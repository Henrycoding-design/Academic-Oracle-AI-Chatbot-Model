import React from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Clock3, Flag, Send } from 'lucide-react';
import type { CoreTestItem } from '../../types';
import { MarkdownContent } from '../MarkdownContent';

type RuntimeToast = {
  id: string;
  message: string;
};

type ExamRuntimeViewProps = {
  items: CoreTestItem[];
  activeQuestionIndex: number;
  currentQuestion: CoreTestItem | null;
  remainingMs: number;
  isPaused: boolean;
  isSubmitting: boolean;
  unansweredCount: number;
  flaggedCount: number;
  toasts: RuntimeToast[];
  isResumeModalOpen: boolean;
  isSubmitConfirmOpen: boolean;
  onDismissResumeModal: () => void;
  onOpenSubmitConfirm: () => void;
  onCancelSubmitConfirm: () => void;
  onConfirmSubmit: () => void;
  onAnswerChange: (questionId: string, answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFlag: (questionId: string) => void;
  onGoToQuestion: (index: number) => void;
  isAnswered: (questionId: string) => boolean;
  isFlagged: (questionId: string) => boolean;
  isCurrent: (questionId: string) => boolean;
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

export const ExamRuntimeView: React.FC<ExamRuntimeViewProps> = ({
  items,
  activeQuestionIndex,
  currentQuestion,
  remainingMs,
  isPaused,
  isSubmitting,
  unansweredCount,
  flaggedCount,
  toasts,
  isResumeModalOpen,
  isSubmitConfirmOpen,
  onDismissResumeModal,
  onOpenSubmitConfirm,
  onCancelSubmitConfirm,
  onConfirmSubmit,
  onAnswerChange,
  onPrevious,
  onNext,
  onToggleFlag,
  onGoToQuestion,
  isAnswered,
  isFlagged,
  isCurrent,
}) => {
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
                Time Remaining
              </p>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {formatRemaining(remainingMs)}
              </p>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Question {Math.min(activeQuestionIndex + 1, items.length)} of {items.length}
          </div>

          <button
            onClick={onOpenSubmitConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Navigator
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
                    Question {currentQuestion.questionNumber}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                    {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Open Response'}
                  </p>
                </div>
                {isFlagged(currentQuestion.id) && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/20 dark:text-amber-300">
                    Flagged
                  </span>
                )}
              </div>

              <div className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                <MarkdownContent content={currentQuestion.prompt} />
              </div>

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
                  placeholder="Type your answer here..."
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
                    Prev
                  </button>
                  <button
                    onClick={onNext}
                    disabled={activeQuestionIndex === items.length - 1}
                    className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Next
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
                  {isFlagged(currentQuestion.id) ? 'Unflag' : 'Flag'}
                </button>
              </div>
            </>
          ) : (
            <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No active question loaded.
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
                You left the exam window.
              </h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              The timer was paused while the exam window was hidden. Acknowledge this notice to resume the exam.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={onDismissResumeModal}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Resume Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-black/5 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Submit Exam?
            </h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>You still have:</p>
              <ul className="list-disc pl-5">
                <li>{unansweredCount} unanswered questions</li>
                <li>{flaggedCount} flagged questions</li>
              </ul>
              <p className="pt-2">Submit anyway?</p>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={onCancelSubmitConfirm}
                className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmSubmit}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamRuntimeView;
