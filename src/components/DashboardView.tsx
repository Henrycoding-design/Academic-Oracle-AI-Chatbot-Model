/*
 * Copyright (c) 2026 Vo Tan Binh / Universal Academic Oracle
 * All Rights Reserved.
 *
 * This file is NOT licensed under Apache License 2.0.
 * No permission is granted to copy, redistribute, modify, reuse,
 * republish, or sublicense this file outside the official upstream
 * Universal Academic Oracle repository without prior written permission.
 *
 * See LICENSE_SCOPE.md and TRADEMARK_POLICY.md for additional terms.
 */

import React, { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileDown,
  GraduationCap,
  MessageSquare,
  LoaderCircle,
  Trophy,
} from "lucide-react";
import type { ChatHistoryItem } from "../types";
import { parseOracleMemory } from "../services/oracleMemory";
import { AppLanguage, LANGUAGE_DATA } from '../lang/Language';

interface DashboardViewProps {
  language: AppLanguage;
  memory: string | null;
  history: ChatHistoryItem[];
  isGeneratingSummary: boolean;
  onDownloadSummary: () => void;
  onBack: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  language,
  memory,
  history,
  isGeneratingSummary,
  onDownloadSummary,
  onBack,
}) => {
  const LD = LANGUAGE_DATA[language];
  const DD = LD.ui.dashboard;
  const loadingMessages = DD.loadingMessages;
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const parsed = parseOracleMemory(memory);
  const topics = parsed.topics;
  const currentTopic =
    topics.find((topic) => topic.topic_tag === parsed.current_topic_tag) ??
    topics[topics.length - 1] ??
    null;

  const trackedAccuracies = topics
    .map((topic) => topic.accuracy)
    .filter((accuracy): accuracy is number => typeof accuracy === "number");

  const learningEfficiency = trackedAccuracies.length > 0
    ? Math.round(trackedAccuracies.reduce((sum, accuracy) => sum + accuracy, 0) / trackedAccuracies.length)
    : topics.length > 0
      ? Math.round((topics.filter((topic) => topic.mastered).length / topics.length) * 100)
      : 0;

  const totalQuizzes = topics.reduce((sum, topic) => sum + topic.quizzes_done, 0);
  const completedTopics = topics.filter((topic) => topic.mastered).length;
  const progressStroke = 2 * Math.PI * 52;
  const progressOffset = progressStroke - (progressStroke * learningEfficiency) / 100;
  const currentSummary = parsed.raw_summary
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .at(-1) || DD.currentSummaryFallback;

  const getRecommendedFocus = (topic: typeof topics[number]) => {
    if (topic.mastered) return DD.recommendedFocusMastered;
    if (topic.needs_feynman) return DD.recommendedFocusNeedsFeynman;
    if ((topic.accuracy ?? 0) < 70) return DD.recommendedFocusLowAccuracy;
    return DD.recommendedFocusDefault;
  };

  const getTopicNotes = (topic: typeof topics[number]) => {
    const notes = [
      `${DD.confidenceLevel}: ${topic.confidence_level || "medium"}`,
      `${DD.masteryStatus}: ${topic.mastered ? DD.masteryStatusMastered : DD.masteryStatusInProgress}`,
    ];

    if (typeof topic.accuracy === "number") {
      notes.push(`${DD.currentAccuracy}: ${topic.accuracy}%`);
    }

    if (topic.recommended_question_style) {
      notes.push(`${DD.bestPracticeMode}: ${topic.recommended_question_style}`);
    }

    return notes;
  };

  useEffect(() => {
    if (!isGeneratingSummary) {
      setLoadingMessageIndex(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [isGeneratingSummary]);

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 left-8 h-40 w-40 rounded-full bg-indigo-200/20 blur-3xl animate-pulse dark:bg-indigo-500/10" />
        <div className="absolute right-10 top-28 h-32 w-32 rounded-full bg-emerald-200/20 blur-3xl animate-pulse dark:bg-emerald-500/10" style={{ animationDelay: "1.2s" }} />
        <div className="absolute bottom-12 left-1/3 h-28 w-28 rounded-full bg-amber-200/15 blur-3xl animate-pulse dark:bg-amber-500/10" style={{ animationDelay: "2.2s" }} />
      </div>

      <div className="sticky top-4 z-50 mb-4 w-fit">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-1.5 
                    rounded-full bg-white/70 dark:bg-slate-800/60 
                    backdrop-blur-md border border-black/5 dark:border-white/10
                    text-sm text-slate-600 dark:text-slate-300 
                    hover:text-indigo-600 hover:dark:text-indigo-400 transition-all shadow-[0_8px_30px_-18px_rgba(15,23,42,0.45)]"
        >
          <span className="text-lg">←</span>
          <MessageSquare className="w-4 h-4" />
          <span>{LD.ui.chat}</span>
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <section className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-md p-6 shadow-[0_24px_60px_-28px_rgba(15,23,42,0.28)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_34%),radial-gradient(circle_at_left,rgba(16,185,129,0.06),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.10),transparent_34%),radial-gradient(circle_at_left,rgba(52,211,153,0.08),transparent_28%)]" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                {DD.title}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {DD.subtitle}
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {DD.description}
              </p>
            </div>

            <button
              onClick={onDownloadSummary}
              disabled={isGeneratingSummary}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-700 hover:shadow-[0_16px_40px_-20px_rgba(79,70,229,0.75)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGeneratingSummary ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>{loadingMessages[loadingMessageIndex]}</span>
                </>
              ) : (
                <>
                  <FileDown className="h-4 w-4" />
                  <span>{DD.downloadSummary}</span>
                </>
              )}
            </button>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-slate-900 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] ring-1 ring-white/40 dark:ring-white/5">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <GraduationCap className="h-4 w-4 text-indigo-500" />
              {DD.userData}
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 shadow-inner shadow-white/60 dark:shadow-none">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.name}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {parsed.profile.name || DD.defaultStudentName}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 shadow-inner shadow-white/60 dark:shadow-none">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.academicLevel}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {parsed.profile.academic_level || DD.academicLevelFallback}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 shadow-inner shadow-white/60 dark:shadow-none">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.currentTopic}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {currentTopic?.topic_tag || DD.currentTopicFallback}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 shadow-inner shadow-white/60 dark:shadow-none">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.learningLevel}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {parsed.profile.level_of_cognition !== "unknown" ? parsed.profile.level_of_cognition : DD.learningLevelFallback}
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] ring-1 ring-white/40 dark:ring-white/5">
            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-200/20 blur-2xl dark:bg-emerald-500/10" />
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 text-emerald-500" />
              {DD.learningEfficiency}
            </p>
            <div className="mt-4 flex flex-col items-center justify-center gap-4">
              <div className="relative h-36 w-36">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-200 dark:text-slate-700" />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={progressStroke}
                    strokeDashoffset={progressOffset}
                    className="text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.25)] transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{learningEfficiency}%</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{DD.efficiencyShort}</span>
                </div>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 text-center shadow-inner shadow-white/60 dark:shadow-none">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{topics.length}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.topicsLearned}</p>
                </div>
                <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 text-center shadow-inner shadow-white/60 dark:shadow-none">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{completedTopics}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.topicsMastered}</p>
                </div>
                <div className="rounded-2xl bg-slate-100/80 dark:bg-slate-800 p-4 text-center shadow-inner shadow-white/60 dark:shadow-none">
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{totalQuizzes}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{DD.quizzesDone}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-[0_18px_42px_-28px_rgba(5,150,105,0.35)] ring-1 ring-white/40 dark:ring-white/5">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Trophy className="h-4 w-4 text-emerald-500" />
              {DD.strengths}
            </p>
            {parsed.strengths.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {parsed.strengths.map((strength) => (
                  <li key={strength} className="flex items-start gap-2 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 px-4 py-3 text-sm text-emerald-800 shadow-sm dark:text-emerald-200">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {strength}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                {DD.strengthsEmpty}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-[0_18px_42px_-28px_rgba(245,158,11,0.35)] ring-1 ring-white/40 dark:ring-white/5">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
              <Activity className="h-4 w-4 text-amber-500" />
              {DD.weaknesses}
            </p>
            {parsed.weaknesses.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {parsed.weaknesses.map((weakness) => (
                  <li key={weakness} className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                    {weakness}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                {DD.weaknessesEmpty}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.32)] ring-1 ring-white/40 dark:ring-white/5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                {DD.learningTopics}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {DD.learningTopicsDescription}
              </p>
            </div>
            <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
              {history.length - 1 > 0 ? DD.sessionTurnsTracked.replace("{count}", String(history.length - 1)) : DD.noActiveHistory}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {topics.length > 0 ? (
              topics.map((topic) => (
                <details
                  key={topic.topic_tag}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 shadow-sm transition-all hover:shadow-[0_18px_40px_-28px_rgba(79,70,229,0.28)] dark:bg-slate-950/40"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{topic.topic_tag}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {DD.topicMeta
                          .replace("{status}", topic.mastered ? DD.topicMastered : DD.topicInProgress)
                          .replace("{quizzes}", String(topic.quizzes_done))
                          .replace("{accuracy}", typeof topic.accuracy === "number" ? `${topic.accuracy}%` : DD.accuracyPending)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white dark:bg-slate-900 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:text-slate-300">
                        {DD.openDetails}
                      </span>
                      <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:hidden" />
                      <ChevronUp className="hidden h-4 w-4 text-slate-400 transition-transform group-open:block" />
                    </div>
                  </summary>

                  <div className="grid gap-4 border-t border-slate-200 px-4 py-4 dark:border-slate-800 md:grid-cols-2">
                    <div>
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <GraduationCap className="h-4 w-4 text-indigo-500" />
                        {DD.keyNotes}
                      </p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                        {getTopicNotes(topic).map((note) => (
                          <li key={note} className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-slate-900">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <Activity className="h-4 w-4 text-amber-500" />
                        {DD.formulasAndCues}
                      </p>
                      {topic.mistake_log.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
                          {topic.mistake_log.map((item, index) => (
                            <li key={`${topic.topic_tag}-mistake-${index}`} className="rounded-xl bg-white px-3 py-2 shadow-sm dark:bg-slate-900">
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-3 rounded-xl bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-600 dark:text-slate-300">
                          {DD.noFormulasYet}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <Trophy className="h-4 w-4 text-emerald-500" />
                        {DD.quizzesDone}
                      </p>
                      <div className="mt-3 rounded-xl bg-white px-3 py-3 text-sm text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                        <p>{DD.quizAttemptsRecorded.replace("{count}", String(topic.quizzes_done))}</p>
                        {topic.quiz_results.length > 0 && (
                          <ul className="mt-3 space-y-2">
                            {topic.quiz_results.map((result, index) => (
                              <li key={`${topic.topic_tag}-quiz-${index}`} className="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
                                {result}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <CheckCircle className="h-4 w-4 text-indigo-500" />
                        {DD.recommendedNextFocus}
                      </p>
                      <div className="mt-3 rounded-xl bg-indigo-50 px-3 py-3 text-sm text-indigo-900 shadow-sm dark:bg-indigo-950/30 dark:text-indigo-100">
                        {getRecommendedFocus(topic)}
                      </div>
                    </div>
                  </div>
                </details>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 px-4 py-8 text-center text-sm text-slate-600 dark:text-slate-300">
                {DD.noTopicsYet}
              </div>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-slate-900 p-6 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.32)] ring-1 ring-white/40 dark:ring-white/5">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
            <FileDown className="h-4 w-4 text-indigo-500" />
            {DD.currentSummary}
          </p>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-200">
            {currentSummary}
          </p>
        </section>
      </div>
    </div>
  );
};

export default DashboardView;
