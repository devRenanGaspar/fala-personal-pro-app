-- Remove constraint UNIQUE para permitir múltiplas conversas por agente
ALTER TABLE conversations 
DROP CONSTRAINT IF EXISTS conversations_user_id_agent_id_key;

-- Adiciona índice para performance nas queries de múltiplas conversas
CREATE INDEX IF NOT EXISTS idx_conversations_user_agent_created 
ON conversations(user_id, agent_id, created_at DESC);