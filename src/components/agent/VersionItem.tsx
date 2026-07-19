interface VersionItemProps {
  versionNumber: number;
  content: string;
  createdAt: string;
  onClick: () => void;
}

export function VersionItem({ versionNumber, content, createdAt, onClick }: VersionItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-card/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-foreground">Versão {versionNumber}</span>
        <span className="text-xs text-muted-foreground">
          {new Date(createdAt).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
          })}
        </span>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {content.substring(0, 60)}...
      </p>
    </button>
  );
}
