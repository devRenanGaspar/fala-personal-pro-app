import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type ReportRange = "week" | "month" | "year";

interface ReportPeriodFilterProps {
  value: ReportRange;
  onChange: (value: ReportRange) => void;
}

export function ReportPeriodFilter({ value, onChange }: ReportPeriodFilterProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ReportRange)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">Última semana</SelectItem>
        <SelectItem value="month">Último mês</SelectItem>
        <SelectItem value="year">Último ano</SelectItem>
      </SelectContent>
    </Select>
  );
}
