-- Corrigir função check_max_questions_per_step com search_path
CREATE OR REPLACE FUNCTION check_max_questions_per_step()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Corrigir função update_updated_at_column com search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;