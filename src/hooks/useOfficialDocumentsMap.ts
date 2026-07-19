import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type OfficialDocsMap = Record<string, string>; // agent_id -> official_conversation_id

export function useOfficialDocumentsMap() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["official-documents-map", user?.id],
    queryFn: async () => {
      if (!user) return {};

      const { data, error } = await supabase
        .from("user_agent_progress")
        .select("agent_id, official_conversation_id")
        .eq("user_id", user.id)
        .not("official_conversation_id", "is", null);

      if (error) throw error;

      const docsMap: OfficialDocsMap = {};
      data.forEach((item) => {
        if (item.official_conversation_id) {
          docsMap[item.agent_id] = item.official_conversation_id;
        }
      });

      return docsMap;
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000,
  });
}
