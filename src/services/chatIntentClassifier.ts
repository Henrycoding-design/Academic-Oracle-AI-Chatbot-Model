// src/services/chatIntentClassifier.ts

/*
 * Copyright (c) 2026 Vo Tan Binh / Universal Academic Oracle
 * All Rights Reserved.
 *
 * This file is NOT licensed under Apache License 2.0.
 * No permission is granted to copy, redistribute, modify, reuse,
 * republish, or sublicense this file outside the official upstream
 * Universal Academic Oracle repository without prior written permission.
 *
 * See NOTICE and TRADEMARK_POLICY.md for additional terms.
 */

import { supabase } from "./supabaseClient";
import { ChatIntent } from "../types";

export const classifyIntent = async (
  encryptedKeyPayload: any,
  prompt: string
): Promise<ChatIntent> => {
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
    const { data, error } = await supabase.functions.invoke("call-ai-response", {
      method: "POST",
      body: {
        provider: "gemini",
        model: "gemini-2.5-flash-lite",
        prompt: classificationPrompt,
        temp: 0.1,
        encryptedKeyPayload,
      },
    });

    if (error || data?.error) {
      throw new Error(data?.error || error?.message || "Intent classification failed");
    }

    const text = data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error("Intent classifier returned empty response");
    }

    const parsed = JSON.parse(text);
    if (parsed.intent === "agentic" || parsed.intent === "fast" || parsed.intent === "balance") {
      return parsed.intent;
    }
  } catch {}

  return "balance";
};
