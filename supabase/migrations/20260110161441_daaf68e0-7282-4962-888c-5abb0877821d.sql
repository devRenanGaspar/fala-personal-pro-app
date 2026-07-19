-- Create plans table
CREATE TABLE public.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  credits integer NOT NULL DEFAULT 0,
  price_cents integer DEFAULT 0,
  duration_days integer,
  max_messages_per_day integer,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Everyone can read plans
CREATE POLICY "Anyone can read plans"
ON public.plans
FOR SELECT
USING (true);

-- Only admins can manage plans
CREATE POLICY "Admins can manage plans"
ON public.plans
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Seed initial trial plan
INSERT INTO public.plans (slug, name, description, credits, duration_days, is_active, display_order)
VALUES ('trial', 'Trial', 'Período de teste gratuito por 7 dias', 100, 7, true, 0);

-- Add plan fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN plan_id uuid REFERENCES public.plans(id),
ADD COLUMN plan_started_at timestamptz,
ADD COLUMN plan_expires_at timestamptz;

-- Update handle_new_user function to assign trial plan
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

  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');

  RETURN NEW;
END;
$$;