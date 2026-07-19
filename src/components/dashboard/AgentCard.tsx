import { Button } from "@/components/ui/button";
import { Agent } from "@/hooks/useAgents";
import { useNavigate } from "react-router-dom";
import { MessageSquare, FolderOpen, Plus, FileCheck } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
  hasOfficialDocument: boolean;
}

export function AgentCard({ agent, hasOfficialDocument }: AgentCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      {/* Header: Ícone + Título + Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{agent.icon}</span>
          <h3 className="text-xl font-bold text-foreground">{agent.title}</h3>
        </div>
        {hasOfficialDocument && (
          <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <FileCheck className="w-3 h-3" />
            Oficial
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 min-h-[40px]">
        {agent.description}
      </p>

      {/* Botões de Ação - Layout 2+1 */}
      <div className="space-y-2">
        <div className="flex gap-2">
          {/* Botão Conversar - Primário */}
          <Button 
            onClick={() => navigate(agent.route)}
            className="flex-1 lg:w-full bg-primary hover:bg-primary/90 text-background"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Conversar
          </Button>
          
          {/* Botão Histórico - Oculto em desktop */}
          <Button 
            variant="outline"
            onClick={() => navigate(`${agent.route}?panel=history`)}
            className="flex-1 lg:hidden border-border hover:border-primary"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Histórico
          </Button>
        </div>
        
        {/* Botão Nova - Criar nova conversa */}
        <Button 
          variant="outline"
          onClick={() => navigate(`${agent.route}?new=true`)}
          className="w-full border-border hover:border-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova
        </Button>
      </div>
    </div>
  );
}
