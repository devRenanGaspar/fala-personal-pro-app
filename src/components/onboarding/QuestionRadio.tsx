import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { OnboardingQuestion } from "@/types/onboarding";

interface QuestionRadioProps {
  question: OnboardingQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function QuestionRadio({ question, value, onChange, error }: QuestionRadioProps) {
  return (
    <div className="space-y-3">
      <Label className="text-foreground">
        {question.question_label}
        {question.is_required && <span className="text-primary ml-1">*</span>}
      </Label>
      <RadioGroup value={value} onValueChange={onChange}>
        {question.options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${question.question_key}-${option.value}`} />
            <Label
              htmlFor={`${question.question_key}-${option.value}`}
              className="text-foreground font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
