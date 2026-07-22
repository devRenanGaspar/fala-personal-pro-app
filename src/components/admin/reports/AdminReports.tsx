import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, MessageSquare, TrendingUp } from "lucide-react";
import { Period, Granularity, useAdminChartData } from "@/hooks/useAdminChartData";
import { useAdminPeakUsers } from "@/hooks/useAdminPeakUsers";
import { useAdminReportSummary } from "@/hooks/useAdminReportSummary";
import { useAdminAgentUsage } from "@/hooks/useAdminAgentUsage";
import { useAdminPlanBreakdown } from "@/hooks/useAdminPlanBreakdown";
import { useAdminUserUsage } from "@/hooks/useAdminUserUsage";
import { ReportPeriodFilter, ReportRange } from "./ReportPeriodFilter";
import { AgentUsageChart } from "./AgentUsageChart";
import { PlanBreakdown } from "./PlanBreakdown";
import { UserUsageTable } from "./UserUsageTable";
import { MessagesChart } from "../dashboard/MessagesChart";
import { ActiveUsersChart } from "../dashboard/ActiveUsersChart";
import { NewSignupsChart } from "../dashboard/NewSignupsChart";
import { AvgMessagesChart } from "../dashboard/AvgMessagesChart";
import { PeakUsersChart } from "../dashboard/PeakUsersChart";

const RANGE_CONFIG: Record<ReportRange, { periodDays: Period; granularity: Granularity }> = {
  week: { periodDays: 7, granularity: "day" },
  month: { periodDays: 30, granularity: "day" },
  year: { periodDays: 365, granularity: "month" },
};

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  isLoading: boolean;
}

function KpiCard({ icon: Icon, label, value, isLoading }: KpiCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminReports() {
  const [range, setRange] = useState<ReportRange>("month");
  const { periodDays, granularity } = RANGE_CONFIG[range];

  const summary = useAdminReportSummary(periodDays);
  const chart = useAdminChartData(periodDays, granularity);
  const peak = useAdminPeakUsers(periodDays, granularity);
  const agentUsage = useAdminAgentUsage(periodDays);
  const planBreakdown = useAdminPlanBreakdown();
  const userUsage = useAdminUserUsage(periodDays);

  const s = summary.data;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Relatórios</h2>
          <p className="text-muted-foreground">
            Uso e custo por usuário. Cada mensagem enviada = 1 chamada ao n8n.
          </p>
        </div>
        <ReportPeriodFilter value={range} onChange={setRange} />
      </div>

      {/* KPIs do período */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={Users} label="Novos usuários" value={s?.newUsers ?? 0} isLoading={summary.isLoading} />
        <KpiCard icon={UserCheck} label="Usuários ativos" value={s?.activeUsers ?? 0} isLoading={summary.isLoading} />
        <KpiCard icon={MessageSquare} label="Mensagens (n8n)" value={s?.messages ?? 0} isLoading={summary.isLoading} />
        <KpiCard icon={TrendingUp} label="Média msgs/ativo" value={s?.avgMessagesPerActiveUser ?? 0} isLoading={summary.isLoading} />
      </div>

      {/* Séries no tempo */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MessagesChart data={chart.data ?? []} isLoading={chart.isLoading} filters={null} />
        <ActiveUsersChart data={chart.data ?? []} isLoading={chart.isLoading} filters={null} />
        <NewSignupsChart data={chart.data ?? []} isLoading={chart.isLoading} filters={null} />
        <AvgMessagesChart data={chart.data ?? []} isLoading={chart.isLoading} filters={null} />
      </div>

      <PeakUsersChart data={peak.data ?? []} isLoading={peak.isLoading} filters={null} />

      {/* Recortes de custo */}
      <div className="grid gap-4 lg:grid-cols-2">
        <AgentUsageChart data={agentUsage.data ?? []} isLoading={agentUsage.isLoading} />
        <PlanBreakdown data={planBreakdown.data ?? []} isLoading={planBreakdown.isLoading} />
      </div>

      <UserUsageTable data={userUsage.data ?? []} isLoading={userUsage.isLoading} />
    </div>
  );
}
