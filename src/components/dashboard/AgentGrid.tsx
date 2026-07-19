import { AgentCard } from "./AgentCard";
import { Agent } from "@/hooks/useAgents";
import { OfficialDocsMap } from "@/hooks/useOfficialDocumentsMap";
import { Skeleton } from "@/components/ui/skeleton";

interface AgentGridProps {
  agents: Agent[];
  officialDocsMap: OfficialDocsMap;
  isLoading: boolean;
}

export function AgentGrid({ agents, officialDocsMap, isLoading }: AgentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[320px] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          hasOfficialDocument={!!officialDocsMap[agent.id]}
        />
      ))}
    </div>
  );
}
