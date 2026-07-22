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
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { UserUsageRow } from "@/hooks/useAdminUserUsage";

interface UserUsageTableProps {
  data: UserUsageRow[];
  isLoading: boolean;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function UserUsageTable({ data, isLoading }: UserUsageTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Users className="h-4 w-4 text-primary" />
        <CardTitle className="text-base font-medium">
          Custo por usuário (mensagens no período)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-right">Mensagens</TableHead>
                <TableHead>Último acesso</TableHead>
                <TableHead>Plano</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>
                    <div className="font-medium text-foreground">{row.nome || row.email}</div>
                    {row.nome && (
                      <div className="text-xs text-muted-foreground">{row.email}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{row.messages}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(row.lastSignInAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.planActive ? "secondary" : "outline"}>
                      {row.planName}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma atividade no período
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
