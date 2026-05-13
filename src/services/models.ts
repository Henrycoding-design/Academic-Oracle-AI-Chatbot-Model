export const GEMINI_MODEL_MAP = {
  agentic: "Gemini 3 Flash",
  fast: "Gemini Flash Lite",
  smart: "Gemini 3.1 Flash",
  balanced: "Gemini 2.5 Flash",
} as const;

export type GeminiModelFlag = keyof typeof GEMINI_MODEL_MAP;

export type GeminiModelName =
  typeof GEMINI_MODEL_MAP[keyof typeof GEMINI_MODEL_MAP];

export type ClientModelLabel = GeminiModelFlag | "openrouter/free";

export const DEFAULT_GEMINI_MODEL: GeminiModelName =
  GEMINI_MODEL_MAP.agentic;

// Mapping from ClientModelLabel to UI display label
export const MODEL_LABEL_MAP: Record<ClientModelLabel, string> = {
  agentic: "Gemini 3 Flash",
  fast: "Gemini Flash Lite",
  smart: "Gemini 3.1 Flash",
  balanced: "Gemini 2.5 Flash",
  "openrouter/free": "OpenRouter Free",
} as const;

export const getModelLabel = (model: ClientModelLabel): string => {
  return MODEL_LABEL_MAP[model] || model;
};

// Not used, reference only
export const GEMINI_MODEL_FLAGS = Object.keys(
  GEMINI_MODEL_MAP,
) as Array<GeminiModelFlag>;

export const isGeminiModelFlag = (value: unknown): value is GeminiModelFlag =>
  typeof value === "string" && value in GEMINI_MODEL_MAP;