import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";

interface UseConversationOptions {
  conversationId?: string;
}

export function useConversation(agentSlug: string, options?: UseConversationOptions) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversation", agentSlug, options?.conversationId, user?.id],
    queryFn: async () => {
      if (!user || !agentSlug) return null;

      try {
        // 1. Buscar agente pelo slug
        const { data: agent, error: agentError } = await supabase
          .from("agents")
          // Somente colunas públicas — system_prompt/webhook_* são restritos
          // por privilégios de coluna no banco.
          .select(
            "id, slug, icon, title, description, route, display_order, is_active, initial_message, suggested_replies"
          )
          .eq("slug", agentSlug)
          .eq("is_active", true)
          .single();

        if (agentError) throw agentError;
        if (!agent) throw new Error("Agente não encontrado");

        // 2. Se tem conversationId específico, buscar essa conversa
        if (options?.conversationId) {
          const { data: conversation, error: convError } = await supabase
            .from("conversations")
            .select("*")
            .eq("id", options.conversationId)
            .eq("user_id", user.id)
            .single();

          if (convError) throw convError;
          return { agent, conversation };
        }

        // 3. Senão, buscar a conversa mais recente
        const { data: conversations, error: convError } = await supabase
          .from("conversations")
          .select("*")
          .eq("user_id", user.id)
          .eq("agent_id", agent.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (convError) throw convError;

        // Se não tem nenhuma conversa, retornar null
        const conversation = conversations && conversations.length > 0 ? conversations[0] : null;

        return { agent, conversation };
      } catch (error) {
        logger.error("Erro ao carregar conversa:", error);
        throw error;
      }
    },
    enabled: !!user && !!agentSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
