import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { HistorySidebar } from "./HistorySidebar";
import { ChatArea } from "./ChatArea";
import { DocumentPanel } from "./DocumentPanel";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  current_document: string | null;
  created_at: string;
}

interface AgentLayoutProps {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  showHistory: boolean;
  showDocument: boolean;
  onToggleHistory: () => void;
  onToggleDocument: () => void;
  messages: Message[];
  conversations: Conversation[];
  activeConversationId: string | null;
  officialConversationId: string | null;
  officialDocument: string;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
  isProcessing: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onRenameConversation: (conversationId: string, newTitle: string) => void;
  onSaveOfficialDocument: (content: string) => void;
  hasOfficialDocument: boolean;
  onSetDocumentOfficial: () => void;
  defaultTab?: 'chat' | 'history' | 'document';
  isConversationReady?: boolean;
  initialMessage?: string | null;
  suggestedReplies?: string[];
  onSuggestionClick?: (text: string) => void;
}

export function AgentLayout({
  isMobile,
  isTablet,
  isDesktop,
  showHistory,
  showDocument,
  onToggleHistory,
  onToggleDocument,
  messages,
  conversations,
  activeConversationId,
  officialConversationId,
  officialDocument,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  isSending,
  isProcessing,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onSaveOfficialDocument,
  hasOfficialDocument,
  onSetDocumentOfficial,
  defaultTab = 'chat',
  isConversationReady = true,
  initialMessage,
  suggestedReplies = [],
  onSuggestionClick,
}: AgentLayoutProps) {
  // MOBILE: Tabs
  if (isMobile) {
    return (
      <Tabs defaultValue={defaultTab} className="flex-1 min-h-0 flex flex-col">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="document">Documento</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="h-[calc(100%-40px)] mt-0">
          <HistorySidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            officialConversationId={officialConversationId}
            onSelectConversation={onSelectConversation}
            onNewConversation={onNewConversation}
            onRenameConversation={onRenameConversation}
          />
        </TabsContent>

        <TabsContent value="chat" className="h-[calc(100%-40px)] mt-0">
          <ChatArea
            messages={messages}
            messageInput={messageInput}
            onMessageInputChange={onMessageInputChange}
            onSendMessage={onSendMessage}
            isSending={isSending}
            isProcessing={isProcessing}
            isConversationReady={isConversationReady}
            initialMessage={initialMessage}
            suggestedReplies={suggestedReplies}
            onSuggestionClick={onSuggestionClick}
          />
        </TabsContent>

        <TabsContent value="document" className="h-[calc(100%-40px)] mt-0">
          <DocumentPanel
            content={officialDocument}
            onSave={onSaveOfficialDocument}
            hasOfficialDocument={hasOfficialDocument}
            onSetOfficial={onSetDocumentOfficial}
            canSetOfficial={!!activeConversationId && activeConversationId !== officialConversationId}
          />
        </TabsContent>
      </Tabs>
    );
  }

  // TABLET: Chat + Sheet overlays
  if (isTablet) {
    return (
      <div className="relative flex-1 min-h-0">
        <div className="h-full">
          <ChatArea
            messages={messages}
            messageInput={messageInput}
            onMessageInputChange={onMessageInputChange}
            onSendMessage={onSendMessage}
            isSending={isSending}
            isProcessing={isProcessing}
            isConversationReady={isConversationReady}
            initialMessage={initialMessage}
            suggestedReplies={suggestedReplies}
            onSuggestionClick={onSuggestionClick}
          />
        </div>

        <Sheet open={showHistory} onOpenChange={onToggleHistory}>
          <SheetContent side="left" className="w-[80%] max-w-[400px] p-0">
            <HistorySidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              officialConversationId={officialConversationId}
              onSelectConversation={onSelectConversation}
              onNewConversation={onNewConversation}
              onRenameConversation={onRenameConversation}
            />
          </SheetContent>
        </Sheet>

        {/* Documento overlay */}
        <Sheet open={showDocument} onOpenChange={onToggleDocument}>
          <SheetContent side="right" className="w-[80%] max-w-[400px] p-0">
            <DocumentPanel
              content={officialDocument}
              onSave={onSaveOfficialDocument}
              hasOfficialDocument={hasOfficialDocument}
              onSetOfficial={onSetDocumentOfficial}
              canSetOfficial={!!activeConversationId && activeConversationId !== officialConversationId}
            />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // DESKTOP: 3 colunas redimensionáveis
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
      {/* Histórico */}
      <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
        <HistorySidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          officialConversationId={officialConversationId}
          onSelectConversation={onSelectConversation}
          onNewConversation={onNewConversation}
          onRenameConversation={onRenameConversation}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Chat */}
      <ResizablePanel defaultSize={50} minSize={35}>
        <ChatArea
          messages={messages}
          messageInput={messageInput}
          onMessageInputChange={onMessageInputChange}
          onSendMessage={onSendMessage}
          isSending={isSending}
          isProcessing={isProcessing}
          isConversationReady={isConversationReady}
          initialMessage={initialMessage}
          suggestedReplies={suggestedReplies}
          onSuggestionClick={onSuggestionClick}
        />
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Documento Oficial */}
      <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
        <DocumentPanel
          content={officialDocument}
          onSave={onSaveOfficialDocument}
          hasOfficialDocument={hasOfficialDocument}
          onSetOfficial={onSetDocumentOfficial}
          canSetOfficial={!!activeConversationId && activeConversationId !== officialConversationId}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
