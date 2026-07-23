-- Protege as colunas sensíveis da tabela agents (system_prompt, webhook_url,
-- webhook_timeout_seconds, webhook_enabled) de leitura por usuários comuns.
--
-- Contexto: o app fazia select("*") em agents, expondo o system_prompt dos
-- agentes de IA a qualquer usuário autenticado via API. Aplicado somente após
-- o cutover do Lovable (2026-07-23), pois o app antigo dependia do select("*").
--
-- Camadas:
--  1. RPC admin_list_agents(): admins leem a linha completa (SECURITY DEFINER
--     com checagem explícita de has_role admin).
--  2. Privilégios de coluna: authenticated/anon só conseguem SELECT nas
--     colunas públicas. Edge functions (service_role) não são afetadas.

-- 1) RPC para o painel admin ler os agentes completos (inclui inativos)
CREATE OR REPLACE FUNCTION public.admin_list_agents()
RETURNS SETOF public.agents
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'permission denied: admin role required'
      USING ERRCODE = '42501';
  END IF;

  RETURN QUERY
    SELECT * FROM public.agents
    ORDER BY display_order ASC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_agents() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_agents() TO authenticated;

-- Admins podem enxergar todas as linhas (necessário para o RETURNING do
-- update quando um agente é desativado; colunas seguem restritas pelos
-- privilégios abaixo — a linha completa só sai pela RPC).
DROP POLICY IF EXISTS "Admins can view all agents" ON public.agents;
CREATE POLICY "Admins can view all agents"
  ON public.agents FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- 2) Trava de leitura por coluna para clientes do browser
REVOKE SELECT ON public.agents FROM anon, authenticated;

GRANT SELECT (
  id,
  slug,
  icon,
  title,
  description,
  route,
  display_order,
  is_active,
  created_at,
  updated_at,
  initial_message,
  suggested_replies
) ON public.agents TO authenticated;
