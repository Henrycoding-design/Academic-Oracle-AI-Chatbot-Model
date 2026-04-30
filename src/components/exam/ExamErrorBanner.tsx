import React from 'react';
import { AlertTriangle, LoaderCircle, RotateCcw } from 'lucide-react';

type ExamErrorBannerProps = {
  message: string;
  isRetrying?: boolean;
  onRetry: () => void;
};

export const ExamErrorBanner: React.FC<ExamErrorBannerProps> = ({
  message,
  isRetrying = false,
  onRetry,
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
    <div className="flex min-w-0 items-center gap-2">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>

    <button
      onClick={onRetry}
      disabled={isRetrying}
      className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900/40 dark:bg-slate-950/60 dark:text-rose-200 dark:hover:bg-rose-950/30"
    >
      {isRetrying ? (
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <RotateCcw className="h-3.5 w-3.5" />
      )}
      Retry
    </button>
  </div>
);

export default ExamErrorBanner;
