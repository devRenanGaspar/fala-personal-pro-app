import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminStats {
  total_users: number;
  total_messages: number;
  messages_last_30_days: number;
  active_users_last_30_days: number;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Total de usuários (profiles)
      const { count: totalUsers, error: usersError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      if (usersError) throw usersError;

      // Total de mensagens (role = 'user')
      const { count: totalMessages, error: messagesError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user");

      if (messagesError) throw messagesError;

      // Mensagens dos últimos 30 dias
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: messagesLast30, error: messages30Error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("role", "user")
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (messages30Error) throw messages30Error;

      // Usuários ativos (com mensagens nos últimos 30 dias)
      const { data: activeUsersData, error: activeError } = await supabase
        .from("conversations")
        .select("user_id")
        .gte("updated_at", thirtyDaysAgo.toISOString());

      if (activeError) throw activeError;

      const uniqueActiveUsers = new Set(activeUsersData?.map((c) => c.user_id) || []);

      return {
        total_users: totalUsers ?? 0,
        total_messages: totalMessages ?? 0,
        messages_last_30_days: messagesLast30 ?? 0,
        active_users_last_30_days: uniqueActiveUsers.size,
      };
    },
    staleTime: 60 * 1000, // 1 minuto
  });
}
