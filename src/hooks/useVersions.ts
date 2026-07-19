import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface DocumentVersion {
  id: string;
  conversation_id: string;
  version_number: number;
  content: string;
  created_at: string;
}

export function useVersions(conversationId: string | undefined) {
  return useQuery({
    queryKey: ["versions", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];

      const { data, error } = await supabase
        .from("document_versions")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("version_number", { ascending: false });

      if (error) throw error;
      return data as DocumentVersion[];
    },
    enabled: !!conversationId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
