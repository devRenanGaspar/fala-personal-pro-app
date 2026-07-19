-- ================================================
-- MIGRAÇÃO: Integração Assíncrona com N8N via Realtime
-- ================================================

-- 1. Adicionar campos de webhook na tabela agents
ALTER TABLE public.agents
ADD COLUMN IF NOT EXISTS webhook_url TEXT,
ADD COLUMN IF NOT EXISTS webhook_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS webhook_timeout_seconds INTEGER DEFAULT 300;

COMMENT ON COLUMN public.agents.webhook_url IS 'URL do webhook no N8N para este agente';
COMMENT ON COLUMN public.agents.webhook_enabled IS 'Se o webhook está ativo';
COMMENT ON COLUMN public.agents.webhook_timeout_seconds IS 'Timeout em segundos (padrão 300 = 5min)';

-- 2. Adicionar campos de status e rastreamento na tabela messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'delivered' CHECK (status IN ('sending', 'sent', 'delivered', 'error')),
ADD COLUMN IF NOT EXISTS request_id UUID,
ADD COLUMN IF NOT EXISTS error_message TEXT;

COMMENT ON COLUMN public.messages.status IS 'Estado da mensagem: sending (enviando), sent (aguardando N8N), delivered (entregue), error (erro)';
COMMENT ON COLUMN public.messages.request_id IS 'UUID único para idempotência';
COMMENT ON COLUMN public.messages.error_message IS 'Mensagem de erro se status = error';

-- 3. Adicionar campos de controle na tabela conversations
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS auto_renamed_by_n8n BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_processing BOOLEAN DEFAULT false;

COMMENT ON COLUMN public.conversations.auto_renamed_by_n8n IS 'Flag para evitar renomeações repetidas pelo N8N';
COMMENT ON COLUMN public.conversations.is_processing IS 'Se o agente está processando uma mensagem';

-- 4. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_agents_webhook ON public.agents(id) WHERE webhook_enabled = true;
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON public.messages(conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_request_id ON public.messages(request_id) WHERE request_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_conversations_processing ON public.conversations(id) WHERE is_processing = true;

-- 5. Habilitar Realtime para as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- 6. Configurar Replica Identity para Realtime completo
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.conversations REPLICA IDENTITY FULL;