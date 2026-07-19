import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AdminAgent, useUpdateAgent } from "@/hooks/useAdminAgents";

interface AgentEditDialogProps {
  agent: AdminAgent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentEditDialog({ agent, open, onOpenChange }: AgentEditDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [initialMessage, setInitialMessage] = useState("");
  const [suggestedReplies, setSuggestedReplies] = useState("");

  const updateAgent = useUpdateAgent();

  useEffect(() => {
    if (agent) {
      setTitle(agent.title);
      setDescription(agent.description);
      setIcon(agent.icon);
      setIsActive(agent.is_active);
      setDisplayOrder(agent.display_order);
      setInitialMessage(agent.initial_message || "");
      setSuggestedReplies(agent.suggested_replies || "");
    }
  }, [agent]);

  const handleSave = () => {
    if (!agent) return;

    updateAgent.mutate(
      {
        id: agent.id,
        updates: {
          title,
          description,
          icon,
          is_active: isActive,
          display_order: displayOrder,
          initial_message: initialMessage || null,
          suggested_replies: suggestedReplies || null,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  // Preview das sugestões
  const suggestionsPreview = suggestedReplies
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            Editar Agente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Label htmlFor="icon">Ícone</Label>
              <Input
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="text-center text-xl"
                maxLength={2}
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order">Ordem de exibição</Label>
              <Input
                id="order"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div className="flex items-center justify-between pt-6">
              <Label htmlFor="active" className="cursor-pointer">
                Agente ativo
              </Label>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Experiência do Chat</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="initialMessage">Mensagem inicial do agente</Label>
                <Textarea
                  id="initialMessage"
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Ex: Olá! Sou seu assistente de nicho. Me conta um pouco sobre você e seus objetivos..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Essa mensagem aparece automaticamente quando o usuário inicia uma nova conversa
                </p>
              </div>

              <div>
                <Label htmlFor="suggestedReplies">Sugestões de primeira mensagem</Label>
                <Input
                  id="suggestedReplies"
                  value={suggestedReplies}
                  onChange={(e) => setSuggestedReplies(e.target.value)}
                  placeholder="Opção 1|Opção 2|Opção 3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separe as opções com | (barra vertical). Recomendamos no máximo 4 sugestões.
                </p>
                
                {/* Preview das sugestões */}
                {suggestionsPreview.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Preview:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestionsPreview.map((suggestion, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-xs rounded-full border border-primary/30 bg-card"
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updateAgent.isPending}>
            {updateAgent.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
