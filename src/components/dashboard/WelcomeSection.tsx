import { useUserName } from "@/hooks/useUserName";
import { Skeleton } from "@/components/ui/skeleton";

export function WelcomeSection() {
  const { data: userName, isLoading } = useUserName();

  const displayName = userName?.nomeProfissional || userName?.nome || "Usuário";

  return (
    <div className="mb-8">
      {isLoading ? (
        <>
          <Skeleton className="h-10 w-96 mb-2" />
          <Skeleton className="h-6 w-[500px]" />
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Bem-vindo, {displayName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Escolha um agente para começar a criar conteúdo profissional
          </p>
        </>
      )}
    </div>
  );
}
