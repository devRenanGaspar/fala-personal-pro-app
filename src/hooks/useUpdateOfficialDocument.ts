import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useUpdateOfficialDocument(
  officialConversationId: string | null,
  agentId: string | undefined
) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!officialConversationId) {
        throw new Error("Nenhum documento oficial definido");
      }

      const { error } = await supabase
        .from("conversations")
        .update({ current_document: content })
        .eq("id", officialConversationId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar query do documento oficial
      queryClient.invalidateQueries({
        queryKey: ["official-document", agentId, user?.id],
      });
      toast({ title: "Documento oficial atualizado!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar documento",
        variant: "destructive",
      });
    },
  });
}
