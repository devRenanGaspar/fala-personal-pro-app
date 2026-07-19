-- Criar tabela onboarding_questions
CREATE TABLE public.onboarding_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  step integer NOT NULL CHECK (step >= 1 AND step <= 4),
  question_key text NOT NULL UNIQUE,
  question_label text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('text', 'select', 'radio', 'textarea')),
  options jsonb DEFAULT '[]'::jsonb,
  placeholder text,
  is_required boolean DEFAULT true,
  status text NOT NULL DEFAULT '00_Rascunho' CHECK (status IN ('00_Rascunho', '10_Publicada', '20_NaoListada', '90_Cancelada')),
  display_order integer NOT NULL DEFAULT 1,
  step_title text,
  step_subtitle text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.onboarding_questions ENABLE ROW LEVEL SECURITY;

-- Criar tabela onboarding_answers
CREATE TABLE public.onboarding_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.onboarding_questions(id) ON DELETE CASCADE,
  answer_value text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(user_id, question_id)
);

-- Habilitar RLS
ALTER TABLE public.onboarding_answers ENABLE ROW LEVEL SECURITY;

-- Trigger para validar máximo 3 perguntas por step
CREATE OR REPLACE FUNCTION check_max_questions_per_step()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = '10_Publicada' THEN
    IF (
      SELECT COUNT(*) 
      FROM onboarding_questions 
      WHERE step = NEW.step 
      AND status = '10_Publicada'
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    ) >= 3 THEN
      RAISE EXCEPTION 'Máximo de 3 perguntas publicadas por step (step %)', NEW.step;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_max_questions
BEFORE INSERT OR UPDATE ON onboarding_questions
FOR EACH ROW EXECUTE FUNCTION check_max_questions_per_step();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_questions_updated_at
BEFORE UPDATE ON onboarding_questions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_answers_updated_at
BEFORE UPDATE ON onboarding_answers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_questions_published_step_order
ON onboarding_questions(step, display_order)
WHERE status = '10_Publicada';

CREATE INDEX idx_answers_user_id
ON onboarding_answers(user_id);

CREATE INDEX idx_answers_user_question
ON onboarding_answers(user_id, question_id);

-- Políticas RLS para onboarding_questions
CREATE POLICY "Authenticated users can read published questions"
ON public.onboarding_questions
FOR SELECT
TO authenticated
USING (status = '10_Publicada');

-- Políticas RLS para onboarding_answers
CREATE POLICY "Users can view own answers"
ON public.onboarding_answers FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
ON public.onboarding_answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
ON public.onboarding_answers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own answers"
ON public.onboarding_answers FOR DELETE
USING (auth.uid() = user_id);

-- Popular com dados iniciais (9 perguntas atuais)
INSERT INTO public.onboarding_questions 
(step, question_key, question_label, question_type, options, placeholder, is_required, status, display_order, step_title, step_subtitle)
VALUES
-- Step 1: Identificação
(1, 'nome', 'Seu nome', 'text', '[]', 'Ex: João Silva', true, '10_Publicada', 1, 'Vamos começar pelo básico', 'Como podemos te chamar?'),
(1, 'nome_profissional', 'Nome profissional', 'text', '[]', 'Ex: Personal João Silva', true, '10_Publicada', 2, NULL, NULL),

-- Step 2: Nicho
(2, 'nicho', 'Nicho principal', 'select', '[{"value":"emagrecimento","label":"Emagrecimento"},{"value":"hipertrofia","label":"Hipertrofia"},{"value":"funcional","label":"Funcional"},{"value":"qualidade_vida","label":"Qualidade de vida"},{"value":"idosos","label":"Idosos"},{"value":"gestantes","label":"Gestantes"},{"value":"atletas","label":"Atletas"},{"value":"outro","label":"Outro"}]', NULL, true, '10_Publicada', 1, 'Qual é o seu foco?', 'Isso nos ajuda a personalizar seu conteúdo'),
(2, 'especialidade', 'Especialidade ou certificação (opcional)', 'text', '[]', 'Ex: Nutrição esportiva', false, '10_Publicada', 2, NULL, NULL),

-- Step 3: Público-alvo
(3, 'publico_idade', 'Faixa etária', 'select', '[{"value":"18-25","label":"18-25 anos"},{"value":"26-35","label":"26-35 anos"},{"value":"36-45","label":"36-45 anos"},{"value":"46-55","label":"46-55 anos"},{"value":"55+","label":"55+ anos"},{"value":"todas","label":"Todas as idades"}]', NULL, true, '10_Publicada', 1, 'Quem é seu público ideal?', 'Entender seu aluno é essencial para criar conteúdo que conecta'),
(3, 'publico_genero', 'Gênero predominante', 'radio', '[{"value":"feminino","label":"Majoritariamente feminino"},{"value":"masculino","label":"Majoritariamente masculino"},{"value":"misto","label":"Misto"}]', NULL, true, '10_Publicada', 2, NULL, NULL),
(3, 'publico_objetivo', 'Objetivo principal', 'select', '[{"value":"emagrecer","label":"Emagrecer"},{"value":"ganhar_massa","label":"Ganhar massa muscular"},{"value":"condicionamento","label":"Melhorar condicionamento"},{"value":"qualidade_vida","label":"Qualidade de vida"},{"value":"performance","label":"Performance esportiva"}]', NULL, true, '10_Publicada', 3, NULL, NULL),

-- Step 4: Objetivos
(4, 'objetivo_principal', 'Objetivo principal', 'select', '[{"value":"atrair_alunos","label":"Atrair novos alunos"},{"value":"fidelizar","label":"Fidelizar alunos atuais"},{"value":"autoridade","label":"Construir autoridade"},{"value":"vender_online","label":"Vender programas online"},{"value":"todos","label":"Todos acima"}]', NULL, true, '10_Publicada', 1, 'Último passo!', 'Qual é seu objetivo principal nas redes sociais?'),
(4, 'posts_semanais', 'Quantos posts por semana você pretende criar?', 'radio', '[{"value":"1-2","label":"1-2 posts por semana"},{"value":"3-4","label":"3-4 posts por semana"},{"value":"5-7","label":"5-7 posts por semana"}]', NULL, true, '10_Publicada', 2, NULL, NULL);