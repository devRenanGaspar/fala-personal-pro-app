import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserName() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-name", user?.id],
    queryFn: async () => {
      if (!user) return { nome: "", nomeProfissional: "" };

      const { data, error } = await supabase
        .from("onboarding_answers")
        .select("question_id, answer_value")
        .eq("user_id", user.id);

      if (error) throw error;

      // Buscar as questions para mapear question_key
      const { data: questions } = await supabase
        .from("onboarding_questions")
        .select("id, question_key")
        .in("question_key", ["nome", "nome_profissional"]);

      const questionMap = new Map(questions?.map(q => [q.id, q.question_key]) || []);

      let nome = "";
      let nomeProfissional = "";

      data.forEach((answer) => {
        const key = questionMap.get(answer.question_id);
        if (key === "nome") nome = answer.answer_value;
        if (key === "nome_profissional") nomeProfissional = answer.answer_value;
      });

      return { nome, nomeProfissional };
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
