import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateAgentCard() {
  return (
    <div className="bg-card border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center hover:border-primary transition-colors opacity-60">
      {/* Icon */}
      <div className="text-5xl mb-4 text-muted-foreground">
        <Plus className="h-12 w-12" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-foreground mb-2 text-center">
        Criar Novo Agente
      </h3>

      {/* Badge */}
      <Badge variant="outline" className="mb-4 border-primary text-primary">
        Em Breve
      </Badge>

      {/* Description */}
      <p className="text-sm text-muted-foreground text-center mb-4">
        Em breve você poderá criar agentes personalizados
      </p>

      {/* Button */}
      <Button
        variant="outline"
        onClick={() => toast.info("Funcionalidade em desenvolvimento")}
        className="border-primary text-primary hover:bg-primary/10"
        disabled
      >
        Aguarde
      </Button>
    </div>
  );
}
