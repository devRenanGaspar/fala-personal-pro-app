import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AdminReportSummary {
  newUsers: number;
  activeUsers: number;
  messages: number;
  avgMessagesPerActiveUser: number;
}

/**
 * KPIs consolidados do período (janela de `periodDays` dias até agora).
 * "Mensagens" = mensagens de usuário = chamadas ao n8n (proxy de custo).
 */
export function useAdminReportSummary(periodDays: number) {
  return useQuery<AdminReportSummary>({
    queryKey: ["admin-report-summary", periodDays],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startISO = startDate.toISOString();

      // Novos usuários no período
      const { count: newUsers, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startISO);
      if (usersError) throw usersError;

      // Mensagens de usuário no período (= chamadas ao n8n)
      const { count: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user")
        .gte("created_at", startISO);
      if (messagesError) throw messagesError;

      // Usuários ativos no período (distinct por atividade em conversas)
      const { data: activeData, error: activeError } = await supabase
        .from("conversations")
        .select("user_id")
        .gte("updated_at", startISO);
      if (activeError) throw activeError;

      const activeUsers = new Set((activeData ?? []).map((c) => c.user_id)).size;
      const msgs = messages ?? 0;

      return {
        newUsers: newUsers ?? 0,
        activeUsers,
        messages: msgs,
        avgMessagesPerActiveUser:
          activeUsers > 0 ? Math.round((msgs / activeUsers) * 10) / 10 : 0,
      };
    },
    staleTime: 60 * 1000,
  });
}
