-- Enable RLS on pro_stories_n8n_chat_histories (the only n8n table missing it)
ALTER TABLE public.pro_stories_n8n_chat_histories ENABLE ROW LEVEL SECURITY;