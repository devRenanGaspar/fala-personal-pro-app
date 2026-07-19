import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, startOfWeek, startOfMonth, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Period, Granularity } from "./useAdminChartData";

interface PeakDataPoint {
  date: string;
  label: string;
  peakUsers: number;
}

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes

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

function calculatePeakForMessages(
  messages: { timestamp: number; userId: string }[]
): number {
  if (messages.length === 0) return 0;

  // Sort by timestamp
  messages.sort((a, b) => a.timestamp - b.timestamp);

  let peak = 0;

  for (let i = 0; i < messages.length; i++) {
    const windowStart = messages[i].timestamp;
    const windowEnd = windowStart + WINDOW_MS;
    const usersInWindow = new Set<string>();

    for (let j = i; j < messages.length; j++) {
      if (messages[j].timestamp > windowEnd) break;
      usersInWindow.add(messages[j].userId);
    }

    peak = Math.max(peak, usersInWindow.size);
  }

  return peak;
}

export function useAdminPeakUsers(period: Period, granularity: Granularity) {
  return useQuery<PeakDataPoint[]>({
    queryKey: ["admin-peak-users", period, granularity],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subDays(endDate, period);

      // Fetch all user messages in period
      const { data: messagesData, error: messagesError } = await supabase
        .from("messages")
        .select("created_at, conversation_id")
        .eq("role", "user")
        .gte("created_at", startDate.toISOString());

      if (messagesError) throw messagesError;

      // Fetch conversations to map user_id
      const { data: conversationsData, error: conversationsError } = await supabase
        .from("conversations")
        .select("id, user_id")
        .gte("updated_at", startDate.toISOString());

      if (conversationsError) throw conversationsError;

      const convUserMap = new Map<string, string>();
      conversationsData?.forEach((c) => convUserMap.set(c.id, c.user_id));

      // Group messages by period key
      const messagesByKey = new Map<string, { timestamp: number; userId: string }[]>();

      messagesData?.forEach((msg) => {
        if (!msg.created_at) return;
        const userId = convUserMap.get(msg.conversation_id);
        if (!userId) return;

        const msgDate = new Date(msg.created_at);
        const key = getDateKey(msgDate, granularity);

        if (!messagesByKey.has(key)) messagesByKey.set(key, []);
        messagesByKey.get(key)!.push({
          timestamp: msgDate.getTime(),
          userId,
        });
      });

      // Build intervals
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

      return intervals.map((date) => {
        const key = getDateKey(date, granularity);
        const msgs = messagesByKey.get(key) || [];
        return {
          date: key,
          label: formatLabel(date, granularity),
          peakUsers: calculatePeakForMessages(msgs),
        };
      });
    },
    staleTime: 60 * 1000,
  });
}
