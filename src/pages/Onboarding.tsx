import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useOnboardingQuestions } from "@/hooks/useOnboardingQuestions";
import { useOnboardingAnswers } from "@/hooks/useOnboardingAnswers";
import { OnboardingStep } from "@/components/onboarding/OnboardingStep";
import { logger } from "@/lib/logger";

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const { steps, isLoading: questionsLoading } = useOnboardingQuestions();
  
  const allQuestions = useMemo(
    () => steps.flatMap((s) => s.questions),
    [steps]
  );
  
  const { answers, updateAnswer, saveAnswers, isLoading: answersLoading, error: answersError, retry } = useOnboardingAnswers(allQuestions);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirecionar se já completou onboarding
  useEffect(() => {
    if (!authLoading && user && profile?.onboarding_completed) {
      navigate("/dashboard");
    }
  }, [authLoading, user, profile, navigate]);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [authLoading, user, navigate]);

  const validateCurrentStep = () => {
    if (!steps[currentStepIndex]) return true;

    const currentStep = steps[currentStepIndex];
    const newErrors: Record<string, string> = {};

    currentStep.questions.forEach((question) => {
      if (question.is_required && !answers[question.question_key]?.trim()) {
        newErrors[question.question_key] = "Este campo é obrigatório";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setErrors({});
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    setErrors({});
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const sendOnboardingToN8N = async () => {
    try {
      // Fire-and-forget: send onboarding data to N8N
      // user_id is extracted from auth token in edge function (not trusted from client)
      supabase.functions.invoke('send-onboarding-to-n8n', {
        body: {
          answers,
        },
      });
      logger.info("Onboarding data sent to N8N");
    } catch (error) {
      // Don't fail the onboarding if webhook fails
      logger.error("Failed to send onboarding to N8N:", error);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar respostas
      await saveAnswers();

      // Marcar onboarding como completo
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ onboarding_completed: true })
        .eq("id", user!.id);

      if (updateError) throw updateError;

      // Fire-and-forget: enviar para N8N (não aguarda resposta)
      sendOnboardingToN8N();

      // Atualizar perfil no contexto
      await refreshProfile();

      toast.success("Perfil configurado com sucesso!");
      navigate("/onboarding-loading");
    } catch (error: unknown) {
      logger.error("Erro ao finalizar onboarding:", error);
      toast.error("Erro ao salvar suas informações. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || questionsLoading || answersLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (answersError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-foreground">Erro ao carregar suas respostas.</p>
          <Button onClick={retry}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  if (!steps.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-foreground">Nenhuma pergunta disponível no momento.</p>
      </div>
    );
  }

  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header com Logo e Logout */}
        <div className="mb-8 flex items-center justify-between">
          <div /> {/* Spacer para centralizar o logo */}
          <h1 className="text-3xl font-bold text-primary">Fala Personal</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Etapa {currentStepIndex + 1} de {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Formulário */}
        <div className="bg-card rounded-lg border border-border p-6 sm:p-8 space-y-8">
          <OnboardingStep
            step={currentStep}
            answers={answers}
            errors={errors}
            onChange={updateAnswer}
          />

          {/* Botões de navegação */}
          <div className="flex gap-4 pt-4">
            {currentStepIndex > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex-1"
              >
                Voltar
              </Button>
            )}

            {!isLastStep ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="flex-1"
              >
                Próximo
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  "Finalizar"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
