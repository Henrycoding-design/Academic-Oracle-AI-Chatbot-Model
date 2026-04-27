import React, { useEffect, useRef, useState } from 'react';
import { ClipboardCheck, FileText, RotateCcw, Upload } from 'lucide-react';
import type { CoreTestPayload } from '../types';
import type { AppLanguage } from '../lang/Language';
import { MarkdownContent } from './MarkdownContent';
import { readFileAsText } from '../services/fileReader';
import { gradeCoreTestPayload, structureCoreTestFromPdf } from '../services/geminiService';

interface CoreTestViewProps {
  language: AppLanguage;
  encryptedApiKey: any;
  onBack: () => void;
  onBusyChange?: (isBusy: boolean) => void;
}

const CORE_TEST_STORAGE_KEY = 'academic-oracle-core-test-state';

const readStoredState = () => {
  if (typeof window === 'undefined') return null;
  const saved = sessionStorage.getItem(CORE_TEST_STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
};

const normalizeExtractedText = (text: string) =>
  text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const mergeUserAnswers = (
  nextPayload: CoreTestPayload,
  previousPayload: CoreTestPayload | null,
) => {
  if (!previousPayload) return nextPayload;

  return {
    ...nextPayload,
    items: nextPayload.items.map((item, index) => ({
      ...item,
      userAnswer:
        previousPayload.items[index]?.userAnswer ??
        previousPayload.items.find((prev) => prev.id === item.id)?.userAnswer ??
        item.userAnswer,
    })),
  };
};

export const CoreTestView: React.FC<CoreTestViewProps> = ({
  language,
  encryptedApiKey,
  onBack,
  onBusyChange,
}) => {
  const questionInputRef = useRef<HTMLInputElement>(null);
  const markSchemeInputRef = useRef<HTMLInputElement>(null);

  const [questionPaperName, setQuestionPaperName] = useState(() => readStoredState()?.questionPaperName ?? '');
  const [markSchemeName, setMarkSchemeName] = useState(() => readStoredState()?.markSchemeName ?? '');
  const [questionPaperRaw, setQuestionPaperRaw] = useState(() => readStoredState()?.questionPaperRaw ?? '');
  const [markSchemeRaw, setMarkSchemeRaw] = useState(() => readStoredState()?.markSchemeRaw ?? '');
  const [testPayload, setTestPayload] = useState<CoreTestPayload | null>(() => readStoredState()?.testPayload ?? null);
  const [activeJob, setActiveJob] = useState<'questions' | 'markscheme' | 'structuring' | 'grading' | null>(() => readStoredState()?.activeJob ?? null);
  const [error, setError] = useState<string | null>(() => readStoredState()?.error ?? null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(CORE_TEST_STORAGE_KEY, JSON.stringify({
      questionPaperName,
      markSchemeName,
      questionPaperRaw,
      markSchemeRaw,
      testPayload,
      activeJob,
      error,
    }));
  }, [questionPaperName, markSchemeName, questionPaperRaw, markSchemeRaw, testPayload, activeJob, error]);

  useEffect(() => {
    onBusyChange?.(activeJob !== null);
  }, [activeJob, onBusyChange]);

  useEffect(() => {
    if (typeof window === 'undefined' || !activeJob) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activeJob]);

  const rebuildStructuredPayload = async (
    nextQuestionPaperRaw: string,
    nextMarkSchemeRaw: string,
    previousPayload: CoreTestPayload | null,
  ) => {
    if (!nextQuestionPaperRaw.trim()) return;

    setActiveJob('structuring');
    setError(null);

    try {
      const structured = await structureCoreTestFromPdf(
        language,
        nextQuestionPaperRaw,
        nextMarkSchemeRaw.trim() ? nextMarkSchemeRaw : null,
        encryptedApiKey,
      );

      setTestPayload(mergeUserAnswers(structured, previousPayload));
    } catch (structureError) {
      console.error(structureError);
      setError('Failed to structure test questions from the uploaded PDF.');
    } finally {
      setActiveJob(null);
    }
  };

  const handlePdfUpload = async (kind: 'questions' | 'markscheme', file?: File) => {
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      setError('PDF files only for this test system.');
      return;
    }

    setError(null);
    setActiveJob(kind);

    try {
      const rawText = normalizeExtractedText(await readFileAsText(file));
      const previousPayload = testPayload;

      if (kind === 'questions') {
        setQuestionPaperName(file.name);
        setQuestionPaperRaw(rawText);
        setTestPayload(null);
        await rebuildStructuredPayload(rawText, markSchemeRaw, null);
      } else {
        setMarkSchemeName(file.name);
        setMarkSchemeRaw(rawText);
        if (questionPaperRaw.trim()) {
          await rebuildStructuredPayload(questionPaperRaw, rawText, previousPayload);
        } else {
          setActiveJob(null);
        }
      }
    } catch (uploadError) {
      console.error(uploadError);
      setError(`Failed to read ${kind === 'questions' ? 'question paper' : 'mark scheme'} PDF.`);
      setActiveJob(null);
    }
  };

  const handleSubmit = async () => {
    if (!testPayload || testPayload.items.length === 0) {
      setError('Upload a question paper before submitting answers.');
      return;
    }

    setActiveJob('grading');
    setError(null);

    try {
      const gradedPayload = await gradeCoreTestPayload(
        language,
        testPayload,
        questionPaperRaw,
        markSchemeRaw.trim() ? markSchemeRaw : null,
        encryptedApiKey,
      );

      setTestPayload(gradedPayload);
    } catch (gradingError) {
      console.error(gradingError);
      setError('Failed to grade answers for this test.');
    } finally {
      setActiveJob(null);
    }
  };

  const handleReset = () => {
    setQuestionPaperName('');
    setMarkSchemeName('');
    setQuestionPaperRaw('');
    setMarkSchemeRaw('');
    setTestPayload(null);
    setError(null);
    setActiveJob(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CORE_TEST_STORAGE_KEY);
    }
  };

  const summary = testPayload?.summary ?? null;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-3 py-6 sm:px-4 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
            Academic Oracle v2.5.0
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Core Test System
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            Upload a question paper PDF, optionally add a mark scheme PDF, answer the structured questions, and get a basic score.
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
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="block rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
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
              {questionPaperName || 'No question paper selected'}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeJob === 'questions' || activeJob === 'structuring'
                ? 'Reading and structuring questions...'
                : questionPaperRaw
                  ? `${testPayload?.items.length ?? 0} question item(s) loaded`
                  : 'Raw content is extracted first, then structured with Gemini'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => questionInputRef.current?.click()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Choose question paper
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {questionPaperName || 'No file chosen'}
            </span>
          </div>

          <input
            ref={questionInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(event) => {
              void handlePdfUpload('questions', event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </div>

        <div className="block rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                <h2 className="text-base font-semibold">Mark scheme</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Optional. Gemini uses this first when grading.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              Optional
            </span>
          </div>

          <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {markSchemeName || 'No mark scheme selected'}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {activeJob === 'markscheme'
                ? 'Reading mark scheme...'
                : markSchemeRaw
                  ? 'Attached to structured payload for grading'
                  : 'If missing, Gemini falls back to its own judgment'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => markSchemeInputRef.current?.click()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Choose mark scheme
            </button>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {markSchemeName || 'No file chosen'}
            </span>
          </div>

          <input
            ref={markSchemeInputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={(event) => {
              void handlePdfUpload('markscheme', event.target.files?.[0]);
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

      {summary && (
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Score</p>
              <h2 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {summary.correct}/{summary.total}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300">
                {summary.percentage}%
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {summary.usedMarkScheme ? 'Graded with mark scheme guidance' : 'Graded without mark scheme guidance'}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Test UI</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Gemini structures the extracted PDF into UI-ready questions, then grades the submitted answers into the same payload format.
            </p>
            {testPayload?.instructions && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {testPayload.instructions}
              </p>
            )}
          </div>
          <button
            onClick={() => void handleSubmit()}
            disabled={!testPayload || testPayload.items.length === 0 || activeJob !== null}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {activeJob === 'grading' ? 'Grading...' : 'Submit answers'}
          </button>
        </div>

        {!testPayload || testPayload.items.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Upload a question paper PDF to generate the structured test view.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {testPayload.items.map((item) => (
              <article
                key={item.id}
                className={`rounded-xl border p-4 ${
                  item.isCorrect === null
                    ? 'border-black/5 bg-slate-50 dark:border-white/10 dark:bg-slate-950/50'
                    : item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-950/10'
                      : 'border-rose-200 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-950/10'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Question {item.questionNumber}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                      {item.type === 'mcq' ? 'Multiple Choice' : 'Open Response'}
                    </p>
                    <div className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                      <MarkdownContent content={item.prompt} />
                    </div>
                  </div>
                  {item.isCorrect !== null && (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {item.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  )}
                </div>

                {item.type === 'mcq' && Array.isArray(item.options) && item.options.length > 0 ? (
                  <div className="mt-4 grid gap-2">
                    {item.options.map((option, optionIndex) => {
                      const isSelected = item.userAnswer === option;

                      return (
                        <button
                          key={`${item.id}-option-${optionIndex}`}
                          type="button"
                          onClick={() =>
                            setTestPayload((prev) => {
                              if (!prev) return prev;

                              return {
                                ...prev,
                                summary: null,
                                items: prev.items.map((currentItem) =>
                                  currentItem.id === item.id
                                    ? {
                                        ...currentItem,
                                        userAnswer: option,
                                        isCorrect: null,
                                        score: null,
                                        feedback: '',
                                      }
                                    : currentItem,
                                ),
                              };
                            })
                          }
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
                    value={item.userAnswer}
                    onChange={(event) =>
                      setTestPayload((prev) => {
                        if (!prev) return prev;

                        return {
                          ...prev,
                          summary: null,
                          items: prev.items.map((currentItem) =>
                            currentItem.id === item.id
                              ? {
                                  ...currentItem,
                                  userAnswer: event.target.value,
                                  isCorrect: null,
                                  score: null,
                                  feedback: '',
                                }
                              : currentItem,
                          ),
                        };
                      })
                    }
                    placeholder="Type your answer here..."
                    className="mt-4 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                )}

                {item.feedback && (
                  <div className="mt-3 rounded-lg bg-white/80 px-3 py-2 text-sm text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                    {item.feedback}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CoreTestView;
