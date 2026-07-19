import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { AgentGrid } from "@/components/dashboard/AgentGrid";
import { useAgents } from "@/hooks/useAgents";
import { useOfficialDocumentsMap } from "@/hooks/useOfficialDocumentsMap";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: agents = [], isLoading: agentsLoading, error: agentsError } = useAgents();
  const { data: officialDocsMap = {}, isLoading: docsLoading } = useOfficialDocumentsMap();

  const isLoading = agentsLoading || docsLoading;

  if (agentsError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Erro ao carregar agentes
          </h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os agentes. Por favor, tente novamente.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <WelcomeSection />
        <AgentGrid 
          agents={agents} 
          officialDocsMap={officialDocsMap} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
