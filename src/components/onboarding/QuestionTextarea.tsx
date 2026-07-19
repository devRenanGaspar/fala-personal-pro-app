import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { OnboardingQuestion } from "@/types/onboarding";

interface QuestionTextareaProps {
  question: OnboardingQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function QuestionTextarea({ question, value, onChange, error }: QuestionTextareaProps) {
  const maxLength = 500;
  
  return (
    <div className="space-y-2">
      <Label htmlFor={question.question_key} className="text-foreground">
        {question.question_label}
        {question.is_required && <span className="text-primary ml-1">*</span>}
      </Label>
      <Textarea
        id={question.question_key}
        placeholder={question.placeholder || ""}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className={error ? "border-destructive" : ""}
        rows={4}
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
