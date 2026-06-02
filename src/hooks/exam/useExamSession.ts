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

import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppLanguage } from '../../lang/Language';
import { LANGUAGE_DATA } from '../../lang/Language';
import type { CoreTestGradingStyle, CoreTestPayload } from '../../types';
import { readFileAsText } from '../../services/fileReader';
import {
  enrichCoreTestCorrectAnswers,
  gradeCoreTestPayload,
  structureCoreTestFromPdf,
} from '../../services/geminiService';

export type ExamStage =
  | 'setup'
  | 'instructions'
  | 'runtime'
  | 'results'
  | 'review';

export interface ExamSession {
  stage: ExamStage;
  status: 'idle' | 'active' | 'submitting' | 'graded';
  startedAt?: number;
  submittedAt?: number;
  durationSeconds: number;
  endTimestamp?: number;
  activeQuestionIndex: number;
  activeInfoPartId?: string | null;
  flaggedQuestionIds: string[];
  payload: CoreTestPayload;
}

export type ExamHelpLevel = 'none' | 'general' | 'specific' | 'solution';
export type ExamGradingStyle = CoreTestGradingStyle;

export type ExamFilesState = {
  questionPaperName: string;
  markSchemeName: string;
  questionPaperRaw: string;
  markSchemeRaw: string;
};

export type ExamActiveJob =
  | 'questions'
  | 'markscheme'
  | 'structuring'
  | 'grading'
  | null;

type StoredExamState = {
  session: ExamSession;
  files: ExamFilesState;
  helpLevel: ExamHelpLevel;
  gradingStyle: ExamGradingStyle;
  activeJob: ExamActiveJob;
  error: string | null;
};

export type UpdateExamSession = (
  next:
    | ExamSession
    | ((previous: ExamSession) => ExamSession)
) => void;

type UseExamSessionOptions = {
  language: AppLanguage;
  encryptedApiKey: any;
};

const STORAGE_KEY = 'academic-oracle-professional-exam-state';

const createEmptyPayload = (): CoreTestPayload => ({
  title: 'Core Test System',
  instructions: '',
  items: [],
  summary: null,
});

const createDefaultSession = (): ExamSession => ({
  stage: 'setup',
  status: 'idle',
  durationSeconds: 60 * 60,
  activeQuestionIndex: 0,
  activeInfoPartId: null,
  flaggedQuestionIds: [],
  payload: createEmptyPayload(),
});

const createDefaultFiles = (): ExamFilesState => ({
  questionPaperName: '',
  markSchemeName: '',
  questionPaperRaw: '',
  markSchemeRaw: '',
});

const normalizeHelpLevel = (value: unknown): ExamHelpLevel => {
  if (
    value === 'none' ||
    value === 'general' ||
    value === 'specific' ||
    value === 'solution'
  ) {
    return value;
  }

  if (value === 'standard') return 'general';
  if (value === 'guided') return 'specific';

  return 'general';
};

const normalizeGradingStyle = (value: unknown): ExamGradingStyle => {
  if (
    value === 'ap' ||
    value === 'ielts' ||
    value === 'sat' ||
    value === 'act' ||
    value === 'cambridge'
  ) {
    return value;
  }

  return 'default';
};

const normalizeExtractedText = (text: string) =>
  text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

const readStoredState = (): StoredExamState | null => {
  if (typeof window === 'undefined') return null;
  const saved = sessionStorage.getItem(STORAGE_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as StoredExamState;
  } catch {
    return null;
  }
};

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

const resetPayloadForAttempt = (payload: CoreTestPayload): CoreTestPayload => ({
  ...payload,
  summary: null,
  items: payload.items.map((item) => ({
    ...item,
    userAnswer: '',
    isCorrect: null,
    score: null,
    feedback: '',
  })),
});

const buildUnansweredSubmissionPayload = (
  payload: CoreTestPayload,
  gradingStyle: ExamGradingStyle,
  language: AppLanguage,
): CoreTestPayload => ({
  ...payload,
  summary: {
    correct: 0,
    total: payload.items.reduce((sum, item) => sum + (item.maxScore ?? 1), 0),
    percentage: 0,
    usedMarkScheme: false,
    gradingStyle,
  },
  items: payload.items.map((item) => ({
    ...item,
    isCorrect: false,
    score: 0,
    feedback: item.feedback || LANGUAGE_DATA[language].ui.exam.noAnswerSubmittedFeedback,
  })),
});

export const useExamSession = ({
  language,
  encryptedApiKey,
}: UseExamSessionOptions) => {
  const storedState = readStoredState();
  const [session, setSession] = useState<ExamSession>(
    storedState?.session ?? createDefaultSession(),
  );
  const [files, setFiles] = useState<ExamFilesState>(
    storedState?.files ?? createDefaultFiles(),
  );
  const [helpLevel, setHelpLevel] = useState<ExamHelpLevel>(
    normalizeHelpLevel(storedState?.helpLevel),
  );
  const [gradingStyle, setGradingStyle] = useState<ExamGradingStyle>(
    normalizeGradingStyle(storedState?.gradingStyle),
  );
  const [activeJob, setActiveJob] = useState<ExamActiveJob>(
    null,
  );
  const [error, setError] = useState<string | null>(
    storedState?.error ?? null,
  );
  const sessionRef = useRef(session);
  const filesRef = useRef(files);
  const activeJobRef = useRef<ExamActiveJob>(activeJob);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    activeJobRef.current = activeJob;
  }, [activeJob]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      session,
      files,
      helpLevel,
      gradingStyle,
      activeJob,
      error,
    }));
  }, [activeJob, error, files, gradingStyle, helpLevel, session]);

  const updateSession: UpdateExamSession = useCallback((next) => {
    setSession((previous) => {
      const resolved =
        typeof next === 'function'
          ? (next as (previous: ExamSession) => ExamSession)(previous)
          : next;

      sessionRef.current = resolved;
      return resolved;
    });
  }, []);

  const startActiveJob = (job: Exclude<ExamActiveJob, null>) => {
    if (activeJobRef.current !== null) {
      setError('Another exam file is still processing. Please wait for it to finish before starting a new upload.');
      return false;
    }

    activeJobRef.current = job;
    setActiveJob(job);
    return true;
  };

  const finishActiveJob = (job: Exclude<ExamActiveJob, null>) => {
    if (activeJobRef.current !== job) return;

    activeJobRef.current = null;
    setActiveJob(null);
  };

  const switchActiveJob = (
    fromJob: Exclude<ExamActiveJob, null>,
    toJob: Exclude<ExamActiveJob, null>,
  ) => {
    if (activeJobRef.current !== fromJob) return false;

    activeJobRef.current = toJob;
    setActiveJob(toJob);
    return true;
  };

  const setDurationSeconds = (durationSeconds: number) => {
    updateSession((prev) => ({
      ...prev,
      durationSeconds,
    }));
  };

  const goToStage = (stage: ExamStage) => {
    updateSession((prev) => ({
      ...prev,
      stage,
    }));
  };

  const updateAnswer = (questionId: string, userAnswer: string) => {
    updateSession((prev) => ({
      ...prev,
      payload: {
        ...prev.payload,
        summary: null,
        items: prev.payload.items.map((item) =>
          item.id === questionId
            ? {
                ...item,
                userAnswer,
                isCorrect: null,
                score: null,
                feedback: '',
              }
            : item,
        ),
      },
    }));
  };

  const loadQuestionPaper = async (file?: File) => {
    if (!file) return;

    if (!startActiveJob('questions')) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('PDF files only for this test system.');
      finishActiveJob('questions');
      return;
    }

    setError(null);

    try {
      const rawText = normalizeExtractedText(await readFileAsText(file));

      setFiles((prev) => ({
        ...prev,
        questionPaperName: file.name,
        questionPaperRaw: rawText,
      }));

      switchActiveJob('questions', 'structuring');

      const structured = await structureCoreTestFromPdf(
        language,
        rawText,
        filesRef.current.markSchemeRaw.trim()
          ? filesRef.current.markSchemeRaw
          : null,
        encryptedApiKey,
      );

      updateSession((prev) => ({
        ...prev,
        stage: 'setup',
        status: 'idle',
        startedAt: undefined,
        submittedAt: undefined,
        endTimestamp: undefined,
        activeQuestionIndex: 0,
        activeInfoPartId: structured.parts?.find((part) => part.info.trim())?.id ?? null,
        flaggedQuestionIds: [],
        payload: structured,
      }));
    } catch (uploadError) {
      console.error(uploadError);
      setError('Failed to read or structure the question paper PDF.');
    } finally {
      finishActiveJob('structuring');
    }
  };

  const loadMarkScheme = async (file?: File) => {
    if (!file) return;

    if (!startActiveJob('markscheme')) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('PDF files only for this test system.');
      finishActiveJob('markscheme');
      return;
    }

    setError(null);

    try {
      const rawText = normalizeExtractedText(await readFileAsText(file));

      setFiles((prev) => ({
        ...prev,
        markSchemeName: file.name,
        markSchemeRaw: rawText,
      }));

      if (!filesRef.current.questionPaperRaw.trim()) {
        finishActiveJob('markscheme');
        return;
      }

      const answerMap = await enrichCoreTestCorrectAnswers(
        language,
        sessionRef.current.payload,
        filesRef.current.questionPaperRaw,
        rawText,
        encryptedApiKey,
      );

      updateSession((prev) => ({
        ...prev,
        payload: {
          ...prev.payload,
          items: prev.payload.items.map((item) => ({
            ...item,
            correctAnswer: answerMap[item.id] ?? item.correctAnswer,
          })),
        },
      }));
    } catch (uploadError) {
      console.error(uploadError);
      setError('Failed to read or enrich correct answers from the mark scheme PDF.');
    } finally {
      finishActiveJob('markscheme');
    }
  };

  const startExam = () => {
    const startedAt = Date.now();

    updateSession((prev) => ({
      ...prev,
      stage: 'runtime',
      status: 'active',
      startedAt,
      submittedAt: undefined,
      endTimestamp: startedAt + prev.durationSeconds * 1000,
      activeQuestionIndex: 0,
      activeInfoPartId: prev.payload.parts?.find((part) => part.info.trim())?.id ?? null,
      flaggedQuestionIds: [],
      payload: resetPayloadForAttempt(prev.payload),
    }));
  };

  const submitExam = async () => {
    const currentSession = sessionRef.current;
    const currentFiles = filesRef.current;

    if (!currentSession.payload.items.length) {
      setError('No structured questions are available to grade.');
      return;
    }

    const answeredCount = currentSession.payload.items.filter((item) =>
      item.userAnswer.trim(),
    ).length;

    if (answeredCount === 0) {
      updateSession((prev) => ({
        ...prev,
        stage: 'results',
        status: 'graded',
        submittedAt: Date.now(),
        payload: buildUnansweredSubmissionPayload(prev.payload, gradingStyle, language),
      }));
      return;
    }

    setError(null);
    setActiveJob('grading');
    updateSession((prev) => ({
      ...prev,
      status: 'submitting',
    }));

    try {
      const gradedPayload = await gradeCoreTestPayload(
        language,
        currentSession.payload,
        currentFiles.questionPaperRaw,
        currentFiles.markSchemeRaw.trim()
          ? currentFiles.markSchemeRaw
          : null,
        gradingStyle,
        encryptedApiKey,
      );

      updateSession((prev) => ({
        ...prev,
        stage: 'results',
        status: 'graded',
        submittedAt: Date.now(),
        payload: gradedPayload,
      }));
    } catch (gradingError) {
      console.error(gradingError);
      setError('Failed to grade the exam submission.');
      updateSession((prev) => ({
        ...prev,
        status: prev.stage === 'runtime' ? 'active' : 'idle',
      }));
    } finally {
      setActiveJob(null);
    }
  };

  const retryLastFailedAction = async () => {
    const currentError = error;
    const currentFiles = filesRef.current;
    const currentSession = sessionRef.current;

    if (!currentError) return;

    if (
      currentError.includes('structure the question paper') &&
      currentFiles.questionPaperRaw.trim()
    ) {
      setError(null);
      setActiveJob('structuring');

      try {
        const structured = await structureCoreTestFromPdf(
          language,
          currentFiles.questionPaperRaw,
          currentFiles.markSchemeRaw.trim()
            ? currentFiles.markSchemeRaw
            : null,
          encryptedApiKey,
        );

        updateSession((prev) => ({
          ...prev,
          stage: 'setup',
          status: 'idle',
          startedAt: undefined,
          submittedAt: undefined,
          endTimestamp: undefined,
          activeQuestionIndex: 0,
          activeInfoPartId: structured.parts?.find((part) => part.info.trim())?.id ?? null,
          flaggedQuestionIds: [],
          payload: mergeUserAnswers(structured, prev.payload),
        }));
      } catch (retryError) {
        console.error(retryError);
        setError('Failed to read or structure the question paper PDF.');
      } finally {
        setActiveJob(null);
      }
      return;
    }

    if (
      currentError.includes('enrich correct answers') &&
      currentFiles.questionPaperRaw.trim() &&
      currentFiles.markSchemeRaw.trim()
    ) {
      setError(null);
      setActiveJob('markscheme');

      try {
        const answerMap = await enrichCoreTestCorrectAnswers(
          language,
          currentSession.payload,
          currentFiles.questionPaperRaw,
          currentFiles.markSchemeRaw,
          encryptedApiKey,
        );

        updateSession((prev) => ({
          ...prev,
          payload: {
            ...prev.payload,
            items: prev.payload.items.map((item) => ({
              ...item,
              correctAnswer: answerMap[item.id] ?? item.correctAnswer,
            })),
          },
        }));
      } catch (retryError) {
        console.error(retryError);
        setError('Failed to read or enrich correct answers from the mark scheme PDF.');
      } finally {
        setActiveJob(null);
      }
      return;
    }

    if (currentError.includes('grade the exam submission')) {
      await submitExam();
      return;
    }

    if (currentError.includes('No structured questions')) {
      updateSession((prev) => ({
        ...prev,
        stage: 'setup',
        status: 'idle',
      }));
    }

    setError(null);
  };

  const redoExam = () => {
    updateSession((prev) => ({
      ...prev,
      stage: 'setup',
      status: 'idle',
      startedAt: undefined,
      submittedAt: undefined,
      endTimestamp: undefined,
      activeQuestionIndex: 0,
      activeInfoPartId: prev.payload.parts?.find((part) => part.info.trim())?.id ?? null,
      flaggedQuestionIds: [],
      payload: resetPayloadForAttempt(prev.payload),
    }));
  };

  const clearSession = () => {
    setSession(createDefaultSession());
    setFiles(createDefaultFiles());
    setHelpLevel('general');
    setGradingStyle('default');
    setActiveJob(null);
    setError(null);

    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  return {
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
  };
};

export default useExamSession;
