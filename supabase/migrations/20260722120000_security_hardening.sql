-- =====================================================================
-- Security hardening
--   1. Habilita RLS na tabela `user_insights`. As políticas já existem
--      desde a migration 20251218200517, mas o comando ENABLE nunca foi
--      aplicado — sem ele, as políticas ficam inertes e a tabela fica
--      aberta para leitura/escrita via chave anon (pública). Idempotente.
--
--   2. Impede escalonamento de plano / edição de notas administrativas.
--      A policy "Users can update own profile" (auth.uid() = id) autoriza
--      o dono a atualizar a linha, mas NÃO restringe colunas. Assim um
--      usuário comum poderia setar o próprio `plan_id` / `plan_expires_at`
--      (bypass de pagamento) ou sobrescrever `notas_admin`. Este trigger
--      torna essas colunas imutáveis para o role `authenticated` não-admin.
--      `service_role` (edge functions admin) e `postgres` (migrações)
--      continuam livres.
-- =====================================================================

-- 1) user_insights: garantir RLS ligado (seguro rodar mesmo se já estiver)
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;

-- 2) profiles: colunas de plano/billing e notas_admin imutáveis p/ usuário
CREATE OR REPLACE FUNCTION public.enforce_profile_protected_columns()
RETURNS trigger
LANGUAGE plpgsql
-- SECURITY INVOKER (padrão) de propósito: precisamos que `current_user`
-- reflita o chamador real (authenticated / service_role / postgres).
AS $$
BEGIN
  -- Só o cliente logado direto (role `authenticated`) é restringido.
  -- Edge functions (service_role) e migrações (postgres) passam adiante.
  IF current_user <> 'authenticated' THEN
    RETURN NEW;
  END IF;

  -- Admins podem alterar qualquer coluna.
  IF public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  -- Usuário comum: campos de plano e notas administrativas são imutáveis.
  IF NEW.plan_id         IS DISTINCT FROM OLD.plan_id
     OR NEW.plan_started_at IS DISTINCT FROM OLD.plan_started_at
     OR NEW.plan_expires_at IS DISTINCT FROM OLD.plan_expires_at
     OR NEW.notas_admin     IS DISTINCT FROM OLD.notas_admin
  THEN
    RAISE EXCEPTION 'Alteração não permitida em campos de plano ou notas administrativas';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_protected_columns ON public.profiles;
CREATE TRIGGER trg_enforce_profile_protected_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_protected_columns();
