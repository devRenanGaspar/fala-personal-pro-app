import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

export function useSaveVersion(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId || !content.trim()) {
        throw new Error("Conversa ou conteúdo inválido");
      }

      // Buscar o número da próxima versão
      const { data: versions } = await supabase
        .from("document_versions")
        .select("version_number")
        .eq("conversation_id", conversationId)
        .order("version_number", { ascending: false })
        .limit(1);

      const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

      // Criar nova versão
      const { error } = await supabase
        .from("document_versions")
        .insert({
          conversation_id: conversationId,
          version_number: nextVersion,
          content: content.trim(),
        });

      if (error) throw error;

      return nextVersion;
    },
    onSuccess: (versionNumber) => {
      queryClient.invalidateQueries({ queryKey: ["versions", conversationId] });
      toast({ title: `Versão ${versionNumber} salva com sucesso!` });
    },
    onError: (error) => {
      logger.error("Erro ao salvar versão:", error);
      toast({
        title: "Erro ao salvar versão",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
}
