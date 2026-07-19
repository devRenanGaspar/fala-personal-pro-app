import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { UserPlus } from "lucide-react";

interface NewSignupsChartProps {
  data: { label: string; newSignups: number }[];
  isLoading: boolean;
  filters: React.ReactNode;
}

const chartConfig = {
  newSignups: {
    label: "Novos Cadastros",
    color: "hsl(270, 70%, 60%)",
  },
} satisfies ChartConfig;

export function NewSignupsChart({ data, isLoading, filters }: NewSignupsChartProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-purple-500" />
          <CardTitle className="text-base font-medium">Novos Cadastros</CardTitle>
        </div>
        {filters}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                allowDecimals={false}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar
                dataKey="newSignups"
                fill="hsl(270, 70%, 60%)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
