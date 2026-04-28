import { useCallback, useEffect, useRef, useState } from 'react';
import type { AppLanguage } from '../../lang/Language';
import type { CoreTestPayload } from '../../types';
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
  flaggedQuestionIds: string[];
  payload: CoreTestPayload;
}

export type ExamHelpLevel = 'none' | 'standard' | 'guided';

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
  flaggedQuestionIds: [],
  payload: createEmptyPayload(),
});

const createDefaultFiles = (): ExamFilesState => ({
  questionPaperName: '',
  markSchemeName: '',
  questionPaperRaw: '',
  markSchemeRaw: '',
});

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
): CoreTestPayload => ({
  ...payload,
  summary: {
    correct: 0,
    total: payload.items.length,
    percentage: 0,
    usedMarkScheme: false,
  },
  items: payload.items.map((item) => ({
    ...item,
    isCorrect: false,
    score: 0,
    feedback: item.feedback || 'No answer was submitted for this question.',
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
    storedState?.helpLevel ?? 'standard',
  );
  const [activeJob, setActiveJob] = useState<ExamActiveJob>(
    storedState?.activeJob ?? null,
  );
  const [error, setError] = useState<string | null>(
    storedState?.error ?? null,
  );
  const sessionRef = useRef(session);
  const filesRef = useRef(files);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
      session,
      files,
      helpLevel,
      activeJob,
      error,
    }));
  }, [activeJob, error, files, helpLevel, session]);

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

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('PDF files only for this test system.');
      return;
    }

    setError(null);
    setActiveJob('questions');

    try {
      const rawText = normalizeExtractedText(await readFileAsText(file));

      setFiles((prev) => ({
        ...prev,
        questionPaperName: file.name,
        questionPaperRaw: rawText,
      }));

      setActiveJob('structuring');

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
        flaggedQuestionIds: [],
        payload: structured,
      }));
    } catch (uploadError) {
      console.error(uploadError);
      setError('Failed to read or structure the question paper PDF.');
    } finally {
      setActiveJob(null);
    }
  };

  const loadMarkScheme = async (file?: File) => {
    if (!file) return;

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError('PDF files only for this test system.');
      return;
    }

    setError(null);
    setActiveJob('markscheme');

    try {
      const rawText = normalizeExtractedText(await readFileAsText(file));

      setFiles((prev) => ({
        ...prev,
        markSchemeName: file.name,
        markSchemeRaw: rawText,
      }));

      if (!filesRef.current.questionPaperRaw.trim()) {
        setActiveJob(null);
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
      setActiveJob(null);
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
        payload: buildUnansweredSubmissionPayload(prev.payload),
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

  const redoExam = () => {
    updateSession((prev) => ({
      ...prev,
      stage: 'setup',
      status: 'idle',
      startedAt: undefined,
      submittedAt: undefined,
      endTimestamp: undefined,
      activeQuestionIndex: 0,
      flaggedQuestionIds: [],
      payload: resetPayloadForAttempt(prev.payload),
    }));
  };

  const clearSession = () => {
    setSession(createDefaultSession());
    setFiles(createDefaultFiles());
    setHelpLevel('standard');
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
  };
};

export default useExamSession;
