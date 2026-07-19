-- Fix 1: Enable RLS on n8n chat history tables
ALTER TABLE pro_bio_n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_dores_n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_n8n_chat_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pro_nicho_n8n_chat_histories ENABLE ROW LEVEL SECURITY;

-- Fix 2: Add RLS policies for user_insights table
CREATE POLICY "Users can view own insights" 
  ON user_insights 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own insights" 
  ON user_insights 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own insights" 
  ON user_insights 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own insights" 
  ON user_insights 
  FOR DELETE 
  USING (auth.uid() = user_id);