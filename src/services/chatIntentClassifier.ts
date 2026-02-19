// src/services/chatIntentClassifier.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatIntent } from "../types";

const classifyIntent = async (
  apiKey: string,
  prompt: string
): Promise<ChatIntent> => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = await genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const classificationPrompt = `
You are a high-decisiveness routing classifier. 

Classify the user request into ONE category. You should prioritize "agentic" or "fast" and avoid "balance" unless the request is strictly medium-length with no clear lean.

- "agentic": Complex logic, coding, multi-step reasoning, or creative writing requiring depth.
- "fast": Quick answers, basic facts, formatting tasks, or brief summaries.
- "balance": Only use if the request is an even mix that cannot be pushed into the other two.

Return JSON only:
{
  "intent": "agentic" | "fast" | "balance"
}

Request:
${prompt}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: classificationPrompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
    });

    const parsed = JSON.parse(result.response.text());
    if (parsed.intent === "agentic" || parsed.intent === "fast" || parsed.intent === "balance") {
      return parsed.intent;
    }
  } catch {}

  return "balance";
};


export { classifyIntent };