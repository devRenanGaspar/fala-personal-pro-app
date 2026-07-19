import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Conversation {
  id: string;
  title: string;
  current_document: string | null;
  created_at: string;
  updated_at: string | null;
}

export function useConversations(agentId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversations", agentId, user?.id],
    queryFn: async () => {
      if (!user || !agentId) return [];

      const { data, error } = await supabase
        .from("conversations")
        .select("id, title, current_document, created_at, updated_at")
        .eq("user_id", user.id)
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Conversation[];
    },
    enabled: !!user && !!agentId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
