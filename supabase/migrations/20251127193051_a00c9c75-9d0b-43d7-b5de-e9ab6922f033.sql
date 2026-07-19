-- Create agents table
CREATE TABLE agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  icon text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  route text NOT NULL,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on agents
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can read active agents
CREATE POLICY "Authenticated users can read active agents"
  ON agents FOR SELECT TO authenticated
  USING (is_active = true);

-- Insert the 5 agents
INSERT INTO agents (slug, icon, title, description, route, display_order) VALUES
  ('nicho', '🎯', 'Nicho & Posicionamento', 'Defina seu nicho e posicionamento único no mercado', '/agent/nicho', 1),
  ('dores-desejos', '💭', 'Dores & Desejos', 'Entenda profundamente as dores e desejos do seu público', '/agent/dores-desejos', 2),
  ('bio', '👤', 'Bio Profissional', 'Crie uma bio impactante para suas redes sociais', '/agent/bio', 3),
  ('posts', '📱', 'Posts para Instagram', 'Gere posts engajadores para o feed do Instagram', '/agent/posts', 4),
  ('stories', '📸', 'Stories Diários', 'Ideias de stories para manter sua audiência conectada', '/agent/stories', 5);

-- Create user_agent_progress table
CREATE TABLE user_agent_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  last_accessed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, agent_id)
);

-- Enable RLS on user_agent_progress
ALTER TABLE user_agent_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view own progress
CREATE POLICY "Users can view own progress"
  ON user_agent_progress FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert own progress
CREATE POLICY "Users can insert own progress"
  ON user_agent_progress FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update own progress
CREATE POLICY "Users can update own progress"
  ON user_agent_progress FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at on agents
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for updated_at on user_agent_progress
CREATE TRIGGER update_user_agent_progress_updated_at
  BEFORE UPDATE ON user_agent_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();