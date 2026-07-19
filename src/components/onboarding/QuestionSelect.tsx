import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OnboardingQuestion } from "@/types/onboarding";

interface QuestionSelectProps {
  question: OnboardingQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function QuestionSelect({ question, value, onChange, error }: QuestionSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={question.question_key} className="text-foreground">
        {question.question_label}
        {question.is_required && <span className="text-primary ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={question.question_key} className={error ? "border-destructive" : ""}>
          <SelectValue placeholder={question.placeholder || "Selecione uma opção"} />
        </SelectTrigger>
        <SelectContent>
          {question.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
