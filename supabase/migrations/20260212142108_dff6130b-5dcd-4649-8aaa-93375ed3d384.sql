-- 1. Remover duração do plano trial
UPDATE plans SET duration_days = NULL WHERE slug = 'trial';

-- 2. Liberar todos os usuários existentes
UPDATE profiles SET plan_expires_at = NULL;