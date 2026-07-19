import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";

const emailSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido")
    .max(255, "Email muito longo"),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({
  open,
  onOpenChange,
}: ForgotPasswordDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);

    try {
      const { error } = await resetPassword(data.email);

      if (error) {
        toast.error("Erro ao enviar email de recuperação. Tente novamente.");
        logger.error("Reset password error:", error);
      } else {
        setEmailSent(true);
        toast.success(
          "Se este email estiver cadastrado, você receberá instruções para redefinir sua senha."
        );
      }
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação. Tente novamente.");
      logger.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmailSent(false);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Recuperar Senha
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {emailSent
              ? "Verifique sua caixa de entrada e spam para o email de recuperação."
              : "Digite seu email para receber as instruções de recuperação de senha."}
          </DialogDescription>
        </DialogHeader>

        {!emailSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar Email"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            <Button
              onClick={handleClose}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Entendido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
