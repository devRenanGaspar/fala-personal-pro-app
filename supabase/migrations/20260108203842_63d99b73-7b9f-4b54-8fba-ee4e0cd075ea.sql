-- Add new columns to profiles table for user management
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS nome text,
ADD COLUMN IF NOT EXISTS telefone text,
ADD COLUMN IF NOT EXISTS instagram text,
ADD COLUMN IF NOT EXISTS notas_admin text;