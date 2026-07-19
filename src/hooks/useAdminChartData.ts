import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, startOfWeek, startOfMonth, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export type Period = 7 | 14 | 30 | 90;
export type Granularity = "day" | "week" | "month";

interface ChartDataPoint {
  date: string;
  label: string;
  messages: number;
  activeUsers: number;
  avgMessagesPerUser: number;
  newSignups: number;
}

function getIntervalDates(period: Period, granularity: Granularity) {
  const endDate = new Date();
  const startDate = subDays(endDate, period);

  let intervals: Date[];
  switch (granularity) {
    case "week":
      intervals = eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 });
      break;
    case "month":
      intervals = eachMonthOfInterval({ start: startDate, end: endDate });
      break;
    default:
      intervals = eachDayOfInterval({ start: startDate, end: endDate });
  }

  return { startDate, endDate, intervals };
}

function formatLabel(date: Date, granularity: Granularity): string {
  switch (granularity) {
    case "week":
      return format(date, "'Sem' w", { locale: ptBR });
    case "month":
      return format(date, "MMM", { locale: ptBR });
    default:
      return format(date, "dd/MM", { locale: ptBR });
  }
}

function getDateKey(date: Date, granularity: Granularity): string {
  switch (granularity) {
    case "week":
      return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
    case "month":
      return format(startOfMonth(date), "yyyy-MM");
    default:
      return format(date, "yyyy-MM-dd");
  }
}

export function useAdminChartData(period: Period, granularity: Granularity) {
  return useQuery<ChartDataPoint[]>({
    queryKey: ["admin-chart-data", period, granularity],
    queryFn: async () => {
      const { startDate, intervals } = getIntervalDates(period, granularity);

      // Buscar mensagens do período
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("created_at, conversation_id")
        .eq("role", "user")
        .gte("created_at", startDate.toISOString());

      if (messagesError) throw messagesError;

      // Buscar conversas para mapear user_id
      const conversationIds = [...new Set(messagesData?.map((m) => m.conversation_id) || [])];
      
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select("id, user_id, updated_at")
        .gte("updated_at", startDate.toISOString());

      if (conversationsError) throw conversationsError;

      // Buscar novos cadastros do período
      const { data: signupsData, error: signupsError } = await supabase
        .from("profiles")
        .select("created_at")
        .gte("created_at", startDate.toISOString());

      if (signupsError) throw signupsError;

      // Agregar cadastros por período
      const signupsByPeriod = new Map<string, number>();
      signupsData?.forEach((profile) => {
        if (profile.created_at) {
          const signupDate = new Date(profile.created_at);
          const key = getDateKey(signupDate, granularity);
          signupsByPeriod.set(key, (signupsByPeriod.get(key) || 0) + 1);
        }
      });

      // Criar mapas para agregação
      const conversationUserMap = new Map<string, string>();
      conversationsData?.forEach((c) => {
        conversationUserMap.set(c.id, c.user_id);
      });

      // Agregar mensagens por período
      const messagesByPeriod = new Map<string, number>();
      const usersByPeriod = new Map<string, Set<string>>();

      messagesData?.forEach((msg) => {
        const msgDate = new Date(msg.created_at);
        const key = getDateKey(msgDate, granularity);
        
        messagesByPeriod.set(key, (messagesByPeriod.get(key) || 0) + 1);
        
        const userId = conversationUserMap.get(msg.conversation_id);
        if (userId) {
          if (!usersByPeriod.has(key)) {
            usersByPeriod.set(key, new Set());
          }
          usersByPeriod.get(key)!.add(userId);
        }
      });

      // Montar array de pontos do gráfico
      const chartData: ChartDataPoint[] = intervals.map((date) => {
        const key = getDateKey(date, granularity);
        const messages = messagesByPeriod.get(key) || 0;
        const activeUsers = usersByPeriod.get(key)?.size || 0;
        
        return {
          date: key,
          label: formatLabel(date, granularity),
          messages,
          activeUsers,
          avgMessagesPerUser: activeUsers > 0 ? Math.round((messages / activeUsers) * 10) / 10 : 0,
          newSignups: signupsByPeriod.get(key) || 0,
        };
      });

      return chartData;
    },
    staleTime: 60 * 1000,
  });
}
