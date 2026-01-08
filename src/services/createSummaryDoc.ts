import { Document, Packer, Paragraph, HeadingLevel } from "docx";
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

          new Paragraph(`Name: ${data.profile?.name ?? "Student"}`),
          new Paragraph(`Level: ${data.profile?.level ?? "N/A"}`),
          new Paragraph(`Focus: ${data.profile?.focus ?? "N/A"}`),

          new Paragraph(""),

          ...data.topics.flatMap((t: any) => [
            new Paragraph({
              text: t.title,
              heading: HeadingLevel.HEADING_1,
            }),

            new Paragraph(`Completion: ${t.completion}`),

            new Paragraph("Formulas:"),
            ...t.formulas.map((f: string) => new Paragraph(`• ${f}`)),

            new Paragraph("Theories:"),
            ...t.theories.map((th: string) => new Paragraph(`• ${th}`)),

            new Paragraph("Key Points:"),
            ...t.key_points.map((kp: string) => new Paragraph(`• ${kp}`)),
          ]),

          new Paragraph(""),
          new Paragraph(`Overall Completion: ${data.overall_completion}`),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Academic_Oracle_Session_Summary.docx");
};
