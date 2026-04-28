import { useMemo } from 'react';
import type { CoreTestItem } from '../../types';
import type { ExamSession, UpdateExamSession } from './useExamSession';

type NavigationHook = {
  goNext: () => void;
  goPrevious: () => void;
  goToQuestion: (index: number) => void;
  toggleFlag: (questionId: string) => void;
  isAnswered: (questionId: string) => boolean;
  isFlagged: (questionId: string) => boolean;
  isCurrent: (questionId: string) => boolean;
};

export const useExamNavigation = (
  session: ExamSession,
  updateSession: UpdateExamSession,
): NavigationHook => {
  const itemMap = useMemo(() => {
    return new Map<string, CoreTestItem>(
      session.payload.items.map((item) => [item.id, item]),
    );
  }, [session.payload.items]);

  const goNext = () => {
    updateSession((prev) => ({
      ...prev,
      activeQuestionIndex: Math.min(
        prev.payload.items.length - 1,
        prev.activeQuestionIndex + 1,
      ),
    }));
  };

  const goPrevious = () => {
    updateSession((prev) => ({
      ...prev,
      activeQuestionIndex: Math.max(0, prev.activeQuestionIndex - 1),
    }));
  };

  const goToQuestion = (index: number) => {
    updateSession((prev) => ({
      ...prev,
      activeQuestionIndex: Math.min(
        Math.max(index, 0),
        Math.max(prev.payload.items.length - 1, 0),
      ),
    }));
  };

  const toggleFlag = (questionId: string) => {
    updateSession((prev) => {
      const flagged = prev.flaggedQuestionIds.includes(questionId)
        ? prev.flaggedQuestionIds.filter((id) => id !== questionId)
        : [...prev.flaggedQuestionIds, questionId];

      return {
        ...prev,
        flaggedQuestionIds: flagged,
      };
    });
  };

  const isAnswered = (questionId: string) => {
    const item = itemMap.get(questionId);
    return Boolean(item?.userAnswer?.trim());
  };

  const isFlagged = (questionId: string) =>
    session.flaggedQuestionIds.includes(questionId);

  const isCurrent = (questionId: string) =>
    session.payload.items[session.activeQuestionIndex]?.id === questionId;

  return {
    goNext,
    goPrevious,
    goToQuestion,
    toggleFlag,
    isAnswered,
    isFlagged,
    isCurrent,
  };
};

export default useExamNavigation;
