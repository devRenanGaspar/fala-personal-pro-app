import type { OnboardingQuestion } from "@/types/onboarding";
import { QuestionText } from "./QuestionText";
import { QuestionSelect } from "./QuestionSelect";
import { QuestionRadio } from "./QuestionRadio";
import { QuestionTextarea } from "./QuestionTextarea";

interface DynamicQuestionProps {
  question: OnboardingQuestion;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function DynamicQuestion({ question, value, onChange, error }: DynamicQuestionProps) {
  switch (question.question_type) {
    case "text":
      return <QuestionText question={question} value={value} onChange={onChange} error={error} />;
    case "select":
      return <QuestionSelect question={question} value={value} onChange={onChange} error={error} />;
    case "radio":
      return <QuestionRadio question={question} value={value} onChange={onChange} error={error} />;
    case "textarea":
      return <QuestionTextarea question={question} value={value} onChange={onChange} error={error} />;
    default:
      return null;
  }
}
