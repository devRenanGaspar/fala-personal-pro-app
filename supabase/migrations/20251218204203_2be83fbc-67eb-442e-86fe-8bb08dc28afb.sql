-- Habilitar REPLICA IDENTITY FULL para capturar todos os dados
ALTER TABLE user_agent_progress REPLICA IDENTITY FULL;

-- Adicionar à publicação supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE user_agent_progress;