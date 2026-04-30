import React from 'react';
import { Clock3, FileText, Flag, Play } from 'lucide-react';
import { ExamBackToChatButton } from './ExamBackToChatButton';
import { MarkdownContent } from '../MarkdownContent';

type ExamInstructionViewProps = {
  title: string;
  questionCount: number;
  estimatedMarks: number;
  durationSeconds: number;
  helpLevel: string;
  instructionsText: string;
  onBack: () => void;
  onBackToChat: () => void;
  chatLabel: string;
  onStart: () => void;
};

const formatDuration = (durationSeconds: number) => {
  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

export const ExamInstructionView: React.FC<ExamInstructionViewProps> = ({
  title,
  questionCount,
  estimatedMarks,
  durationSeconds,
  helpLevel,
  instructionsText,
  onBack,
  onBackToChat,
  chatLabel,
  onStart,
}) => {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-3 pb-6 pt-20 sm:px-4 sm:pb-8 sm:pt-24 md:pt-8">
      <ExamBackToChatButton onClick={onBackToChat} label={chatLabel} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
            Exam Instructions
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        </div>

      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <FileText className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Questions</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{questionCount}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Flag className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Estimated Marks</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{estimatedMarks}</p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Clock3 className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Duration</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {formatDuration(durationSeconds)}
          </p>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Play className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">Help Level</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900 capitalize dark:text-slate-100">{helpLevel}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Instructions</h2>
        <div className="mt-4 text-sm text-slate-700 dark:text-slate-200">
          <MarkdownContent content={instructionsText} />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Back
        </button>
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Play className="h-4 w-4" />
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default ExamInstructionView;
