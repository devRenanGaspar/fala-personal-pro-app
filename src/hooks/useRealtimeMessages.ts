import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  status?: string;
  created_at: string;
}

export function useRealtimeMessages(conversationId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    logger.info("[useRealtimeMessages] Subscribing to conversation:", conversationId);

    // Criar canal Realtime para a conversa
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.info("[useRealtimeMessages] New message inserted:", payload.new);

          // Adicionar nova mensagem ao cache do React Query
          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return [payload.new as Message];
              // Evitar duplicatas (verificar por ID)
              if (old.some((msg) => msg.id === payload.new.id)) {
                return old;
              }
              return [...old, payload.new as Message];
            }
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.info("[useRealtimeMessages] Message updated:", payload.new);

          // Atualizar mensagem existente no cache
          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return [payload.new as Message];
              return old.map((msg) =>
                msg.id === payload.new.id ? (payload.new as Message) : msg
              );
            }
          );
        }
      )
      .subscribe((status) => {
        logger.info("[useRealtimeMessages] Subscription status:", status);
      });

    // Cleanup ao desmontar
    return () => {
      logger.info("[useRealtimeMessages] Unsubscribing from:", conversationId);
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);
}
