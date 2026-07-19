import type { OnboardingStep as OnboardingStepType, AnswersMap } from "@/types/onboarding";
import { DynamicQuestion } from "./DynamicQuestion";

interface OnboardingStepProps {
  step: OnboardingStepType;
  answers: AnswersMap;
  errors: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export function OnboardingStep({ step, answers, errors, onChange }: OnboardingStepProps) {
  return (
    <div className="space-y-6">
      {step.title && (
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
          {step.subtitle && <p className="text-muted-foreground">{step.subtitle}</p>}
        </div>
      )}

      <div className="space-y-6">
        {step.questions.map((question) => (
          <DynamicQuestion
            key={question.id}
            question={question}
            value={answers[question.question_key] || ""}
            onChange={(value) => onChange(question.question_key, value)}
            error={errors[question.question_key]}
          />
        ))}
      </div>
    </div>
  );
}
