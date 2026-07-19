import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Activity, MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardsProps {
  stats?: {
    total_users: number;
    total_messages: number;
    messages_last_30_days: number;
    active_users_last_30_days: number;
  };
  isLoading: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total de Usuários",
      value: stats?.total_users ?? 0,
      icon: Users,
      description: "Contas criadas",
    },
    {
      title: "Mensagens (30 dias)",
      value: stats?.messages_last_30_days ?? 0,
      icon: MessageSquare,
      description: "Mensagens enviadas",
    },
    {
      title: "Usuários Ativos (30 dias)",
      value: stats?.active_users_last_30_days ?? 0,
      icon: Activity,
      description: "Acessaram o sistema",
    },
    {
      title: "Total de Mensagens",
      value: stats?.total_messages ?? 0,
      icon: MessagesSquare,
      description: "Desde o início",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-2xl font-bold">{card.value.toLocaleString("pt-BR")}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
