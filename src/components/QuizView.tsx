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

import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, Settings, Play, RotateCcw, MessageSquarePlus, MessageSquare, LoaderCircle } from 'lucide-react';
import type { ChatHistoryItem, QuizConfig, QuizQuestion, QuizResult, UserMessageUiMeta } from '../types';
import { generateQuizQuestions, validateOpenAnswer, estimateQuizConfig } from '../services/geminiService';
import { formatTopicTagForDisplay, getCurrentTopicTag, getVisibleOracleTopics } from '../services/oracleMemory';
import { AppLanguage, LANGUAGE_DATA } from '../lang/Language';
import { MarkdownContent } from './MarkdownContent';

interface ExplainRequestPayload {
  prompt: string;
  uiMeta: UserMessageUiMeta;
}

interface QuizViewProps {
  language: AppLanguage;
  history: ChatHistoryItem[];
  memory: string | null;
  encryptedApiKey: any;
  onBack: () => void;
  onExplainRequest: (payload: ExplainRequestPayload) => void;
  onAddToMemory: (summary: string, topicTag: string | null) => void;
  forcedTopicSelection?: { id: number; topicTag: string | null } | null;
  onForcedTopicSelectionApplied?: (id: number) => void;
}

type QuizState = 'config' | 'loading' | 'active' | 'review';
type TopicConfigCacheEntry = {
  config: QuizConfig;
  contextKey: string;
};

const DEFAULT_QUIZ_CONFIG: QuizConfig = {
  level: 'Intermediate',
  count: 5,
  mcqRatio: 0.5,
};

const normalizeTopicConfigKey = (topicTag: string | null | undefined) =>
  typeof topicTag === 'string' ? topicTag.trim().toLowerCase() : '';

const areQuizConfigsEqual = (left: QuizConfig, right: QuizConfig) =>
  left.level === right.level &&
  left.count === right.count &&
  left.mcqRatio === right.mcqRatio;

const buildQuestionPreview = (question: string, maxLength = 96) => {
  const normalized = question.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength).trimEnd()}...`;
};

export const QuizView: React.FC<QuizViewProps> = ({ 
  language, history, memory, encryptedApiKey, onBack, onExplainRequest, onAddToMemory, forcedTopicSelection, onForcedTopicSelectionApplied
}) => {
  const difficultyLevels: QuizConfig["level"][] = ["Fundamental", "Intermediate", "Advanced"];
  const availableTopics = getVisibleOracleTopics(memory);
  const rawCurrentTopicTag = getCurrentTopicTag(memory, history);
  const defaultTopicTag =
    availableTopics.find((topic) => topic.topic_tag.toLowerCase() === rawCurrentTopicTag?.toLowerCase())?.topic_tag ??
    availableTopics[availableTopics.length - 1]?.topic_tag ??
    null;

  // --- State ---
  const [viewState, setViewState] = useState<QuizState>('config');
  const [config, setConfig] = useState<QuizConfig>({ level: 'Intermediate', count: 5, mcqRatio: 0.5 });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, QuizResult>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [quizTopicTag, setQuizTopicTag] = useState<string | null>(null);
  const [selectedTopicTag, setSelectedTopicTag] = useState<string | null>(null);
  const [hasUserSelectedTopic, setHasUserSelectedTopic] = useState(false);
  const [topicConfigCache, setTopicConfigCache] = useState<Record<string, TopicConfigCacheEntry>>({});
  const [updatingConfigTopicTag, setUpdatingConfigTopicTag] = useState<string | null>(null);

  const [isHydrated, setIsHydrated] = useState(false);
  const selectedTopicRef = useRef<string | null>(null);
  const pendingEstimateKeyRef = useRef<string | null>(null);
  const syncedTopicContextKeysRef = useRef<Record<string, string>>({});

  const LD = LANGUAGE_DATA[language];
  const quizContextKey = JSON.stringify({
    history,
    memory: memory ?? null,
  });
  const activeConfigTopicTag = selectedTopicTag ?? defaultTopicTag;
  const currentChatTopicKey = normalizeTopicConfigKey(rawCurrentTopicTag);
  const activeConfigTopicKey = normalizeTopicConfigKey(activeConfigTopicTag);
  const isUpdatingSelectedTopicConfig =
    normalizeTopicConfigKey(updatingConfigTopicTag) !== '' &&
    normalizeTopicConfigKey(updatingConfigTopicTag) === activeConfigTopicKey;

  // --- Session Storage Caching ---
  useEffect(() => {
    const cached = sessionStorage.getItem('academic-oracle-quiz-state');
    if (cached) {
      const parsed = JSON.parse(cached);
      setQuestions(parsed.questions);
      setResults(parsed.results ?? {});
      setConfig(parsed.config);
      setCurrentQIndex(parsed.currentQIndex);
      setViewState(parsed.viewState);
      setUserAnswers(parsed.userAnswers ?? {});
      setQuizTopicTag(typeof parsed.quizTopicTag === "string" ? parsed.quizTopicTag : null);
      setSelectedTopicTag(typeof parsed.selectedTopicTag === "string" ? parsed.selectedTopicTag : null);
      setHasUserSelectedTopic(Boolean(parsed.hasUserSelectedTopic));
      setTopicConfigCache(
        parsed.topicConfigCache && typeof parsed.topicConfigCache === "object"
          ? parsed.topicConfigCache
          : {}
      );
      if (parsed.topicConfigCache && typeof parsed.topicConfigCache === "object") {
        const nextSyncedKeys: Record<string, string> = {};
        for (const [topicKey, entry] of Object.entries(parsed.topicConfigCache)) {
          if (
            entry &&
            typeof entry === "object" &&
            typeof (entry as TopicConfigCacheEntry).contextKey === "string"
          ) {
            nextSyncedKeys[topicKey] = (entry as TopicConfigCacheEntry).contextKey;
          }
        }
        syncedTopicContextKeysRef.current = nextSyncedKeys;
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    selectedTopicRef.current = activeConfigTopicTag;
  }, [activeConfigTopicTag]);

  useEffect(() => {
    if (!isHydrated) return;
    sessionStorage.setItem('academic-oracle-quiz-state', JSON.stringify({
      questions,
      results,
      config,
      currentQIndex,
      viewState,
      userAnswers,
      quizTopicTag,
      selectedTopicTag,
      hasUserSelectedTopic,
      topicConfigCache,
    }));
  }, [questions, results, config, currentQIndex, viewState, userAnswers, quizTopicTag, selectedTopicTag, hasUserSelectedTopic, topicConfigCache]);

  useEffect(() => {
    if (!isHydrated) return;

    const selectedTopicStillExists = availableTopics.some(
      (topic) => topic.topic_tag.toLowerCase() === selectedTopicTag?.toLowerCase()
    );

    if (hasUserSelectedTopic && selectedTopicStillExists) {
      return;
    }

    const nextTopicTag = selectedTopicStillExists ? selectedTopicTag : defaultTopicTag;

    if (selectedTopicTag !== nextTopicTag) {
      setSelectedTopicTag(nextTopicTag);
    }

    if (hasUserSelectedTopic && !selectedTopicStillExists) {
      setHasUserSelectedTopic(false);
    }
  }, [availableTopics, defaultTopicTag, hasUserSelectedTopic, isHydrated, selectedTopicTag]);

  useEffect(() => {
    if (!isHydrated || !forcedTopicSelection) return;

    const requestedTopicTag =
      availableTopics.find((topic) => topic.topic_tag.toLowerCase() === forcedTopicSelection.topicTag?.toLowerCase())?.topic_tag ??
      defaultTopicTag ??
      null;

    setSelectedTopicTag(requestedTopicTag);
    setHasUserSelectedTopic(Boolean(requestedTopicTag));
    setViewState('config');
    setQuestions([]);
    setResults({});
    setCurrentQIndex(0);
    setUserAnswers({});
    setQuizTopicTag(null);

    onForcedTopicSelectionApplied?.(forcedTopicSelection.id);
  }, [availableTopics, defaultTopicTag, forcedTopicSelection, isHydrated, onForcedTopicSelectionApplied]);

  const getTopicConfigCacheEntry = (topicTag: string | null | undefined) => {
    const topicKey = normalizeTopicConfigKey(topicTag);
    return topicKey ? topicConfigCache[topicKey] ?? null : null;
  };

  const cacheTopicConfig = (topicTag: string | null, nextConfig: QuizConfig, contextKey = quizContextKey) => {
    const topicKey = normalizeTopicConfigKey(topicTag);
    if (!topicKey) return;

    setTopicConfigCache((prev) => {
      const currentEntry = prev[topicKey];
      if (
        currentEntry &&
        currentEntry.contextKey === contextKey &&
        areQuizConfigsEqual(currentEntry.config, nextConfig)
      ) {
        return prev;
      }

      return {
        ...prev,
        [topicKey]: {
          config: nextConfig,
          contextKey,
        },
      };
    });
  };

  const applyManualConfig = (nextConfig: QuizConfig) => {
    setConfig(nextConfig);
    cacheTopicConfig(activeConfigTopicTag, nextConfig);
  };

  useEffect(() => {
    if (!isHydrated || viewState !== 'config') return;

    const topicTag = activeConfigTopicTag;
    if (!topicTag) {
      if (!areQuizConfigsEqual(config, DEFAULT_QUIZ_CONFIG)) {
        setConfig(DEFAULT_QUIZ_CONFIG);
      }
      return;
    }

    const cachedEntry = getTopicConfigCacheEntry(topicTag);

    if (cachedEntry && !areQuizConfigsEqual(config, cachedEntry.config)) {
      setConfig(cachedEntry.config);
    }

    if (!cachedEntry && !areQuizConfigsEqual(config, DEFAULT_QUIZ_CONFIG)) {
      setConfig(DEFAULT_QUIZ_CONFIG);
    }

    const shouldAutoRefreshFromChat = activeConfigTopicKey !== '' && activeConfigTopicKey === currentChatTopicKey;
    const topicKey = normalizeTopicConfigKey(topicTag);
    const alreadySyncedContextKey = syncedTopicContextKeysRef.current[topicKey];

    if (cachedEntry?.contextKey === quizContextKey) {
      syncedTopicContextKeysRef.current[topicKey] = quizContextKey;
      return;
    }

    if (!shouldAutoRefreshFromChat || history.length <= 2 || alreadySyncedContextKey === quizContextKey) {
      return;
    }

    const pendingEstimateKey = `${topicKey}:${quizContextKey}`;

    if (pendingEstimateKeyRef.current === pendingEstimateKey) {
      return;
    }

    pendingEstimateKeyRef.current = pendingEstimateKey;
    let isCancelled = false;

    const runEstimate = async () => {
      try {
        setUpdatingConfigTopicTag(topicTag);
        const estimated = await estimateQuizConfig(history, memory, encryptedApiKey, topicTag);
        if (isCancelled) return;

        cacheTopicConfig(topicTag, estimated, quizContextKey);
        syncedTopicContextKeysRef.current[topicKey] = quizContextKey;

        if (normalizeTopicConfigKey(selectedTopicRef.current) === topicKey) {
          setConfig((prev) => areQuizConfigsEqual(prev, estimated) ? prev : estimated);
        }
      } catch (e) {
        console.error("Auto-config failed", e);
      } finally {
        setUpdatingConfigTopicTag((current) =>
          normalizeTopicConfigKey(current) === topicKey ? null : current
        );
        if (pendingEstimateKeyRef.current === pendingEstimateKey) {
          pendingEstimateKeyRef.current = null;
        }
      }
    };

    void runEstimate();

    return () => {
      isCancelled = true;
    };
  }, [activeConfigTopicTag, config, encryptedApiKey, history, isHydrated, memory, quizContextKey, topicConfigCache, viewState]);

  // --- Handlers ---
  const handleStartQuiz = async () => {
    if (history.length < 2 || !memory) {
      alert(LD.ui.chatTooShortForQuiz);
      return;
    }
    if (!selectedTopicTag) {
      alert(LD.ui.chooseTopicRequired);
      return;
    }
    setViewState('loading');
    try {
      const lockedTopicTag = selectedTopicTag;
      const q = await generateQuizQuestions(language, config, history, memory, encryptedApiKey, lockedTopicTag);
      setQuestions(q);
      setResults({});
      setCurrentQIndex(0);
      setQuizTopicTag(lockedTopicTag);
      setViewState('active');
    } catch (e) {
      alert(LD.ui.failedToGenerateQuiz);
      setViewState('config');
    }
  };

  const handleSubmitAnswer = async (answer: string) => {
    const currentQ = questions[currentQIndex];
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
    setIsValidating(true);

    let result: QuizResult;

    if (currentQ.type === 'mcq') {
      const isCorrect = answer === currentQ.correctAnswer;
      result = {
        questionId: currentQ.id,
        userAnswer: answer,
        isCorrect,
        feedback: isCorrect
          ? LD.ui.correctExclaim
          : LD.ui.mcqIncorrect
              .replace('{answer}', currentQ.correctAnswer || '')
              .replace('{explanation}', currentQ.explanation || '')
      };
    } else {
      try {
        // AI Validation for Open Ended
        const validation = await validateOpenAnswer(
          language,
          currentQ.question, 
          answer, 
          currentQ.correctAnswer || currentQ.explanation || "", 
          encryptedApiKey
        );
        result = { ...validation, questionId: currentQ.id };
      } catch (e) {
        result = {
          questionId: currentQ.id,
          userAnswer: answer,
          isCorrect: null,
          isModelFailure: true,
          feedback: LD.ui.genericError
        };
      }
    }

    setResults(prev => ({ ...prev, [currentQ.id]: result }));
    setIsValidating(false);
  };

  const handleRetryOpenAnswer = (question: QuizQuestion, result: QuizResult) => {
    if (isValidating) return;

    setResults((prev) => {
      const next = { ...prev };
      delete next[question.id];
      return next;
    });

    void handleSubmitAnswer(result.userAnswer ?? userAnswers[question.id] ?? '');
  };

  const handleNext = () => {
    if (isValidating) return; // Prevent navigation during validation

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setViewState('review');
    }
  };

  const handleExplainInChat = (q: QuizQuestion, r: QuizResult) => {
    const resultText = r.isModelFailure
      ? LD.ui.modelGradingUnavailable
      : r.isCorrect
        ? LD.ui.correctLabel
        : LD.ui.notQuite;
    const prompt = LD.ui.explainContext
      .replace('{question}', q.question)
      .replace('{answer}', r.userAnswer ?? '')
      .replace('{result}', resultText)
      .replace('{feedback}', r.feedback ?? '');

    const questionLabel = LD.ui.questionOf
      .replace('{current}', String(currentQIndex + 1))
      .replace('{total}', String(questions.length));
    const topicLabel = formatTopicTagForDisplay(quizTopicTag ?? selectedTopicTag ?? "");
    const chipLabel = topicLabel ? `${questionLabel} • ${topicLabel}` : questionLabel;

    onExplainRequest({
      prompt,
      uiMeta: {
        displayContent: LD.ui.askExplain,
        selectionContext: {
          actionLabel: chipLabel,
          selectionText: buildQuestionPreview(q.question),
        },
      },
    });
  };

  const handleFinish = () => {
    const score = (Object.values(results) as QuizResult[])
        .filter(r => r.isCorrect === true)
        .length;
    const summary = LD.ui.quizSummary
      .replace('{score}', String(score))
      .replace('{total}', String(questions.length))
      .replace('{level}', String(config.level));
    onAddToMemory(summary, quizTopicTag);
  };

  // --- Renders ---

  if (viewState === 'config') {
    return (
      <div className="flex h-full flex-col items-center overflow-y-auto p-4 pt-4 sm:p-6 md:justify-center animate-in fade-in zoom-in duration-300">
        <div className="mb-4 flex w-full max-w-md md:hidden">
          <button
            onClick={onBack}
            className="z-30 flex items-center gap-2 rounded-full border border-black/5 bg-white/75 px-3 py-1.5 text-sm text-slate-600 shadow-sm backdrop-blur-md transition-all hover:text-indigo-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-indigo-400"
          >
            ← <MessageSquare className="w-4 h-4" />
            {LD.ui.chat}
          </button>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-indigo-100 bg-white p-5 shadow-xl dark:border-indigo-900/30 dark:bg-slate-900 sm:p-8 bg-gradient-to-br from-white via-indigo-50/20 to-white dark:from-slate-900 dark:via-indigo-950/10 dark:to-slate-900">
          <div className="flex items-center gap-3 mb-6 text-indigo-600 dark:text-indigo-400">
            <Settings className="w-6 h-6" />
            <h2 className="text-xl font-bold sm:text-2xl">{LD.ui.quizConfigTitle}</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="quiz-topic-select" className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                {LD.ui.chooseTopic}
              </label>
              <select
                id="quiz-topic-select"
                value={selectedTopicTag ?? ''}
                onChange={(e) => {
                  const nextTopicTag = e.target.value || null;
                  setSelectedTopicTag(nextTopicTag);
                  setHasUserSelectedTopic(Boolean(nextTopicTag));
                }}
                disabled={availableTopics.length === 0}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:disabled:bg-slate-900 dark:disabled:text-slate-500"
              >
                <option value="">{LD.ui.chooseTopicPlaceholder}</option>
                {availableTopics.map((topic) => (
                  <option key={topic.topic_tag} value={topic.topic_tag}>
                    {formatTopicTagForDisplay(topic.topic_tag)}
                  </option>
                ))}
              </select>
              {availableTopics.length === 0 && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {LD.ui.noQuizTopicsAvailable}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">{LD.ui.difficultyLevel}</label>
              <div className="grid grid-cols-3 gap-2">
                {difficultyLevels.map((level, index) => (
                  <button
                    key={level}
                    onClick={() => applyManualConfig({ ...config, level })}
                    className={`py-2 px-3 rounded-lg text-sm transition-all ${
                      config.level === level
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {LD.ui.difficultyOptions[index] ?? level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">{LD.ui.numberOfQuestions.replace('{count}', String(config.count))}</label>
              <input 
                type="range" min="1" max="10" 
                value={config.count} 
                onChange={(e) => applyManualConfig({ ...config, count: parseInt(e.target.value) })}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                {LD.ui.mixLabel.replace('{mcq}', String(Math.round(config.mcqRatio * 100))).replace('{open}', String(100 - Math.round(config.mcqRatio * 100)))}
              </label>
              <input 
                type="range" min="0" max="1" step="0.1"
                value={config.mcqRatio} 
                onChange={(e) => applyManualConfig({ ...config, mcqRatio: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button 
              onClick={handleStartQuiz}
              disabled={!selectedTopicTag || isUpdatingSelectedTopicConfig}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              {isUpdatingSelectedTopicConfig ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin" /> {LD.ui.updatingQuizConfig}
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" /> {LD.ui.startAssessment}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'loading') {
    return (
      <div className="flex h-full flex-col items-center justify-center px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-500 animate-pulse">{LD.ui.generatingAssessment}</p>
      </div>
    );
  }

  if (viewState === 'active') {
    const currentQ = questions[currentQIndex];
    const currentResult = results[currentQ.id];
    const isAnswered = !!currentResult;
    const isModelFailure = currentResult?.isModelFailure === true;

    return (
      <div className="relative h-full">
        <button
          onClick={onBack}
          className="sticky left-0 top-4 z-30 ml-4 inline-flex items-center gap-2 px-3 py-1.5 sm:ml-6 md:hidden
                    rounded-full
                    bg-white/85 dark:bg-slate-900/80
                    backdrop-blur-md
                    text-sm text-slate-600 dark:text-slate-300
                   hover:text-indigo-400 dark:hover:text-indigo-400
                    transition-all shadow-sm border border-black/5 dark:border-white/10"
        >
          ← <MessageSquare className="w-4 h-4" />
          {LD.ui.chat}
        </button>
        <div className="relative mx-auto flex h-full max-w-3xl flex-col overflow-y-auto px-4 pb-6 pt-6 sm:px-6 sm:pb-8">
          <div className="flex-1">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">{LD.ui.questionOf.replace('{current}', String(currentQIndex + 1)).replace('{total}', String(questions.length))}</span>
              <span className="w-fit px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium uppercase">{currentQ.type}</span>
            </div>

            <h3 className="mb-6 text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-100 sm:mb-8 sm:text-xl md:text-2xl">
              <MarkdownContent content={currentQ.question} />
            </h3>

            <div className="space-y-4">
              {currentQ.type === 'mcq' && currentQ.options?.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSubmitAnswer(opt)}
                  className={`w-full text-slate-900 dark:text-white text-left p-4 rounded-xl border-2 transition-all ${
                    isAnswered 
                      ? opt === currentQ.correctAnswer 
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                        : opt === currentResult.userAnswer 
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' 
                          : 'border-transparent bg-slate-100 dark:bg-slate-800 opacity-50'
                      : 'border-transparent bg-white dark:bg-slate-800 shadow-sm hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <MarkdownContent content={opt} ismcq={true} />
                </button>
              ))}

              {currentQ.type === 'open' && (
                <div className="space-y-4">
                  <textarea
                    disabled={isAnswered}
                    value={userAnswers[currentQ.id] || ''}
                    onChange={(e) =>
                      setUserAnswers(prev => ({
                        ...prev,
                        [currentQ.id]: e.target.value
                      }))
                    }
                    className="h-32 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    placeholder={LD.ui.answerPlaceholder}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmitAnswer(userAnswers[currentQ.id] || '');
                      }
                    }}
                  />
                  {!isAnswered && <p className="text-xs text-slate-400">{LD.ui.pressEnter}</p>}
                </div>
              )}
            </div>

            {/* Feedback Section */}
            {isValidating && <div className="mt-6 text-indigo-600 animate-pulse">{LD.ui.aiGrading}</div>}
            
            {isAnswered && !isValidating && (
              <div className={`mt-8 rounded-2xl p-5 sm:p-6 animate-in slide-in-from-bottom-4 ${
                isModelFailure
                  ? 'bg-amber-50 dark:bg-amber-950/30'
                  : currentResult.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/30'
                    : 'bg-rose-50 dark:bg-rose-950/30'
              }`}>
                <div className="flex items-start gap-3">
                  {isModelFailure
                    ? <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                    : currentResult.isCorrect 
                    ? <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    : <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                  }
                  <div className="flex-1">
                    <p className={`font-semibold mb-2 ${
                      isModelFailure
                        ? 'text-amber-700 dark:text-amber-400'
                        : currentResult.isCorrect
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-rose-700 dark:text-rose-400'
                    }`}>
                      {isModelFailure
                        ? LD.ui.modelGradingUnavailable
                        : currentResult.isCorrect
                          ? LD.ui.correctExclaim
                          : LD.ui.notQuite}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed"><MarkdownContent content={currentResult.feedback} /></p>
                    
                    {isModelFailure && (
                      <button
                        onClick={() => handleRetryOpenAnswer(currentQ, currentResult)}
                        className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
                      >
                        <RotateCcw className="w-4 h-4" /> {LD.ui.retryButton}
                      </button>
                    )}

                    {currentResult.isCorrect === false && (
                      <button 
                        onClick={() => handleExplainInChat(currentQ, currentResult)}
                        className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <MessageSquarePlus className="w-4 h-4" /> {LD.ui.askExplain}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {isAnswered && !isValidating && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleNext}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 dark:bg-white dark:text-slate-900 sm:w-auto"
              >
                {currentQIndex === questions.length - 1 ? LD.ui.seeResults : LD.ui.nextQuestion} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Review View
  return (
    <div className="relative flex h-full flex-col items-center justify-center p-4 pt-24 sm:p-6 sm:pt-24 animate-in fade-in">
      <button
        onClick={onBack}
        className="absolute left-4 top-4 z-30 flex items-center gap-2 px-3 py-1.5 sm:left-6 sm:top-6 md:hidden
                  rounded-full
                  bg-white/75 dark:bg-slate-900/70
                  backdrop-blur-md
                  text-sm text-slate-600 dark:text-slate-300
                  hover:text-indigo-400 dark:hover:text-indigo-400
                  transition-all shadow-sm border border-black/5 dark:border-white/10"
      >
        ← <MessageSquare className="w-4 h-4" />
        Chat
      </button>
      <div className="w-full max-w-2xl rounded-3xl border border-indigo-100 bg-white p-5 text-center shadow-2xl dark:border-indigo-900/30 dark:bg-slate-900 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">{LD.ui.assessmentComplete}</h2>
        
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
                <div className="text-4xl font-bold text-emerald-600 mb-1">
                    {(Object.values(results) as QuizResult[])
                        .filter(r => r.isCorrect === true)
                        .length}
                </div>
                <div className="text-sm text-emerald-700 dark:text-emerald-400">{LD.ui.correctLabel}</div>
            </div>
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl">
                <div className="text-4xl font-bold text-rose-600 mb-1">
                    {(Object.values(results) as QuizResult[])
                        .filter(r => r.isCorrect === false)
                        .length}
                </div>
                <div className="text-sm text-rose-700 dark:text-rose-400">{LD.ui.needsReview}</div>
            </div>
        </div>

        <div className="flex flex-col gap-3">
            <button 
                onClick={()=> {
                  setViewState('config');
                  handleFinish();
                }}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium"
            >
                {LD.ui.addToMemory}
            </button>
            <button 
                onClick={() => {
                    setViewState('config');
                    setResults({});
                    setUserAnswers({});
                    setQuizTopicTag(null);
                    setQuestions([]);
                    setCurrentQIndex(0);
                }}
                className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 font-medium flex items-center justify-center gap-2"
            >
                <RotateCcw className="w-4 h-4"/> {LD.ui.takeAnother}
            </button>
        </div>
      </div>
    </div>
  );
};
