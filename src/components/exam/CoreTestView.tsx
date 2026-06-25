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

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, ClipboardCheck, FileText, Info, LoaderCircle, RotateCcw, Upload } from 'lucide-react';
import { LANGUAGE_DATA, type AppLanguage } from '../../lang/Language';
import type { CoreTestGradingStyle, CoreTestPayload } from '../../types';
import { ExamBackToChatButton } from './ExamBackToChatButton';
import { ExamErrorBanner } from './ExamErrorBanner';
import { ExamInstructionView } from './ExamInstructionView';
import { ExamResultView } from './ExamResultView';
import { ExamReviewView } from './ExamReviewView';
import { ExamRuntimeView } from './ExamRuntimeView';
import { CheckListView } from './CheckListView';
import { exportExamResultDocx } from './examResultExport';
import { useExamNavigation } from '../../hooks/exam/useExamNavigation';
import { useExamSession } from '../../hooks/exam/useExamSession';
import { useExamTimer } from '../../hooks/exam/useExamTimer';
import { shouldShowExamPartHeaders } from '../../hooks/exam/examRuntimeEntries';
import { generateBlindChecklist } from '../../services/geminiService';

interface CoreTestViewProps {
  language: AppLanguage;
  encryptedApiKey: any;
  onBack: () => void;
  isViewActive?: boolean;
  onRequestScrollTop?: () => void;
  onBusyChange?: (isBusy: boolean) => void;
  onAddToMemory?: (summary: string, topicTag: string | null) => void;
  chatHistory: any[];
  oracleMemory: string | null;
}

type ToastMessage = {
  id: string;
  message: string;
};

const QUESTION_FILE_INPUT_ID = 'core-test-question-input';
const MARKSCHEME_FILE_INPUT_ID = 'core-test-markscheme-input';
const DURATION_SLIDER_VALUES = [1, ...Array.from({ length: 18 }, (_, index) => (index + 1) * 5)];
const DURATION_SLIDER_MAX_MINUTES = 90;
const DURATION_INPUT_MAX_MINUTES = 6 * 60;
const DURATION_INPUT_MIN_MINUTES = 1;
type SetupTooltipKey = 'duration' | 'helpLevel' | 'gradingStyle';

const estimateGrade = (percentage: number, gradingStyle: CoreTestGradingStyle) => {
  if (gradingStyle === 'ap') {
    if (percentage >= 85) return 'AP 5';
    if (percentage >= 70) return 'AP 4';
    if (percentage >= 55) return 'AP 3';
    if (percentage >= 40) return 'AP 2';
    return 'AP 1';
  }

  if (gradingStyle === 'ielts') {
    if (percentage >= 95) return 'Band 9';
    if (percentage >= 88) return 'Band 8.5';
    if (percentage >= 80) return 'Band 8';
    if (percentage >= 72) return 'Band 7.5';
    if (percentage >= 64) return 'Band 7';
    if (percentage >= 56) return 'Band 6.5';
    if (percentage >= 48) return 'Band 6';
    if (percentage >= 40) return 'Band 5.5';
    if (percentage >= 32) return 'Band 5';
    return 'Below Band 5';
  }

  if (gradingStyle === 'sat') {
    const scaled = Math.round(200 + (Math.max(0, Math.min(100, percentage)) / 100) * 600);
    return `SAT ${scaled}`;
  }

  if (gradingStyle === 'act') {
    const scaled = Math.max(1, Math.round(1 + (Math.max(0, Math.min(100, percentage)) / 100) * 35));
    return `ACT ${scaled}`;
  }

  if (gradingStyle === 'cambridge') {
    if (percentage >= 90) return 'A*';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    if (percentage >= 40) return 'E';
    return 'U';
  }

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
  lang: typeof LANGUAGE_DATA[AppLanguage]['ui']['examSetup'],
) => {
  if (total === 0) return lang.resultSummaryNoQuestions;
  if (answeredCount === 0) {
    return lang.resultSummaryNotAnswered.replace('{total}', String(total));
  }
  if (percentage >= 80) return lang.resultSummaryStrong.replace('{score}', String(score)).replace('{total}', String(total));
  if (percentage >= 60) return lang.resultSummaryCompetent.replace('{score}', String(score)).replace('{total}', String(total));
  return lang.resultSummaryNeedsReview.replace('{score}', String(score)).replace('{total}', String(total));
};

const buildMemorySummary = (
  payload: CoreTestPayload,
  score: number,
  total: number,
  percentage: number,
  grade: string,
  gradingStyle: CoreTestGradingStyle,
) => {
  const truncateQuestion = (text: string, limit = 300) => {
    if (!text) return '';
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > limit ? clean.substring(0, limit) + '...' : clean;
  };

  const truncateAnswers = (text: string, limit = 150) => {
    if (!text) return '';
    const clean = text.replace(/\s+/g, ' ').trim();
    return clean.length > limit ? clean.substring(0, limit) + '...' : clean;
  };

  const weakItems = payload.items
    .filter((item) => (item.score ?? 0) < (item.maxScore ?? 1))
    .slice(0, 6)
    .map((item) => {
      const question = item.prompt ? ` Question: "${truncateQuestion(item.prompt)}"` : '';
      const uAns = item.userAnswer ? ` User: "${truncateAnswers(item.userAnswer)}"` : '';
      const cAns = item.correctAnswer ? ` Correct: "${truncateAnswers(item.correctAnswer)}"` : '';
      const feedback = item.feedback ? ` Feedback: ${item.feedback}` : '';
      return `Q${item.questionNumber}: ${item.score ?? 0}/${item.maxScore ?? 1}.${question}${uAns}${cAns}${feedback}`;
    });

  const strengths = payload.items
    .filter((item) => (item.score ?? 0) >= (item.maxScore ?? 1))
    .slice(0, 4)
    .map((item) => {
      const question = item.prompt ? ` Question: "${truncateQuestion(item.prompt)}"` : '';
      const uAns = item.userAnswer ? ` User: "${truncateAnswers(item.userAnswer)}"` : '';
      const feedback = item.feedback ? ` Feedback: ${item.feedback}` : '';
      return `Q${item.questionNumber}: ${item.score ?? 0}/${item.maxScore ?? 1}.${question}${uAns}${feedback}`;
    });

  return [
    `Core test result for "${payload.title}": ${score}/${total} (${percentage}%), estimated ${grade}, grading style ${gradingStyle}.`,
    strengths.length ? `Strong questions:\n- ${strengths.join('\n- ')}` : '',
    weakItems.length ? `Review targets:\n- ${weakItems.join('\n- ')}` : 'No major review targets were detected from this test.',
  ].filter(Boolean).join('\n\n');
};

const buildSetupInstructions = (payloadInstructions: string, lang: any) => {
  const base = [
    `**${lang.examRuntimeNotesTitle}**`,
    `- ${lang.examRuntimeNote1}`,
    `- ${lang.examRuntimeNote2}`,
    `- ${lang.examRuntimeNote3}`,
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
  isViewActive = true,
  onRequestScrollTop,
  onBusyChange,
  onAddToMemory,
  chatHistory,
  oracleMemory,
}) => {
  const {
    session,
    files,
    helpLevel,
    gradingStyle,
    activeJob,
    error,
    updateSession,
    setDurationSeconds,
    setHelpLevel,
    setGradingStyle,
    setError,
    goToStage,
    updateAnswer,
    loadQuestionPaper,
    loadMarkScheme,
    startExam,
    submitExam,
    retryLastFailedAction,
    redoExam,
    clearSession,
  } = useExamSession({
    language,
    encryptedApiKey,
  });

  const navigation = useExamNavigation(session, updateSession);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSubmitConfirmOpen, setIsSubmitConfirmOpen] = useState(false);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const [activeSetupTooltip, setActiveSetupTooltip] = useState<SetupTooltipKey | null>(null);
  const [durationInputValue, setDurationInputValue] = useState(() =>
    String(Math.round(session.durationSeconds / 60)),
  );

  const calculateMetricsHash = (metrics: any) => {
    try {
      const str = JSON.stringify(metrics);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return hash.toString();
    } catch (e) {
      return Date.now().toString();
    }
  };

  const handleGenerateChecklist = async () => {
    if (isGeneratingChecklist) return;

    const metrics = {
      chats: chatHistory,
      tests: [session.payload],
      memory: oracleMemory,
    };

    const currentHash = calculateMetricsHash(metrics);

    if (session.checklistContent && session.lastChecklistMetricsHash === currentHash) {
      goToStage('checklist');
      return;
    }

    setIsGeneratingChecklist(true);
    goToStage('checklist');

    try {
      const content = await generateBlindChecklist(
        metrics,
        language,
        encryptedApiKey
      );

      updateSession(prev => ({
        ...prev,
        checklistContent: content,
        lastChecklistMetricsHash: currentHash
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to generate the blind checklist.');
      goToStage('results');
    } finally {
      setIsGeneratingChecklist(false);
    }
  };

  const lang = LANGUAGE_DATA[language].ui.exam;
  const setupLang = LANGUAGE_DATA[language].ui.examSetup;

  const HELP_LEVEL_OPTIONS = [
    { value: 'none', label: setupLang.helpLevelNone },
    { value: 'general', label: setupLang.helpLevelGeneral },
    { value: 'specific', label: setupLang.helpLevelSpecific },
    { value: 'solution', label: setupLang.helpLevelSolution },
  ] as const;

  const GRADING_STYLE_OPTIONS: { value: CoreTestGradingStyle; label: string }[] = [
    { value: 'default', label: setupLang.gradingStyleDefault },
    { value: 'ap', label: 'AP' },
    { value: 'ielts', label: 'IELTS' },
    { value: 'sat', label: 'SAT' },
    { value: 'act', label: 'ACT' },
    { value: 'cambridge', label: 'Cambridge' },
  ];

  const shouldShowPartHeaders = shouldShowExamPartHeaders(session.payload);
  const durationMinutes = Math.round(session.durationSeconds / 60);
  const durationSliderIndex = DURATION_SLIDER_VALUES.reduce(
    (closestIndex, value, index) =>
      Math.abs(value - Math.min(durationMinutes, DURATION_SLIDER_MAX_MINUTES)) <
      Math.abs(DURATION_SLIDER_VALUES[closestIndex] - Math.min(durationMinutes, DURATION_SLIDER_MAX_MINUTES))
        ? index
        : closestIndex,
    0,
  );
  const setupTooltips: Record<SetupTooltipKey, string> = {
    duration: setupLang.durationTooltip,
    helpLevel: setupLang.helpLevelTooltip,
    gradingStyle: setupLang.gradingStyleTooltip,
  };
  const unansweredCount = useMemo(
    () => session.payload.items.filter((item) => !item.userAnswer.trim()).length,
    [session.payload.items],
  );
  const answeredCount = session.payload.items.length - unansweredCount;
  const flaggedCount = session.flaggedQuestionIds.length;
  const estimatedMarks = useMemo(
    () => session.payload.items.reduce((sum, item) => sum + (item.maxScore ?? 1), 0),
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
    isViewActive,
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

  useEffect(() => {
    setDurationInputValue(String(durationMinutes));
  }, [durationMinutes]);

  useEffect(() => {
    if (!isViewActive) return;
    onRequestScrollTop?.();
  }, [isViewActive, onRequestScrollTop, session.stage]);

  const handleConfirmSubmit = () => {
    setIsSubmitConfirmOpen(false);
    void submitExam();
  };

  const applyDurationMinutes = (minutes: number) => {
    const nextMinutes = Math.max(
      DURATION_INPUT_MIN_MINUTES,
      Math.min(DURATION_INPUT_MAX_MINUTES, Math.round(minutes)),
    );

    setDurationSeconds(nextMinutes * 60);
    setDurationInputValue(String(nextMinutes));
  };

  const renderSetupLabel = (
    label: string,
    tooltipKey: SetupTooltipKey,
    htmlFor?: string,
  ) => (
    <div className="flex items-center gap-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <div
        className="relative flex items-center"
        onMouseEnter={() => setActiveSetupTooltip(tooltipKey)}
        onMouseLeave={() => setActiveSetupTooltip((current) => current === tooltipKey ? null : current)}
        onFocus={() => setActiveSetupTooltip(tooltipKey)}
        onBlur={() => setActiveSetupTooltip((current) => current === tooltipKey ? null : current)}
      >
        <button
          type="button"
          className="text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus-visible:text-slate-600 dark:hover:text-slate-200 dark:focus-visible:text-slate-200"
          aria-label={setupTooltips[tooltipKey]}
        >
          <Info className="h-3.5 w-3.5" />
        </button>
        {activeSetupTooltip === tooltipKey && (
          <div className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-900 shadow-lg dark:bg-slate-800 dark:text-white">
            {setupTooltips[tooltipKey]}
          </div>
        )}
      </div>
    </div>
  );

  const score = session.payload.summary?.correct ?? 0;
  const total = session.payload.summary?.total ?? session.payload.items.length;
  const percentage = session.payload.summary?.percentage ?? 0;
  const grade = estimateGrade(percentage, gradingStyle);
  const resultSummary = buildResultSummary(percentage, score, total, answeredCount, setupLang);
  const gradingStyleLabel =
    GRADING_STYLE_OPTIONS.find((option) => option.value === gradingStyle)?.label ?? setupLang.gradingStyleDefault;
  const chatLabel = LANGUAGE_DATA[language].ui.chat;
  const isQuestionPaperLoading = activeJob === 'questions' || activeJob === 'structuring';
  const isMarkSchemeLoading = activeJob === 'markscheme';
  const isExamUploadLocked = activeJob !== null;

  if (session.stage === 'instructions') {
    return (
      <ExamInstructionView
        title={session.payload.title || setupLang.defaultExamTitle}
        questionCount={session.payload.items.length}
        estimatedMarks={estimatedMarks}
        durationSeconds={session.durationSeconds}
        helpLevel={helpLevel}
        instructionsText={buildSetupInstructions(session.payload.instructions, setupLang)}
        onBack={() => goToStage('setup')}
        onBackToChat={onBack}
        chatLabel={chatLabel}
        onStart={startExam}
        language={language}
      />
    );
  }

  if (session.status === 'submitting' && session.stage === 'runtime') {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
        <div className="relative">
          <LoaderCircle className="h-16 w-16 animate-spin text-indigo-500" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipboardCheck className="h-6 w-6 text-indigo-400" />
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {setupLang.submittingLoading}
        </h2>
        <p className="mt-3 max-w-md text-lg text-slate-600 dark:text-slate-400">
          {setupLang.submittingSubtitle}
        </p>
      </div>
    );
  }

  if (session.stage === 'runtime') {
    return (
        <ExamRuntimeView
          items={session.payload.items}
        entries={navigation.entries}
        activeEntryIndex={navigation.activeEntryIndex}
        currentEntry={navigation.currentEntry}
        currentQuestion={navigation.currentQuestion}
        shouldShowPartHeaders={shouldShowPartHeaders}
        remainingMs={timer.remainingMs}
        helpLevel={helpLevel}
        isPaused={timer.isPaused}
        isSubmitting={session.status === 'submitting'}
        unansweredCount={unansweredCount}
        flaggedCount={flaggedCount}
        toasts={toasts}
        error={error}
        isRetrying={activeJob !== null || session.status === 'submitting'}
        isResumeModalOpen={timer.isResumeModalOpen}
        isSubmitConfirmOpen={isSubmitConfirmOpen}
        onDismissResumeModal={timer.acknowledgeResume}
        onOpenSubmitConfirm={() => setIsSubmitConfirmOpen(true)}
        onCancelSubmitConfirm={() => setIsSubmitConfirmOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        onRetryError={retryLastFailedAction}
        onAnswerChange={updateAnswer}
        onPrevious={navigation.goPrevious}
        onNext={navigation.goNext}
        onToggleFlag={navigation.toggleFlag}
        onGoToEntry={navigation.goToEntry}
        isAnswered={navigation.isAnswered}
        isFlagged={navigation.isFlagged}
        isCurrentEntry={navigation.isCurrentEntry}
        language={language}
      />
    );
  }

  if (session.stage === 'results') {
    return (
      <ExamResultView
        title={session.payload.title || setupLang.defaultExamTitle}
        score={score}
        total={total}
        percentage={percentage}
        estimatedGrade={grade}
        gradingStyleLabel={gradingStyleLabel}
        summary={resultSummary}
        onBackToChat={onBack}
        chatLabel={chatLabel}
        onExport={() =>
          exportExamResultDocx({
            payload: session.payload,
            score,
            total,
            percentage,
            estimatedGrade: grade,
            gradingStyleLabel,
            summary: resultSummary,
            language,
          })
        }
        onAddToMemory={
          onAddToMemory
            ? () =>
                onAddToMemory(
                  buildMemorySummary(session.payload, score, total, percentage, grade, gradingStyle),
                  session.payload.title || null,
                )
            : undefined
        }
        onRedo={redoExam}
        onReview={() => goToStage('review')}
        onChecklist={handleGenerateChecklist}
        language={language}
      />
    );
  }

  if (session.stage === 'review') {
    return (
      <ExamReviewView
        title={session.payload.title || setupLang.defaultExamTitle}
        payload={session.payload}
        onBack={() => goToStage('results')}
        onBackToChat={onBack}
        chatLabel={chatLabel}
        onRedo={redoExam}
        language={language}
      />
    );
  }

  if (session.stage === 'checklist') {
    return (
      <CheckListView
        language={language}
        content={session.checklistContent}
        isLoading={isGeneratingChecklist}
        onBack={() => goToStage('results')}
        onBackToChat={onBack}
        chatLabel={chatLabel}
      />
    );
  }

  return (
    <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-3 pb-6 pt-20 sm:px-4 sm:pb-8 sm:pt-24 md:pt-8">
      <ExamBackToChatButton onClick={onBack} label={chatLabel} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500 dark:text-indigo-300">
            {setupLang.moduleSupertitle}
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {setupLang.moduleTitle}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
            {setupLang.moduleDescription}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearSession}
            className="inline-flex items-center gap-2 rounded-lg border border-black/5 bg-white px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCcw className="h-4 w-4" />
            {setupLang.reset}
          </button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <FileText className="h-5 w-5 text-indigo-500" />
                <h2 className="text-base font-semibold">{setupLang.questionPaperTitle}</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {setupLang.questionPaperSubtitle}
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
              {setupLang.questionPaperBadge}
            </span>
          </div>

          <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
            {isQuestionPaperLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-indigo-500 dark:text-indigo-300" />
            ) : (
              <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            )}
            <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {files.questionPaperName || setupLang.noQuestionPaperSelected}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isQuestionPaperLoading
                ? setupLang.questionPaperLoading
                : files.questionPaperRaw
                  ? setupLang.questionPaperLoaded.replace('{count}', String(session.payload.items.length))
                  : setupLang.questionPaperHint}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              htmlFor={QUESTION_FILE_INPUT_ID}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                isExamUploadLocked
                  ? 'cursor-not-allowed bg-slate-400 opacity-70'
                  : 'cursor-pointer bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {setupLang.chooseQuestionPaper}
            </label>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {files.questionPaperName || setupLang.noFileChosen}
            </span>
          </div>

          <input
            id={QUESTION_FILE_INPUT_ID}
            type="file"
            accept=".pdf,application/pdf"
            disabled={isExamUploadLocked}
            className="sr-only"
            onChange={(event) => {
              if (isExamUploadLocked) return;
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
                <h2 className="text-base font-semibold">{setupLang.markSchemeTitle}</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {setupLang.markSchemeSubtitle}
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300">
              {setupLang.markSchemeBadge}
            </span>
          </div>

          <div className="mt-4 flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/50">
            {isMarkSchemeLoading ? (
              <LoaderCircle className="h-5 w-5 animate-spin text-emerald-500 dark:text-emerald-300" />
            ) : (
              <Upload className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            )}
            <span className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              {files.markSchemeName || setupLang.noMarkSchemeSelected}
            </span>
            <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {isMarkSchemeLoading
                ? setupLang.markSchemeLoading
                : files.markSchemeRaw
                  ? setupLang.markSchemeLoaded
                  : setupLang.markSchemeHint}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label
              htmlFor={MARKSCHEME_FILE_INPUT_ID}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
                isExamUploadLocked
                  ? 'cursor-not-allowed bg-slate-400 opacity-70'
                  : 'cursor-pointer bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {setupLang.chooseMarkScheme}
            </label>
            <span className="text-sm text-slate-600 dark:text-slate-300">
              {files.markSchemeName || setupLang.noFileChosen}
            </span>
          </div>

          <input
            id={MARKSCHEME_FILE_INPUT_ID}
            type="file"
            accept=".pdf,application/pdf"
            disabled={isExamUploadLocked}
            className="sr-only"
            onChange={(event) => {
              if (isExamUploadLocked) return;
              void loadMarkScheme(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </div>
      </section>

      {error && (
        <ExamErrorBanner
          language = {language}
          message={error}
          isRetrying={activeJob !== null}
          onRetry={retryLastFailedAction}
        />
      )}

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {setupLang.sessionSetupTitle}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {setupLang.sessionSetupDescription}
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              {renderSetupLabel(setupLang.durationLabel, 'duration', 'core-test-duration-minutes')}
              <div className="mt-3 space-y-3">
                <input
                  type="range"
                  min="0"
                  max={DURATION_SLIDER_VALUES.length - 1}
                  step="1"
                  value={durationSliderIndex}
                  onChange={(event) => applyDurationMinutes(DURATION_SLIDER_VALUES[Number(event.target.value)])}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600 dark:bg-slate-700"
                />
                <input
                  id="core-test-duration-minutes"
                  type="number"
                  min={DURATION_INPUT_MIN_MINUTES}
                  max={DURATION_INPUT_MAX_MINUTES}
                  step="1"
                  value={durationInputValue}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setDurationInputValue(nextValue);
                    if (nextValue === '') return;

                    const parsedMinutes = Number(nextValue);
                    if (Number.isFinite(parsedMinutes)) {
                      applyDurationMinutes(parsedMinutes);
                    }
                  }}
                  onBlur={() => {
                    if (durationInputValue === '') {
                      setDurationInputValue(String(durationMinutes));
                      return;
                    }

                    const parsedMinutes = Number(durationInputValue);
                    applyDurationMinutes(Number.isFinite(parsedMinutes) ? parsedMinutes : durationMinutes);
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              {renderSetupLabel(setupLang.helpLevelLabel, 'helpLevel')}
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

            <div>
              {renderSetupLabel(setupLang.gradingStyleLabel, 'gradingStyle', 'core-test-grading-style')}
              <select
                id="core-test-grading-style"
                value={gradingStyle}
                onChange={(event) => setGradingStyle(event.target.value as CoreTestGradingStyle)}
                className="mt-3 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                {GRADING_STYLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {setupLang.snapshotTitle}
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p><span className="font-medium text-slate-900 dark:text-slate-100">{setupLang.snapshotFieldTitle}:</span> {session.payload.title || setupLang.snapshotPendingTitle}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">{setupLang.snapshotFieldQuestions}:</span> {session.payload.items.length}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">{setupLang.snapshotFieldMarks}:</span> {estimatedMarks}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">{setupLang.snapshotFieldDuration}:</span> {Math.round(session.durationSeconds / 60)} {setupLang.snapshotMinutes}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">{setupLang.snapshotFieldHelpLevel}:</span> {HELP_LEVEL_OPTIONS.find((o) => o.value === helpLevel)?.label}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">{setupLang.snapshotFieldGradingStyle}:</span> {GRADING_STYLE_OPTIONS.find((o) => o.value === gradingStyle)?.label}</p>
          </div>

          <button
            onClick={() => {
              if (!session.payload.items.length) {
                setError(setupLang.errorNoQuestionPaper);
                return;
              }
              setError(null);
              goToStage('instructions');
            }}
            disabled={!session.payload.items.length || activeJob !== null}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {setupLang.continueToInstructions}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default CoreTestView;
