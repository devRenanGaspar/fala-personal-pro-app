export interface OnboardingQuestion {
  id: string;
  step: number;
  question_key: string;
  question_label: string;
  question_type: 'text' | 'select' | 'radio' | 'textarea';
  options: Array<{ value: string; label: string }>;
  placeholder: string | null;
  is_required: boolean;
  status: '00_Rascunho' | '10_Publicada' | '20_NaoListada' | '90_Cancelada';
  display_order: number;
  step_title: string | null;
  step_subtitle: string | null;
}

export interface OnboardingAnswer {
  id: string;
  user_id: string;
  question_id: string;
  answer_value: string;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  step: number;
  title: string | null;
  subtitle: string | null;
  questions: OnboardingQuestion[];
}

export type AnswersMap = Record<string, string>;
