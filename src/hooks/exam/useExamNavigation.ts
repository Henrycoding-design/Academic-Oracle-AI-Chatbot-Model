import { useMemo } from 'react';
import type { CoreTestItem } from '../../types';
import type { ExamSession, UpdateExamSession } from './useExamSession';
import { buildExamRuntimeEntries, type CoreTestRuntimeEntry } from './examRuntimeEntries';

type NavigationHook = {
  entries: CoreTestRuntimeEntry[];
  activeEntryIndex: number;
  currentEntry: CoreTestRuntimeEntry | null;
  currentQuestion: CoreTestItem | null;
  goNext: () => void;
  goPrevious: () => void;
  goToEntry: (index: number) => void;
  toggleFlag: (questionId: string) => void;
  isAnswered: (questionId: string) => boolean;
  isFlagged: (questionId: string) => boolean;
  isCurrentEntry: (entry: CoreTestRuntimeEntry) => boolean;
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

  const entries = useMemo(
    () => buildExamRuntimeEntries(session.payload),
    [session.payload],
  );

  const activeEntryIndex = useMemo(() => {
    if (session.activeInfoPartId) {
      const infoIndex = entries.findIndex(
        (entry) => entry.type === 'info' && entry.partId === session.activeInfoPartId,
      );
      if (infoIndex >= 0) return infoIndex;
    }

    const activeItem = session.payload.items[session.activeQuestionIndex];
    const questionIndex = entries.findIndex(
      (entry) => entry.type === 'question' && entry.item.id === activeItem?.id,
    );

    return Math.max(questionIndex, 0);
  }, [entries, session.activeInfoPartId, session.activeQuestionIndex, session.payload.items]);

  const currentEntry = entries[activeEntryIndex] ?? null;
  const currentQuestion = currentEntry?.type === 'question' ? currentEntry.item : null;

  const applyEntry = (entry: CoreTestRuntimeEntry) => {
    updateSession((prev) => ({
      ...prev,
      activeInfoPartId: entry.type === 'info' ? entry.partId : null,
      activeQuestionIndex: entry.type === 'question' ? entry.itemIndex : prev.activeQuestionIndex,
    }));
  };

  const goNext = () => {
    const nextEntry = entries[Math.min(entries.length - 1, activeEntryIndex + 1)];
    if (nextEntry) applyEntry(nextEntry);
  };

  const goPrevious = () => {
    const previousEntry = entries[Math.max(0, activeEntryIndex - 1)];
    if (previousEntry) applyEntry(previousEntry);
  };

  const goToEntry = (index: number) => {
    const entry = entries[Math.min(Math.max(index, 0), Math.max(entries.length - 1, 0))];
    if (entry) applyEntry(entry);
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

  const isCurrentEntry = (entry: CoreTestRuntimeEntry) =>
    currentEntry?.type === entry.type && currentEntry.id === entry.id;

  return {
    entries,
    activeEntryIndex,
    currentEntry,
    currentQuestion,
    goNext,
    goPrevious,
    goToEntry,
    toggleFlag,
    isAnswered,
    isFlagged,
    isCurrentEntry,
  };
};

export default useExamNavigation;
