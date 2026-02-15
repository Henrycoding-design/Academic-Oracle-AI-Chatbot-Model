import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import { saveAs } from "file-saver";

export const createSummaryDoc = async (data: any) => {
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

          new Paragraph(""),

          ...data.topics.flatMap((t: any) => [
            new Paragraph({
              text: t.title,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 },
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Completion: ", bold: true }),
                new TextRun(t.completion),
              ],
            }),

            // Quiz Results Section
            ...(t.quiz_results?.length > 0 
              ? [
                  new Paragraph({ text: "Quiz Performance:", heading: HeadingLevel.HEADING_2 }),
                  ...t.quiz_results.map((q: string) => new Paragraph({ text: `✓ ${q}`, bullet: { level: 0 } }))
                ] 
              : []),

            // Formulas Section
            ...(t.formulas?.length > 0 
              ? [
                  new Paragraph({ text: "Formulas:", heading: HeadingLevel.HEADING_2 }),
                  ...t.formulas.map((f: string) => new Paragraph({ text: f, bullet: { level: 0 } }))
                ] 
              : []),

            // Theories Section
            ...(t.theories?.length > 0 
              ? [
                  new Paragraph({ text: "Theories:", heading: HeadingLevel.HEADING_2 }),
                  ...t.theories.map((th: string) => new Paragraph({ text: th, bullet: { level: 0 } }))
                ] 
              : []),

            // Key Points Section
            ...(t.key_points?.length > 0 
              ? [
                  new Paragraph({ text: "Key Takeaways:", heading: HeadingLevel.HEADING_2 }),
                  ...t.key_points.map((kp: string) => new Paragraph({ text: kp, bullet: { level: 0 } }))
                ] 
              : []),
          ]),

          new Paragraph(""),
          new Paragraph({
            border: { top: { color: "auto", space: 1, style: "single", size: 6 } },
            children: [
              new TextRun({ text: "Overall Summary: ", bold: true }),
              new TextRun(data.overall_completion),
            ],
            spacing: { before: 400 },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `Academic_Oracle_Learning_Summary_${data.profile?.name ?? "Student"}.docx`);
};
