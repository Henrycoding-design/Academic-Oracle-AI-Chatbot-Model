import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ExamSession, UpdateExamSession } from './useExamSession';

type ExamTimerOptions = {
  session: ExamSession;
  updateSession: UpdateExamSession;
  onAutoSubmit: () => void;
  onWarning: (message: string) => void;
  isViewActive?: boolean;
};

type ExamTimerState = {
  remainingMs: number;
  isPaused: boolean;
  isResumeModalOpen: boolean;
  acknowledgeResume: () => void;
};

const WARNING_THRESHOLDS = [
  { seconds: 600, label: '10 minutes remaining.' },
  { seconds: 300, label: '5 minutes remaining.' },
  { seconds: 60, label: '1 minute remaining.' },
];

export const useExamTimer = ({
  session,
  updateSession,
  onAutoSubmit,
  onWarning,
  isViewActive = true,
}: ExamTimerOptions): ExamTimerState => {
  const [now, setNow] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const pauseStartedAtRef = useRef<number | null>(null);
  const autoSubmittedRef = useRef(false);
  const warnedRef = useRef<Record<number, boolean>>({
    600: false,
    300: false,
    60: false,
  });

  const pauseExam = useCallback(() => {
    if (pauseStartedAtRef.current) return;

    pauseStartedAtRef.current = Date.now();
    setNow(Date.now());
    setIsPaused(true);
  }, []);

  const requestResumeAcknowledgement = useCallback(() => {
    if (pauseStartedAtRef.current) {
      setIsResumeModalOpen(true);
    }
  }, []);

  const remainingMs = useMemo(() => {
    if (!session.endTimestamp || session.stage !== 'runtime') {
      return 0;
    }

    return Math.max(0, session.endTimestamp - now);
  }, [now, session.endTimestamp, session.stage]);

  useEffect(() => {
    if (session.stage !== 'runtime' || session.status !== 'active') {
      setIsPaused(false);
      setIsResumeModalOpen(false);
      pauseStartedAtRef.current = null;
    }
  }, [session.stage, session.status]);

  useEffect(() => {
    warnedRef.current = {
      600: false,
      300: false,
      60: false,
    };
    autoSubmittedRef.current = false;
  }, [session.startedAt, session.endTimestamp]);

  useEffect(() => {
    if (
      session.stage !== 'runtime' ||
      session.status !== 'active' ||
      !session.endTimestamp ||
      isPaused
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isPaused, session.endTimestamp, session.stage, session.status]);

  useEffect(() => {
    if (session.stage !== 'runtime' || session.status !== 'active' || isPaused) {
      return;
    }

    for (const threshold of WARNING_THRESHOLDS) {
      if (
        remainingMs <= threshold.seconds * 1000 &&
        remainingMs > 0 &&
        !warnedRef.current[threshold.seconds]
      ) {
        warnedRef.current[threshold.seconds] = true;
        onWarning(threshold.label);
      }
    }
  }, [isPaused, onWarning, remainingMs, session.stage, session.status]);

  useEffect(() => {
    if (
      session.stage !== 'runtime' ||
      session.status !== 'active' ||
      isPaused ||
      remainingMs > 0 ||
      autoSubmittedRef.current
    ) {
      return;
    }

    autoSubmittedRef.current = true;
    onAutoSubmit();
  }, [isPaused, onAutoSubmit, remainingMs, session.stage, session.status]);

  useEffect(() => {
    if (session.stage !== 'runtime' || session.status !== 'active') {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        pauseExam();
        return;
      }

      if (document.visibilityState === 'visible') {
        requestResumeAcknowledgement();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pauseExam, requestResumeAcknowledgement, session.stage, session.status]);

  useEffect(() => {
    if (session.stage !== 'runtime' || session.status !== 'active') {
      return;
    }

    if (!isViewActive) {
      pauseExam();
      return;
    }

    if (document.visibilityState === 'visible') {
      requestResumeAcknowledgement();
    }
  }, [
    isViewActive,
    pauseExam,
    requestResumeAcknowledgement,
    session.stage,
    session.status,
  ]);

  const acknowledgeResume = () => {
    if (!pauseStartedAtRef.current) {
      setIsResumeModalOpen(false);
      setIsPaused(false);
      return;
    }

    const pausedDuration = Date.now() - pauseStartedAtRef.current;
    pauseStartedAtRef.current = null;

    updateSession((prev) => ({
      ...prev,
      endTimestamp: prev.endTimestamp
        ? prev.endTimestamp + pausedDuration
        : prev.endTimestamp,
    }));

    setNow(Date.now());
    setIsResumeModalOpen(false);
    setIsPaused(false);
  };

  return {
    remainingMs,
    isPaused,
    isResumeModalOpen,
    acknowledgeResume,
  };
};

export default useExamTimer;
