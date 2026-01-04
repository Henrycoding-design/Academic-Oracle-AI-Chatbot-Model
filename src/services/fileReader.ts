import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";


// pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

// async function readPdf(file: File): Promise<string> {
//   const buffer = await file.arrayBuffer();
//   const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

//   let text = "";

//   for (let i = 1; i <= pdf.numPages; i++) {
//     const page = await pdf.getPage(i);
//     const content = await page.getTextContent();
//     text += content.items.map((i: any) => i.str).join(" ") + "\n";
//   }

//   return text.trim();
// }
async function readPdf(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    
    // Load the document
    const loadingTask = pdfjsLib.getDocument({ 
      data: buffer,
      useSystemFonts: true // Helps with some encoding issues
    });
    
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      
      // Filter and join text items
      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");
        
      fullText += pageText + "\n";
    }

    const result = fullText.trim();
    
    if (result === "" && pdf.numPages > 0) {
      console.warn("PDF parsed but no text found. This might be a scanned document.");
    }

    return result;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Failed to read PDF content.");
  }
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
  console.log("Detected file extension:", ext);

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