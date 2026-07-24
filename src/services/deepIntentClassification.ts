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
import type { GeminiModelFlag } from "./models";

const DEEP_REASONING_REGEX = /\b(proof|prove|theorem|calculus|differential|integral|eigenvalue|schrodinger|thermodynamics|relativity|quantum|fourier|laplace|topology|manifold|isomorphism|homomorphism|q\.e\.d|derivation|formal proof|rigorous proof)\b/i;

export const classifyDeepIntent = async (
  encryptedKeyPayload: any,
  prompt: string
): Promise<boolean> => {
  // Fast Heuristic Check
  if (DEEP_REASONING_REGEX.test(prompt)) {
    return true;
  }

  const classificationPrompt = `
You are an academic depth classifier. Analyze whether the user prompt requires deep reasoning, mathematical proofs, advanced formal derivations, complex scientific theoretical analysis, or advanced algorithms.

User prompt:
${prompt}

Return JSON only:
{
  "isDeep": true | false
}
`;

  try {
    const model: GeminiModelFlag = "nano";

    const { data, error } = await supabase.functions.invoke("call-ai-response", {
      method: "POST",
      body: {
        provider: "gemini",
        model,
        prompt: classificationPrompt,
        temp: 0.1,
        encryptedKeyPayload,
      },
    });

    if (error || data?.error) {
      return false;
    }

    const text = data?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return false;

    const parsed = JSON.parse(text);
    return Boolean(parsed.isDeep);
  } catch {
    return false;
  }
};
