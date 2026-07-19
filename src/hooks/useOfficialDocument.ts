import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useOfficialDocument(agentId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["official-document", agentId, user?.id],
    queryFn: async () => {
      if (!agentId || !user?.id) return null;

      // Buscar official_conversation_id de user_agent_progress
      const { data: progress, error: progressError } = await supabase
        .from("user_agent_progress")
        .select("official_conversation_id")
        .eq("user_id", user.id)
        .eq("agent_id", agentId)
        .maybeSingle();

      if (progressError) throw progressError;
      if (!progress?.official_conversation_id) return null;

      // Buscar o documento da conversa oficial
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .select("id, current_document, title")
        .eq("id", progress.official_conversation_id)
        .maybeSingle();

      if (convError) throw convError;

      return conversation;
    },
    enabled: !!agentId && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Realtime: escutar mudanças no conteúdo da conversa oficial
  useEffect(() => {
    if (!data?.id) return;

    const channel = supabase
      .channel(`official-doc-${data.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${data.id}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["official-document", agentId, user?.id],
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [data?.id, agentId, user?.id, queryClient]);

  // Realtime: escutar mudanças no official_conversation_id (quando N8N muda qual é a conversa oficial)
  useEffect(() => {
    if (!agentId || !user?.id) return;

    const channel = supabase
      .channel(`user-agent-progress-${agentId}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_agent_progress",
          filter: `agent_id=eq.${agentId}`,
        },
        (payload) => {
          const newData = payload.new as { user_id: string; official_conversation_id: string | null };
          if (newData.user_id === user.id) {
            queryClient.invalidateQueries({
              queryKey: ["official-document", agentId, user?.id],
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [agentId, user?.id, queryClient]);

  return {
    officialConversationId: data?.id ?? null,
    officialDocument: data?.current_document ?? null,
    officialTitle: data?.title ?? null,
    isLoading,
    refetch,
  };
}
