import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AgentUsage {
  agentId: string;
  title: string;
  icon: string;
  messages: number;
}

/** Mensagens de usuário por agente no período (onde o custo se concentra). */
export function useAdminAgentUsage(periodDays: number) {
  return useQuery<AgentUsage[]>({
    queryKey: ["admin-agent-usage", periodDays],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startISO = startDate.toISOString();

      const { data: messagesData, error: mErr } = await supabase
        .from("messages")
        .select("conversation_id")
        .eq("role", "user")
        .gte("created_at", startISO);
      if (mErr) throw mErr;

      const { data: convData, error: cErr } = await supabase
        .from("conversations")
        .select("id, agent_id");
      if (cErr) throw cErr;

      const { data: agents, error: aErr } = await supabase
        .from("agents")
        .select("id, title, icon");
      if (aErr) throw aErr;

      const convAgent = new Map<string, string>();
      (convData ?? []).forEach((c) => convAgent.set(c.id, c.agent_id));

      const msgByAgent = new Map<string, number>();
      (messagesData ?? []).forEach((m) => {
        const aid = convAgent.get(m.conversation_id);
        if (aid) msgByAgent.set(aid, (msgByAgent.get(aid) ?? 0) + 1);
      });

      const rows: AgentUsage[] = (agents ?? []).map((a) => ({
        agentId: a.id,
        title: a.title,
        icon: a.icon,
        messages: msgByAgent.get(a.id) ?? 0,
      }));

      rows.sort((x, y) => y.messages - x.messages);
      return rows;
    },
    staleTime: 60 * 1000,
  });
}
