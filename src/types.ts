
import type { ClientModelLabel } from "./services/models";

export interface AttachmentMeta {
  name: string;
  type: string;   // mime or extension
  size: number;
}

export interface UserMessageSelectionContext {
  targetMessageId?: string;
  actionLabel: string;
  selectionText: string;
}

export interface UserMessageUiMeta {
  displayContent?: string;
  selectionContext?: UserMessageSelectionContext;
}

export interface Message {
  id?: string;
  role: "user" | "model";
  content: string;
  attachment?: AttachmentMeta;
  attachments?: AttachmentMeta[];
  selectionContext?: UserMessageSelectionContext;
}

export interface ChatHistoryItem {
  role: "user" | "model";
  content: string;
};

export interface OracleTopicMemory {
  topic_tag: string;
  mistake_log: string[];
  accuracy: number | null;
  confidence_level: string;
  quizzes_done: number;
  mastered: boolean;
  quiz_results: string[];
  recommended_question_style?: "practical" | "cognitive" | "mixed";
  needs_feynman?: boolean;
  last_updated?: string;
}

export interface OracleProfileMemory {
  name: string | null;
  academic_level: string | null;
  interests: string[];
  confidence_level: string;
  level_of_cognition: string;
}

export interface OracleMemory {
  version: number;
  profile: OracleProfileMemory;
  current_topic_tag: string | null;
  topics: OracleTopicMemory[];
  strengths: string[];
  weaknesses: string[];
  raw_summary: string;
}

export type OracleResponse = {
  answer: string;
  memory: string;
  model: ClientModelLabel;
  model_label?: string;
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
  isCorrect: boolean | null;
  isModelFailure?: boolean;
  feedback: string;
}

export interface CoreTestItem {
  id: string;
  questionNumber: string;
  type: 'open' | 'mcq';
  prompt: string;
  options: string[];
  correctAnswer: string;
  markScheme: string;
  hints?: {
    general: string;
    specific: string;
    solution: string;
  };
  userAnswer: string;
  isCorrect: boolean | null;
  score: number | null;
  maxScore: number | null;
  feedback: string;
}

export type CoreTestGradingStyle =
  | 'default'
  | 'ap'
  | 'ielts'
  | 'sat'
  | 'act'
  | 'cambridge';

export interface CoreTestSummary {
  correct: number;
  total: number;
  percentage: number;
  usedMarkScheme: boolean;
  gradingStyle?: CoreTestGradingStyle;
}

export interface CoreTestPayload {
  title: string;
  instructions: string;
  items: CoreTestItem[];
  summary: CoreTestSummary | null;
}

export type ChatIntent = "agentic" | "fast" | "balance";

export type ChatTailoringMode = "no" | "standard" | "always";

export type GuardResult = {
  web_search: boolean;
  jailbreak: boolean;
  reason: string;
  web_search_topic?: "news" | "general" | "finance" | null;
};

export const PROVIDERS = ["gemini", "stepfun"] as const;

export type Provider = typeof PROVIDERS[number];

export const isValidProvider = (value: any): value is Provider => {
  return PROVIDERS.includes(value);
};
