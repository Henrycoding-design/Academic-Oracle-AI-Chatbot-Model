
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatHistoryItem, Message, OracleResponse, QuizConfig, QuizQuestion, QuizResult} from '../types';
import { decryptApiKey } from "./edgeCrypto";
import { getNextEnvKey } from "./envKeys";
import { InvalidAIResponseError , InvalidAPIError} from "../types";
import { AppLanguage } from "../lang/Language";

// const SYSTEM_INSTRUCTION = `You are the 'Academic Oracle', a world-class polymath and supportive mentor. 
// Your scope is UNLIMITED: from primary education and competitive exams (IGCSE, SAT, AP, IELTS) to University-level research and professional Industrial practices.

// Your Interaction Framework:
// 1. START: If you don't know the user's name, greet them warmly and ask for their name and what they are currently studying or working on.
// 2. VALIDATE: Always start by acknowledging the user's input. If they share a thought or answer, tell them exactly what they got right and where the logic might be slipping.
// 3. DECIDE:
//    - If the student is close to a breakthrough, use the Socratic method (HINTING). Give them a small push to find the answer themselves.
//    - If the topic is a new fundamental concept, a complex industrial process, or if the student is clearly frustrated/stuck, EXPLAIN it clearly with high-quality analogies.
// 4. PACING: Ask only ONE question at a time. Do not overwhelm the user with multiple questions or a wall of text. Wait for their response before moving to the next part of the dialogue.
// 5. TONE: Professional yet highly encouraging. Adapt your vocabulary to the user's level (e.g., simpler for IGCSE, more technical for University/Industrial).
// 6. CONCLUDE: After helping, offer a 'Mastery Check' question or suggest a practical industrial application of the concept.

// Always maintain a hidden 'Student Profile' in your context: Name, Level, Confidence. Use this to maintain consistency across the session.`;

const SYSTEM_INSTRUCTION = `
System Language (FORCED INPUT/OUTPUT LANGUAGE): {{LANGUAGE}}

You are the 'Academic Oracle', a world-class polymath and supportive mentor. 
Your scope is UNLIMITED: from primary education and competitive exams (IGCSE, SAT, AP, IELTS) to University-level research and professional Industrial practices.

Your PRIMARY objective is to generate the best possible response for the current user input by intelligently combining:
- Short-term conversational context (recent dialogue)
- Long-term student memory (persistent profile/logs)

Memory exists to SUPPORT reasoning and personalization — never to distract from answer quality.

Output Format:
All responses MUST be returned as a valid JSON object.
{
  "answer": "...",
  "memory": "...",
  "sessionForTopicDone": boolean
}

CRITICAL FOR MATH & CODE:
1. **LATEX DELIMITERS:** Strictly use "$$" for block math and "$" for inline math. **Do NOT use "\\[" or "\\("**.
2. **JSON ESCAPING:** All backslashes in LaTeX must be double-escaped (e.g., use "\\\\frac" so it appears as "\\frac" in the string).
3. **Markdown:** Code blocks must use standard markdown fences.
4. **Newlines:** Use literal "\\n" for line breaks within the JSON string.

"sessionForTopicDone" Parameter Rules:
- **RESET RULE:** You MUST scan the long-term memory for the tag "[TOPIC MASTERED]". If this tag exists for the current/latest topic, it indicates a quiz was fired and the topic is closed. In this case, "sessionForTopicDone" MUST be set to **false** to allow a fresh start for the next topic.
- **SET RULE:** Set to **true** ONLY when the user has successfully completed the "Mastery Check" in the *current* turn and you have confirmed they have fully synthesized the learning topic.
- **DEFAULT:** Set to **false** for all other interactions during the learning process, including while the Mastery Check is still in progress or if the memory indicates the latest topic is already marked as [TOPIC MASTERED].

Memory Update Rules (CRITICAL):
- The "answer" is ALWAYS the top priority.
- Update memory ONLY if new information is:
  • Long-term relevant (weeks/months, not minutes)
  • Useful for future personalization, pacing, or difficulty tuning
  • Stable (identity, level, strengths, weaknesses, goals, ongoing projects)
- **LOGGING MASTERY:** When a student passes the Master Check, you MUST append the tag "[TOPIC MASTERED]" next to that topic in the memory string.
- DO NOT store:
  • Temporary confusion
  • One-off questions
  • Step-by-step solutions
  • Raw chat summaries
- If nothing meaningful should be updated, return the previous memory unchanged.

STOPPING CRITERIA (DYNAMIC MASTERY):
- **IGNORE MESSAGE COUNT:** Do not determine the end of a topic based on how many turns have passed.
- **CONTENT-BASED TERMINATION:** Evaluate the user's recent responses against the "Student Profile" in memory. If the user demonstrates a synthesis of the concept that matches their target level, move to a Master Check.
- **NEVER LOOP:** If the user has correctly applied a concept twice, do not ask further clarifying questions; progress to the next difficulty tier or conclude.

Your Interaction Framework:
1. START: If you don't know the user's name, greet them warmly and ask for their name and what they are currently studying or working on.
2. VALIDATE: Always start by acknowledging the user's input. If they share a thought or answer, tell them exactly what they got right and where the logic might be slipping.
3. DECIDE:
    - If the student is close to a breakthrough, use the Socratic method (HINTING). Give them a small push to find the answer themselves.
    - If the topic is a new fundamental concept, a complex industrial process, or if the student is clearly frustrated/stuck, EXPLAIN it clearly with high-quality analogies.
4. PACING: Ask only ONE question at a time. Do not overwhelm the user with multiple questions or a wall of text. Wait for their response before moving to the next part of the dialogue.
5. TONE: Professional yet highly encouraging. Adapt your vocabulary to the user's level (e.g., simpler for IGCSE, more technical for University/Industrial).
6. CONCLUDE: Perform a 'Mastery Check' ONLY when you observe the student has self-corrected or correctly synthesized the core concept. The check must involve a practical industrial application or a "what-if" scenario to confirm deep understanding. Limit this to exactly one Mastery Check per topic unless the user explicitly requests additional evaluation.

Please DOUBLE CHECK the JSON responses to ensure they follow the RULES ABOVE: Both CONTENT and SYNTAX STRUCTURE. Use the provided long-term memory as the single source of truth.`;

const MODEL_FALLBACK_CHAIN = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash" // last resort due to this model also being use in Quiz generation/validation -> less load balancing
] as const;

// let chatInstance: Chat | null = null;
// let currentApiKey: string | null = null;

type EncryptedKeyPayload = {
  iv: string;
  data: string;
};

type ValidationResponse = {
  isCorrect: boolean;
  feedback: string;
};

type estimateQuizConfigResponse = {
  level: 'Fundamental' | 'Intermediate' | 'Advanced';
  count: number;
  mcqRatio: number;
};

type TemperatureEstimationResponse = {
  temperature: number;
};

const isEstimateQuizConfigResponse = (obj: any): obj is estimateQuizConfigResponse => {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.level === "string" &&
    ["Fundamental", "Intermediate", "Advanced"].includes(obj.level) &&
    typeof obj.count === "number" &&
    obj.count > 0 &&
    typeof obj.mcqRatio === "number" &&
    obj.mcqRatio >= 0 && obj.mcqRatio <= 1
  );
};

const isEstimateTemperatureResponse = (obj: any): obj is TemperatureEstimationResponse => {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.temperature === "number" &&
    obj.temperature > 0 && obj.temperature <= 1
  );
};

const isEncryptedPayload = (p: any): p is EncryptedKeyPayload =>
  p &&
  typeof p === "object" &&
  typeof p.iv === "string" &&
  typeof p.data === "string";

const isRateLimitError = (err: unknown): boolean => {
  try {
    // Case 1: string error (Gemini SDK common case)
    if (typeof err === "string") {
      // Try JSON parse
      try {
        const parsed = JSON.parse(err);
        return (
          parsed?.error?.code === 429 ||
          parsed?.error?.status === 429 ||
          parsed?.error?.message?.includes("429") ||
          parsed?.error?.message?.toLowerCase().includes("rate limit")
        );
      } catch {
        // Plain string
        return err.includes("429") || err.toLowerCase().includes("rate limit");
      }
    }

    // Case 2: Error / object
    const anyErr = err as any;

    return (
      anyErr?.status === 429 ||
      anyErr?.code === 429 ||
      anyErr?.error?.status === 429 ||
      anyErr?.error?.code === 429 ||
      anyErr?.message?.toLowerCase().includes("rate limit") ||
      anyErr?.error?.message?.toLowerCase().includes("rate limit")
    );
  } catch {
    // Absolute last resort — never crash fallback
    return false;
  }
};

const isUnavailableError = (err: unknown): boolean => {
  try {
    // Case 1: string error (Gemini SDK common case)
    if (typeof err === "string") {
      // Try JSON parse
      try {
        const parsed = JSON.parse(err);
        return (
          parsed?.error?.code === 503 ||
          parsed?.error?.status === "UNAVAILABLE" ||
          parsed?.error?.status === 503 ||
          parsed?.error?.message?.toLowerCase().includes("overloaded") ||
          parsed?.error?.message?.toLowerCase().includes("unavailable")
        );
      } catch {
        // Plain string
        return (
          err.includes("503") ||
          err.toLowerCase().includes("unavailable") ||
          err.toLowerCase().includes("overloaded")
        );
      }
    }

    // Case 2: Error / object
    const anyErr = err as any;

    return (
      anyErr?.status === 503 ||
      anyErr?.code === 503 ||
      anyErr?.error?.status === "UNAVAILABLE" ||
      anyErr?.error?.status === 503 ||
      anyErr?.error?.code === 503 ||
      anyErr?.message?.toLowerCase().includes("unavailable") ||
      anyErr?.message?.toLowerCase().includes("overloaded") ||
      anyErr?.error?.message?.toLowerCase().includes("unavailable") ||
      anyErr?.error?.message?.toLowerCase().includes("overloaded")
    );
  } catch {
    // Absolute last resort — never crash fallback
    return false;
  }
};

export function isRetryableAIError(err: unknown): boolean {
  if (err instanceof InvalidAIResponseError) return true; // mostly this case as we use the custom error in validation earlier
  if (err instanceof SyntaxError) return true;

  if (err && typeof err === "object") {
    const msg = (err as any)?.message;
    if (typeof msg === "string") {
      return (
        msg.includes("Invalid JSON") ||
        msg.includes("No balanced JSON") ||
        msg.includes("Oracle returned no JSON")
      );
    }
  }

  return false;
}

const isInvalidApiKeyError = (err: unknown): boolean => {
  try {
    // Case 1: string error (SDKs love this)
    if (typeof err === "string") {
      // Try JSON parse first
      try {
        const parsed = JSON.parse(err);
        return (
          parsed?.error?.code === 400 ||
          parsed?.error?.status === "INVALID_ARGUMENT" ||
          parsed?.error?.status === 400 ||
          parsed?.error?.message?.toLowerCase().includes("api key") ||
          parsed?.error?.message?.toLowerCase().includes("invalid key") ||
          parsed?.error?.message?.toLowerCase().includes("expired")
        );
      } catch {
        // Plain string fallback
        return (
          err.includes("400") ||
          err.toLowerCase().includes("api key") ||
          err.toLowerCase().includes("invalid key") ||
          err.toLowerCase().includes("expired")
        );
      }
    }

    // Case 2: Error / object
    const anyErr = err as any;

    return (
      anyErr?.status === 400 ||
      anyErr?.code === 400 ||
      anyErr?.error?.status === "INVALID_ARGUMENT" ||
      anyErr?.error?.status === 400 ||
      anyErr?.error?.code === 400 ||
      anyErr?.message?.toLowerCase().includes("api key") ||
      anyErr?.message?.toLowerCase().includes("invalid key") ||
      anyErr?.message?.toLowerCase().includes("expired") ||
      anyErr?.error?.message?.toLowerCase().includes("api key") ||
      anyErr?.error?.message?.toLowerCase().includes("invalid key") ||
      anyErr?.error?.message?.toLowerCase().includes("expired")
    );
  } catch {
    // Nuclear option: never crash prod
    return false;
  }
};

function extractBalancedJSON(text: string): string {
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === "}") {
      depth--;
      if (depth === 0 && start !== -1) {
        return text.slice(start, i + 1);
      }
    }
  }

  throw new Error("No balanced JSON found");
}

function sanitizeJSON(json: string): string {
  return json
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    // Remove zero-width characters that can cause JSON.parse to fail
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
}

export function extractAndParseJSONSafe(
  text: string,
  options?: { fixLatex?: boolean }
): { ok: true; data: any } | { ok: false } {
  try {
    const jsonString = extractBalancedJSON(text);
    let sanitized = sanitizeJSON(jsonString);

    if (options?.fixLatex) {
      sanitized = sanitized.replace(/\\(?!["\\/bfnrtu])/g, "\\\\");
    }

    return { ok: true, data: JSON.parse(sanitized) };
  } catch {
    return { ok: false};
  }
}

function isOraclePayload(data: any): data is OracleResponse {
  return (
    typeof data?.answer === "string" &&
    typeof data?.memory === "string" &&
    typeof data?.sessionForTopicDone === "boolean"
  );
}

// function extractAndParseJSON(text: string) { // this check is the main cause of error in chat (usually 2-3 per whole session): consider not throwing err but force retry on the loop: sacrifice more waiting time than err to UI 
//   const start = text.indexOf('{'); 
//   const end = text.lastIndexOf('}'); 

//   if (start === -1 || end === -1) { 
//     throw new Error("Oracle returned no JSON"); // BUG: we've got this error often 1/10 times 
//   } 

//   const json = text.slice(start, end + 1); 
  
//   return JSON.parse(json); // BUG: this error here too, the check passes but JSON.parse still fails: bad escape character: 2/10 times 
// }

export const getChat = (apiKey: string, model: string): Chat => {
  // // 🔁 Same user, same chat → full context preserved
  // if (chatInstance && currentApiKey === apiKey) {
  //   return chatInstance;
  // }

  // 🆕 New user OR new session
  const ai = new GoogleGenAI({ apiKey });

  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION
    },
  });

  return chat

  // currentApiKey = apiKey;
  // return chatInstance;
};

// export const resetChat = () => {
//   chatInstance = null;
//   currentApiKey = null;
// };

const temperatureHelper = async (decryptedKey: string, request: any): Promise<number> => { // return the best fit temperature
  const genAI = new GoogleGenerativeAI( decryptedKey );
  const ai = await genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
  const prompt = `System Language (FORCED INPUT/OUTPUT CONTENT LANGUAGE): English
You are an expert educational content analyzer. Given this request/prompt, recommend the best temperature setting for a balance of creativity and accuracy in the response for Socratic learning. Return only a number larger than 0 and less than or equal to 1.
MUST response in JSON format:
{
  "temperature": number
}
Request/Prompt: ${JSON.stringify(request)}
`;
  const result = await ai.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.2 } // low temp for more deterministic output
  });
  if (!result.response.text()) throw new Error("No response from temperature helper");
  if (!isEstimateTemperatureResponse(JSON.parse(result.response.text()))) {
    throw new Error("Invalid response from temperature helper");
  }
  return JSON.parse(result.response.text()).temperature;
}

export const sendMessageToBot = async (params: {
  history: { role: "user" | "model"; content: string }[];
  memory?: string | null;
  encryptedKeyPayload: any;
  language: AppLanguage;
}): Promise<OracleResponse> => {
  const { history, memory, encryptedKeyPayload, language } = params;

  const memoryBlock = memory
    ? `ORACLE MEMORY (Persistent Student Profile):
  ${memory}

  ---`
    : "";

  const prompt = `
    ${memoryBlock}
    CHAT HISTORY (Trimmed)
    ${history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join("\n\n")}
    `.trim();

  let api_key: string | null = null;
  
  if (!encryptedKeyPayload) {
    // Use environment key
    api_key = getNextEnvKey();
  } else {
    // Decrypt user key

    // 🔓 decrypt JUST-IN-TIME with jsonb type guard
    if (!isEncryptedPayload(encryptedKeyPayload)) {
      throw new Error("Invalid encrypted API key payload");
    }

    api_key = await decryptApiKey(encryptedKeyPayload);
  }

  if (!api_key) { // should never happen
    throw new Error("No API key available for free mode.");
  }

  // last: Language update
  const systemPrompt = SYSTEM_INSTRUCTION.replace(
    "{{LANGUAGE}}",
    language === "en" ? "English"
    : language === "fr" ? "French"
    : language === "es" ? "Spanish"
    : "Vietnamese"
  );

  // Get temperature recommendation from helper function based on the current prompt
  const totalPrompt = `System Instruction: ${systemPrompt}\n\nUser Prompt:\n${prompt}`;
  let temp = await temperatureHelper(api_key, totalPrompt);

  if (isNaN(temp) || temp <= 0 || temp > 1) {
    console.log(`Temperature helper returned invalid value "${temp}". Falling back to default 0.7`);
    temp = 0.7; // default fallback, never fail the main response due to temp estimation issues, as it's a "nice to have" optimization rather than a core requirement
  }
  console.log(`Using temperature ${temp} based on helper recommendation.`);

  let lastError: any = null;
  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const ai = new GoogleGenAI({ apiKey: api_key });
      const chat = ai.chats.create({
        model,
        config: { systemInstruction: systemPrompt, responseMimeType: "application/json", temperature: temp }, // enough to be creative but still focused on rules and reduce hallucinations and speed up response time with structured output, also helps parsing errors which are common with Gemini
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });

      // console.log(`Raw response from model ${model}:`, response.text);
      
      // USE THE HYBRID PARSER HERE
      const parsed = extractAndParseJSONSafe(response.text);

      if (!parsed.ok || parsed.data == null) throw new InvalidAIResponseError();

      if (!isOraclePayload(parsed.data)) { // guard type
        throw new InvalidAIResponseError("Malformed Oracle payload");
      }

      // console.log(`Response from model ${model}:`, parsed);

      return {
        answer: parsed.data.answer,
        memory: parsed.data.memory,
        model: model,
        sessionForTopicDone: parsed.data.sessionForTopicDone
      };
    } catch (err: any) {
      lastError = err;
      // If it's a rate limit, try the next model in the chain
      if (isRateLimitError(err)) continue;
      if (isUnavailableError(err)) continue;
      if (isRetryableAIError(err)) continue;
      if (isInvalidApiKeyError(err)) throw new InvalidAPIError();
      throw err;
    }
  }
  throw lastError;
};


// Generate structured session summary using Gemini
const SUMMARY_SYSTEM_INSTRUCTION = `
System Language (FORCED INPUT/OUTPUT CONTENT LANGUAGE): {{LANGUAGE}}

You are an advanced Educational Data Analyst. 
Your specific task is to condense a raw student-AI dialogue and performance metrics into a structured JSON summary for local storage and review.

INPUT DATA:
- Student Profile (Memory)
- Chat History (Look for [TOPIC MASTERED] and [QUIZ RESULT] flags)
- Contextual Instructions

OUTPUT OBJECTIVE:
Generate a valid JSON object summarizing the learning session, specifically tracking mastery and quiz performance.

STRICT JSON SCHEMA:
{
  "profile": {
    "name": "Student Name or 'Unknown'",
    "level": "Academic Level or 'General'",
    "focus": "Current Study Topic or 'General'"
  },
  "topics": [
    {
      "title": "Topic Name",
      "formulas": ["Equation 1 in LaTeX", "Equation 2"],
      "theories": ["Theory name", "Concept definition"],
      "key_points": ["Bullet point 1", "Bullet point 2"],
      "quiz_results": ["Detailed log of any [QUIZ RESULT] found for this topic"],
      "completion": "Estimated understanding (e.g., '3/5', 'Completed')"
    }
  ],
  "overall_completion": "Brief sentence on session progress including quiz outcomes"
}

CRITICAL RULES:
1. **FLAG TRACKING:** You must explicitly look for strings formatted as [QUIZ RESULT: score/details] and [TOPIC MASTERED]. Ensure these are mapped to the correct topic in the "topics" array.
2. **FORMAT:** Output MUST be raw JSON: use {content inside}. Do not use Markdown code fences.
3. **LATEX:** If math formulas appear, use LaTeX notation. You MUST double-escape backslashes (e.g., "\\\\frac" for fraction).
4. **NO HALLUCINATIONS:** Only summarize what was actually discussed or logged in flags. If a field (like formulas) was not discussed, return an empty array [].
5. **OBJECTIVITY:** Remove conversational filler. Focus on educational value and data-driven progress markers.
`;

export const generateSessionSummary = async (params: {
  history: { role: "user" | "model"; content: string }[];
  memory?: string | null;
  encryptedKeyPayload: any;
  language: AppLanguage;
}) => {
  const { history, memory, encryptedKeyPayload, language } = params;

  let api_key: string | null = null;

  if (!encryptedKeyPayload) {
    api_key = getNextEnvKey();
  } else {
    // 🔓 decrypt JUST-IN-TIME with jsonb type guard
    if (!isEncryptedPayload(encryptedKeyPayload)) {
      throw new Error("Invalid encrypted API key payload");
    }
    api_key = await decryptApiKey(encryptedKeyPayload);
  }

  if (!api_key) { // should never happen
    throw new Error("No API key available for free mode.");
  }

  const inputBlock = `
ANALYZE THIS SESSION DATA:

STUDENT PROFILE (Long Term Memory):
${memory ?? "No prior profile data."}

CURRENT SESSION HISTORY:
${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n\n")}
`.trim();

  const summaryPrompt = SUMMARY_SYSTEM_INSTRUCTION.replace(
    "{{LANGUAGE}}",
    language === "en" ? "English"
    : language === "fr" ? "French"
    : language === "es" ? "Spanish"
    : "Vietnamese"
  );

  // Get temperature recommendation from helper function based on the current prompt
  const totalPrompt = `System Instruction: ${summaryPrompt}\n\nSession Data:\n${inputBlock}`;
  let temp = await temperatureHelper(api_key, totalPrompt);

  if (isNaN(temp) || temp <= 0 || temp > 1) {
    console.log(`Temperature helper returned invalid value "${temp}". Falling back to default temp of 0.7.`);
    temp = 0.7; // default fallback, never fail the main response due to temp estimation issues, as it's a "nice to have" optimization rather than a core requirement
  }

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const ai = new GoogleGenAI({ apiKey: api_key });

      const chat = ai.chats.create({
        model: model,
        config: { systemInstruction: summaryPrompt, responseMimeType: "application/json", temperature: temp }, // enough to be creative but still focused on rules
      });

      const res = await chat.sendMessage({ message: inputBlock });

      console.log(res);

      const parsed = extractAndParseJSONSafe(res.text);
      if (!parsed.ok) throw new InvalidAIResponseError();
      return parsed.data;
    } catch (err) {
      // If it's a rate limit, try the next model in the chain
      if (isRateLimitError(err)) continue;
      if (isUnavailableError(err)) continue;
      throw err;
    }
  }
  throw new Error("All models rate limited or failed for session summary");
};

// Helper to get model (DRY principle)
const getModel = async (decryptedKey: string) => {
  const genAI = new GoogleGenerativeAI( decryptedKey );
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use a fast but accurate model for quiz logic
};

const getModelLite = async (decryptedKey: string) => {
  const genAI = new GoogleGenerativeAI( decryptedKey );
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" }); // Use a fast but accurate model for quiz logic
};

// 2. NEW: Estimate Quiz Configuration based on Chat Context
export const estimateQuizConfig = async (
  history: ChatHistoryItem[], 
  encryptedKeyPayload: any
): Promise<QuizConfig> => {

  let decryptedKey: string | null = null;

  if (!encryptedKeyPayload) {
    decryptedKey = getNextEnvKey();
  } else {
    // 🔓 decrypt JUST-IN-TIME with jsonb type guard
    if (!isEncryptedPayload(encryptedKeyPayload)) {
      throw new Error("Invalid encrypted API key payload");
    }
    decryptedKey = await decryptApiKey(encryptedKeyPayload);
  }
  if (!decryptedKey) {
    throw new Error("No API key available for free mode.");
  }
    
  const model = await getModelLite(decryptedKey); // lighter model for estimation: offload
  
  const prompt = `
  System Language (FORCED INPUT/OUTPUT CONTENT LANGUAGE): English

  You are an expert educational content analyzer.
  Analyze this chat history. Recommend a quiz configuration.
  Return JSON only:
  {
    "level": "Fundamental" | "Intermediate" | "Advanced",
    "count": number (between 3 and 10),
    "mcqRatio": number (0.0 to 1.0, e.g. 0.5 is 50% MCQ)
  }
  History: 
  ${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n\n")}`;

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.2 } // low temp for more deterministic output
  });

  if (!result.response.text()) {
    throw new InvalidAIResponseError("Empty response for quiz config estimation");
  }
  if (!isEstimateQuizConfigResponse(JSON.parse(result.response.text()))) {
    throw new InvalidAIResponseError("Invalid response format for quiz config estimation");
  }

  return JSON.parse(result.response.text());
};

// 3. NEW: Generate Quiz Questions
export const generateQuizQuestions = async (
  language: AppLanguage,
  config: QuizConfig,
  history: ChatHistoryItem[],
  memory: string | null,
  encryptedKeyPayload: any
): Promise<QuizQuestion[]> => {
  let decryptedKey: string | null = null;

  if (!encryptedKeyPayload) {
    decryptedKey = getNextEnvKey();
  } else { 
    // 🔓 decrypt JUST-IN-TIME with jsonb type guard
    if (!isEncryptedPayload(encryptedKeyPayload)) {
      throw new Error("Invalid encrypted API key payload");
    }
    decryptedKey = await decryptApiKey(encryptedKeyPayload);
  }
  if (!decryptedKey) {
    throw new Error("No API key available for free mode.");
  }

  const model = await getModel(decryptedKey);

  const prompt = `
  System Language (FORCED INPUT/OUTPUT CONTENT LANGUAGE): ${language === "en" ? "English"
    : language === "fr" ? "French"
    : language === "es" ? "Spanish"
    : "Vietnamese"}

  You are an expert quiz generator.
  Generate a quiz based on this student memory: "${memory}" and recent chat history: "${JSON.stringify(history)}".

  Quiz Configuration:
  - Difficulty: ${config.level}
  - Total Questions: ${config.count}
  - Mix: ${Math.round(config.mcqRatio * 100)}% Multiple Choice, ${100 - Math.round(config.mcqRatio * 100)}% Open Ended.
  
  Return a JSON array of objects. 
  Schema:
  [
    {
      "id": "unique_id",
      "type": "mcq" | "open",
      "question": "The question text",
      "options": ["A", "B", "C", "D"] (Only for MCQ),
      "correctAnswer": "The correct option text" (For MCQ) or "Key concepts to cover" (For Open),
      "explanation": "Short explanation of the answer"
    }
  ]`;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.6 } // low temp for more deterministic output
    });

    if (!result.response.text()) {
      throw new InvalidAIResponseError("Empty response for quiz generation");
    }
    
    return JSON.parse(result.response.text());
  } catch (err) {
    if (isRetryableAIError(err)) {
      // Retry once with the same model
      const retryResult = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 } // even lower temp for retry to increase chance of valid output
      });
      return JSON.parse(retryResult.response.text());
    }
    if (isRateLimitError(err) || isUnavailableError(err)) {
      // Fallback to lite model
      const liteModel = await getModelLite(decryptedKey);
      const fallbackResult = await liteModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.5 } // lower temp for fallback to increase chance of valid output
      });
      return JSON.parse(fallbackResult.response.text());
    }
    throw err;
  }
};

// 4. NEW: Validate Open-Ended Answer
export const validateOpenAnswer = async (
  language: AppLanguage,
  question: string,
  userAnswer: string,
  context: string,
  encryptedKeyPayload: any
): Promise<QuizResult> => {
  let decryptedKey: string | null = null;

  if (!encryptedKeyPayload) {
    decryptedKey = getNextEnvKey();
  } else {
    // 🔓 decrypt JUST-IN-TIME with jsonb type guard
    if (!isEncryptedPayload(encryptedKeyPayload)) {
      throw new Error("Invalid encrypted API key payload");
    }
    decryptedKey = await decryptApiKey(encryptedKeyPayload);
  }
  if (!decryptedKey) {
    throw new Error("No API key available for free mode.");
  }

  const model = await getModel(decryptedKey);

  const prompt = `
System Language (FORCED INPUT/OUTPUT CONTENT LANGUAGE): ${language === "en" ? "English"
  : language === "fr" ? "French"
  : language === "es" ? "Spanish"
  : "Vietnamese"}

You are an expert quiz grader.
Question: "${question}"
Reference/Context: "${context}"
User Answer: "${userAnswer}"

Evaluate the user's answer.
Return JSON:
{
  "isCorrect": boolean,
  "feedback": "Concise explanation of why it is right or wrong. Be encouraging but strict."
}`;

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: "application/json", temperature: 0.6 }
  });

  const parsed = extractAndParseJSONSafe(result.response.text());

  if (!parsed.ok) {
    throw new InvalidAIResponseError("Invalid quiz validation payload");
  }

  const data = parsed.data as ValidationResponse;

  return {
    questionId: "validation", // placeholder as no ID here, overwritten by caller
    userAnswer,
    isCorrect: data.isCorrect,
    feedback: data.feedback
  };
};
