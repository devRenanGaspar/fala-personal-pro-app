import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2, AlertTriangle } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { ForgotPasswordDialog } from "@/components/ForgotPasswordDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const signupSchema = z.object({
  nome: z
    .string()
    .min(2, "Nome deve ter no mínimo 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  password: z
    .string()
    .min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z
    .string()
    .min(1, "Confirme sua senha"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user, profile, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!loading && user) {
      if (profile?.onboarding_completed) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    }
  }, [user, profile, loading, navigate]);

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    const { error } = await signIn(data.email, data.password);
    
    if (error) {
      // Detectar erro de email não confirmado
      if (error.message?.toLowerCase().includes("email not confirmed")) {
        setErrorMessage("Confirme seu email antes de fazer login. Verifique sua caixa de entrada.");
      } else if (error.message?.includes("Invalid login credentials")) {
        setErrorMessage("Email ou senha incorretos");
      } else {
        setErrorMessage(error.message || "Erro ao fazer login. Tente novamente.");
      }
      setIsLoading(false);
      return;
    }
    
    toast.success("Login realizado com sucesso!");
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    const { error } = await signUp(data.email, data.password, data.nome);
    
    if (error) {
      const errorMsg = error.message?.toLowerCase() || "";
      
      if (errorMsg.includes("already registered")) {
        setErrorMessage("Este email já está cadastrado");
      } else if (errorMsg.includes("password")) {
        setErrorMessage("Senha muito fraca. Use uma senha mais forte.");
      } else if (errorMsg.includes("email") && errorMsg.includes("invalid")) {
        setErrorMessage("Email inválido. Verifique o formato.");
      } else if (errorMsg.includes("rate") || errorMsg.includes("limit")) {
        setErrorMessage("Muitas tentativas. Aguarde alguns minutos.");
      } else {
        setErrorMessage(error.message || "Erro ao criar conta. Tente novamente.");
      }
      setIsLoading(false);
      return;
    }
    
    toast.success("Conta criada com sucesso! Verifique seu email para confirmar.");
    setActiveTab("login");
    signupForm.reset();
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Coluna Esquerda - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-background p-16 flex-col justify-between relative">
        {/* Logo */}
        <div className="inline-block">
          <img 
            src={logo} 
            alt="Fala Personal" 
            className="h-16 w-auto"
          />
        </div>

        {/* Conteúdo Principal */}
        <div className="max-w-xl">
          <h2 className="text-foreground font-black text-5xl leading-tight mb-4">
            Transforme sua
            <br />
            comunicação com IA
          </h2>
          <div className="w-[200px] h-1 bg-primary mb-8" />

          <p className="text-foreground text-xl mb-12 leading-relaxed">
            Crie conteúdo profissional para suas redes sociais e
            <br />
            engaje seus alunos de forma autêntica.
          </p>

          {/* Benefícios */}
          <div className="space-y-4">
            {[
              "Copy profissional em minutos",
              "Conteúdo personalizado para seu público",
              "Economia de tempo e recursos",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <span className="text-primary text-2xl font-bold">✓</span>
                </div>
                <span className="text-foreground text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground text-sm">
          © 2025 Fala Personal. Todos os direitos reservados.
        </p>
      </div>

      {/* Coluna Direita - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <div className="lg:hidden mb-8 text-center">
            <img 
              src={logo} 
              alt="Fala Personal" 
              className="h-12 w-auto mx-auto"
            />
          </div>

          {/* Tabs Login / Criar Conta */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-card">
              <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Criar Conta
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <div className="mb-6">
                <h2 className="text-primary font-bold text-[32px] mb-2">
                  Bem-vindo de volta!
                </h2>
                <p className="text-foreground text-lg">Faça login para continuar</p>
              </div>

              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                {/* Campo Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-foreground font-semibold text-base">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    {...loginForm.register("email")}
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-destructive text-sm">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-foreground font-semibold text-base">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pr-12"
                      {...loginForm.register("password")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          loginForm.handleSubmit(onLoginSubmit)();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-destructive text-sm">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Esqueceu senha */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordDialog(true)}
                    className="text-primary text-sm hover:underline font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                {/* Botão Entrar */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base uppercase"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "ENTRAR"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <div className="mb-6">
                <h2 className="text-primary font-bold text-[32px] mb-2">
                  Criar conta
                </h2>
                <p className="text-foreground text-lg">Comece seu período de teste gratuito</p>
              </div>

              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-6">
                {/* Campo Nome */}
                <div className="space-y-2">
                  <Label htmlFor="signup-nome" className="text-foreground font-semibold text-base">
                    Nome
                  </Label>
                  <Input
                    id="signup-nome"
                    type="text"
                    placeholder="Seu nome"
                    className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    {...signupForm.register("nome")}
                  />
                  {signupForm.formState.errors.nome && (
                    <p className="text-destructive text-sm">{signupForm.formState.errors.nome.message}</p>
                  )}
                </div>

                {/* Campo Email */}
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground font-semibold text-base">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
                    {...signupForm.register("email")}
                  />
                  {signupForm.formState.errors.email && (
                    <p className="text-destructive text-sm">{signupForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Campo Senha */}
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground font-semibold text-base">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pr-12"
                      {...signupForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-destructive text-sm">{signupForm.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Campo Confirmar Senha */}
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="text-foreground font-semibold text-base">
                    Confirmar Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-14 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary pr-12"
                      {...signupForm.register("confirmPassword")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          signupForm.handleSubmit(onSignupSubmit)();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {signupForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-sm">{signupForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                {/* Info Trial */}
                <p className="text-muted-foreground text-sm text-center">
                  Ao criar sua conta, você inicia com o plano <span className="text-primary font-semibold">Trial gratuito por 7 dias</span>.
                </p>

                {/* Botão Criar Conta */}
                <Button
                  type="submit"
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base uppercase"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    "CRIAR CONTA"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Footer - Link Suporte */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Dúvidas?{" "}
              <a
                href={import.meta.env.VITE_SUPPORT_WHATSAPP_URL ?? "https://wa.me/5599999999999"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Fale com nosso suporte
              </a>
            </p>
          </div>

          {/* Branding Mobile */}
          <div className="lg:hidden mt-12 text-center">
            <p className="text-foreground font-bold text-xl mb-4">
              Transforme sua comunicação com IA
            </p>
            <p className="text-muted-foreground text-sm">
              © 2025 Fala Personal. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>

      {/* Dialog de Recuperação de Senha */}
      <ForgotPasswordDialog
        open={showForgotPasswordDialog}
        onOpenChange={setShowForgotPasswordDialog}
      />

      {/* Modal de Erro Centralizado */}
      <AlertDialog open={!!errorMessage} onOpenChange={() => setErrorMessage(null)}>
        <AlertDialogContent className="bg-card border-border max-w-sm">
          <AlertDialogHeader className="items-center text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-foreground text-xl">Atenção</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-base">
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              onClick={() => setErrorMessage(null)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold min-w-[120px]"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Login;
