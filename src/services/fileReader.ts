import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";


pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

async function readPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((i: any) => i.str).join(" ") + "\n";
  }

  return text.trim();
}


async function readDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.trim();
}


async function readImage(file: File): Promise<string> {
  const { data } = await Tesseract.recognize(file, "eng");
  return data.text.trim();
}

export async function readFileAsText(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (!ext) throw new Error("Unknown file type");

  switch (ext) {
    case "txt":
      return await file.text();

    case "pdf":
      return await readPdf(file);

    case "docx":
      return await readDocx(file);

    case "png":
    case "jpg":
    case "jpeg":
      return await readImage(file);

    default:
      throw new Error("Unsupported file type");
  }
}