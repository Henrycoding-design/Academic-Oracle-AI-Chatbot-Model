import type { GeminiModelFlag } from "./models";

export type ModelFailureType =
  | "unretriable"
  | "retriable"
  | "rate_limited"
  | "unavailable"
  | "wrong_format";

type ModelFailureCounts = Record<ModelFailureType, number>;

type ModelRoutingStats = {
  attempts: number;
  successes: number;
  failures: ModelFailureCounts;
  lastFailureAt: string | null;
};

type ModelRoutingMemory = {
  version: 1;
  models: Partial<Record<GeminiModelFlag, ModelRoutingStats>>;
};

const STORAGE_KEY = "academic-oracle-model-routing-memory";

const FAILURE_TYPES: ModelFailureType[] = [
  "unretriable",
  "retriable",
  "rate_limited",
  "unavailable",
  "wrong_format",
];

const SKIP_THRESHOLDS: Record<ModelFailureType, number> = {
  unretriable: 1,
  retriable: 3,
  rate_limited: 2,
  unavailable: 2,
  wrong_format: 2,
};

const createEmptyFailureCounts = (): ModelFailureCounts => ({
  unretriable: 0,
  retriable: 0,
  rate_limited: 0,
  unavailable: 0,
  wrong_format: 0,
});

const createEmptyRoutingMemory = (): ModelRoutingMemory => ({
  version: 1,
  models: {},
});

const normalizeStats = (value: any): ModelRoutingStats => ({
  attempts: typeof value?.attempts === "number" && value.attempts > 0 ? Math.round(value.attempts) : 0,
  successes: typeof value?.successes === "number" && value.successes > 0 ? Math.round(value.successes) : 0,
  failures: FAILURE_TYPES.reduce<ModelFailureCounts>((acc, type) => {
    const count = value?.failures?.[type];
    acc[type] = typeof count === "number" && count > 0 ? Math.round(count) : 0;
    return acc;
  }, createEmptyFailureCounts()),
  lastFailureAt: typeof value?.lastFailureAt === "string" ? value.lastFailureAt : null,
});

const readRoutingMemory = (): ModelRoutingMemory => {
  if (typeof window === "undefined") return createEmptyRoutingMemory();

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyRoutingMemory();

    const parsed = JSON.parse(raw);
    const models = parsed?.models && typeof parsed.models === "object" ? parsed.models : {};

    return {
      version: 1,
      models: Object.entries(models).reduce<ModelRoutingMemory["models"]>((acc, [model, stats]) => {
        acc[model as GeminiModelFlag] = normalizeStats(stats);
        return acc;
      }, {}),
    };
  } catch {
    return createEmptyRoutingMemory();
  }
};

const writeRoutingMemory = (memory: ModelRoutingMemory) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  } catch {
    // Best-effort session telemetry only.
  }
};

const ensureModelStats = (memory: ModelRoutingMemory, model: GeminiModelFlag): ModelRoutingStats => {
  const stats = normalizeStats(memory.models[model]);
  memory.models[model] = stats;
  return stats;
};

const hasUnusualFailures = (stats: ModelRoutingStats): boolean =>
  FAILURE_TYPES.some((type) => stats.failures[type] >= SKIP_THRESHOLDS[type]);

export const recordStandardModelAttempt = (model: GeminiModelFlag) => {
  const memory = readRoutingMemory();
  const stats = ensureModelStats(memory, model);
  stats.attempts += 1;
  writeRoutingMemory(memory);
};

export const recordStandardModelSuccess = (model: GeminiModelFlag) => {
  const memory = readRoutingMemory();
  const stats = ensureModelStats(memory, model);
  stats.successes += 1;
  writeRoutingMemory(memory);
};

export const recordStandardModelFailure = (model: GeminiModelFlag, type: ModelFailureType) => {
  const memory = readRoutingMemory();
  const stats = ensureModelStats(memory, model);
  stats.failures[type] += 1;
  stats.lastFailureAt = new Date().toISOString();
  writeRoutingMemory(memory);
};

export const shouldSkipStandardModel = (model: GeminiModelFlag): boolean => {
  const stats = readRoutingMemory().models[model];
  return stats ? hasUnusualFailures(stats) : false;
};

export const shouldForceRaceFromRoutingMemory = (): boolean => {
  const memory = readRoutingMemory();
  return Object.values(memory.models).filter((stats) => stats && hasUnusualFailures(stats)).length >= 2;
};
