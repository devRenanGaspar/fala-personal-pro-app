import { useEffect, useState, useRef, useCallback } from "react";
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

interface ConversationUpdate {
  is_processing?: boolean;
  title?: string;
  current_document?: string;
}

const PROCESSING_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useConversationRealtime(conversationId: string | undefined) {
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const processingStartRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    processingStartRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      logger.info("[useConversationRealtime] Safety timeout reached, forcing isProcessing=false");
      setIsProcessing(false);
      processingStartRef.current = null;
    }, PROCESSING_TIMEOUT_MS);
  }, []);

  const clearSafetyTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    processingStartRef.current = null;
  }, []);

  const fetchInitialState = useCallback(async () => {
    if (!conversationId) return;
    const { data, error } = await supabase
      .from("conversations")
      .select("is_processing")
      .eq("id", conversationId)
      .maybeSingle();

    if (error) {
      logger.info("[useConversationRealtime] Error fetching initial state:", error);
      return;
    }
    if (data) {
      const processing = data.is_processing ?? false;
      setIsProcessing(processing);
      if (processing) startSafetyTimeout();
      else clearSafetyTimeout();
    }
  }, [conversationId, startSafetyTimeout, clearSafetyTimeout]);

  useEffect(() => {
    setIsProcessing(false);
    clearSafetyTimeout();

    if (!conversationId) return;

    logger.info("[useConversationRealtime] Subscribing to conversation:", conversationId);
    fetchInitialState();

    const channel = supabase
      .channel(`conversation-realtime-${conversationId}`)
      // Listener 1: messages INSERT (cache + fallback processing reset)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.info("[useConversationRealtime] Message inserted:", payload.new);

          queryClient.setQueryData<Message[]>(
            ["messages", conversationId],
            (old) => {
              if (!old) return [payload.new as Message];
              if (old.some((msg) => msg.id === payload.new.id)) return old;
              return [...old, payload.new as Message];
            }
          );

          // Fallback: assistant message resets processing
          if ((payload.new as Message).role === "assistant") {
            logger.info("[useConversationRealtime] Assistant message received, forcing isProcessing=false");
            setIsProcessing(false);
            clearSafetyTimeout();
          }
        }
      )
      // Listener 2: messages UPDATE (cache sync)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          logger.info("[useConversationRealtime] Message updated:", payload.new);

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
      // Listener 3: conversations UPDATE (is_processing)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          logger.info("[useConversationRealtime] Conversation updated:", payload.new);

          const update = payload.new as ConversationUpdate;
          if (typeof update.is_processing === "boolean") {
            setIsProcessing(update.is_processing);
            if (update.is_processing) startSafetyTimeout();
            else clearSafetyTimeout();
          }
        }
      )
      .subscribe((status, err) => {
        logger.info("[useConversationRealtime] Channel status:", status);
        if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          logger.info("[useConversationRealtime] Channel error/closed, refetching state...", err);
          setTimeout(() => fetchInitialState(), 1000);
        }
      });

    return () => {
      logger.info("[useConversationRealtime] Unsubscribing from:", conversationId);
      clearSafetyTimeout();
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient, fetchInitialState, startSafetyTimeout, clearSafetyTimeout]);

  return { isProcessing };
}
