import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PlanBreakdownRow {
  planName: string;
  total: number;
  active: number;
  expired: number;
}

/**
 * Usuários agrupados por plano, com ativos vs. expirados.
 * Ativo = plano is_active e (sem data de expiração ou expiração no futuro).
 */
export function useAdminPlanBreakdown() {
  return useQuery<PlanBreakdownRow[]>({
    queryKey: ["admin-plan-breakdown"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("plan_id, plan_expires_at");
      if (pErr) throw pErr;

      const { data: plans, error: plErr } = await supabase
        .from("plans")
        .select("id, name, is_active");
      if (plErr) throw plErr;

      const planById = new Map((plans ?? []).map((p) => [p.id, p]));
      const now = new Date();
      const agg = new Map<string, { total: number; active: number; expired: number }>();

      (profiles ?? []).forEach((prof) => {
        const plan = prof.plan_id ? planById.get(prof.plan_id) : undefined;
        const name = plan?.name ?? "Sem plano";
        const notExpired = !prof.plan_expires_at || new Date(prof.plan_expires_at) > now;
        const active = plan ? plan.is_active !== false && notExpired : false;

        const cur = agg.get(name) ?? { total: 0, active: 0, expired: 0 };
        cur.total += 1;
        if (active) cur.active += 1;
        else cur.expired += 1;
        agg.set(name, cur);
      });

      return [...agg.entries()]
        .map(([planName, v]) => ({ planName, ...v }))
        .sort((a, b) => b.total - a.total);
    },
    staleTime: 60 * 1000,
  });
}
