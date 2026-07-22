import { useState, useEffect } from "react";
import { useAdminAgents, useUpdateAgent, AdminAgent } from "@/hooks/useAdminAgents";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function AgentPromptCard({ agent }: { agent: AdminAgent }) {
  const [prompt, setPrompt] = useState(agent.system_prompt ?? "");
  const updateAgent = useUpdateAgent();

  // Ressincroniza quando o agente é recarregado (ex.: após salvar)
  useEffect(() => {
    setPrompt(agent.system_prompt ?? "");
  }, [agent.system_prompt]);

  const isDirty = prompt !== (agent.system_prompt ?? "");

  const handleSave = () => {
    updateAgent.mutate({
      id: agent.id,
      updates: { system_prompt: prompt.trim() ? prompt : null },
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl">{agent.icon}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate">{agent.title}</h3>
            <p className="text-xs text-muted-foreground">/{agent.slug}</p>
          </div>
        </div>
        {agent.webhook_enabled ? (
          <Badge variant="secondary" className="shrink-0">n8n conectado</Badge>
        ) : (
          <Badge variant="outline" className="shrink-0">sem webhook</Badge>
        )}
      </div>

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={8}
        placeholder="Prompt de sistema deste agente. É enviado ao n8n a cada mensagem do usuário."
        className="font-mono text-sm resize-y"
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{prompt.length} caracteres</p>
        <Button size="sm" onClick={handleSave} disabled={!isDirty || updateAgent.isPending}>
          {updateAgent.isPending ? "Salvando..." : "Salvar prompt"}
        </Button>
      </div>
    </div>
  );
}

export function AdminPrompts() {
  const { data: agents, isLoading } = useAdminAgents();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Prompts dos Agentes</h2>
        <p className="text-muted-foreground">
          Defina o prompt de sistema de cada agente. Ele é enviado ao n8n a cada mensagem do usuário.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {agents?.map((agent) => (
            <AgentPromptCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
}
