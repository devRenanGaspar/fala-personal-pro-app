import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { AnswersMap, OnboardingQuestion } from "@/types/onboarding";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";

export function useOnboardingAnswers(questions: OnboardingQuestion[] | undefined) {
  const { user } = useAuth();
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Criar uma chave estável baseada nos IDs das questions
  const questionsKey = questions?.map(q => q.id).join(',') || '';

  const loadAnswers = async () => {
    if (!user || !questions?.length) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("onboarding_answers")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      if (data) {
        // Criar mapa de respostas usando question_id para buscar question_key
        const answersMap: AnswersMap = {};
        data.forEach((answer) => {
          const question = questions.find((q) => q.id === answer.question_id);
          if (question) {
            answersMap[question.question_key] = answer.answer_value;
          }
        });
        setAnswers(answersMap);
      }
    } catch (err) {
      logger.error("Erro ao carregar respostas:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    if (!user || !questions?.length || hasFetched) return;
    loadAnswers();
  }, [user, questionsKey, hasFetched]);

  const retry = () => {
    setHasFetched(false);
  };

  const updateAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const saveAnswers = async () => {
    if (!user || !questions) return;

    try {
      const answersToSave = Object.entries(answers)
        .map(([questionKey, answerValue]) => {
          const question = questions.find((q) => q.question_key === questionKey);
          if (!question) return null;

          return {
            user_id: user.id,
            question_id: question.id,
            answer_value: answerValue,
          };
        })
        .filter(
          (a): a is { user_id: string; question_id: string; answer_value: string } =>
            a !== null
        );

      const { error } = await supabase
        .from("onboarding_answers")
        .upsert(answersToSave, {
          onConflict: "user_id,question_id",
        });

      if (error) throw error;
    } catch (error) {
      logger.error("Erro ao salvar respostas:", error);
      throw error;
    }
  };

  return {
    answers,
    updateAnswer,
    saveAnswers,
    isLoading,
    error,
    retry,
  };
}
