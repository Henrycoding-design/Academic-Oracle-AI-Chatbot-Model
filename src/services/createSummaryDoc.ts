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

import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { saveAs } from "file-saver";
import { LANGUAGE_DATA, type AppLanguage } from '../lang/Language';

export const createSummaryDoc = async (data: any, language: AppLanguage) => {
  const lang = LANGUAGE_DATA[language].ui.dashboard;
  const examLang = LANGUAGE_DATA[language].ui.exam;

  const metricLine = (label: string, value: string | number | boolean) =>
    new Paragraph({
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun(String(value)),
      ],
    });

  const bulletSection = (title: string, items: string[]) =>
    items.length > 0
      ? [
          new Paragraph({ text: title, heading: HeadingLevel.HEADING_2 }),
          ...items.map((item: string) => new Paragraph({ text: item, bullet: { level: 0 } })),
        ]
      : [];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: lang.reportDocTitle,
            heading: HeadingLevel.TITLE,
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `${lang.name}: `, bold: true }),
              new TextRun(`${data.profile?.name ?? lang.defaultStudentName}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${lang.reportLevel}: `, bold: true }),
              new TextRun(`${data.profile?.level ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${lang.reportFocus}: `, bold: true }),
              new TextRun(`${data.profile?.focus ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${lang.confidenceLevel}: `, bold: true }),
              new TextRun(`${data.profile?.confidence_level ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${lang.reportCognitionLevel}: `, bold: true }),
              new TextRun(`${data.profile?.level_of_cognition ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${lang.reportInterests}: `, bold: true }),
              new TextRun(
                Array.isArray(data.profile?.interests) && data.profile.interests.length > 0
                  ? data.profile.interests.join(", ")
                  : "N/A"
              ),
            ],
          }),

          new Paragraph(""),
          new Paragraph({
            text: lang.reportSessionOverview,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300 },
          }),
          metricLine(lang.currentTopic, data.session_overview?.current_topic ?? "N/A"),
          metricLine(lang.reportTopicsCovered, data.session_overview?.topics_covered ?? 0),
          metricLine(lang.topicsMastered, data.session_overview?.topics_mastered ?? 0),
          metricLine(lang.quizzesDone, data.session_overview?.quizzes_completed ?? 0),
          metricLine(lang.reportOverallAccuracy, data.session_overview?.overall_accuracy ?? "N/A"),
          metricLine(lang.learningEfficiency, data.session_overview?.learning_efficiency ?? "N/A"),
          metricLine(lang.recommendedNextFocus, data.session_overview?.recommended_next_focus ?? "N/A"),

          new Paragraph(""),
          new Paragraph({
            text: lang.reportAdaptiveInsights,
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300 },
          }),
          metricLine(lang.reportStudyStyle, data.adaptive_insights?.study_style ?? "N/A"),
          metricLine(lang.reportToneRecommendation, data.adaptive_insights?.tone_recommendation ?? "N/A"),
          metricLine(
            lang.reportQuestionStyleRecommendation,
            data.adaptive_insights?.question_style_recommendation ?? "N/A"
          ),
          ...bulletSection(lang.strengths, data.adaptive_insights?.strengths ?? []),
          ...bulletSection(lang.weaknesses, data.adaptive_insights?.weaknesses ?? []),

          ...data.topics.flatMap((t: any) => [
            new Paragraph({
              text: t.title,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 },
            }),

            metricLine(lang.reportTopicTag, t.topic_tag ?? t.title),
            metricLine(lang.reportCompletion, t.completion),
            metricLine(lang.reportMastered, t.mastered ? examLang.yes : examLang.no),
            metricLine(lang.confidenceLevel, t.confidence_level ?? "N/A"),
            metricLine(lang.currentAccuracy, t.accuracy ?? "N/A"),
            metricLine(lang.quizzesDone, t.quizzes_done ?? 0),
            metricLine(lang.reportQuestionStyleRecommendation, t.recommended_question_style ?? "mixed"),
            metricLine(lang.reportNeedsFeynman, t.needs_feynman ? examLang.yes : examLang.no),

            ...bulletSection(lang.reportMistakeLog, t.mistake_log ?? []),
            ...bulletSection(lang.reportQuizPerformance, t.quiz_results ?? []),
            ...bulletSection(lang.reportFormulas, t.formulas ?? []),
            ...bulletSection(lang.reportTheories, t.theories ?? []),
            ...bulletSection(lang.reportKeyTakeaways, t.key_points ?? []),
            ...bulletSection(lang.reportPracticalApplications, t.practical_applications ?? []),
            ...bulletSection(lang.recommendedNextFocus, t.recommended_next_focus ?? []),
          ]),

          new Paragraph(""),
          new Paragraph({
            border: { top: { color: "auto", space: 1, style: "single", size: 6 } },
            children: [
              new TextRun({ text: `${lang.reportOverallSummary}: `, bold: true }),
              new TextRun(data.overall_summary ?? data.overall_completion),
            ],
            spacing: { before: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${lang.reportOverallCompletion}: `, bold: true }),
              new TextRun(data.overall_completion),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Academic_Oracle_Learning_Summary_${data.profile?.name ?? lang.defaultStudentName}.docx`);
};
