import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";
import type { AttachmentMeta, Message } from "../types";
import { AppLanguage } from "../lang/Language";

export type ExportType = "docx" | "md";
export type ExportResult = { status: "ok" } | { status: "error"; error: string };

// ---------- helpers ----------

const roleLabel = (role: Message["role"]) => (role === "user" ? "You" : "Academic Oracle");

function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function describeAttachment(a: AttachmentMeta): string {
  const details = [a.type, formatSize(a.size)].filter(Boolean).join(", ");
  return details ? `${a.name} (${details})` : a.name;
}

/** Collect single + multiple attachments into one de-duplicated list of labels. */
function attachmentLabels(m: Message): string[] {
  const all = [...(m.attachment ? [m.attachment] : []), ...(m.attachments ?? [])];
  const seen = new Set<string>();
  const labels: string[] = [];
  for (const a of all) {
    const key = `${a.name}|${a.size}`;
    if (seen.has(key)) continue;
    seen.add(key);
    labels.push(describeAttachment(a));
  }
  return labels;
}

/** The action + quoted text the user selected when sending the message, if any. */
function selectionInfo(m: Message): { label: string; text: string } | null {
  const s = m.selectionContext;
  if (!s || !s.selectionText?.trim()) return null;
  return { label: s.actionLabel, text: s.selectionText };
}

function modeTags(m: Message): string {
  const tags: string[] = [];
  if (m.isDeepMode) tags.push("Deep mode");
  if (m.isWebSearch) tags.push("Web search");
  return tags.join(", ");
}

// ---------- markdown ----------

export function buildMarkdown(messages: Message[]): string {
  return messages
    .map((m) => {
      const parts: string[] = [`## ${roleLabel(m.role)}`];

      const tags = modeTags(m);
      if (tags) parts.push(`*${tags}*`);

      const sel = selectionInfo(m);
      if (sel) {
        const quoted = sel.text.split("\n").map((l) => `> ${l}`).join("\n");
        parts.push(`**${sel.label}:**\n\n${quoted}`);
      }

      const files = attachmentLabels(m);
      if (files.length) parts.push(files.map((f) => `📎 ${f}`).join("  \n"));

      parts.push(m.content);
      return parts.join("\n\n");
    })
    .join("\n\n---\n\n");
}

/** Copies the conversation as markdown to the clipboard. */
export async function exportToMarkdown(messages: Message[]): Promise<ExportResult> {
  try {
    await navigator.clipboard.writeText(buildMarkdown(messages));
    return { status: "ok" };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

// ---------- docx ----------

/** Turns **bold**, *italic* and `code` into TextRuns. */
function inlineRuns(text: string, base: { bold?: boolean; italics?: boolean } = {}): TextRun[] {
  const runs: TextRun[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let last = 0;
  for (const match of text.matchAll(re)) {
    const idx = match.index ?? 0;
    if (idx > last) runs.push(new TextRun({ text: text.slice(last, idx), ...base }));
    const tok = match[0];
    if (tok.startsWith("**")) runs.push(new TextRun({ text: tok.slice(2, -2), ...base, bold: true }));
    else if (tok.startsWith("`")) runs.push(new TextRun({ text: tok.slice(1, -1), font: "Consolas", shading: { fill: "EEEEEE" } }));
    else runs.push(new TextRun({ text: tok.slice(1, -1), ...base, italics: true }));
    last = idx + tok.length;
  }
  if (last < text.length) runs.push(new TextRun({ text: text.slice(last), ...base }));
  return runs.length ? runs : [new TextRun({ text, ...base })];
}

const HEADINGS = [
  HeadingLevel.HEADING_3,
  HeadingLevel.HEADING_3,
  HeadingLevel.HEADING_3,
  HeadingLevel.HEADING_4,
  HeadingLevel.HEADING_5,
  HeadingLevel.HEADING_6,
];

/** Minimal markdown -> docx paragraphs (headings, lists, code blocks, quotes, inline styles). */
function markdownToParagraphs(md: string): Paragraph[] {
  const out: Paragraph[] = [];
  const lines = md.split("\n");
  let inCode = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      out.push(
        new Paragraph({
          children: [new TextRun({ text: line || " ", font: "Consolas", size: 20 })],
          shading: { fill: "F4F4F4" },
        })
      );
      continue;
    }
    if (!line.trim()) continue;

    const h = line.match(/^(#{1,6})\s+(.*)/);
    if (h) {
      out.push(new Paragraph({ heading: HEADINGS[h[1].length - 1], children: inlineRuns(h[2]) }));
      continue;
    }
    const bullet = line.match(/^(\s*)[-*+]\s+(.*)/);
    if (bullet) {
      out.push(
        new Paragraph({
          bullet: { level: Math.min(Math.floor(bullet[1].length / 2), 8) },
          children: inlineRuns(bullet[2]),
        })
      );
      continue;
    }
    const num = line.match(/^(\s*)(\d+)[.)]\s+(.*)/);
    if (num) {
      out.push(
        new Paragraph({
          indent: { left: 720 + Math.floor(num[1].length / 2) * 360, hanging: 360 },
          children: inlineRuns(`${num[2]}. ${num[3]}`),
        })
      );
      continue;
    }
    const quote = line.match(/^>\s?(.*)/);
    if (quote) {
      out.push(
        new Paragraph({
          indent: { left: 360 },
          border: { left: { style: "single", size: 12, color: "AAAAAA", space: 8 } },
          children: inlineRuns(quote[1], { italics: true }),
        })
      );
      continue;
    }
    out.push(new Paragraph({ spacing: { after: 120 }, children: inlineRuns(line) }));
  }
  return out;
}

export function buildDocx(messages: Message[]): Document {
  const children: Paragraph[] = [];

  messages.forEach((m, i) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: i === 0 ? 0 : 360 },
        children: [new TextRun({ text: roleLabel(m.role) })],
      })
    );

    const tags = modeTags(m);
    if (tags) {
      children.push(new Paragraph({ children: [new TextRun({ text: tags, italics: true, color: "777777", size: 18 })] }));
    }

    const sel = selectionInfo(m);
    if (sel) {
      children.push(new Paragraph({ children: [new TextRun({ text: `${sel.label}:`, bold: true })] }));
      children.push(...markdownToParagraphs(sel.text.split("\n").map((l) => `> ${l}`).join("\n")));
    }

    for (const f of attachmentLabels(m)) {
      children.push(new Paragraph({ children: [new TextRun({ text: `📎 ${f}`, color: "555555" })] }));
    }

    children.push(...markdownToParagraphs(m.content));
  });

  return new Document({ sections: [{ children }] });
}

/** Builds a .docx of the conversation and triggers a download. */
export async function exportToDocx(
  messages: Message[],
  fileName: string
): Promise<ExportResult> {
  try {
    const blob = await Packer.toBlob(buildDocx(messages));
    saveAs(blob, fileName);
    return { status: "ok" };
  } catch (e) {
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

// ---------- single entry point ----------

export function exportMessages(messages: Message[], type: ExportType, fileName: string): Promise<ExportResult> {
  return type === "md" ? exportToMarkdown(messages) : exportToDocx(messages, fileName);
}
