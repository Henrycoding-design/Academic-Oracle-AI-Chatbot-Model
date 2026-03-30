import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { saveAs } from "file-saver";

export const createSummaryDoc = async (data: any) => {
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
            text: "Academic Oracle — Session Summary",
            heading: HeadingLevel.TITLE,
          }),

          new Paragraph({
            children: [
              new TextRun({ text: `Name: `, bold: true }),
              new TextRun(`${data.profile?.name ?? "Student"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Level: `, bold: true }),
              new TextRun(`${data.profile?.level ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Focus: `, bold: true }),
              new TextRun(`${data.profile?.focus ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Confidence: `, bold: true }),
              new TextRun(`${data.profile?.confidence_level ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Cognition Level: `, bold: true }),
              new TextRun(`${data.profile?.level_of_cognition ?? "N/A"}`),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `Interests: `, bold: true }),
              new TextRun(
                Array.isArray(data.profile?.interests) && data.profile.interests.length > 0
                  ? data.profile.interests.join(", ")
                  : "N/A"
              ),
            ],
          }),

          new Paragraph(""),
          new Paragraph({
            text: "Session Overview",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300 },
          }),
          metricLine("Current Topic", data.session_overview?.current_topic ?? "N/A"),
          metricLine("Topics Covered", data.session_overview?.topics_covered ?? 0),
          metricLine("Topics Mastered", data.session_overview?.topics_mastered ?? 0),
          metricLine("Quizzes Completed", data.session_overview?.quizzes_completed ?? 0),
          metricLine("Overall Accuracy", data.session_overview?.overall_accuracy ?? "N/A"),
          metricLine("Learning Efficiency", data.session_overview?.learning_efficiency ?? "N/A"),
          metricLine("Recommended Next Focus", data.session_overview?.recommended_next_focus ?? "N/A"),

          new Paragraph(""),
          new Paragraph({
            text: "Adaptive Insights",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300 },
          }),
          metricLine("Study Style", data.adaptive_insights?.study_style ?? "N/A"),
          metricLine("Tone Recommendation", data.adaptive_insights?.tone_recommendation ?? "N/A"),
          metricLine(
            "Question Style Recommendation",
            data.adaptive_insights?.question_style_recommendation ?? "N/A"
          ),
          ...bulletSection("Strengths", data.adaptive_insights?.strengths ?? []),
          ...bulletSection("Weaknesses", data.adaptive_insights?.weaknesses ?? []),

          ...data.topics.flatMap((t: any) => [
            new Paragraph({
              text: t.title,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 },
            }),

            metricLine("Topic Tag", t.topic_tag ?? t.title),
            metricLine("Completion", t.completion),
            metricLine("Mastered", t.mastered ? "Yes" : "No"),
            metricLine("Confidence", t.confidence_level ?? "N/A"),
            metricLine("Accuracy", t.accuracy ?? "N/A"),
            metricLine("Quizzes Done", t.quizzes_done ?? 0),
            metricLine("Recommended Question Style", t.recommended_question_style ?? "mixed"),
            metricLine("Needs Feynman Reinforcement", t.needs_feynman ? "Yes" : "No"),

            ...bulletSection("Mistake Log", t.mistake_log ?? []),
            ...bulletSection("Quiz Performance", t.quiz_results ?? []),
            ...bulletSection("Formulas", t.formulas ?? []),
            ...bulletSection("Theories", t.theories ?? []),
            ...bulletSection("Key Takeaways", t.key_points ?? []),
            ...bulletSection("Practical Applications", t.practical_applications ?? []),
            ...bulletSection("Recommended Next Focus", t.recommended_next_focus ?? []),
          ]),

          new Paragraph(""),
          new Paragraph({
            border: { top: { color: "auto", space: 1, style: "single", size: 6 } },
            children: [
              new TextRun({ text: "Overall Summary: ", bold: true }),
              new TextRun(data.overall_summary ?? data.overall_completion),
            ],
            spacing: { before: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Overall Completion: ", bold: true }),
              new TextRun(data.overall_completion),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Academic_Oracle_Learning_Summary_${data.profile?.name ?? "Student"}.docx`);
};
