import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot } from "lucide-react";
import { AgentUsage } from "@/hooks/useAdminAgentUsage";

const chartConfig = {
  messages: { label: "Mensagens", color: "hsl(25, 100%, 50%)" },
} satisfies ChartConfig;

interface AgentUsageChartProps {
  data: AgentUsage[];
  isLoading: boolean;
}

export function AgentUsageChart({ data, isLoading }: AgentUsageChartProps) {
  const chartData = data.map((a) => ({
    label: `${a.icon} ${a.title}`,
    messages: a.messages,
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Bot className="h-4 w-4 text-primary" />
        <CardTitle className="text-base font-medium">Top agentes por uso</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" horizontal={false} />
              <XAxis
                type="number"
                stroke="hsl(0, 0%, 40%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                stroke="hsl(0, 0%, 40%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={150}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Bar dataKey="messages" fill="hsl(25, 100%, 50%)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
