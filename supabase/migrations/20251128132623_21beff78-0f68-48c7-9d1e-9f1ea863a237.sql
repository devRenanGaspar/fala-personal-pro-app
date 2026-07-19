-- 1. Adicionar coluna system_prompt na tabela agents existente
ALTER TABLE agents ADD COLUMN system_prompt text;

-- Atualizar os 5 agentes com seus prompts específicos
UPDATE agents SET system_prompt = 'Você é um especialista em posicionamento de mercado para personal trainers. Ajude o usuário a definir seu nicho específico, público-alvo ideal e diferencial competitivo. Faça perguntas estratégicas sobre: faixa etária, gênero, objetivos, dores, estilo de vida. Gere uma definição clara e acionável de nicho.' WHERE slug = 'nicho';

UPDATE agents SET system_prompt = 'Você é um especialista em copywriting e psicologia do consumidor. Ajude o personal trainer a identificar as dores profundas, objeções e desejos do público-alvo. Explore: frustrações, medos, tentativas anteriores, sonhos, transformação desejada.' WHERE slug = 'dores-desejos';

UPDATE agents SET system_prompt = 'Você é um especialista em marketing digital para Instagram. Crie uma bio otimizada para conversão que comunique: quem é, para quem atende, resultado que entrega. Máximo 150 caracteres. Use emojis estratégicos. Inclua CTA claro.' WHERE slug = 'bio';

UPDATE agents SET system_prompt = 'Você é um criador de conteúdo especializado em fitness e saúde. Crie posts educativos, inspiracionais ou promocionais baseados no nicho e dores do público. Formatos: carrossel (5-10 slides), post estático, roteiro de reel. Inclua: gancho, desenvolvimento, CTA.' WHERE slug = 'posts';

UPDATE agents SET system_prompt = 'Você é um especialista em stories e conteúdo efêmero. Crie séries de stories (3-7 stories) com objetivo específico: educar, engajar, vender, conectar. Formato: texto curto + indicação visual + interação (enquete, quiz, caixinha).' WHERE slug = 'stories';

-- 2. Criar tabela conversations (1 conversa por usuário por agente)
CREATE TABLE conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  title text DEFAULT 'Nova Conversa',
  current_document text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, agent_id)
);

-- RLS para conversations (restrictive policies)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON conversations
  AS RESTRICTIVE FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON conversations
  AS RESTRICTIVE FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON conversations
  AS RESTRICTIVE FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger para updated_at na conversations
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Criar tabela messages (mensagens do chat)
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Índice para performance
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- RLS para messages (via subquery na conversation)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own conversations" ON messages
  AS RESTRICTIVE FOR SELECT 
  USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert messages to own conversations" ON messages
  AS RESTRICTIVE FOR INSERT 
  WITH CHECK (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));

-- 4. Criar tabela document_versions (histórico de versões)
CREATE TABLE document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, version_number)
);

-- Índice para busca de versões
CREATE INDEX idx_versions_conversation ON document_versions(conversation_id, version_number DESC);

-- RLS para document_versions (via subquery)
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions from own conversations" ON document_versions
  AS RESTRICTIVE FOR SELECT 
  USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert versions to own conversations" ON document_versions
  AS RESTRICTIVE FOR INSERT 
  WITH CHECK (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));