export type Step = 'home' | 'name' | 'quiz' | 'transition' | 'offer';

export interface QuizState {
  step: Step;
  userName: string;
  answers: Record<number, string>;
  currentQuestionIndex: number;
}
