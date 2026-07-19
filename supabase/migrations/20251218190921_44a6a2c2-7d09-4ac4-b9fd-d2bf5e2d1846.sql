-- Habilitar REPLICA IDENTITY FULL para capturar todos campos no UPDATE
ALTER TABLE public.conversations REPLICA IDENTITY FULL;