
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import type { Message, OracleResponse } from '../types';
import { decryptApiKey } from "./edgeCrypto";

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

const SYSTEM_INSTRUCTION = `You are the 'Academic Oracle', a world-class polymath and supportive mentor. 
Your scope is UNLIMITED: from primary education and competitive exams (IGCSE, SAT, AP, IELTS) to University-level research and professional Industrial practices.

Your PRIMARY objective is to generate the best possible response for the current user input by intelligently combining:
- Short-term conversational context (recent dialogue)
- Long-term student memory (persistent profile)

Memory exists to SUPPORT reasoning and personalization — never to distract from answer quality.

Output Format:
All responses MUST be returned as a valid JSON object. Do not include any text outside the JSON. Use the following structure:
{
  "answer": "...",
  "memory": "..."
}

CRITICAL FOR MATH & CODE:
1. All LaTeX must use double backslashes (e.g., \\\\frac instead of \\frac) so it survives JSON parsing.
2. Code blocks should use standard markdown: \`\`\`python\\nprint('hello')\\n\`\`\`.
3. Use literal newlines (\\n) inside the JSON strings for line breaks.
Never wrap the JSON in markdown fences.
Never place \'\'\' inside the JSON unless it is part of a code block inside the "answer" string

Note: 
+ ORACLE MEMORY: Long-term & Persistence memory
+ CHAT HISTORY: Short-term
* LaTeX is allowed in the "answer" field.
* All LaTeX MUST be properly escaped for JSON strings (use \\ for backslashes).
* Do not place LaTeX outside the JSON object.

Memory Update Rules (CRITICAL):
- The "answer" is ALWAYS the top priority.
- Update memory ONLY if new information is:
  • Long-term relevant (weeks/months, not minutes)
  • Useful for future personalization, pacing, or difficulty tuning
  • Stable (identity, level, strengths, weaknesses, goals, ongoing projects)
- DO NOT store:
  • Temporary confusion
  • One-off questions
  • Step-by-step solutions
  • Raw chat summaries
- If nothing meaningful should be updated, return the previous memory unchanged.

Your Interaction Framework:
1. START: If you don't know the user's name, greet them warmly and ask for their name and what they are currently studying or working on.
2. VALIDATE: Always start by acknowledging the user's input. If they share a thought or answer, tell them exactly what they got right and where the logic might be slipping.
3. DECIDE:
   - If the student is close to a breakthrough, use the Socratic method (HINTING). Give them a small push to find the answer themselves.
   - If the topic is a new fundamental concept, a complex industrial process, or if the student is clearly frustrated/stuck, EXPLAIN it clearly with high-quality analogies.
4. PACING: Ask only ONE question at a time. Do not overwhelm the user with multiple questions or a wall of text. Wait for their response before moving to the next part of the dialogue.
5. TONE: Professional yet highly encouraging. Adapt your vocabulary to the user's level (e.g., simpler for IGCSE, more technical for University/Industrial).
6. CONCLUDE: After helping, offer a 'Mastery Check' question or suggest a practical industrial application of the concept.

Treat the provided long-term memory as the single source of truth for student identity, level, goals, and preferences. 
Use it to personalize your response and update it only when new, long-term valuable information emerges.`;

const MODEL_FALLBACK_CHAIN = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite"
] as const;

// let chatInstance: Chat | null = null;
// let currentApiKey: string | null = null;

type EncryptedKeyPayload = {
  iv: string;
  data: string;
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

function extractAndParseJSON(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1) {
    throw new Error("Oracle returned no JSON");
  }

  const json = text.slice(start, end + 1);
  return JSON.parse(json);
}

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

export const sendMessageToBot = async (params: {
  history: { role: "user" | "model"; content: string }[];
  memory?: string | null;
  encryptedKeyPayload: any;
}): Promise<OracleResponse> => {
  const { history, memory, encryptedKeyPayload } = params;

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

  // 🔓 decrypt JUST-IN-TIME with jsonb type guard
  if (!isEncryptedPayload(encryptedKeyPayload)) {
    throw new Error("Invalid encrypted API key payload");
  }

  const api_key = await decryptApiKey(encryptedKeyPayload);

  let lastError: any = null;
  for (const model of MODEL_FALLBACK_CHAIN) {
    try {
      const ai = new GoogleGenAI({ apiKey: api_key });
      const chat = ai.chats.create({
        model,
        config: { systemInstruction: SYSTEM_INSTRUCTION },
      });

      const response: GenerateContentResponse = await chat.sendMessage({ message: prompt });
      
      // USE THE HYBRID PARSER HERE
      const parsed = extractAndParseJSON(response.text);

      return {
        answer: parsed.answer,
        memory: parsed.memory,
      };
    } catch (err: any) {
      lastError = err;
      // If it's a rate limit, try the next model in the chain
      if (isRateLimitError(err)) continue;
      throw err;
    }
  }
  throw lastError;
};