import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period, Granularity } from "@/hooks/useAdminChartData";

interface ChartFiltersProps {
  period: Period;
  granularity: Granularity;
  onPeriodChange: (period: Period) => void;
  onGranularityChange: (granularity: Granularity) => void;
}

export function ChartFilters({
  period,
  granularity,
  onPeriodChange,
  onGranularityChange,
}: ChartFiltersProps) {
  return (
    <div className="flex gap-2">
      <Select
        value={period.toString()}
        onValueChange={(v) => onPeriodChange(Number(v) as Period)}
      >
        <SelectTrigger className="w-[130px] h-8 text-xs bg-background border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7">Últimos 7 dias</SelectItem>
          <SelectItem value="14">Últimos 14 dias</SelectItem>
          <SelectItem value="30">Últimos 30 dias</SelectItem>
          <SelectItem value="90">Últimos 90 dias</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={granularity}
        onValueChange={(v) => onGranularityChange(v as Granularity)}
      >
        <SelectTrigger className="w-[100px] h-8 text-xs bg-background border-border">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Por dia</SelectItem>
          <SelectItem value="week">Por semana</SelectItem>
          <SelectItem value="month">Por mês</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
