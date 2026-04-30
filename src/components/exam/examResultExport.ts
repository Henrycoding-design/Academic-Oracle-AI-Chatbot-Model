import { Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import type { CoreTestPayload } from '../../types';

type ExportExamResultOptions = {
  payload: CoreTestPayload;
  score: number;
  total: number;
  percentage: number;
  estimatedGrade: string;
  gradingStyleLabel: string;
  summary: string;
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
}: ExportExamResultOptions) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Academic Oracle - Test Result',
            heading: HeadingLevel.TITLE,
          }),
          metricLine('Title', payload.title || 'Professional Exam Runtime'),
          metricLine('Score', `${score}/${total}`),
          metricLine('Percentage', `${percentage}%`),
          metricLine('Estimated Grade', estimatedGrade),
          metricLine('Grading Style', gradingStyleLabel),
          metricLine('Used Mark Scheme', payload.summary?.usedMarkScheme ? 'Yes' : 'No'),
          new Paragraph({
            text: 'Analytics Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 320 },
          }),
          new Paragraph(summary),
          ...payload.items.flatMap((item) => [
            new Paragraph({
              text: `Question ${item.questionNumber}`,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 420 },
            }),
            metricLine('Score', `${item.score ?? 0}/${item.maxScore ?? 1}`),
            bodyLine('Question', stripMarkdown(item.prompt)),
            bodyLine('Your Answer', item.userAnswer || 'No answer submitted.'),
            bodyLine(
              'Correct Answer',
              item.correctAnswer || item.markScheme || 'No official correct answer was available.',
            ),
            bodyLine('Feedback', item.feedback || 'No additional feedback.'),
          ]),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${safeFileName(payload.title)}_Result.docx`);
};
