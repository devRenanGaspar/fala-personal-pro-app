import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";

interface AvgMessagesChartProps {
  data: { label: string; avgMessagesPerUser: number }[];
  isLoading: boolean;
  filters: React.ReactNode;
}

const chartConfig = {
  avgMessagesPerUser: {
    label: "Média Msgs/Usuário",
    color: "hsl(210, 100%, 50%)",
  },
} satisfies ChartConfig;

export function AvgMessagesChart({ data, isLoading, filters }: AvgMessagesChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          <CardTitle className="text-base font-medium">Média de Mensagens/Usuário</CardTitle>
        </div>
        {filters}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="avgMessagesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210, 100%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
              <XAxis
                dataKey="label"
                stroke="hsl(0, 0%, 40%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(0, 0%, 40%)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                type="monotone"
                dataKey="avgMessagesPerUser"
                stroke="hsl(210, 100%, 50%)"
                strokeWidth={2}
                fill="url(#avgMessagesGradient)"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
