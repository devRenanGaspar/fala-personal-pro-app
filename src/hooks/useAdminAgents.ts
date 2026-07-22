import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export interface AdminAgent {
  id: string;
  slug: string;
  icon: string;
  title: string;
  description: string;
  route: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  initial_message: string | null;
  suggested_replies: string | null;
  system_prompt: string | null;
  webhook_enabled: boolean;
}

export function useAdminAgents() {
  return useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as AdminAgent[];
    },
    staleTime: 30 * 1000,
  });
}

export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Pick<AdminAgent, "title" | "description" | "icon" | "is_active" | "display_order" | "initial_message" | "suggested_replies" | "system_prompt">>;
    }) => {
      const { data, error } = await supabase
        .from("agents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-agents"] });
      queryClient.invalidateQueries({ queryKey: ["agents"] });
      toast.success("Agente atualizado com sucesso");
    },
    onError: (error) => {
      logger.error("Error updating agent:", error);
      toast.error("Erro ao atualizar agente");
    },
  });
}
