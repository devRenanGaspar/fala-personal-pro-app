import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { OnboardingQuestion, OnboardingStep } from "@/types/onboarding";

export function useOnboardingQuestions() {
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ["onboarding-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_questions")
        .select("*")
        .eq("status", "10_Publicada")
        .order("step", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) throw error;
      
      // Converter Json para array de opções
      return data.map((item) => ({
        ...item,
        options: Array.isArray(item.options) ? item.options as Array<{ value: string; label: string }> : [],
      })) as OnboardingQuestion[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Agrupar perguntas por step
  const questionsByStep: Record<number, OnboardingStep> = {};
  
  questions?.forEach((question) => {
    if (!questionsByStep[question.step]) {
      questionsByStep[question.step] = {
        step: question.step,
        title: question.step_title,
        subtitle: question.step_subtitle,
        questions: [],
      };
    }
    questionsByStep[question.step].questions.push(question);
  });

  // Extrair apenas os steps que têm perguntas
  const steps = Object.values(questionsByStep).sort((a, b) => a.step - b.step);

  return {
    questions,
    questionsByStep,
    steps,
    isLoading,
    error,
  };
}
