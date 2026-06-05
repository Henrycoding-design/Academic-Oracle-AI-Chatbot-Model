import React, { Fragment } from 'react';
import { BookOpen } from 'lucide-react';
import type { CoreTestPayload } from '../../types';
import { ExamBackToChatButton } from './ExamBackToChatButton';
import { MarkdownContent } from '../MarkdownContent';
import { AppLanguage, LANGUAGE_DATA} from '../../lang/Language';
import { buildExamRuntimeEntries, shouldShowExamPartHeaders } from '../../hooks/exam/examRuntimeEntries';

type ExamReviewViewProps = {
  title: string;
  payload: CoreTestPayload;
  onBack: () => void;
  onBackToChat: () => void;
  chatLabel: string;
  onRedo: () => void;
  language: AppLanguage;
};

export const ExamReviewView: React.FC<ExamReviewViewProps> = ({
  title,
  payload,
  onBack,
  onBackToChat,
  chatLabel,
  onRedo,
  language = 'en',
}) => {
  const entries = buildExamRuntimeEntries(payload);
  const shouldShowPartHeaders = shouldShowExamPartHeaders(payload);

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-3 pb-6 pt-20 sm:px-4 sm:pb-8 sm:pt-24 md:pt-8">
      <ExamBackToChatButton onClick={onBackToChat} label={chatLabel} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
            {LANGUAGE_DATA[language].ui.exam.reviewExam}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {LANGUAGE_DATA[language].ui.exam.backToResults}
          </button>
          <button
            onClick={onRedo}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            {LANGUAGE_DATA[language].ui.exam.redoExam}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {entries.map((entry, index) => {
          const previousEntry = entries[index - 1];
          const shouldRenderPartHeader =
            shouldShowPartHeaders &&
            entry.partId &&
            entry.partId !== previousEntry?.partId;

          if (entry.type === 'info') {
            return (
              <Fragment key={entry.id}>
                {shouldRenderPartHeader && (
                  <h2 className="pt-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 first:pt-0">
                    {entry.partTitle}
                  </h2>
                )}
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/30 p-5 shadow-sm dark:border-indigo-900/30 dark:bg-indigo-950/10">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-500 dark:text-indigo-300">
                    <BookOpen className="h-4 w-4" />
                    Information
                  </div>
                  <div className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">
                    <MarkdownContent content={entry.info} />
                  </div>
                </div>
              </Fragment>
            );
          }

          const item = entry.item;
          const isUnanswered = !item.userAnswer.trim();
          const itemScore = item.score ?? 0;
          const itemMaxScore = item.maxScore ?? 1;
          const isPartial = itemScore > 0 && itemScore < itemMaxScore;
          const reviewState = isUnanswered
            ? 'unanswered'
            : isPartial
              ? 'partial'
              : item.isCorrect || itemScore >= itemMaxScore
                ? 'correct'
                : 'incorrect';

          const cardClassName =
            reviewState === 'correct'
              ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/10'
              : reviewState === 'partial'
                ? 'border-amber-200 bg-amber-50/40 dark:border-amber-900/40 dark:bg-amber-950/10'
              : reviewState === 'incorrect'
                ? 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/10'
                : 'border-black/5 bg-white dark:border-white/10 dark:bg-slate-900';

          const badgeClassName =
            reviewState === 'correct'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
              : reviewState === 'partial'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
              : reviewState === 'incorrect'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300';

          const badgeText =
            reviewState === 'correct'
              ? LANGUAGE_DATA[language].ui.exam.correct
              : reviewState === 'partial'
                ? LANGUAGE_DATA[language].ui.exam.partial
              : reviewState === 'incorrect'
                ? LANGUAGE_DATA[language].ui.exam.incorrect
                : LANGUAGE_DATA[language].ui.exam.unanswered;

          return (
            <Fragment key={item.id}>
              {shouldRenderPartHeader && (
                <h2 className="pt-4 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 first:pt-0">
                  {entry.partTitle}
                </h2>
              )}
              <article
                className={`rounded-2xl border p-5 shadow-sm ${cardClassName}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {LANGUAGE_DATA[language].ui.exam.questionPrefix} {item.questionNumber}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                      {item.type === 'mcq' ? LANGUAGE_DATA[language].ui.exam.multipleChoice : LANGUAGE_DATA[language].ui.exam.openResponse}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClassName}`}>
                      {badgeText}
                    </span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {LANGUAGE_DATA[language].ui.exam.score}
                      </p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {item.score ?? 0}/{item.maxScore ?? 1}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  <MarkdownContent content={item.prompt} />
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {LANGUAGE_DATA[language].ui.exam.yourAnswer}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                      {item.userAnswer || LANGUAGE_DATA[language].ui.exam.noAnswerSubmitted}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {LANGUAGE_DATA[language].ui.exam.correctAnswer}
                    </p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                      {item.correctAnswer || item.markScheme || LANGUAGE_DATA[language].ui.exam.noOfficialAnswer}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {LANGUAGE_DATA[language].ui.exam.feedback}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                    {item.feedback || LANGUAGE_DATA[language].ui.exam.noAdditionalFeedback}
                  </p>
                </div>
              </article>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ExamReviewView;
