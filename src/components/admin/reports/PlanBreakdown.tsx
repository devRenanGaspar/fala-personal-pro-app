import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard } from "lucide-react";
import { PlanBreakdownRow } from "@/hooks/useAdminPlanBreakdown";

interface PlanBreakdownProps {
  data: PlanBreakdownRow[];
  isLoading: boolean;
}

export function PlanBreakdown({ data, isLoading }: PlanBreakdownProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <CardTitle className="text-base font-medium">Usuários por plano</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[200px] w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plano</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Ativos</TableHead>
                <TableHead className="text-right">Expirados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.planName}>
                  <TableCell className="font-medium">{row.planName}</TableCell>
                  <TableCell className="text-right">{row.total}</TableCell>
                  <TableCell className="text-right text-green-500">{row.active}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.expired}</TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Sem dados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
