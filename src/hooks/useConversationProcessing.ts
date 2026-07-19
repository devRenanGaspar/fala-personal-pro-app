import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

interface ConversationUpdate {
  is_processing?: boolean;
  title?: string;
  current_document?: string;
}

interface MessageInsert {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
}

const PROCESSING_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes safety timeout

export function useConversationProcessing(conversationId: string | undefined) {
  const [isProcessing, setIsProcessing] = useState(false);
  const processingStartRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Safety timeout: reset isProcessing after 5 minutes
  const startSafetyTimeout = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    processingStartRef.current = Date.now();
    
    timeoutRef.current = setTimeout(() => {
      logger.info("[useConversationProcessing] Safety timeout reached, forcing isProcessing=false");
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

  // Fetch current state from database
  const fetchInitialState = useCallback(async () => {
    if (!conversationId) return;
    
    const { data, error } = await supabase
      .from("conversations")
      .select("is_processing")
      .eq("id", conversationId)
      .maybeSingle();

    if (error) {
      logger.info("[useConversationProcessing] Error fetching initial state:", error);
      return;
    }

    if (data) {
      const processing = data.is_processing ?? false;
      setIsProcessing(processing);
      
      if (processing) {
        startSafetyTimeout();
      } else {
        clearSafetyTimeout();
      }
    }
  }, [conversationId, startSafetyTimeout, clearSafetyTimeout]);

  useEffect(() => {
    // Reset state when conversation changes
    setIsProcessing(false);
    clearSafetyTimeout();

    if (!conversationId) return;

    logger.info("[useConversationProcessing] Subscribing to conversation:", conversationId);

    fetchInitialState();

    // Channel for conversation updates (is_processing changes)
    const conversationChannel = supabase
      .channel(`conversation-processing-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
          filter: `id=eq.${conversationId}`,
        },
        (payload) => {
          logger.info("[useConversationProcessing] Conversation updated:", payload.new);

          const update = payload.new as ConversationUpdate;

          if (typeof update.is_processing === "boolean") {
            setIsProcessing(update.is_processing);
            
            if (update.is_processing) {
              startSafetyTimeout();
            } else {
              clearSafetyTimeout();
            }
          }
        }
      )
      .subscribe((status, err) => {
        logger.info("[useConversationProcessing] Conversation channel status:", status);
        
        // Handle reconnection on error
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          logger.info("[useConversationProcessing] Channel error/closed, refetching state...", err);
          setTimeout(() => {
            fetchInitialState();
          }, 1000);
        }
      });

    // Channel for message inserts (fallback: detect assistant response)
    const messagesChannel = supabase
      .channel(`messages-processing-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const message = payload.new as MessageInsert;
          
          // If we receive an assistant message while processing, force reset
          if (message.role === "assistant") {
            logger.info("[useConversationProcessing] Assistant message received, forcing isProcessing=false");
            setIsProcessing(false);
            clearSafetyTimeout();
          }
        }
      )
      .subscribe((status) => {
        logger.info("[useConversationProcessing] Messages channel status:", status);
      });

    // Cleanup on unmount or conversation change
    return () => {
      logger.info("[useConversationProcessing] Unsubscribing from:", conversationId);
      clearSafetyTimeout();
      supabase.removeChannel(conversationChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, [conversationId, fetchInitialState, startSafetyTimeout, clearSafetyTimeout]);

  return { isProcessing };
}
