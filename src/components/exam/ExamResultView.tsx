import React from 'react';
import { Award, Brain, ClipboardList, Download, RotateCcw } from 'lucide-react';
import { ExamBackToChatButton } from './ExamBackToChatButton';

type ExamResultViewProps = {
  title: string;
  score: number;
  total: number;
  percentage: number;
  estimatedGrade: string;
  gradingStyleLabel: string;
  summary: string;
  onBackToChat: () => void;
  chatLabel: string;
  onExport: () => void;
  onAddToMemory?: () => void;
  onRedo: () => void;
  onReview: () => void;
};

export const ExamResultView: React.FC<ExamResultViewProps> = ({
  title,
  score,
  total,
  percentage,
  estimatedGrade,
  gradingStyleLabel,
  summary,
  onBackToChat,
  chatLabel,
  onExport,
  onAddToMemory,
  onRedo,
  onReview,
}) => {
  return (
    <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6 px-3 pb-6 pt-20 sm:px-4 sm:pb-8 sm:pt-24 md:pt-8">
      <ExamBackToChatButton onClick={onBackToChat} label={chatLabel} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
            Exam Results
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h1>
        </div>

      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {score}/{total}
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Percentage</p>
          <p className="mt-2 text-3xl font-semibold text-indigo-600 dark:text-indigo-300">
            {percentage}%
          </p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">Estimated Grade</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {estimatedGrade}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            {gradingStyleLabel}
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <Award className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold">Summary</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-200">
          {summary}
        </p>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onRedo}
          className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <RotateCcw className="h-4 w-4" />
          Redo Exam
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4" />
            Export to Docx
          </button>
          <button
            onClick={onAddToMemory}
            disabled={!onAddToMemory}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-200 dark:hover:bg-emerald-950/40"
          >
            <Brain className="h-4 w-4" />
            Add to Oracle Memory
          </button>
          <button
            onClick={onReview}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <ClipboardList className="h-4 w-4" />
            Review Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamResultView;
