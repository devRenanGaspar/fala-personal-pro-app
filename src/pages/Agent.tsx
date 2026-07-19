import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useConversation } from "@/hooks/useConversation";
import { useConversations } from "@/hooks/useConversations";
import { useCreateConversation } from "@/hooks/useCreateConversation";
import { useMessages } from "@/hooks/useMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useConversationRealtime } from "@/hooks/useConversationRealtime";
import { useOfficialDocument } from "@/hooks/useOfficialDocument";
import { useUpdateOfficialDocument } from "@/hooks/useUpdateOfficialDocument";
import { useSetOfficialConversation } from "@/hooks/useSetOfficialConversation";
import { useRenameConversation } from "@/hooks/useRenameConversation";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { AgentLayout } from "@/components/agent/AgentLayout";

const Agent = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  // Estados locais
  const [messageInput, setMessageInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isCreatingFirstConversation, setIsCreatingFirstConversation] = useState(false);
  const [createAttempts, setCreateAttempts] = useState(0);
  const MAX_CREATE_ATTEMPTS = 3;

  // Ler query param
  const panelParam = searchParams.get("panel");
  const newParam = searchParams.get("new");

  // Buscar agente e conversa ativa
  const { data: conversationData, isLoading: isLoadingConversation } = useConversation(
    agentId || "",
    { conversationId: activeConversationId || undefined }
  );

  // Buscar todas conversas do agente
  const { data: allConversations = [] } = useConversations(
    conversationData?.agent?.id
  );

  // Buscar mensagens da conversa ativa
  const { data: messages = [] } = useMessages(activeConversationId || undefined);

  // Habilitar Realtime para mensagens e status de processamento
  const { isProcessing } = useConversationRealtime(activeConversationId || undefined);
  // Documento oficial com Realtime
  const { 
    officialConversationId, 
    officialDocument,
    isLoading: isLoadingOfficial 
  } = useOfficialDocument(conversationData?.agent?.id);
  
  const setOfficialConversation = useSetOfficialConversation();
  
  // Mutation para salvar documento oficial
  const updateOfficialDocument = useUpdateOfficialDocument(
    officialConversationId,
    conversationData?.agent?.id
  );

  // Mutations
  const sendMessage = useSendMessage(
    activeConversationId || "",
    conversationData?.agent?.id || ""
  );
  const createConversation = useCreateConversation();
  const renameConversation = useRenameConversation();

  // Estado derivado: conversa está pronta para enviar mensagens?
  const isConversationReady = !!activeConversationId && 
                              !isCreatingFirstConversation && 
                              !createConversation.isPending;

  // Definir conversa ativa quando carregar
  useEffect(() => {
    if (!conversationData) return;

    // Se tem ?new=true, criar nova conversa
    if (newParam === "true" && conversationData.agent) {
      createConversation.mutate(
        {
          agentId: conversationData.agent.id,
          agentTitle: conversationData.agent.title,
        },
        {
          onSuccess: (newConversation) => {
            setActiveConversationId(newConversation.id);
            setSearchParams({}); // Remove ?new=true
          },
        }
      );
      return;
    }

    // Se tem conversa existente, selecionar ela
    if (conversationData.conversation) {
      setActiveConversationId(conversationData.conversation.id);
      return;
    }

    // Se excedeu tentativas, mostrar erro
    if (createAttempts >= MAX_CREATE_ATTEMPTS) {
      toast({
        title: "Erro ao criar conversa",
        description: "Não foi possível iniciar a conversa. Tente recarregar a página.",
        variant: "destructive",
      });
      return;
    }

    // Se não tem nenhuma conversa, criar uma automaticamente
    if (conversationData.agent && !conversationData.conversation && !isCreatingFirstConversation) {
      setIsCreatingFirstConversation(true);
      createConversation.mutate(
        {
          agentId: conversationData.agent.id,
          agentTitle: conversationData.agent.title,
        },
        {
          onSuccess: (newConversation) => {
            setActiveConversationId(newConversation.id);
            setIsCreatingFirstConversation(false);
            setCreateAttempts(0); // Reset em sucesso
          },
          onError: () => {
            setIsCreatingFirstConversation(false);
            setCreateAttempts(prev => prev + 1); // Incrementa tentativas
          },
        }
      );
    }
  }, [conversationData, newParam, createAttempts]);

  // Abrir painel específico via query param
  useEffect(() => {
    if (panelParam === "history" && isTablet) {
      setShowHistory(true);
    }
  }, [panelParam, isTablet]);

  // Loading state
  if (isLoadingConversation) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <Skeleton className="h-12 w-96 mb-4" />
          <Skeleton className="h-6 w-[500px]" />
        </div>
      </div>
    );
  }

  // Agente não encontrado
  if (!conversationData?.agent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Agente não encontrado
          </h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-primary hover:underline"
          >
            Voltar para Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { agent } = conversationData;

  // Parse suggested replies
  const suggestedReplies = agent.suggested_replies
    ? agent.suggested_replies.split("|").map((s) => s.trim()).filter(Boolean)
    : [];

  // Handlers
  const handleSendMessage = async () => {
    if (!messageInput.trim() || sendMessage.isPending) return;
    
    // Validação de segurança
    if (!activeConversationId) {
      toast({ 
        title: "Aguarde...", 
        description: "A conversa está sendo preparada.",
      });
      return;
    }
    
    await sendMessage.mutateAsync({ 
      content: messageInput, 
      initialMessage: agent.initial_message 
    });
    setMessageInput("");
  };

  const handleSuggestionClick = (text: string) => {
    if (!activeConversationId || sendMessage.isPending) return;
    sendMessage.mutate({ 
      content: text, 
      initialMessage: agent.initial_message 
    });
  };

  const handleSelectConversation = (conversation: { id: string; current_document: string | null }) => {
    setActiveConversationId(conversation.id);
    toast({ title: `Conversa carregada` });
  };

  const handleNewConversation = () => {
    if (!agent) return;
    
    createConversation.mutate(
      {
        agentId: agent.id,
        agentTitle: agent.title,
      },
      {
        onSuccess: (newConversation) => {
          setActiveConversationId(newConversation.id);
        },
      }
    );
  };

  const handleSetDocumentOfficial = () => {
    if (!agent || !activeConversationId) return;
    setOfficialConversation.mutate({
      agentId: agent.id,
      conversationId: activeConversationId,
    });
  };

  const handleRenameConversation = (conversationId: string, newTitle: string) => {
    renameConversation.mutate({ conversationId, newTitle });
  };

  const handleSaveOfficialDocument = async (content: string) => {
    await updateOfficialDocument.mutateAsync(content);
  };

  const hasOfficialDocument = !!officialConversationId;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <AgentHeader
        agent={agent}
        isMobile={isMobile}
        isTablet={isTablet}
        showHistory={showHistory}
        showDocument={showDocument}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onToggleDocument={() => setShowDocument(!showDocument)}
        officialDocument={officialDocument || ""}
        currentDocument={conversationData?.conversation?.current_document || ""}
      />

      <AgentLayout
        isMobile={isMobile}
        isTablet={isTablet}
        isDesktop={isDesktop}
        showHistory={showHistory}
        showDocument={showDocument}
        onToggleHistory={() => setShowHistory(!showHistory)}
        onToggleDocument={() => setShowDocument(!showDocument)}
        messages={messages}
        conversations={allConversations}
        activeConversationId={activeConversationId}
        officialConversationId={officialConversationId}
        officialDocument={officialDocument || ""}
        messageInput={messageInput}
        onMessageInputChange={setMessageInput}
        onSendMessage={handleSendMessage}
        isSending={sendMessage.isPending}
        isProcessing={isProcessing}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onSaveOfficialDocument={handleSaveOfficialDocument}
        hasOfficialDocument={hasOfficialDocument}
        onSetDocumentOfficial={handleSetDocumentOfficial}
        defaultTab={panelParam === "history" ? "history" : "chat"}
        isConversationReady={isConversationReady}
        initialMessage={agent.initial_message}
        suggestedReplies={suggestedReplies}
        onSuggestionClick={handleSuggestionClick}
      />
    </div>
  );
};

export default Agent;
