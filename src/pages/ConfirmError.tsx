import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";
import { logger } from "@/lib/logger";

type PageStatus = "processing" | "success" | "sent" | "error" | "need_email";

interface HashParams {
  error?: string;
  error_code?: string;
  error_description?: string;
  access_token?: string;
  refresh_token?: string;
  type?: string;
}

const parseHashParams = (hash: string): HashParams => {
  const params: HashParams = {};
  if (!hash || hash.length <= 1) return params;
  
  const hashString = hash.substring(1); // Remove the leading #
  const pairs = hashString.split("&");
  
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      params[key as keyof HashParams] = decodeURIComponent(value.replace(/\+/g, " "));
    }
  });
  
  return params;
};

const ConfirmError = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<PageStatus>("processing");
  const [email, setEmail] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleConfirmation = async () => {
      const hashParams = parseHashParams(window.location.hash);
      
      logger.info("ConfirmError: Processing hash params", hashParams);

      // Case 1: Successful confirmation (has access_token)
      if (hashParams.access_token) {
        logger.info("ConfirmError: Valid token detected, redirecting to onboarding");
        setStatus("success");
        
        // Wait a moment for the session to be established
        setTimeout(() => {
          navigate("/onboarding", { replace: true });
        }, 1500);
        return;
      }

      // Case 2: Error in confirmation
      if (hashParams.error) {
        logger.warn("ConfirmError: Error detected", {
          error: hashParams.error,
          code: hashParams.error_code,
          description: hashParams.error_description,
        });

        // Try to extract email from URL search params (some Supabase versions include it)
        const searchParams = new URLSearchParams(window.location.search);
        const emailFromUrl = searchParams.get("email");
        
        if (emailFromUrl) {
          setEmail(emailFromUrl);
          await resendEmail(emailFromUrl);
        } else {
          // No email available, need user to provide it
          setStatus("need_email");
        }
        return;
      }

      // Case 3: No hash params - check if user navigated here directly
      // This shouldn't happen in normal flow, redirect to login
      logger.info("ConfirmError: No hash params, redirecting to login");
      navigate("/", { replace: true });
    };

    handleConfirmation();
  }, [navigate]);

  const resendEmail = async (emailToResend: string) => {
    try {
      setStatus("processing");
      
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailToResend,
        options: {
          emailRedirectTo: `${window.location.origin}/confirm-error`,
        },
      });

      if (error) {
        logger.error("ConfirmError: Failed to resend email", error);
        setErrorMessage(error.message);
        setStatus("error");
        return;
      }

      logger.info("ConfirmError: Email resent successfully to", emailToResend);
      setEmail(emailToResend);
      setStatus("sent");
    } catch (err: unknown) {
      logger.error("ConfirmError: Exception while resending email", err);
      setErrorMessage(err instanceof Error ? err.message : "Erro desconhecido");
      setStatus("error");
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputEmail.trim()) {
      await resendEmail(inputEmail.trim());
    }
  };

  const handleRetry = () => {
    if (email) {
      resendEmail(email);
    } else {
      setStatus("need_email");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto mb-2">
            <span className="text-4xl font-black text-primary">FALA</span>
            <span className="text-4xl font-black text-foreground"> PERSONAL</span>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Processing State */}
          {status === "processing" && (
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Processando...</p>
            </div>
          )}

          {/* Success State - Redirecting */}
          {status === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <CardTitle className="text-xl">Email Confirmado!</CardTitle>
              <CardDescription>
                Sua conta foi confirmada com sucesso. Redirecionando...
              </CardDescription>
            </div>
          )}

          {/* Email Sent State */}
          {status === "sent" && (
            <div className="text-center space-y-4">
              <Mail className="h-12 w-12 text-primary mx-auto" />
              <CardTitle className="text-xl">🔗 Link Expirado</CardTitle>
              <CardDescription className="space-y-2">
                <p>O link de confirmação que você clicou não é mais válido.</p>
                <p>
                  Mas não se preocupe! Enviamos um novo email de confirmação para{" "}
                  <strong className="text-foreground">{email}</strong>.
                </p>
                <p className="text-sm">
                  Verifique sua caixa de entrada (e a pasta de spam) e clique no novo link.
                </p>
              </CardDescription>
              <Button 
                onClick={() => navigate("/")} 
                className="mt-4 w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}

          {/* Need Email State */}
          {status === "need_email" && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto" />
                <CardTitle className="text-xl">🔗 Link Expirado</CardTitle>
                <CardDescription>
                  O link de confirmação expirou. Digite seu email para receber um novo link.
                </CardDescription>
              </div>
              
              <form onSubmit={handleSubmitEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar Novo Link
                </Button>
              </form>
              
              <Button 
                variant="outline" 
                onClick={() => navigate("/")} 
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
              <CardTitle className="text-xl">⚠️ Ocorreu um Erro</CardTitle>
              <CardDescription className="space-y-2">
                <p>Não foi possível reenviar o email de confirmação.</p>
                {errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}
                <p className="text-sm">
                  Por favor, tente novamente ou entre em contato com o suporte.
                </p>
              </CardDescription>
              <div className="flex flex-col gap-2">
                <Button onClick={handleRetry} className="w-full">
                  Tentar Novamente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/")} 
                  className="w-full"
                >
                  Voltar ao Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmError;
