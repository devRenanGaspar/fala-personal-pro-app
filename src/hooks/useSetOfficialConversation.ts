import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface SetOfficialParams {
  agentId: string;
  conversationId: string;
}

export function useSetOfficialConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, conversationId }: SetOfficialParams) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      // UPSERT em user_agent_progress
      const { data, error } = await supabase
        .from("user_agent_progress")
        .upsert(
          {
            user_id: user.id,
            agent_id: agentId,
            official_conversation_id: conversationId,
          },
          {
            onConflict: "user_id,agent_id",
          }
        )
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      // Invalidar cache
      queryClient.invalidateQueries({
        queryKey: ["official-document", variables.agentId],
      });
      toast.success("Documento definido como oficial!");
    },
    onError: (error) => {
      logger.error("Erro ao definir documento oficial:", error);
      toast.error("Erro ao definir documento oficial");
    },
  });
}
