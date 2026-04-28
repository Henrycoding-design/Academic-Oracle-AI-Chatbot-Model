import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ClipboardCheck, FileText, RotateCcw, Upload } from 'lucide-react';
import type { AppLanguage } from '../../lang/Language';
import { ExamInstructionView } from './ExamInstructionView';
import { ExamResultView } from './ExamResultView';
import { ExamReviewView } from './ExamReviewView';
import { ExamRuntimeView } from './ExamRuntimeView';
import { useExamNavigation } from '../../hooks/exam/useExamNavigation';
import { useExamSession } from '../../hooks/exam/useExamSession';
import { useExamTimer } from '../../hooks/exam/useExamTimer';

interface CoreTestViewProps {
  language: AppLanguage;
  encryptedApiKey: any;
  onBack: () => void;
  onBusyChange?: (isBusy: boolean) => void;
}

type ToastMessage = {
  id: string;
  message: string;
};

const HELP_LEVEL_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'standard', label: 'Standard' },
  { value: 'guided', label: 'Guided' },
] as const;

const DURATION_OPTIONS = [
  { value: 15 * 60, label: '15 min' },
  { value: 30 * 60, label: '30 min' },
  { value: 45 * 60, label: '45 min' },
  { value: 60 * 60, label: '60 min' },
] as const;

const QUESTION_FILE_INPUT_ID = 'core-test-question-input';
const MARKSCHEME_FILE_INPUT_ID = 'core-test-markscheme-input';

const estimateGrade = (percentage: number) => {
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'E';
};

const buildResultSummary = (
  percentage: number,
  score: number,
  total: number,
  answeredCount: number,
) => {
  if (total === 0) return 'No graded questions are available.';
  if (answeredCount === 0) {
    return `Test not answered. No responses were submitted, so this attempt was recorded as 0 out of ${total}.`;
  }
  if (percentage >= 80) return `Strong performance. You answered ${score} out of ${total} questions correctly.`;
  if (percentage >= 60) return `Competent result. You answered ${score} out of ${total} questions correctly, with some room to tighten consistency.`;
  return `The runtime is working, but this attempt needs review. You answered ${score} out of ${total} questions correctly.`;
};

const buildSetupInstructions = (payloadInstructions: string) => {
  const base = [
    '**Exam Runtime Notes**',
    '- Upload a question paper PDF to structure the exam.',
    '- Upload a mark scheme PDF if you want grading to prioritize official marking guidance.',
    '- Choose duration and help level before starting.',
  ];

  if (payloadInstructions.trim()) {
    base.push('', payloadInstructions);
  }

  return base.join('\n');
};

export const CoreTestView: React.FC<CoreTestViewProps> = ({
  language,
  encryptedApiKey,
  onBack,
  onBusyChange,
}) => {
  const {
    session,
    files,
    helpLevel,
    activeJob,
    error,
    updateSession,
    setDurationSeconds,
    setHelpLevel,
    setError,
    goToStage,
    updateAnswer,
    loadQuestionPaper,
    loadMarkScheme,
    startExam,
    submitExam,
    redoExam,
    clearSession,
  } = useExamSession({
    language,
    encryptedApiKey,
  });

  const navigation = useExamNavigation(session, updateSession);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);

  const currentQuestion = session.payload.items[session.activeQuestionIndex] ?? null;
  const unansweredCount = useMemo(
    () =>
      session.payload.items.filter((item) => !item.userAnswer.trim()).length,
    [session.payload.items],
  );
  const answeredCount = session.payload.items.length - unansweredCount;
  const flaggedCount = session.flaggedQuestionIds.length;
  const estimatedMarks = useMemo(
    () =>
      session.payload.items.reduce(
        (sum, item) => sum + (item.maxScore ?? 1),
        0,
      ),
    [session.payload.items],
  );

  const timer = useExamTimer({
    session,
    updateSession,
    onAutoSubmit: () => {
      setIsSubmitConfirmOpen(false);
      void submitExam();
    },
    onWarning: (message) => {
      const toastId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev, { id: toastId, message }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
      }, 4000);
    },
  });

  useEffect(() => {
    onBusyChange?.(
      activeJob !== null ||
      session.status === 'active' ||
      session.status === 'submitting',
    );
  }, [activeJob, onBusyChange, session.status]);

  useEffect(() => {
    if (session.stage !== 'runtime') {
      setIsSubmitConfirmOpen(false);
    }
  }, [session.stage]);

  const handleConfirmSubmit = () => {
    setIsSubmitConfirmOpen(false);
    void submitExam();
  };

  const score = session.payload.summary?.correct ?? 0;
  const total = session.payload.summary?.total ?? session.payload.items.length;
  const percentage = session.payload.summary?.percentage ?? 0;
  const grade = estimateGrade(percentage);
  const resultSummary = buildResultSummary(percentage, score, total, answeredCount);

  if (session.stage === 'instructions') {
    return (
      <ExamInstructionView
        title={session.payload.title || 'Professional Exam Runtime'}
        questionCount={session.payload.items.length}
        estimatedMarks={estimatedMarks}
        durationSeconds={session.durationSeconds}
        helpLevel={helpLevel}
        instructionsText={buildSetupInstructions(session.payload.instructions)}
        onBack={() => goToStage('setup')}
        onStart={startExam}
      />
    );
  }

  if (session.stage === 'runtime') {
    return (
      <ExamRuntimeView
        items={session.payload.items}
        activeQuestionIndex={session.activeQuestionIndex}
        currentQuestion={currentQuestion}
        remainingMs={timer.remainingMs}
        isPaused={timer.isPaused}
        isSubmitting={session.status === 'submitting'}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        toasts={toasts}
        isResumeModalOpen={timer.isResumeModalOpen}
        isSubmitConfirmOpen={isSubmitConfirmOpen}
        onDismissResumeModal={timer.acknowledgeResume}
        onOpenSubmitConfirm={() => setIsSubmitConfirmOpen(true)}
        onCancelSubmitConfirm={() => setIsSubmitConfirmOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        onAnswerChange={updateAnswer}
        onPrevious={navigation.goPrevious}
        onNext={navigation.goNext}
        onToggleFlag={navigation.toggleFlag}
        onGoToQuestion={navigation.goToQuestion}
        isAnswered={navigation.isAnswered}
        isFlagged={navigation.isFlagged}
        isCurrent={navigation.isCurrent}
      />
    );
  }

  if (session.stage === 'results') {
    return (
      <ExamResultView
        title={session.payload.title || 'Professional Exam Runtime'}
        score={score}
        total={total}
        percentage={percentage}
        estimatedGrade={grade}
        summary={resultSummary}
        onRedo={redoExam}
        onReview={() => goToStage('review')}
      />
    );
  }

  if (session.stage === 'review') {
    return (
      <ExamReviewView
        title={session.payload.title || 'Professional Exam Runtime'}
        payload={session.payload}
        onBack={() => goToStage('results')}
        onRedo={redoExam}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
            Academic Oracle v2.5.0
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Professional Exam Runtime
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Upload source PDFs, prepare the exam session, and launch the multi-stage runtime without leaving this view.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="rounded-lg border border-black/5 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Back to chat
          </button>
          <button
            onClick={clearSession}
            className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <FileText className="h-5 w-5 text-indigo-500" />
                <h2 className="text-base font-semibold">Question paper</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Required. PDF only.
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
              Core input
            </span>
          </div>

          <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {files.questionPaperName || 'No question paper selected'}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeJob === 'questions' || activeJob === 'structuring'
                ? 'Reading and structuring questions...'
                : files.questionPaperRaw
                  ? `${session.payload.items.length} question item(s) loaded`
                  : 'Raw content is extracted first, then structured with Gemini'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              htmlFor={QUESTION_FILE_INPUT_ID}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Choose question paper
            </label>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {files.questionPaperName || 'No file chosen'}
            </span>
          </div>

          <input
            id={QUESTION_FILE_INPUT_ID}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(event) => {
              void loadQuestionPaper(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                <h2 className="text-base font-semibold">Mark scheme</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Optional. Used for grading priority.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              Optional
            </span>
          </div>

          <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {files.markSchemeName || 'No mark scheme selected'}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeJob === 'markscheme'
                ? 'Reading mark scheme...'
                : files.markSchemeRaw
                  ? 'Attached to the structured exam payload'
                  : 'If missing, grading falls back to model judgment'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              htmlFor={MARKSCHEME_FILE_INPUT_ID}
              className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Choose mark scheme
            </label>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {files.markSchemeName || 'No file chosen'}
            </span>
          </div>

          <input
            id={MARKSCHEME_FILE_INPUT_ID}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(event) => {
              void loadMarkScheme(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
          {error}
        </div>
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Session Setup
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Prepare the runtime session before entering the instruction and exam stages.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Duration
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDurationSeconds(option.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      session.durationSeconds === option.value
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Help Level
              </label>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {HELP_LEVEL_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setHelpLevel(option.value)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      helpLevel === option.value
                        ? 'border-indigo-500 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Exam Snapshot
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Title:</span> {session.payload.title || 'Pending question paper'}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Questions:</span> {session.payload.items.length}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Estimated marks:</span> {estimatedMarks}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Duration:</span> {Math.round(session.durationSeconds / 60)} minutes</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Help level:</span> {helpLevel}</p>
          </div>

          <button
            onClick={() => {
              if (!session.payload.items.length) {
                setError('Upload and structure a question paper before continuing.');
                return;
              }

              setError(null);
              goToStage('instructions');
            }}
            disabled={!session.payload.items.length || activeJob !== null}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Continue to Instructions
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoreTestView;
