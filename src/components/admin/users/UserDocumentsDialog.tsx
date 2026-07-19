import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface UserDocumentsDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ConversationDocument {
  id: string;
  title: string;
  current_document: string | null;
  agent_title: string;
  agent_icon: string;
}

export function UserDocumentsDialog({ userId, open, onOpenChange }: UserDocumentsDialogProps) {
  const { data: documents, isLoading } = useQuery<ConversationDocument[]>({
    queryKey: ["admin-user-documents", userId],
    queryFn: async () => {
      if (!userId) return [];

      // Buscar conversas do usuário com documentos
      const { data: conversations, error } = await supabase
        .from("conversations")
        .select(`
          id,
          title,
          current_document,
          agent_id
        `)
        .eq("user_id", userId)
        .not("current_document", "is", null)
        .not("current_document", "eq", "")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Buscar dados dos agentes
      const agentIds = [...new Set(conversations?.map((c) => c.agent_id) || [])];
      const { data: agents } = await supabase
        .from("agents")
        .select("id, title, icon")
        .in("id", agentIds);

      const agentsMap = new Map(agents?.map((a) => [a.id, a]) || []);

      return (
        conversations?.map((conv) => ({
          id: conv.id,
          title: conv.title || "Sem título",
          current_document: conv.current_document,
          agent_title: agentsMap.get(conv.agent_id)?.title || "Agente",
          agent_icon: agentsMap.get(conv.agent_id)?.icon || "📄",
        })) || []
      );
    },
    enabled: !!userId && open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documentos do Usuário
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : documents?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum documento encontrado para este usuário.
            </div>
          ) : (
            <div className="space-y-4">
              {documents?.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-background border border-border rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                    <span className="text-lg">{doc.agent_icon}</span>
                    <span className="text-sm font-medium text-primary">{doc.agent_title}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{doc.title}</span>
                  </div>
                  <div className="prose prose-sm max-w-none text-foreground">
                    <ReactMarkdown>{doc.current_document || ""}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
