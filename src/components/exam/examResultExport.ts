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

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import type { CoreTestPayload } from '../../types';
import { LANGUAGE_DATA, type AppLanguage } from '../../lang/Language';

type ExportExamResultOptions = {
  payload: CoreTestPayload;
  score: number;
  total: number;
  percentage: number;
  estimatedGrade: string;
  gradingStyleLabel: string;
  summary: string;
  language: AppLanguage;
};

const stripMarkdown = (value: string) =>
  value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .trim();

const metricLine = (label: string, value: string | number) =>
  new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(String(value)),
    ],
  });

const bodyLine = (label: string, value: string) =>
  new Paragraph({
    spacing: { before: 120 },
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun(value || 'N/A'),
    ],
  });

const safeFileName = (value: string) =>
  value
    .replace(/[^a-z0-9_\- ]/gi, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'Exam_Result';

export const exportExamResultDocx = async ({
  payload,
  score,
  total,
  percentage,
  estimatedGrade,
  gradingStyleLabel,
  summary,
  language,
}: ExportExamResultOptions) => {
  const lang = LANGUAGE_DATA[language].ui.exam;

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: lang.reportTitle,
            heading: HeadingLevel.TITLE,
          }),
          metricLine(lang.reportTitle, payload.title || 'Professional Exam Runtime'),
          metricLine(lang.score, `${score}/${total}`),
          metricLine(lang.percentage, `${percentage}%`),
          metricLine(lang.estimatedGrade, estimatedGrade),
          metricLine(LANGUAGE_DATA[language].ui.examSetup.gradingStyleLabel, gradingStyleLabel),
          metricLine(lang.reportUsedMarkScheme, payload.summary?.usedMarkScheme ? lang.yes : lang.no),
          new Paragraph({
            text: lang.reportAnalyticsSummary,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 320 },
          }),
          new Paragraph(summary),
          ...payload.items.flatMap((item) => [
            new Paragraph({
              text: `${lang.reportQuestion} ${item.questionNumber}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 420 },
            }),
            metricLine(lang.score, `${item.score ?? 0}/${item.maxScore ?? 1}`),
            bodyLine(lang.reportQuestion, stripMarkdown(item.prompt)),
            bodyLine(lang.yourAnswer, item.userAnswer || lang.noAnswerSubmitted),
            bodyLine(
              lang.correctAnswer,
              item.correctAnswer || item.markScheme || lang.noOfficialAnswer,
            ),
            bodyLine(lang.feedback, item.feedback || lang.noAdditionalFeedback),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFileName(payload.title)}_Result.docx`);
};
