import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserUsageRow {
  userId: string;
  email: string;
  nome: string | null;
  messages: number;
  lastSignInAt: string | null;
  planName: string;
  planActive: boolean;
}

interface AdminUsersLite {
  users: {
    id: string;
    email: string;
    nome: string | null;
    last_sign_in_at: string | null;
  }[];
}

/**
 * Custo por usuário no período: mensagens (= chamadas n8n) por usuário,
 * cruzado com identidade (email/último acesso via edge function admin-users)
 * e plano. Só usuários com atividade no período, ordenados por mensagens desc.
 */
export function useAdminUserUsage(periodDays: number) {
  return useQuery<UserUsageRow[]>({
    queryKey: ["admin-user-usage", periodDays],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startISO = startDate.toISOString();

      // Mensagens do período + mapa conversa->usuário
      const { data: messagesData, error: mErr } = await supabase
        .from("messages")
        .select("conversation_id")
        .eq("role", "user")
        .gte("created_at", startISO);
      if (mErr) throw mErr;

      const { data: convData, error: cErr } = await supabase
        .from("conversations")
        .select("id, user_id");
      if (cErr) throw cErr;

      const convUser = new Map<string, string>();
      (convData ?? []).forEach((c) => convUser.set(c.id, c.user_id));

      const msgByUser = new Map<string, number>();
      (messagesData ?? []).forEach((m) => {
        const uid = convUser.get(m.conversation_id);
        if (uid) msgByUser.set(uid, (msgByUser.get(uid) ?? 0) + 1);
      });

      // Planos por usuário
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, plan_id, plan_expires_at");
      if (pErr) throw pErr;

      const { data: plans, error: plErr } = await supabase
        .from("plans")
        .select("id, name, is_active");
      if (plErr) throw plErr;

      const planById = new Map((plans ?? []).map((p) => [p.id, p]));
      const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

      // Identidade (email, nome, último acesso) via edge function admin-users
      const idById = new Map<
        string,
        { email: string; nome: string | null; last_sign_in_at: string | null }
      >();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (token) {
        const resp = await fetch(
          "https://mmygxbfhthrlgamxbcfr.supabase.co/functions/v1/admin-users?page=1&per_page=1000",
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        if (resp.ok) {
          const json: AdminUsersLite = await resp.json();
          json.users.forEach((u) =>
            idById.set(u.id, { email: u.email, nome: u.nome, last_sign_in_at: u.last_sign_in_at })
          );
        }
      }

      const now = new Date();
      const rows: UserUsageRow[] = [];
      msgByUser.forEach((messages, userId) => {
        const id = idById.get(userId);
        const profile = profileById.get(userId);
        const plan = profile?.plan_id ? planById.get(profile.plan_id) : undefined;
        const notExpired = !profile?.plan_expires_at || new Date(profile.plan_expires_at) > now;
        const planActive = plan ? plan.is_active !== false && notExpired : false;

        rows.push({
          userId,
          email: id?.email ?? "—",
          nome: id?.nome ?? null,
          messages,
          lastSignInAt: id?.last_sign_in_at ?? null,
          planName: plan?.name ?? "Sem plano",
          planActive,
        });
      });

      rows.sort((a, b) => b.messages - a.messages);
      return rows;
    },
    staleTime: 60 * 1000,
  });
}
