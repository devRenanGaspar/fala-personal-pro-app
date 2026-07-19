-- Remove progress column from user_agent_progress table
ALTER TABLE public.user_agent_progress DROP COLUMN IF EXISTS progress;