interface SuggestedRepliesProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function SuggestedReplies({ suggestions, onSelect, disabled }: SuggestedRepliesProps) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="px-4 py-2 text-sm rounded-full border border-primary/30 bg-card text-foreground
                     hover:border-primary hover:bg-primary/10 transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     max-w-sm truncate"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
