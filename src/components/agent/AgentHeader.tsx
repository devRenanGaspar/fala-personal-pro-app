import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ExportDialog } from "./ExportDialog";

interface Agent {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
}

interface AgentHeaderProps {
  agent: Agent;
  isMobile: boolean;
  isTablet: boolean;
  showHistory?: boolean;
  showDocument?: boolean;
  onToggleHistory?: () => void;
  onToggleDocument?: () => void;
  officialDocument?: string;
  currentDocument?: string;
}

export function AgentHeader({
  agent,
  isMobile,
  isTablet,
  showHistory,
  showDocument,
  onToggleHistory,
  onToggleDocument,
  officialDocument = "",
  currentDocument = "",
}: AgentHeaderProps) {
  const navigate = useNavigate();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  return (
    <>
      <div className="bg-card border-b border-border p-4 h-20 flex-shrink-0">
        <div className="max-w-full mx-auto flex items-center justify-between">
          {/* Esquerda: Voltar + Ícone + Título */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>

            <div className="text-3xl">{agent.icon}</div>

            <div>
              <h1 className="text-xl font-bold text-foreground">{agent.title}</h1>
              <p className="text-sm text-muted-foreground hidden md:block">
                {agent.description}
              </p>
            </div>
          </div>

          {/* Direita: Botões de ação */}
          <div className="flex items-center gap-2">
            {/* Botões Tablet para expandir sidebars */}
            {isTablet && !isMobile && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleHistory}
                  className="border-primary text-primary"
                >
                  Histórico {showHistory ? "▲" : "▼"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleDocument}
                  className="border-primary text-primary"
                >
                  Documento {showDocument ? "▲" : "▼"}
                </Button>
              </>
            )}

            {/* Botão Exportar (desktop) */}
            {!isMobile && (
              <Button
                variant="outline"
                onClick={() => setExportDialogOpen(true)}
                className="border-primary text-primary"
              >
                Exportar
              </Button>
            )}

            {/* Menu de opções */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isMobile && (
                  <DropdownMenuItem onClick={() => setExportDialogOpen(true)}>
                    Exportar PDF
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => toast({ title: "Em desenvolvimento" })}>
                  Renomear conversa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Em desenvolvimento" })}>
                  Limpar histórico
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Excluir conversa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        officialDocument={officialDocument}
        currentDocument={currentDocument}
        agentTitle={agent.title}
      />
    </>
  );
}
