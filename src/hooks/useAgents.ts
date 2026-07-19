import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Agent {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  display_order: number;
  is_active: boolean;
  initial_message: string | null;
  suggested_replies: string | null;
}

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Agent[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
