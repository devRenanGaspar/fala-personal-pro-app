import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const MAX_LENGTH = 2000;

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  const remaining = MAX_LENGTH - value.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <div className="flex-1">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-[60px] max-h-[120px]"
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={MAX_LENGTH}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {remaining} caracteres restantes • Enter para enviar, Shift+Enter para nova linha
          </p>
        </div>
        <Button
          onClick={onSubmit}
          disabled={!value.trim() || disabled}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
        </Button>
      </div>
    </div>
  );
}
