const KEY = "ecocentre.quiz.v1";

export interface QuizState {
  scores: Record<string, number>;
  recommendedSlug: string;
  answers: { questionId: string; optionLabel: string }[];
  completedAt: string;
}

export const saveQuizState = (state: QuizState) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
};

export const loadQuizState = (): QuizState | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as QuizState) : null;
  } catch {
    return null;
  }
};

export const clearQuizState = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
};
