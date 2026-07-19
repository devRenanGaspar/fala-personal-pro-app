import { useState } from "react";
import { useAdminAgents, AdminAgent } from "@/hooks/useAdminAgents";
import { AgentsTable } from "./AgentsTable";
import { AgentEditDialog } from "./AgentEditDialog";

export function AdminAgents() {
  const { data: agents, isLoading } = useAdminAgents();
  const [selectedAgent, setSelectedAgent] = useState<AdminAgent | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleEdit = (agent: AdminAgent) => {
    setSelectedAgent(agent);
    setEditDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Agentes</h2>
        <p className="text-muted-foreground">
          {agents?.length
            ? `${agents.length} agentes configurados`
            : "Configurar agentes de IA"}
        </p>
      </div>

      <AgentsTable
        agents={agents || []}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      <AgentEditDialog
        agent={selectedAgent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />
    </div>
  );
}
