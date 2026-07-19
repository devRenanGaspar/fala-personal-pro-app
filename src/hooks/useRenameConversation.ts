import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface RenameConversationParams {
  conversationId: string;
  newTitle: string;
}

export function useRenameConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, newTitle }: RenameConversationParams) => {
      const { error } = await supabase
        .from("conversations")
        .update({ title: newTitle })
        .eq("id", conversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      toast({ title: "Conversa renomeada com sucesso" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao renomear conversa", 
        variant: "destructive" 
      });
    },
  });
}
