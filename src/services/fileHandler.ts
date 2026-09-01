import { readFileAsText } from "./fileReader";
import { GeminiModelFlag } from "./models";

export type ModelCapabilityId = GeminiModelFlag | "openrouter/free";

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // Base64
  };
}

export interface ModelCapabilities {
  pdf: boolean;
  image: boolean;
  video: boolean;
  audio: boolean;
}

export interface ModelCapabilityConfig {
  id: ModelCapabilityId;
  capabilities: ModelCapabilities;
}

export const MODEL_CAPABILITIES: Record<ModelCapabilityId, ModelCapabilities> = {
  swift: {
    pdf: true,
    image: true,
    video: true,
    audio: true,
  },
  core: {
    pdf: true,
    image: true,
    video: true,
    audio: true,
  },
  lite: {
    pdf: true,
    image: true,
    video: true,
    audio: true,
  },
  mini: {
    pdf: true,
    image: true,
    video: false,
    audio: true,
  },
  nano: {
    pdf: true,
    image: true,
    video: true,
    audio: true,
  },
  pro: {
    pdf: false,
    image: true,
    video: true,
    audio: true,
  },
  deep: {
    pdf: true,
    image: true,
    video: true,
    audio: true,
  },
  "openrouter/free": {
    pdf: false,
    image: false,
    video: false,
    audio: false,
  },
};

export const MODEL_CAPABILITY_CONFIGS: ModelCapabilityConfig[] = (
  Object.entries(MODEL_CAPABILITIES) as [ModelCapabilityId, ModelCapabilities][]
).map(([id, capabilities]) => ({
  id,
  capabilities,
}));

export function getModelCapabilities(modelId: string): ModelCapabilities {
  return (
    MODEL_CAPABILITIES[modelId] || {
      pdf: false,
      image: false,
      video: false,
      audio: false,
    }
  );
}

export const SIZE_100_MB = 100 * 1024 * 1024;
export const SIZE_50_MB = 50 * 1024 * 1024;

// Simple Base64 converter utility
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64String = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Routes the uploaded file to either native Gemini Base64 inline payload
 * or falls back to local text extraction based on model capabilities and limits.
 */
export async function processFileForGemini(
  file: File,
  modelId?: string
): Promise<GeminiPart> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const capabilities = modelId
    ? getModelCapabilities(modelId)
    : { pdf: true, image: true, video: true, audio: false };

  // Rule 1: Text-based extensions never need Base64 serialization or fallback parser
  if (["txt", "md", "csv", "json"].includes(ext)) {
    return { text: await file.text() };
  }

  // Rule 2: Non-native files (like .docx) always go through your mammoth fallback parser
  if (ext === "docx") {
    const extractedText = await readFileAsText(file);
    return { text: extractedText };
  }

  // Rule 3: Native Image formats check size limits and model capabilities
  if (["png", "jpg", "jpeg", "webp"].includes(ext)) {
    if (capabilities.image && file.size < SIZE_100_MB) {
      // Send directly to let Gemini handle the visual processing
      return {
        inlineData: {
          mimeType: file.type || `image/${ext === "jpg" ? "jpeg" : ext}`,
          data: await fileToBase64(file),
        },
      };
    } else {
      // Fallback: Image is too massive for inline data or model lacks native image capability
      if (file.size >= SIZE_100_MB) {
        console.warn(`Image ${file.name} exceeds 100MB inline limit. Falling back to local OCR.`);
      } else {
        console.warn(`Model ${modelId ?? "unknown"} lacks native image capability. Falling back to local OCR.`);
      }
      const extractedText = await readFileAsText(file);
      return { text: extractedText };
    }
  }

  // Rule 4: Native PDF checks size limits and model capabilities
  if (ext === "pdf") {
    if (capabilities.pdf && file.size < SIZE_50_MB) {
      // Send directly to keep images/tables intact for Gemini
      return {
        inlineData: {
          mimeType: "application/pdf",
          data: await fileToBase64(file),
        },
      };
    } else {
      // Fallback: PDF is too massive for inline data or model lacks native PDF capability
      if (file.size >= SIZE_50_MB) {
        console.warn(`PDF ${file.name} exceeds 50MB inline limit. Falling back to local text extraction.`);
      } else {
        console.warn(`Model ${modelId ?? "unknown"} lacks native PDF capability. Falling back to local text extraction.`);
      }
      const extractedText = await readFileAsText(file);
      return { text: extractedText };
    }
  }

  // Attempt reading as text via fileReader fallback for any other supported format
  try {
    const extractedText = await readFileAsText(file);
    return { text: extractedText };
  } catch {
    throw new Error(`Unsupported file type extension: .${ext}`);
  }
}

/**
 * Prepares the payload parts for a given model, combining textual prompts
 * with native Base64 inline data or fallback extracted text according to model capabilities.
 */
export async function prepareModelPayload(
  prompt: string,
  files: File[] | undefined,
  modelId: string
): Promise<{ parts: GeminiPart[]; fallbackPrompt: string }> {
  if (!files || files.length === 0) {
    return {
      parts: [{ text: prompt }],
      fallbackPrompt: prompt,
    };
  }

  const processed = await Promise.all(
    files.map(async (file) => {
      const part = await processFileForGemini(file, modelId);
      return { file, part };
    })
  );

  const inlineParts: GeminiPart[] = [];
  const extractedTextBlocks: string[] = [];

  for (const { file, part } of processed) {
    if (part.inlineData) {
      inlineParts.push(part);
    } else if (part.text) {
      extractedTextBlocks.push(
        `--- FILE CONTEXT (${file.name}) ---\n${part.text}\n--- END FILE CONTEXT ---`
      );
    }
  }

  const textContext = extractedTextBlocks.join("\n\n");
  const fullPrompt = textContext ? `${textContext}\n\n${prompt}` : prompt;

  const parts: GeminiPart[] = [
    { text: fullPrompt },
    ...inlineParts,
  ];

  return {
    parts,
    fallbackPrompt: fullPrompt,
  };
}
