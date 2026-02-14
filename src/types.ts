
export interface AttachmentMeta {
  name: string;
  type: string;   // mime or extension
  size: number;
}

export interface Message {
  role: "user" | "model";
  content: string;
  attachment?: AttachmentMeta;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  content: string;
};

export type OracleResponse = {
  answer: string;
  memory?: string;
  model: string;
  sessionForTopicDone: boolean; // NEW: Mastery Flag
};

export class InvalidAIResponseError extends Error {
  constructor(message = "Invalid AI JSON response") {
    super(message);
    this.name = "InvalidAIResponseError";
  }
}

export class InvalidAPIError extends Error {
  constructor(message = "Invalid API") {
    super(message);
    this.name = "InvalidAPIError";
  }
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'open';
  question: string;
  options?: string[]; // Only for MCQ
  correctAnswer?: string; // For MCQ validation or reference
  explanation?: string; // Pre-generated explanation
}

export interface QuizConfig {
  level: 'Fundamental' | 'Intermediate' | 'Advanced';
  count: number;
  mcqRatio: number; // 0 to 1 (e.g., 0.5 = 50%)
}

export interface QuizResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
}
