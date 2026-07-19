import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OnboardingQuestion } from "@/types/onboarding";

interface QuestionTextProps {
  question: OnboardingQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function QuestionText({ question, value, onChange, error }: QuestionTextProps) {
  const maxLength = 200;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={question.question_key} className="text-foreground">
        {question.question_label}
        {question.is_required && <span className="text-primary ml-1">*</span>}
      </Label>
      <Input
        id={question.question_key}
        type="text"
        placeholder={question.placeholder || ""}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={error ? "border-destructive" : ""}
      />
      <div className="flex justify-between items-center">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <p className="text-xs text-muted-foreground ml-auto">
          {value.length}/{maxLength}
        </p>
      </div>
    </div>
  );
}
