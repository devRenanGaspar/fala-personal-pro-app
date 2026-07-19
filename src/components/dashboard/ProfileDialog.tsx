import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { data: profile, isLoading } = useUserProfile();
  const { resetPassword } = useAuth();

  const handleChangePassword = async () => {
    if (!profile?.email) {
      toast.error("Email não encontrado");
      return;
    }

    const { error } = await resetPassword(profile.email);

    if (error) {
      toast.error("Erro ao enviar email de recuperação");
      return;
    }

    toast.success("Email de recuperação enviado! Confira sua caixa de entrada.");
    onOpenChange(false);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Meu Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading ? (
            <>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                  Nome
                </Label>
                <p className="text-foreground font-medium">{profile?.nome || "—"}</p>
              </div>

              {profile?.nomeProfissional && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                    Nome Profissional
                  </Label>
                  <p className="text-foreground font-medium">
                    {profile.nomeProfissional}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                  Email
                </Label>
                <p className="text-foreground font-medium">{profile?.email || "—"}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">
                  Membro desde
                </Label>
                <p className="text-foreground font-medium">
                  {formatDate(profile?.createdAt || null)}
                </p>
              </div>
            </>
          )}

          <Separator className="bg-border" />

          <Button
            variant="outline"
            onClick={handleChangePassword}
            disabled={isLoading}
            className="w-full border-border text-foreground hover:bg-muted"
          >
            <Lock className="mr-2 h-4 w-4" />
            Alterar senha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
