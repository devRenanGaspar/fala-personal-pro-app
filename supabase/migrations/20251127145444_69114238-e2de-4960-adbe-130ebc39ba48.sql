-- Remover colunas de resposta do onboarding (agora gerenciadas em onboarding_answers)
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS nome,
  DROP COLUMN IF EXISTS nome_profissional,
  DROP COLUMN IF EXISTS nicho,
  DROP COLUMN IF EXISTS especialidade,
  DROP COLUMN IF EXISTS publico_idade,
  DROP COLUMN IF EXISTS publico_genero,
  DROP COLUMN IF EXISTS publico_objetivo,
  DROP COLUMN IF EXISTS objetivo_principal,
  DROP COLUMN IF EXISTS posts_semanais;