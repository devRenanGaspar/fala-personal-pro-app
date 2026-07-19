-- Add official_conversation_id to user_agent_progress table
ALTER TABLE user_agent_progress 
ADD COLUMN official_conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL;