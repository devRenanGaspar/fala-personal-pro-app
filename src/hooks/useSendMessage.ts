import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  status: string;
  request_id?: string;
  created_at: string;
}

interface SendMessageInput {
  content: string;
  initialMessage?: string | null;
}

export function useSendMessage(
  conversationId: string, 
  agentId: string
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, initialMessage }: SendMessageInput) => {
      if (!conversationId || !content.trim()) {
        throw new Error("Conversa ou conteúdo inválido");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const requestId = crypto.randomUUID();
      const messageId = crypto.randomUUID();
      const now = new Date().toISOString();

      // 1. Criar mensagem do usuário com status 'sending'
      const userMessage: Message = {
        id: messageId,
        conversation_id: conversationId,
        role: "user",
        content: content.trim(),
        status: "sending",
        request_id: requestId,
        created_at: now,
      };

      // 2. Adicionar mensagem otimisticamente no cache
      queryClient.setQueryData<Message[]>(
        ["messages", conversationId],
        (old) => (old ? [...old, userMessage] : [userMessage])
      );

      // 3. Salvar mensagem no banco
      const { error: insertError } = await supabase
        .from("messages")
        .insert({
          id: messageId,
          conversation_id: conversationId,
          role: "user",
          content: content.trim(),
          status: "sending",
          request_id: requestId,
        });

      if (insertError) throw insertError;

      // 4. Chamar Edge Function (fire-and-forget)
      // user_id is extracted from auth token in edge function (not trusted from client)
      const { data, error: functionError } = await supabase.functions.invoke(
        "send-to-n8n",
        {
          body: {
            conversation_id: conversationId,
            agent_id: agentId,
            mensagem: content.trim(),
            initial_message: initialMessage?.trim() || null,
          },
        }
      );

      if (functionError) {
        // Atualizar mensagem para status 'error'
        await supabase
          .from("messages")
          .update({ status: "error", error_message: functionError.message })
          .eq("id", messageId);

        throw functionError;
      }

      // 5. Atualizar mensagem para status 'sent' (aguardando N8N)
      await supabase
        .from("messages")
        .update({ status: "sent" })
        .eq("id", messageId);

      logger.info("[useSendMessage] Message queued:", data);

      return { success: true, request_id: requestId };
    },
    onError: (error) => {
      logger.error("[useSendMessage] Error:", error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    },
  });
}

