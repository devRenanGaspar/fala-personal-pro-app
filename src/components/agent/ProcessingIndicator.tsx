export function ProcessingIndicator() {
  return (
    <div className="flex items-start gap-3 justify-start">
      <div className="max-w-[80%] p-4 rounded-lg bg-card border border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              ⏱️ Processando...
            </span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Assim como um bom treino leva alguns minutos para ser montado, eu preciso de tempo para dar resultados!
          </p>
          <p className="text-sm text-muted-foreground">
            Aguarde até 3 minutos enquanto eu estudo seu caso. 💪
          </p>
        </div>
      </div>
    </div>
  );
}
