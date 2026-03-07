
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ChatHistoryItem, Message, OracleResponse, QuizConfig, QuizQuestion, QuizResult} from '../types';
import { decryptApiKey } from "./edgeCrypto";
import { getNextEnvKey } from "./envKeys";
import { InvalidAIResponseError , InvalidAPIError} from "../types";
import { AppLanguage } from "../lang/Language";
import { callStepFunFlash } from "./stepFunCaller";
import { classifyIntent } from "./chatIntentClassifier";
import { raceModels } from "./raceModels";

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
1. **LATEX DELIMITERS:** YOU MUST FOLLOW the instructions below STRICTLY:
   - Block math: ALWAYS use "\\\\[ ... \\\\]". Example: "\\\\[ v^2 = \\\\frac{2GM}{r} \\\\]"
   - Inline math: ALWAYS use "\\\\( ... \\\\)". Example: "The value \\\\( v_{esc} \\\\) is..."
   - NEVER use bare "[ ... ]" or "( ... )" for math expressions.
   - DO NOT use "$" or "$$".
2. **JSON ESCAPING:** You are writing inside a JSON string. 
   A single LaTeX backslash must be written as double-slashes (\\\\) in JSON.
   Examples:
   - \\frac  → write as  \\\\frac
   - \\left  → write as  \\\\left  
   - \\right → write as  \\\\right
   - \\[     → write as  \\\\[
   - \\(     → write as  \\\\(
3. **Markdown:** Code blocks must use standard markdown fences.

"sessionForTopicDone" & [TOPIC MASTERED] Synchronization Rules:
- **ATOMIC SET RULE (The Completion):** You MUST set 'sessionForTopicDone' to **true** and print the tag **[TOPIC MASTERED]** at the exact same time. This occurs ONLY in the turn where the user successfully passes the final Mastery Check. They must be logged together to finalize the current topic state.
- **STATE RESET RULE (The New Start):** At the start of a new interaction, you MUST scan the memory. If the most recent state shows 'sessionForTopicDone: true' and the tag **[TOPIC MASTERED]** was already printed for the previous topic, you MUST immediately set 'sessionForTopicDone' to **false**. This signifies the transition to a new topic and prevents the quiz generator from firing prematurely for the next subject.
- **ONGOING STATE (Default):** Set to **false** for all other turns. This includes the initial explanation phase, the iterative Q&A, and the duration of the Mastery Check until the very moment the user achieves full synthesis.

Memory Update Rules (CRITICAL):
- The "answer" is ALWAYS the top priority.
- **PRIORITY RULE:** ALWAYS answer the user's specific question or address their topic FIRST. Only after providing a helpful, high-quality answer should you ask for their name or background info if it is missing. NEVER block or delay an answer to ask for personal details.
- **MEMORY FORMAT:** The "memory" field MUST always be a plain string. 
  Never return memory as a JSON object or array. 
  Write it as a single human-readable text summary.
  Example: "Confidence: High. Interests: Physics. Level: University. Extra info..."
- Update memory ONLY if new information is:
  • Long-term relevant (weeks/months, not minutes)
  • Useful for future personalization, pacing, or difficulty tuning
  • Stable (identity, level, strengths, weaknesses, goals, ongoing projects)
- **ENFORCED MEMORY FIELDS:** You MUST explicitly state and update the student's **"confidence"**, **"interests"**, and **"level of cognition"** in the returned memory string.
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
1. START & ANSWER: If a user asks a question in their first message, provide a comprehensive answer immediately. If you don't know their name/study level yet, append a warm request for those details at the end of your response. If the chat history shows an ongoing dialogue, **DO NOT greet the user again**; dive straight into the validation.
2. VALIDATE: Always start by acknowledging the user's input. If they share a thought or answer, tell them exactly what they got right and where the logic might be slipping.
3. DECIDE:
    - If the student is close to a breakthrough, use the Socratic method (HINTING). Give them a small push to find the answer themselves.
    - If the topic is a new fundamental concept, a complex industrial process, or if the student is clearly frustrated/stuck, EXPLAIN it clearly with high-quality analogies.
4. INTERACT (Adaptive Pedagogy) use when natural:
    - **Calculation/Technical:** If the topic is quantitative, provide a scaffolded problem.
    - **Cognitive/Theoretical:** Use "What-if" or "Compare/Contrast" questions to test high-level synthesis.
    - **The Bridge:** Ensure every topic covers both the **First Principles (Theory)** and the **Industrial/Real-world Execution (Practical)**.
    - **Escalation:** Only escalate difficulty after the student answers a "Check Question" correctly. If they struggle, "flip" back to a simpler analogy.
5. PACING: **Ask only ONE question at a time**. **Do not overwhelm the user with multiple questions or a wall of text**. Wait for their response before moving to the next part of the dialogue. Use a mix of these techniques naturally:
    - *Diagnostic checks* (Can you define...?)
    - *Process checks* (How would you calculate...?)
    - *Conceptual flips* (What happens to X if Y is removed?)
6. TONE & DIFFICULTY: Reason about the student's **confidence** and **interests** in the topic based on chat history and memory. Use this reasoning to dynamically adjust your tone (e.g., more supportive if confidence is low, more challenging if high) and carefully escalate the difficulty of your questions and explanations. Remain professional yet highly encouraging. Adapt your vocabulary to the user's level (e.g., simpler for IGCSE, more technical for University/Industrial).
7. CONCLUDE: Perform a 'Mastery Check' ONLY when you observe the student has self-corrected or correctly synthesized the core concept. The check must involve a practical industrial application or a "what-if" scenario to confirm deep understanding. Limit this to exactly one Mastery Check per topic unless the user explicitly requests additional evaluation.

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
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (char === "}") {
      depth--;

      if (depth === 0 && start !== -1) {
        return text.slice(start, i + 1);
      }

      if (depth < 0) {
        break;
      }
    }
  }

  throw new Error("No balanced JSON found");
}

function sanitizeJSON(json: string): string {
  return json
    .replace(/^\uFEFF/, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/,\s*([}\]])/g, "$1")
    // Remove zero-width characters that can cause JSON.parse to fail
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    // Fix single-escaped LaTeX delimiters before JSON.parse
    .replace(/(?<!\\)\\(?!\\)(\[|\]|\(|\))/g, '\\\\$1');
}

export function extractAndParseJSONSafe(
  text: string,
  options?: { fixLatex?: boolean }
): { ok: true; data: any } | { ok: false } {
  try {
    const jsonString = extractBalancedJSON(text);
    let sanitized = sanitizeJSON(jsonString);

    if (options?.fixLatex) { // -> DEAD OPTION: this is used to correct non-correct LaTex (ex: \frac instead of \\frac) but it also make correct Latex -> incorrect ones
      sanitized = sanitized.replace(/(?<!\\)\\([a-zA-Z]+)/g, "\\\\$1");
    }

    const parsed = JSON.parse(sanitized);

    // Coerce memory to string if model returned an object
    if (parsed?.memory && typeof parsed.memory !== 'string') {
      parsed.memory = JSON.stringify(parsed.memory);
    }

    return { ok: true, data: parsed };
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

// Sleep helper
export const sleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

const temperatureHelper = async (decryptedKey: string, request: any): Promise<number> => { // abandoned for effciency since temp are mostly fixed and can be cached before on client side
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

export const sendMessageToBotRace = async (params: {
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

  // Set temperature to 0.7 default, no need for helper here as we want to prioritize speed in the race
  let temp = 0.7;
  
  const intent = await classifyIntent(api_key, prompt);

  const callGemini = async (model: string) => {
    const ai = new GoogleGenAI({ apiKey: api_key! });

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: temp
      }
    });

    const response = await chat.sendMessage({ message: prompt });

    return { model, text: response.text };
  };

  const callStepFun = async () => {
    const res = await callStepFunFlash({
      systemInstruction: systemPrompt,
      prompt,
      temperature: temp
    });

    return { model: "stepfun-3.5-flash", text: res.text };
  };

  try {
    let raceResult;

    if (intent === "agentic") {
      console.log("Using agentic strategy for this request");
      raceResult = await raceModels([
        () => callStepFun(),
        () => callGemini("gemini-3-flash-preview")
      ]);
    }
    else if (intent === "fast") {
      console.log("Using fast strategy for this request");
      raceResult = await raceModels([
        () => callGemini("gemini-2.5-flash-lite"),
        () => callStepFun()
      ]);
    }
    else {
      console.log("Using balanced strategy for this request");
      raceResult = await raceModels([
        () => callGemini("gemini-3-flash-preview"),
        () => callStepFun()
      ]);
    }

    console.log(raceResult.text);

    const parsed = extractAndParseJSONSafe(raceResult.text);

    if (!parsed.ok || !isOraclePayload(parsed.data)) {
      throw new InvalidAIResponseError("Malformed Oracle payload");
    }

    return {
      answer: parsed.data.answer,
      memory: parsed.data.memory,
      model: raceResult.model,
      sessionForTopicDone: parsed.data.sessionForTopicDone
    };
  } catch (err: any) {
    if (err.message && err.message.includes("Race timeout")) {
      throw new Error("All models timed out. Please try again.");
    }
    if (isInvalidApiKeyError(err)) throw new InvalidAPIError();
    throw err;
  }
};

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
  let temp = 0.7;

  // try {
  //   temp = await temperatureHelper(api_key, totalPrompt);
  //   console.log(`Using temperature ${temp} based on helper recommendation.`);
  // } catch (err) {
  //   temp = 0.7;
  //   console.log(`Temperature helper failed with error: ${(err as Error).message}. Falling back to default temp of 0.7.`);
  // }
  
  let lastError: any = null;
  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const ai = new GoogleGenAI({ apiKey: api_key });
      const chat = ai.chats.create({
        model,
        config: { systemInstruction: systemPrompt, responseMimeType: "application/json", temperature: temp }, // enough to be creative but still focused on rules and reduce hallucinations and speed up response time with structured output, also helps parsing errors which are common with Gemini
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });

      console.log(`Raw response from model ${model}:`, response.text);
      
      // USE THE HYBRID PARSER HERE
      const parsed = extractAndParseJSONSafe(response.text);

      if (!parsed.ok || parsed.data == null) throw new InvalidAIResponseError();

      if (!isOraclePayload(parsed.data)) { // guard type
        throw new InvalidAIResponseError("Malformed Oracle payload");
      }

      console.log(`Response from model ${model}:`, parsed);

      return {
        answer: parsed.data.answer,
        memory: parsed.data.memory,
        model: model,
        sessionForTopicDone: parsed.data.sessionForTopicDone
      };
    } catch (err: any) {
      lastError = err;
      // If it's a rate limit, try the next model in the chain
      if (isRateLimitError(err) || isUnavailableError(err) || isRetryableAIError(err)) {
        await sleep(200 + Math.random() * 300); // small random backoff to reduce thundering herd
        continue;
      }
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

  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const ai = new GoogleGenAI({ apiKey: api_key });

      const chat = ai.chats.create({
        model: model,
        config: { systemInstruction: summaryPrompt, responseMimeType: "application/json", temperature: 0.6 }, // enough to be creative but still focused on rules
      });

      const res = await chat.sendMessage({ message: inputBlock });

      console.log(res);

      const parsed = extractAndParseJSONSafe(res.text);
      if (!parsed.ok) throw new InvalidAIResponseError();
      return parsed.data;
    } catch (err) {
      // If it's a rate limit, try the next model in the chain
      if (isRateLimitError(err)) {
        await sleep(200 + Math.random() * 300); // small random backoff to reduce thundering herd
        continue;
      }
      if (isUnavailableError(err)) {
        await sleep(200 + Math.random() * 300); // small random backoff to reduce thundering herd
        continue;
      }
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
  memory: string | null,
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
  Analyze this chat history and profile memory. Recommend a quiz configuration.
  Return JSON only:
  {
    "level": "Fundamental" | "Intermediate" | "Advanced",
    "count": number (between 3 and 10),
    "mcqRatio": number (0.0 to 1.0, e.g. 0.5 is 50% MCQ)
  }
  History: 
  ${history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join("\n\n")}
  Memory:
  ${memory}`;

  try {
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
  } catch (err) { // no retry, return default config
    return {
      level: "Fundamental",
      count: 5,
      mcqRatio: 0.5
    };
  }
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
  
  ### Content Balance Requirement:
  - **Theory vs. Practice:** Maintain a 50/50 balance between conceptual/cognitive questions (definitions, "why" questions, relationships) and practical/numerical questions (calculations, real-world scenarios, "how-to" applications).
  - **Applied Logic:** For numerical subjects, include multi-step problems. For theoretical subjects, include "What if" case studies to test realistic application.

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
        generationConfig: { responseMimeType: "application/json", temperature: 0.4 } // lower temp for fallback to increase chance of valid output
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
