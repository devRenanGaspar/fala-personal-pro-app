import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface CreateConversationParams {
  agentId: string;
  agentTitle: string;
}

export function useCreateConversation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, agentTitle }: CreateConversationParams) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user.id,
          agent_id: agentId,
          title: `Conversa - ${agentTitle}`,
          current_document: "",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", variables.agentId] });
      toast({ title: "Nova conversa criada!" });
    },
    onError: (error) => {
      logger.error("Erro ao criar conversa:", error);
      toast({
        title: "Erro ao criar conversa",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
}
