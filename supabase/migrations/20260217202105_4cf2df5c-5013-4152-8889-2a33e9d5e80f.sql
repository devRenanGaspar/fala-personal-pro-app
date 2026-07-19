-- Add constraint to ensure webhook_url is HTTPS only when set
ALTER TABLE public.agents
ADD CONSTRAINT webhook_url_https_only
CHECK (webhook_url IS NULL OR webhook_url LIKE 'https://%');