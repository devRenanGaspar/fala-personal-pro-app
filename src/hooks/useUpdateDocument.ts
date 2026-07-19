import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

export function useUpdateDocument(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) {
        throw new Error("Conversa inválida");
      }

      const { error } = await supabase
        .from("conversations")
        .update({ current_document: content })
        .eq("id", conversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversation"] });
      toast({ title: "Documento atualizado com sucesso!" });
    },
    onError: (error) => {
      logger.error("Erro ao atualizar documento:", error);
      toast({
        title: "Erro ao atualizar documento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
}
