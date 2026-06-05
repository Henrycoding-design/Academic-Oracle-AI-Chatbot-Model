import type { CoreTestItem, CoreTestPayload } from '../../types';

export type CoreTestRuntimeEntry =
  | {
      type: 'info';
      id: string;
      partId: string;
      partTitle: string;
      info: string;
      itemIndex: null;
    }
  | {
      type: 'question';
      id: string;
      partId: string | null;
      partTitle: string | null;
      item: CoreTestItem;
      itemIndex: number;
    };

export const buildExamRuntimeEntries = (
  payload: CoreTestPayload,
): CoreTestRuntimeEntry[] => {
  const entries: CoreTestRuntimeEntry[] = [];
  const renderedPartInfoIds = new Set<string>();

  // Map questionId to its corresponding part for quick lookup
  const questionToPart = new Map<string, (typeof payload.parts)[0]>();
  payload.parts?.forEach((part) => {
    part.questionIds.forEach((id) => {
      questionToPart.set(id, part);
    });
  });

  payload.items.forEach((item, index) => {
    const part = questionToPart.get(item.id);

    if (part) {
      // If the question belongs to a part, check if we need to render the part's info first
      const info = part.info.trim();
      if (info && !renderedPartInfoIds.has(part.id)) {
        entries.push({
          type: 'info',
          id: `info-${part.id}`,
          partId: part.id,
          partTitle: part.title,
          info,
          itemIndex: null,
        });
        renderedPartInfoIds.add(part.id);
      }

      entries.push({
        type: 'question',
        id: item.id,
        partId: part.id,
        partTitle: part.title,
        item,
        itemIndex: index,
      });
    } else {
      // Question does not belong to any part, render it at its original position
      entries.push({
        type: 'question',
        id: item.id,
        partId: null,
        partTitle: null,
        item,
        itemIndex: index,
      });
    }
  });

  return entries;
};

export const shouldShowExamPartHeaders = (payload: CoreTestPayload) =>
  (payload.parts?.length ?? 0) > 1;
