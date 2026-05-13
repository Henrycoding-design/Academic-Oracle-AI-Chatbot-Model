export const GEMINI_MODEL_MAP = {
  agentic: "Gemini 3 Flash",
  fast: "Gemini 2.5 Lite",
  smart: "Gemini 3.1 Lite",
  balanced: "Gemini 2.5 Flash",
} as const;

export type GeminiModelFlag = keyof typeof GEMINI_MODEL_MAP;

export type GeminiModelName =
  typeof GEMINI_MODEL_MAP[keyof typeof GEMINI_MODEL_MAP];

export type ClientModelLabel = GeminiModelFlag | "openrouter/free";

export const DEFAULT_GEMINI_MODEL: GeminiModelName =
  GEMINI_MODEL_MAP.agentic;



export const getModelLabel = (model: ClientModelLabel): string => {
  if (model === "openrouter/free") return "OpenRouter Free";
  return GEMINI_MODEL_MAP[model as GeminiModelFlag] || model;
};

// Not used, reference only
export const GEMINI_MODEL_FLAGS = Object.keys(
  GEMINI_MODEL_MAP,
) as Array<GeminiModelFlag>;

export const isGeminiModelFlag = (value: unknown): value is GeminiModelFlag =>
  typeof value === "string" && value in GEMINI_MODEL_MAP;
