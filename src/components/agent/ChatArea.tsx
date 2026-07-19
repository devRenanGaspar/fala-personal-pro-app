import { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ProcessingIndicator } from "./ProcessingIndicator";
import { SuggestedReplies } from "./SuggestedReplies";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

interface ChatAreaProps {
  messages: Message[];
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
  isProcessing: boolean;
  isConversationReady?: boolean;
  initialMessage?: string | null;
  suggestedReplies?: string[];
  onSuggestionClick?: (text: string) => void;
}

export function ChatArea({
  messages,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  isSending,
  isProcessing,
  isConversationReady = true,
  initialMessage,
  suggestedReplies = [],
  onSuggestionClick,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Verifica se é uma conversa nova (sem mensagens do usuário ainda)
  const isNewConversation = messages.length === 0;
  const showSuggestions = isNewConversation && suggestedReplies.length > 0;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  return (
    <div className="flex flex-col h-full">
      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!isConversationReady ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Preparando conversa...</p>
          </div>
        ) : isNewConversation ? (
          <>
            {/* Mensagem inicial do agente (se existir) */}
            {initialMessage && (
              <ChatMessage
                role="assistant"
                content={initialMessage}
                createdAt={new Date().toISOString()}
              />
            )}
            {/* Placeholder quando não há mensagem inicial */}
            {!initialMessage && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">Nenhuma mensagem ainda</p>
                <p className="text-sm text-muted-foreground">Comece a conversa com o agente!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                role={msg.role}
                content={msg.content}
                createdAt={msg.created_at}
              />
            ))}
            {isProcessing && <ProcessingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Sugestões de resposta (apenas em conversa nova) */}
      {showSuggestions && onSuggestionClick && (
        <SuggestedReplies
          suggestions={suggestedReplies}
          onSelect={onSuggestionClick}
          disabled={isSending || isProcessing || !isConversationReady}
        />
      )}

      {/* Input de mensagem */}
      <ChatInput
        value={messageInput}
        onChange={onMessageInputChange}
        onSubmit={onSendMessage}
        disabled={isSending || isProcessing || !isConversationReady}
      />
    </div>
  );
}
