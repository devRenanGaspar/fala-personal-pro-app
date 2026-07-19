import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { Badge } from "@/components/ui/badge";
import { Mail, CheckCircle } from "lucide-react";
import { useUpdateUser, useConfirmUserEmail, useBanUser } from "@/hooks/useAdminUsers";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { AdminUser } from "@/hooks/useAdminUsers";

interface UserEditDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [notasAdmin, setNotasAdmin] = useState("");
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const { user: currentUser } = useAuth();
  const updateUser = useUpdateUser();
  const confirmEmail = useConfirmUserEmail();
  const banUserMutation = useBanUser();

  const isCurrentUser = user?.id === currentUser?.id;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleConfirmEmail = async () => {
    if (!user) return;
    try {
      await confirmEmail.mutateAsync(user.id);
      toast.success("Email confirmado com sucesso");
    } catch (error) {
      toast.error("Erro ao confirmar email");
    }
  };

  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setTelefone(user.telefone || "");
      setInstagram(user.instagram || "");
      setNotasAdmin(user.notas_admin || "");
      setOnboardingCompleted(user.onboarding_completed);
      setIsAdmin(user.is_admin);
      setIsActive(!user.banned_until || new Date(user.banned_until) <= new Date());
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    try {
      // Handle ban/unban if status changed
      const wasBanned = user.banned_until && new Date(user.banned_until) > new Date();
      const statusChanged = isActive === !!wasBanned;
      if (statusChanged && !isCurrentUser) {
        await banUserMutation.mutateAsync({ userId: user.id, ban: !isActive });
      }

      await updateUser.mutateAsync({
        userId: user.id,
        nome,
        telefone,
        instagram,
        notas_admin: notasAdmin,
        onboarding_completed: onboardingCompleted,
        is_admin: isAdmin,
      });
      toast.success("Usuário atualizado com sucesso");
      onOpenChange(false);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar usuário";
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
          </div>

          <div className="flex items-center justify-between py-2 px-3 rounded-md bg-muted/50">
            <div>
              <Label>Confirmação de Email</Label>
              <p className="text-xs text-muted-foreground">
                {user?.email_confirmed_at 
                  ? `Confirmado em ${formatDate(user.email_confirmed_at)}`
                  : "Email ainda não confirmado"
                }
              </p>
            </div>
            {user?.email_confirmed_at ? (
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirmado
              </Badge>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleConfirmEmail}
                disabled={confirmEmail.isPending}
              >
                <Mail className="h-4 w-4 mr-2" />
                {confirmEmail.isPending ? "Confirmando..." : "Confirmar"}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do usuário"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@usuario"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas do Admin</Label>
            <Textarea
              id="notas"
              value={notasAdmin}
              onChange={(e) => setNotasAdmin(e.target.value)}
              placeholder="Anotações internas sobre o usuário..."
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="onboarding">Onboarding Completo</Label>
            <Switch
              id="onboarding"
              checked={onboardingCompleted}
              onCheckedChange={setOnboardingCompleted}
            />
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
            <div>
              <Label htmlFor="active" className="font-semibold">
                Status da Conta
              </Label>
              <p className="text-xs text-muted-foreground">
                {isCurrentUser
                  ? "Você não pode desativar sua própria conta"
                  : isActive ? "Usuário pode fazer login normalmente" : "Usuário não consegue fazer login"
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${isActive ? "text-green-500" : "text-destructive"}`}>
                {isActive ? "Ativo" : "Inativo"}
              </span>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={isCurrentUser}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
            <div>
              <Label htmlFor="admin" className="text-primary font-semibold">
                Administrador
              </Label>
              <p className="text-xs text-muted-foreground">
                {isCurrentUser 
                  ? "Você não pode remover seu próprio privilégio de admin"
                  : "Admins têm acesso total ao painel de administração"
                }
              </p>
            </div>
            <Switch
              id="admin"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
              disabled={isCurrentUser}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={updateUser.isPending}>
            {updateUser.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
