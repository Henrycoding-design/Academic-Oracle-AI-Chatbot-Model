/*
 * Copyright (c) 2026 Vo Tan Binh / Universal Academic Oracle
 * All Rights Reserved.
 *
 * This file is NOT licensed under Apache License 2.0.
 * No permission is granted to copy, redistribute, modify, reuse,
 * republish, or sublicense this file outside the official upstream
 * Universal Academic Oracle repository without prior written permission.
 *
 * See NOTICE and TRADEMARK_POLICY.md for additional terms.
 */

import type { ChatHistoryItem, OracleMemory, OracleTopicMemory } from "../types";

const MEMORY_VERSION = 2;

const DEFAULT_PROFILE = {
  name: null,
  academic_level: null,
  interests: [] as string[],
  confidence_level: "medium",
  level_of_cognition: "unknown",
};

const clampAccuracy = (value: unknown): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
};

export const formatTopicTagForDisplay = (topicTag: string | null | undefined): string => {
  if (typeof topicTag !== "string") return "";

  const normalized = topicTag
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (!normalized) return "";

  return normalized.replace(/\b([a-z])/gi, (match) => match.toUpperCase());
};

const normalizeTopic = (topic: Partial<OracleTopicMemory> | null | undefined): OracleTopicMemory | null => {
  const topicTag = typeof topic?.topic_tag === "string" ? topic.topic_tag.trim() : "";
  if (!topicTag) return null;

  const questionStyle = topic?.recommended_question_style;
  const normalizedQuestionStyle =
    questionStyle === "practical" || questionStyle === "cognitive" || questionStyle === "mixed"
      ? questionStyle
      : "mixed";

  return {
    topic_tag: topicTag,
    mistake_log: Array.isArray(topic?.mistake_log)
      ? topic!.mistake_log.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [],
    accuracy: clampAccuracy(topic?.accuracy),
    confidence_level:
      typeof topic?.confidence_level === "string" && topic.confidence_level.trim()
        ? topic.confidence_level.trim()
        : "medium",
    quizzes_done: typeof topic?.quizzes_done === "number" && topic.quizzes_done >= 0
      ? Math.round(topic.quizzes_done)
      : 0,
    mastery_checks_attempted: typeof topic?.mastery_checks_attempted === "number" && topic.mastery_checks_attempted >= 0
      ? Math.round(topic.mastery_checks_attempted)
      : 0,
    mastered: Boolean(topic?.mastered),
    quiz_results: Array.isArray(topic?.quiz_results)
      ? topic!.quiz_results.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [],
    recommended_question_style: normalizedQuestionStyle,
    needs_feynman: Boolean(topic?.needs_feynman),
    last_updated:
      typeof topic?.last_updated === "string" && topic.last_updated.trim()
        ? topic.last_updated
        : new Date().toISOString(),
  };
};

const findTopicByTag = (
  topics: OracleTopicMemory[],
  topicTag: string | null | undefined
): OracleTopicMemory | null => {
  if (typeof topicTag !== "string" || !topicTag.trim()) return null;
  return topics.find((topic) => topic.topic_tag.toLowerCase() === topicTag.trim().toLowerCase()) ?? null;
};

export const hasOracleTopicData = (topic: Partial<OracleTopicMemory> | null | undefined): boolean => {
  const normalized = normalizeTopic(topic);
  if (!normalized) return false;

  return Boolean(
    normalized.topic_tag.trim() &&
    (
      normalized.mastered ||
      normalized.quizzes_done > 0 ||
      normalized.mistake_log.length > 0 ||
      normalized.quiz_results.length > 0 ||
      normalized.accuracy !== null
    )
  );
};

export const createEmptyOracleMemory = (): OracleMemory => ({
  version: MEMORY_VERSION,
  profile: { ...DEFAULT_PROFILE },
  current_topic_tag: null,
  topics: [],
  strengths: [],
  weaknesses: [],
  raw_summary: "",
});

const normalizeOracleMemoryObject = (input: Partial<OracleMemory> | null | undefined): OracleMemory => {
  const topics = Array.isArray(input?.topics)
    ? input!.topics.map(normalizeTopic).filter((topic): topic is OracleTopicMemory => Boolean(topic))
    : [];

  const dedupedTopics = topics.reduce<OracleTopicMemory[]>((acc, topic) => {
    const existing = acc.find((item) => item.topic_tag.toLowerCase() === topic.topic_tag.toLowerCase());
    if (!existing) {
      acc.push(topic);
      return acc;
    }

    existing.mistake_log = Array.from(new Set([...existing.mistake_log, ...topic.mistake_log]));
    existing.quiz_results = Array.from(new Set([...existing.quiz_results, ...topic.quiz_results]));
    existing.quizzes_done = Math.max(existing.quizzes_done, topic.quizzes_done);
    existing.mastery_checks_attempted = Math.max(existing.mastery_checks_attempted, topic.mastery_checks_attempted);
    existing.accuracy = topic.accuracy ?? existing.accuracy;
    existing.confidence_level = topic.confidence_level || existing.confidence_level;
    existing.mastered = existing.mastered || topic.mastered;
    existing.recommended_question_style = topic.recommended_question_style || existing.recommended_question_style;
    existing.needs_feynman = existing.needs_feynman || topic.needs_feynman;
    existing.last_updated = topic.last_updated || existing.last_updated;
    return acc;
  }, []);

  return {
    version: MEMORY_VERSION,
    profile: {
      name: typeof input?.profile?.name === "string" && input.profile.name.trim() ? input.profile.name.trim() : null,
      academic_level:
        typeof input?.profile?.academic_level === "string" && input.profile.academic_level.trim()
          ? input.profile.academic_level.trim()
          : null,
      interests: Array.isArray(input?.profile?.interests)
        ? input!.profile!.interests.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        : [],
      confidence_level:
        typeof input?.profile?.confidence_level === "string" && input.profile.confidence_level.trim()
          ? input.profile.confidence_level.trim()
          : "medium",
      level_of_cognition:
        typeof input?.profile?.level_of_cognition === "string" && input.profile.level_of_cognition.trim()
          ? input.profile.level_of_cognition.trim()
          : "unknown",
    },
    current_topic_tag:
      typeof input?.current_topic_tag === "string" && input.current_topic_tag.trim()
        ? input.current_topic_tag.trim()
        : dedupedTopics.at(-1)?.topic_tag ?? null,
    topics: dedupedTopics,
    strengths: Array.isArray(input?.strengths)
      ? input!.strengths.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [],
    weaknesses: Array.isArray(input?.weaknesses)
      ? input!.weaknesses.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
      : [],
    raw_summary: typeof input?.raw_summary === "string" ? input.raw_summary : "",
  };
};

const matchField = (text: string, label: string) => {
  const regex = new RegExp(`${label}\\s*[:\\-]\\s*([^\\n.]+)`, "i");
  return text.match(regex)?.[1]?.trim() ?? null;
};

const parseTopicMentions = (text: string): OracleTopicMemory[] => {
  const topics = new Map<string, OracleTopicMemory>();
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const masteredMatch = line.match(/(.+?)\s*\[TOPIC MASTERED\]/i);
    const explicitTopicMatch = line.match(/(?:topic|focus|current topic)\s*[:\-]\s*(.+)$/i);
    const topicTag = (masteredMatch?.[1] || explicitTopicMatch?.[1] || "").trim();

    if (!topicTag) continue;

    topics.set(topicTag.toLowerCase(), {
      topic_tag: topicTag,
      mistake_log: [],
      accuracy: null,
      confidence_level: "medium",
      quizzes_done: 0,
      mastery_checks_attempted: 0,
      mastered: Boolean(masteredMatch),
      quiz_results: [],
      recommended_question_style: "mixed",
      needs_feynman: false,
      last_updated: new Date().toISOString(),
    });
  }

  return Array.from(topics.values());
};

const reconstructLegacyMemory = (text: string): OracleMemory => {
  const memory = createEmptyOracleMemory();
  memory.raw_summary = text.trim();

  const name = matchField(text, "name");
  const academicLevel = matchField(text, "academic level") || matchField(text, "level");
  const confidence = matchField(text, "confidence");
  const cognition = matchField(text, "level of cognition");
  const interests = matchField(text, "interests");

  if (name) memory.profile.name = name;
  if (academicLevel) memory.profile.academic_level = academicLevel;
  if (confidence) memory.profile.confidence_level = confidence;
  if (cognition) memory.profile.level_of_cognition = cognition;
  if (interests) {
    memory.profile.interests = interests.split(/,|\/|\|/).map((item) => item.trim()).filter(Boolean);
  }

  const topics = parseTopicMentions(text);
  if (topics.length > 0) {
    memory.topics = topics;
    memory.current_topic_tag = topics.at(-1)?.topic_tag ?? null;
  }

  const quizResults = Array.from(text.matchAll(/\[QUIZ RESULT\]\s*:\s*([^\n]+)/gi)).map((match) => match[1].trim());
  if (quizResults.length > 0) {
    const topic = memory.topics.at(-1) ?? {
      topic_tag: memory.current_topic_tag ?? "general",
      mistake_log: [],
      accuracy: null,
      confidence_level: "medium",
      quizzes_done: 0,
      mastery_checks_attempted: 0,
      mastered: false,
      quiz_results: [],
      recommended_question_style: "mixed" as const,
      needs_feynman: false,
      last_updated: new Date().toISOString(),
    };

    topic.quiz_results.push(...quizResults);
    topic.quizzes_done += quizResults.length;
    if (memory.topics.length === 0) {
      memory.topics.push(topic);
      memory.current_topic_tag = topic.topic_tag;
    } else {
      memory.topics[memory.topics.length - 1] = topic;
    }
  }

  return normalizeOracleMemoryObject(memory);
};

export const parseOracleMemory = (raw: string | OracleMemory | null | undefined): OracleMemory => {
  if (!raw) return createEmptyOracleMemory();
  if (typeof raw === "object") return normalizeOracleMemoryObject(raw);

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return normalizeOracleMemoryObject(parsed);
    }
  } catch {
    // Legacy plain text memory, migrate below.
  }

  return reconstructLegacyMemory(raw);
};

export const serializeOracleMemory = (raw: string | OracleMemory | null | undefined): string => {
  return JSON.stringify(parseOracleMemory(raw));
};

export const hasReadyOracleMemory = (raw: string | OracleMemory | null | undefined): boolean => {
  const memory = parseOracleMemory(raw);

  const hasProfileData = Boolean(
    memory.profile.name ||
    memory.profile.academic_level ||
    memory.profile.interests.length > 0 ||
    (memory.profile.level_of_cognition && memory.profile.level_of_cognition !== "unknown")
  );

  const hasTopicData = memory.topics.some(hasOracleTopicData);

  const hasUsefulSummary = memory.raw_summary.trim().length > 0;

  return hasProfileData || hasTopicData || hasUsefulSummary;
};

const extractTopicHintFromHistory = (history: ChatHistoryItem[]): string | null => {
  const recentUserMessage = [...history].reverse().find((item) => item.role === "user" && item.content.trim());
  if (!recentUserMessage) return null;

  const patterns = [
    /(?:about|on|regarding|studying|learning)\s+([A-Za-z0-9][A-Za-z0-9\s\-+/(),]{2,60})/i,
    /(?:topic|concept)\s*[:\-]\s*([A-Za-z0-9][A-Za-z0-9\s\-+/(),]{2,60})/i,
  ];

  for (const pattern of patterns) {
    const match = recentUserMessage.content.match(pattern)?.[1]?.trim();
    if (match) return match.replace(/[?.!,;:]+$/, "");
  }

  return null;
};

export const getCurrentTopicTag = (raw: string | OracleMemory | null | undefined, history: ChatHistoryItem[] = []): string | null => {
  const memory = parseOracleMemory(raw);
  if (memory.current_topic_tag) return memory.current_topic_tag;
  if (memory.topics.length > 0) return memory.topics[memory.topics.length - 1].topic_tag;
  return extractTopicHintFromHistory(history);
};

export const getVisibleOracleTopics = (
  raw: string | OracleMemory | null | undefined
): OracleTopicMemory[] => {
  return parseOracleMemory(raw).topics.filter(hasOracleTopicData);
};

export const getNewlyMasteredTopicTag = (
  previousRaw: string | OracleMemory | null | undefined,
  nextRaw: string | OracleMemory | null | undefined
): string | null => {
  const previous = parseOracleMemory(previousRaw);
  const next = parseOracleMemory(nextRaw);

  const previousByTag = new Map(
    previous.topics.map((topic) => [topic.topic_tag.toLowerCase(), topic])
  );

  const newlyMastered = next.topics.filter((topic) => {
    const previousTopic = previousByTag.get(topic.topic_tag.toLowerCase());
    return topic.mastered && !previousTopic?.mastered;
  });

  if (newlyMastered.length === 0) return null;

  const currentTopicTag = next.current_topic_tag?.toLowerCase();
  const currentTopicMatch = currentTopicTag
    ? newlyMastered.find((topic) => topic.topic_tag.toLowerCase() === currentTopicTag)
    : null;

  return (currentTopicMatch ?? newlyMastered[newlyMastered.length - 1]).topic_tag;
};

const ensureTopic = (memory: OracleMemory, topicTag: string): OracleTopicMemory => {
  const normalizedTag = topicTag.trim();
  let topic = memory.topics.find((item) => item.topic_tag.toLowerCase() === normalizedTag.toLowerCase());

  if (!topic) {
    topic = {
      topic_tag: normalizedTag,
      mistake_log: [],
      accuracy: null,
      confidence_level: memory.profile.confidence_level || "medium",
      quizzes_done: 0,
      mastery_checks_attempted: 0,
      mastered: false,
      quiz_results: [],
      recommended_question_style: "mixed",
      needs_feynman: false,
      last_updated: new Date().toISOString(),
    };
    memory.topics.push(topic);
  }

  memory.current_topic_tag = topic.topic_tag;
  topic.last_updated = new Date().toISOString();
  return topic;
};

export const mergeOracleMemoryUpdate = (
  existingRaw: string | null | undefined,
  incomingRaw: unknown,
  history: ChatHistoryItem[] = []
): string => {
  const existing = parseOracleMemory(existingRaw);
  const incoming =
    typeof incomingRaw === "string" || (incomingRaw && typeof incomingRaw === "object")
      ? parseOracleMemory(incomingRaw as string | OracleMemory)
      : createEmptyOracleMemory();

  const merged = normalizeOracleMemoryObject({
    ...existing,
    ...incoming,
    profile: {
      ...existing.profile,
      ...incoming.profile,
      interests: incoming.profile.interests.length > 0 ? incoming.profile.interests : existing.profile.interests,
    },
    topics: [...existing.topics, ...incoming.topics],
    strengths: Array.from(new Set([...existing.strengths, ...incoming.strengths])),
    weaknesses: Array.from(new Set([...existing.weaknesses, ...incoming.weaknesses])),
    raw_summary: [existing.raw_summary, incoming.raw_summary].filter(Boolean).join("\n").trim(),
  });

  const topicHint = incoming.current_topic_tag || extractTopicHintFromHistory(history);
  if (topicHint) {
    ensureTopic(merged, topicHint);
  }

  return JSON.stringify(merged);
};

export const markTopicMasteredInMemory = (
  raw: string | null | undefined,
  history: ChatHistoryItem[] = []
): string => {
  const memory = parseOracleMemory(raw);
  const topicTag = getCurrentTopicTag(memory, history) || "current topic";
  const topic = ensureTopic(memory, topicTag);
  topic.mastered = true;
  topic.needs_feynman = false;
  return JSON.stringify(memory);
};

const inferAccuracyFromSummary = (summary: string): number | null => {
  const scoreMatch = summary.match(/(\d+)\s*\/\s*(\d+)/);
  if (!scoreMatch) return null;
  const score = Number(scoreMatch[1]);
  const total = Number(scoreMatch[2]);
  if (!total) return null;
  return clampAccuracy((score / total) * 100);
};

export const recordQuizResultInMemory = (
  raw: string | null | undefined,
  summary: string,
  explicitTopicTag?: string | null,
  history: ChatHistoryItem[] = []
): string => {
  const memory = parseOracleMemory(raw);
  const topicTag = explicitTopicTag?.trim() || getCurrentTopicTag(memory, history) || "general";
  const topic = ensureTopic(memory, topicTag);

  topic.quiz_results = Array.from(new Set([...topic.quiz_results, summary]));
  topic.quizzes_done += 1;
  topic.accuracy = inferAccuracyFromSummary(summary) ?? topic.accuracy;
  topic.recommended_question_style =
    topic.accuracy !== null && topic.accuracy < 60
      ? "cognitive"
      : topic.accuracy !== null && topic.accuracy >= 80
        ? "practical"
        : "mixed";
  topic.needs_feynman = topic.accuracy !== null ? topic.accuracy < 75 : true;

  return JSON.stringify(memory);
};

export const deleteTopicFromOracleMemory = (
  raw: string | OracleMemory | null | undefined,
  topicTag: string
): string => {
  const normalizedTag = topicTag.trim().toLowerCase();
  const memory = parseOracleMemory(raw);

  if (!normalizedTag) {
    return JSON.stringify(memory);
  }

  const nextTopics = memory.topics.filter((topic) => topic.topic_tag.toLowerCase() !== normalizedTag);
  const visibleRemainingTopics = nextTopics.filter(hasOracleTopicData);

  memory.topics = nextTopics;

  const currentTopicStillExists = findTopicByTag(nextTopics, memory.current_topic_tag);
  if (!currentTopicStillExists) {
    memory.current_topic_tag =
      visibleRemainingTopics[visibleRemainingTopics.length - 1]?.topic_tag ??
      nextTopics[nextTopics.length - 1]?.topic_tag ??
      null;
  }

  return JSON.stringify(memory);
};

export const formatOracleMemoryForPrompt = (
  raw: string | null | undefined,
  topicTag?: string | null
): string => {
  const memory = parseOracleMemory(raw);
  const selectedTopic = findTopicByTag(memory.topics, topicTag);
  if (selectedTopic) {
    memory.current_topic_tag = selectedTopic.topic_tag;
  }
  return JSON.stringify(memory);
};

export const formatOracleMemoryForQuizConfig = (
  raw: string | null | undefined,
  topicTag?: string | null
): string => {
  const memory = parseOracleMemory(raw);
  const visibleTopics = memory.topics.filter(hasOracleTopicData);
  const currentTopic =
    findTopicByTag(visibleTopics, topicTag) ??
    findTopicByTag(visibleTopics, memory.current_topic_tag) ??
    visibleTopics[visibleTopics.length - 1] ??
    findTopicByTag(memory.topics, topicTag) ??
    findTopicByTag(memory.topics, memory.current_topic_tag) ??
    memory.topics[memory.topics.length - 1] ??
    null;

  return JSON.stringify({
    profile: {
      academic_level: memory.profile.academic_level,
      confidence_level: memory.profile.confidence_level,
      level_of_cognition: memory.profile.level_of_cognition,
    },
    current_topic_tag: currentTopic?.topic_tag ?? memory.current_topic_tag,
    current_topic: currentTopic
      ? {
          topic_tag: currentTopic.topic_tag,
          accuracy: currentTopic.accuracy,
          quizzes_done: currentTopic.quizzes_done,
          mastered: currentTopic.mastered,
          recommended_question_style: currentTopic.recommended_question_style ?? "mixed",
          needs_feynman: Boolean(currentTopic.needs_feynman),
          recent_mistakes: currentTopic.mistake_log.slice(-3),
        }
      : null,
  });
};
