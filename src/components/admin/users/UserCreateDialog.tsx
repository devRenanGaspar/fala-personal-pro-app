import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useCreateUser } from "@/hooks/useAdminUsers";
import { toast } from "sonner";

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  const createUser = useCreateUser();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setNome("");
    setTelefone("");
    setInstagram("");
    setOnboardingCompleted(false);
  };

  const handleCreate = async () => {
    if (!email || !password) {
      toast.error("Email e senha são obrigatórios");
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      await createUser.mutateAsync({
        email,
        password,
        nome: nome || undefined,
        telefone: telefone || undefined,
        instagram: instagram || undefined,
        onboarding_completed: onboardingCompleted,
      });
      toast.success("Usuário criado com sucesso");
      resetForm();
      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao criar usuário";
      toast.error(message);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="create-email">Email *</Label>
            <Input
              id="create-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-password">Senha *</Label>
            <Input
              id="create-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-nome">Nome</Label>
            <Input
              id="create-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do usuário (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-telefone">Telefone</Label>
            <Input
              id="create-telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999 (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-instagram">Instagram</Label>
            <Input
              id="create-instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@usuario (opcional)"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="create-onboarding">Pular Onboarding</Label>
            <Switch
              id="create-onboarding"
              checked={onboardingCompleted}
              onCheckedChange={setOnboardingCompleted}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={createUser.isPending}>
            {createUser.isPending ? "Criando..." : "Criar Usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
