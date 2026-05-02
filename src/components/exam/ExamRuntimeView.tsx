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

import React, { useMemo, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Clock3, Flag, Lightbulb, LoaderCircle, Send } from 'lucide-react';
import type { CoreTestItem } from '../../types';
import type { ExamHelpLevel } from '../../hooks/exam/useExamSession';
import { ExamErrorBanner } from './ExamErrorBanner';
import { MarkdownContent } from '../MarkdownContent';
import { AppLanguage, LANGUAGE_DATA} from '../../lang/Language';

type RuntimeToast = {
  id: string;
  message: string;
};

type ExamRuntimeViewProps = {
  items: CoreTestItem[];
  activeQuestionIndex: number;
  currentQuestion: CoreTestItem | null;
  remainingMs: number;
  helpLevel: ExamHelpLevel;
  isPaused: boolean;
  isSubmitting: boolean;
  unansweredCount: number;
  flaggedCount: number;
  toasts: RuntimeToast[];
  error: string | null;
  isRetrying: boolean;
  isResumeModalOpen: boolean;
  isSubmitConfirmOpen: boolean;
  onDismissResumeModal: () => void;
  onOpenSubmitConfirm: () => void;
  onCancelSubmitConfirm: () => void;
  onConfirmSubmit: () => void;
  onRetryError: () => void;
  onAnswerChange: (questionId: string, answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFlag: (questionId: string) => void;
  onGoToQuestion: (index: number) => void;
  isAnswered: (questionId: string) => boolean;
  isFlagged: (questionId: string) => boolean;
  isCurrent: (questionId: string) => boolean;
  language: AppLanguage;
};

const formatRemaining = (remainingMs: number) => {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hours = Math.floor(minutes / 60);
  const displayMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}:${String(displayMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const getNavigatorClassName = (state: 'current' | 'answered' | 'unanswered' | 'flagged') => {
  if (state === 'current') {
    return 'border-indigo-500 bg-indigo-600 text-white';
  }

  if (state === 'flagged') {
    return 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300';
  }

  if (state === 'answered') {
    return 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300';
  }

  return 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200';
};

const getFallbackHint = (question: CoreTestItem, helpLevel: ExamHelpLevel) => {
  if (helpLevel === 'general') {
    return question.type === 'mcq'
      ? 'Read every option before selecting. Eliminate choices that contradict the question wording.'
      : 'Identify the command word first, then list the key facts or steps the question is asking for.';
  }

  if (helpLevel === 'specific') {
    return question.type === 'mcq'
      ? 'Compare each option against the exact condition in the question, then choose the one that satisfies all parts.'
      : `Start with the central concept, then add evidence, calculation, or explanation for each of the ${question.maxScore ?? 1} available mark(s).`;
  }

  if (helpLevel === 'solution') {
    if (question.hints?.solution) return question.hints.solution;
    if (question.correctAnswer) return `Expected answer: ${question.correctAnswer}`;
    if (question.markScheme) return `Expected solution should cover: ${question.markScheme}`;
    return 'No solution is available for this question yet.';
  }

  return '';
};

const getHintContent = (question: CoreTestItem, helpLevel: ExamHelpLevel) => {
  if (helpLevel === 'none') return '';

  const configuredHint =
    helpLevel === 'general'
      ? question.hints?.general
      : helpLevel === 'specific'
        ? question.hints?.specific
        : question.hints?.solution;

  return configuredHint || getFallbackHint(question, helpLevel);
};

const getHintLabel = (helpLevel: ExamHelpLevel, languageData: { solution: string; specificHint: string; hint: string }) => {
  if (helpLevel === 'solution') return languageData.solution;
  if (helpLevel === 'specific') return languageData.specificHint;
  return languageData.hint;
};

export const ExamRuntimeView: React.FC<ExamRuntimeViewProps> = ({
  items,
  activeQuestionIndex,
  currentQuestion,
  remainingMs,
  helpLevel,
  isPaused,
  isSubmitting,
  unansweredCount,
  flaggedCount,
  toasts,
  error,
  isRetrying,
  isResumeModalOpen,
  isSubmitConfirmOpen,
  onDismissResumeModal,
  onOpenSubmitConfirm,
  onCancelSubmitConfirm,
  onConfirmSubmit,
  onRetryError,
  onAnswerChange,
  onPrevious,
  onNext,
  onToggleFlag,
  onGoToQuestion,
  isAnswered,
  isFlagged,
  isCurrent,
  language = 'en',
}) => {
  const languageData = LANGUAGE_DATA[language].ui.exam;
  const [openHintQuestionIds, setOpenHintQuestionIds] = useState<string[]>([]);
  const hintContent = useMemo(
    () => currentQuestion ? getHintContent(currentQuestion, helpLevel) : '',
    [currentQuestion, helpLevel],
  );
  const isHintOpen = currentQuestion
    ? openHintQuestionIds.includes(currentQuestion.id)
    : false;

  const toggleHint = (questionId: string) => {
    setOpenHintQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId],
    );
  };

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col px-3 py-6 sm:px-4 sm:py-8">
      <header className="sticky top-0 z-20 rounded-2xl border border-black/5 bg-white/95 px-4 py-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/95">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2 dark:bg-slate-900">
              <Clock3 className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {languageData.timeRemaining}
              </p>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {formatRemaining(remainingMs)}
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            {languageData.questionOf?.replace('{current}', String(Math.min(activeQuestionIndex + 1, items.length))).replace('{total}', String(items.length)) }
          </div>

          <button
            onClick={onOpenSubmitConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSubmitting ? languageData.submitting : languageData.submit}
          </button>
        </div>
      </header>

      {error && (
        <div className="mt-4">
          <ExamErrorBanner
            language={language}
            message={error}
            isRetrying={isRetrying}
            onRetry={onRetryError}
          />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {languageData.navigator}
          </h2>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {items.map((item, index) => {
              const state = isCurrent(item.id)
                ? 'current'
                : isFlagged(item.id)
                  ? 'flagged'
                  : isAnswered(item.id)
                    ? 'answered'
                    : 'unanswered';

              return (
                <button
                  key={item.id}
                  onClick={() => onGoToQuestion(index)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${getNavigatorClassName(state)}`}
                >
                  {item.questionNumber}
                </button>
              );
            })}
          </div>
        </aside>

        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          {currentQuestion ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {languageData.questionPrefix || 'Question'} {currentQuestion.questionNumber}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                    {currentQuestion.type === 'mcq' ? languageData.multipleChoice : languageData.openResponse}
                  </p>
                </div>
                {isFlagged(currentQuestion.id) && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
                    {languageData.flagged}
                  </span>
                )}
              </div>

              <div className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <MarkdownContent content={currentQuestion.prompt} />
              </div>

              {helpLevel !== 'none' && hintContent && (
                <div className="mt-4">
                  <button
                    onClick={() => toggleHint(currentQuestion.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-200 dark:hover:bg-indigo-950/40"
                  >
                    <Lightbulb className="h-4 w-4" />
                    {isHintOpen ? languageData.hideHint : languageData.showHint} {getHintLabel(helpLevel, languageData)}
                  </button>

                  {isHintOpen && (
                    <div className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm leading-6 text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-indigo-100">
                      <MarkdownContent content={hintContent} />
                    </div>
                  )}
                </div>
              )}

              {currentQuestion.type === 'mcq' && currentQuestion.options.length > 0 ? (
                <div className="mt-5 grid gap-2">
                  {currentQuestion.options.map((option, optionIndex) => {
                    const isSelected = currentQuestion.userAnswer === option;

                    return (
                      <button
                        key={`${currentQuestion.id}-option-${optionIndex}`}
                        onClick={() => onAnswerChange(currentQuestion.id, option)}
                        className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/30 dark:text-indigo-200'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <textarea
                  value={currentQuestion.userAnswer}
                  onChange={(event) =>
                    onAnswerChange(currentQuestion.id, event.target.value)
                  }
                  placeholder={languageData.typeAnswerHere}
                  className="mt-5 min-h-40 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={onPrevious}
                    disabled={activeQuestionIndex === 0}
                    className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    {languageData.prev}
                  </button>
                  <button
                    onClick={onNext}
                    disabled={activeQuestionIndex === items.length - 1}
                    className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {languageData.next}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => onToggleFlag(currentQuestion.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isFlagged(currentQuestion.id)
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'border border-black/5 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Flag className="h-4 w-4" />
                  {isFlagged(currentQuestion.id) ? languageData.unflag : languageData.flag}
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              {languageData.noActiveQuestion}
            </div>
          )}
        </section>
      </div>

      {toasts.length > 0 && (
        <div className="pointer-events-none fixed right-4 top-24 z-40 flex w-72 flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200"
            >
              {toast.message}
            </div>
          ))}
        </div>
      )}

      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {languageData.youLeftExamWindow}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              { languageData.resumeExamNotice }
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={onDismissResumeModal}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {languageData.resumeExam}
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {languageData.submitExam}
            </h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>{ languageData.youStillHave }</p>
              <ul className="list-disc pl-5">
                <li>{unansweredCount} {languageData.unansweredQuestions}</li>
                <li>{flaggedCount} {languageData.flaggedQuestions}</li>
              </ul>
              <p className="pt-2">{languageData.submitAnyway}</p>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={onCancelSubmitConfirm}
                className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {languageData.cancel}
              </button>
              <button
                onClick={onConfirmSubmit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {languageData.confirmSubmit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamRuntimeView;
