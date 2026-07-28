export interface Week {
  id: string;
  weekNumber: number;
  title: string;
  createdAt?: Date;
}

export interface Question {
  id: string;
  weekId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface LearnerProgress {
  weekId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface UserStats {
  streak: number;
  lastPracticeDate: string;
  bookmarkedQuestionIds: string[];
  progress: Record<string, LearnerProgress>; // key is weekId
}
