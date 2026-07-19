import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Pencil } from "lucide-react";
import { AdminAgent, useUpdateAgent } from "@/hooks/useAdminAgents";

interface AgentsTableProps {
  agents: AdminAgent[];
  isLoading: boolean;
  onEdit: (agent: AdminAgent) => void;
}

export function AgentsTable({ agents, isLoading, onEdit }: AgentsTableProps) {
  const updateAgent = useUpdateAgent();

  const handleToggleActive = (agent: AdminAgent) => {
    updateAgent.mutate({
      id: agent.id,
      updates: { is_active: !agent.is_active },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="text-foreground font-semibold w-16 text-center">Ordem</TableHead>
            <TableHead className="text-foreground font-semibold w-16 text-center">Ícone</TableHead>
            <TableHead className="text-foreground font-semibold">Título</TableHead>
            <TableHead className="text-foreground font-semibold">Descrição</TableHead>
            <TableHead className="text-foreground font-semibold text-center w-24">Ativo</TableHead>
            <TableHead className="text-foreground font-semibold text-right w-24">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                Nenhum agente encontrado
              </TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent.id} className="hover:bg-muted/30">
                <TableCell className="text-center text-muted-foreground">
                  {agent.display_order}
                </TableCell>
                <TableCell className="text-center text-2xl">
                  {agent.icon}
                </TableCell>
                <TableCell className="font-medium">{agent.title}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                  {agent.description}
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={agent.is_active}
                    onCheckedChange={() => handleToggleActive(agent)}
                    disabled={updateAgent.isPending}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(agent)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
