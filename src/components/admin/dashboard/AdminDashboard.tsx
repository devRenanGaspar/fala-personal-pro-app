import { useState } from "react";
import { StatsCards } from "./StatsCards";
import { MessagesChart } from "./MessagesChart";
import { ActiveUsersChart } from "./ActiveUsersChart";
import { AvgMessagesChart } from "./AvgMessagesChart";
import { NewSignupsChart } from "./NewSignupsChart";
import { PeakUsersChart } from "./PeakUsersChart";
import { ChartFilters } from "./ChartFilters";
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminChartData, Period, Granularity } from "@/hooks/useAdminChartData";
import { useAdminPeakUsers } from "@/hooks/useAdminPeakUsers";

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const [period, setPeriod] = useState<Period>(30);
  const [granularity, setGranularity] = useState<Granularity>("day");
  
  const { data: chartData, isLoading: chartLoading } = useAdminChartData(period, granularity);
  const { data: peakData, isLoading: peakLoading } = useAdminPeakUsers(period, granularity);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Visão geral do sistema</p>
      </div>

      <StatsCards stats={stats} isLoading={statsLoading} />

      <div className="grid gap-4 md:grid-cols-2">
        <MessagesChart
          data={chartData || []}
          isLoading={chartLoading}
          filters={
            <ChartFilters
              period={period}
              granularity={granularity}
              onPeriodChange={setPeriod}
              onGranularityChange={setGranularity}
            />
          }
        />
        <ActiveUsersChart
          data={chartData || []}
          isLoading={chartLoading}
          filters={
            <ChartFilters
              period={period}
              granularity={granularity}
              onPeriodChange={setPeriod}
              onGranularityChange={setGranularity}
            />
          }
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AvgMessagesChart
          data={chartData || []}
          isLoading={chartLoading}
          filters={
            <ChartFilters
              period={period}
              granularity={granularity}
              onPeriodChange={setPeriod}
              onGranularityChange={setGranularity}
            />
          }
        />
        <NewSignupsChart
          data={chartData || []}
          isLoading={chartLoading}
          filters={
            <ChartFilters
              period={period}
              granularity={granularity}
              onPeriodChange={setPeriod}
              onGranularityChange={setGranularity}
            />
          }
        />
      </div>

      <PeakUsersChart
        data={peakData || []}
        isLoading={peakLoading}
        filters={
          <ChartFilters
            period={period}
            granularity={granularity}
            onPeriodChange={setPeriod}
            onGranularityChange={setGranularity}
          />
        }
      />
    </div>
  );
}
