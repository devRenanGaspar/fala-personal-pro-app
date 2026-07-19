-- Update handle_new_user function to avoid duplicate key constraint error
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  trial_plan_id uuid;
  trial_duration integer;
BEGIN
  -- Get trial plan
  SELECT id, duration_days INTO trial_plan_id, trial_duration
  FROM public.plans
  WHERE slug = 'trial'
  LIMIT 1;

  -- Create profile with trial plan
  INSERT INTO public.profiles (id, onboarding_completed, plan_id, plan_started_at, plan_expires_at)
  VALUES (
    NEW.id,
    false,
    trial_plan_id,
    now(),
    CASE WHEN trial_duration IS NOT NULL THEN now() + (trial_duration || ' days')::interval ELSE NULL END
  );

  -- Assign default user role (ignore if already exists from another trigger)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;