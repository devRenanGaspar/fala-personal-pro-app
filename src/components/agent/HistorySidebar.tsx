import { Button } from "@/components/ui/button";
import { ConversationItem } from "./ConversationItem";
import { Plus } from "lucide-react";

interface Conversation {
  id: string;
  title: string;
  current_document: string | null;
  created_at: string;
}

interface HistorySidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  officialConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onRenameConversation: (conversationId: string, newTitle: string) => void;
}

export function HistorySidebar({
  conversations,
  activeConversationId,
  officialConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
}: HistorySidebarProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Histórico</h3>
        <Button
          onClick={onNewConversation}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-2">
              Nenhuma conversa ainda
            </p>
            <p className="text-xs text-muted-foreground">
              Clique em "Nova" para começar
            </p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div key={conversation.id} className="group">
              <ConversationItem
                id={conversation.id}
                title={conversation.title || "Sem título"}
                content={conversation.current_document}
                createdAt={conversation.created_at}
                isActive={conversation.id === activeConversationId}
                isOfficial={conversation.id === officialConversationId}
                onClick={() => onSelectConversation(conversation)}
                onRename={(newTitle) => onRenameConversation(conversation.id, newTitle)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
