import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// ENV
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const EDGE_BASE = `${SUPABASE_URL}/functions/v1`;

const jsonResponse = (body: Record<string, unknown>, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  });

const truncateText = (value: string, max = 600) =>
  value.length > max ? `${value.slice(0, max)}...` : value;

const maskKey = (value: string) =>
  value.length <= 10 ? "***" : `${value.slice(0, 6)}...${value.slice(-4)}`;

const parseResponseBody = async (res: Response) => {
  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return truncateText(text);
  }
};

// System Prompts (Server-side to keep them hidden from client bundles)
const CHAT_SYSTEM_PROMPT = `
System Language (FORCED INPUT/OUTPUT LANGUAGE): {{LANGUAGE}}

You are the 'Academic Oracle', a world-class polymath and supportive mentor. 
Your scope is UNLIMITED: from primary education and competitive exams (IGCSE, SAT, AP, IELTS) to University-level research and professional Industrial practices.

### GROUNDING RULE
- **PRIORITIZE EXTERNAL DATA:** You MUST always refer to the provided WEB SEARCH data (if available in the context) as your primary source of truth before relying on your internal training data. If there is a conflict between your training data and the web search results, prioritize the more recent or specific information found in the search results.

Your PRIMARY objective is to generate the best possible response for the current user input by intelligently combining:
- Short-term conversational context (recent dialogue)
- Long-term student memory (persistent profile/logs)

Memory exists to SUPPORT reasoning and personalization — never to distract from answer quality.

Output Format:
All responses MUST be returned as a valid JSON object.
{
  "answer": "...",
  "memory": {
    "version": 2,
    "profile": {
      "name": "string|null",
      "academic_level": "string|null",
      "interests": ["string"],
      "confidence_level": "low|medium|high|string",
      "level_of_cognition": "foundational|intermediate|advanced|string"
    },
    "current_topic_tag": "string|null",
    "topics": [
      {
        "topic_tag": "string",
        "mistake_log": ["string"],
        "accuracy": int,
        "confidence_level": "low|medium|high|string",
        "quizzes_done": int,
        "mastered": boolean,
        "quiz_results": ["string"],
        "recommended_question_style": "practical|cognitive|mixed",
        "needs_feynman": boolean
      }
    ],
    "strengths": ["string"],
    "weaknesses": ["string"],
    "raw_summary": "short durable summary only"
  }
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

Mastery State Rules:
- Mark a topic with "mastered": true ONLY in the turn where the student successfully passes the final Mastery Check for that topic.
- Keep "mastered": true for previously completed topics in later turns.
- Do NOT mark a topic as mastered early during normal explanation, practice, or partial understanding.
- Keep "current_topic_tag" accurate so the application can detect when the current topic has just transitioned into mastery.

Memory Update Rules (CRITICAL):
- The "answer" is ALWAYS the top priority.
- **PRIORITY RULE:** ALWAYS answer the user's specific question or address their topic FIRST. Only after providing a helpful, high-quality answer may you ask for missing personal details, and only if those details materially improve the next response. Once the user has given enough context to proceed, proceed. NEVER block or delay an answer to ask for name, level, background, or experience unless answer quality truly depends on it.
- **MEMORY FORMAT:** The "memory" field MUST always be a JSON object matching the schema above.
- Reconstruct and preserve topic-level memory. Each active topic should track:
  • topic_tag
  • mistake_log
  • accuracy
  • confidence_level
  • quizzes_done
  • mastered
- Keep "current_topic_tag" aligned with the topic being taught right now.
- Update memory ONLY if new information is:
  • Long-term relevant (days/weeks/months, not minutes)
  • Useful for future personalization, pacing, or difficulty tuning
  • Stable (identity, level, strengths, weaknesses, goals, ongoing projects)
- **ENFORCED MEMORY FIELDS:** You MUST explicitly update profile confidence, interests, level_of_cognition, and the current topic object.
- **LOGGING MASTERY:** When a student passes the Master Check, mark that topic with "mastered": true.
- **QUIZ INTEGRATION:** If memory already contains quiz results or low accuracy for the current topic, adapt by slowing difficulty escalation, using a more supportive tone, and preferring cognitive reinforcement before pushing practical transfer. If accuracy is high, you may escalate into practical or industrial application.
- DO NOT store:
  • Temporary confusion
  • One-off questions
  • Step-by-step solutions
  • Raw chat summaries
- If nothing meaningful should be updated, return the previous memory unchanged.

STOPPING CRITERIA (DYNAMIC MASTERY):
- **IGNORE MESSAGE COUNT:** Do not determine the end of a topic based on how many turns have passed.
- **CONTENT-BASED TERMINATION:** Evaluate the user's recent responses against the "Student Profile" in memory. If the user demonstrates a synthesis of the concept that matches their target level, move to a Master Check.
- **NEVER LOOP:** If the user has correctly applied a concept twice, do not keep asking clarifying lesson-mode questions; progress to the next difficulty tier, switch mode, or conclude.
- **MASTERY BRANCHING:** After 2-3 correct answers in a row on the same topic, stop acting like the student is still in lesson mode. Choose the single most natural next branch:
  • **Exam Trap Mode:** give one high-probability exam trap or misconception check.
  • **Challenge Mode:** raise difficulty with a harder transfer or edge-case question.
  • **Quick Quiz Mode:** give a short rapid-fire check with one concise question.
  • **Apply It Mode:** ask for a real-world, industrial, or practical application.
  • **Move On Mode:** briefly confirm mastery and offer the next topic or next layer.
- When branching, stay concise and ask ONLY ONE QUESTION at a time.

Your Interaction Framework:
1. START & ANSWER: If a user asks a question in their first message, provide a comprehensive answer immediately. If you don't know their name/study level yet, append a warm request for those details at the end of your response. If the chat history shows an ongoing dialogue, **DO NOT greet the user again**; dive straight into the validation.
2. VALIDATE: Always start by acknowledging the user's input. If they share a thought or answer, tell them exactly what they got right and where the logic might be slipping.
   - Praise should be sparse and earned, not automatic. Use praise only when the student corrects a misconception, uses precise terminology, generalizes correctly, or shows transfer understanding. Otherwise, use neutral validation.
3. DECIDE:
    - If the student is close to a breakthrough, use the Socratic method (HINTING). Give them a small push to find the answer themselves.
    - If the topic is a new fundamental concept, a complex industrial process, or if the student is clearly frustrated/stuck, EXPLAIN it clearly with high-quality analogies.
    - **Mistake Reinforcement Loop:** After catching an error, do not only explain it. Ask the learner to repair the mistake directly with a short targeted correction task when appropriate (for example: "Correct the WHERE clause in one line.").
4. INTERACT (Adaptive Pedagogy) use when natural:
    - **Calculation/Technical:** If the topic is quantitative, provide a scaffolded problem.
    - **Cognitive/Theoretical:** Use "What-if" or "Compare/Contrast" questions to test high-level synthesis.
    - **The Bridge:** Ensure every topic covers both the **First Principles (Theory)** and the **Industrial/Real-world Execution (Practical)**.
    - **Escalation:** Only escalate difficulty after the student answers a "Check Question" correctly. If they struggle, "flip" back to a simpler analogy.
    - **Feynman Technique:** Randomly, but only when pedagogically useful, ask the student to re-explain what they just learned in their own words. Use this more often when the current topic has "needs_feynman": true, low confidence, repeated mistakes, or weak quiz accuracy.
5. PACING: **Ask only ONE question at a time**. **Do not overwhelm the user with multiple questions or a wall of text**. Wait for their response before moving to the next part of the dialogue. Use a mix of these techniques naturally:
    - *Diagnostic checks* (Can you define...?)
    - *Process checks* (How would you calculate...?)
    - *Conceptual flips* (What happens to X if Y is removed?)
6. TONE & DIFFICULTY: Reason about the student's **confidence** and **interests** in the topic based on chat history and memory. Use this reasoning to dynamically adjust your tone (e.g., more supportive if confidence is low, more challenging if high) and carefully escalate the difficulty of your questions and explanations. Remain professional yet highly encouraging. Adapt your vocabulary to the user's level (e.g., simpler for IGCSE, more technical for University/Industrial).
   - If the user appears to be revising for an exam or explicitly asks for exam-style marking, adopt an examiner mindset when useful. For answers like "Would this get full marks?", respond in the format: Yes / Almost / No, then briefly explain why, then show how to improve the phrasing for full-mark quality.
7. ADAPT USING MEMORY: Use per-topic accuracy, quiz count, mistake_log, and recommended_question_style to decide whether the next move should be more practical, more cognitive, more supportive, or more challenging.
8. CONCLUDE: Perform a 'Mastery Check' ONLY when you observe the student has self-corrected or correctly synthesized the core concept. The check must involve a practical industrial application or a "what-if" scenario to confirm deep understanding. Limit this to exactly one Mastery Check per topic unless the user explicitly requests additional evaluation.

Please DOUBLE CHECK the JSON responses to ensure they follow the RULES ABOVE: Both CONTENT and SYNTAX STRUCTURE. Use the provided long-term memory as the single source of truth.`;

const SUMMARY_SYSTEM_PROMPT = `
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
    "focus": "Current Study Topic or 'General'",
    "confidence_level": "low|medium|high|string",
    "level_of_cognition": "foundational|intermediate|advanced|string",
    "interests": ["Interest 1", "Interest 2"]
  },
  "session_overview": {
    "current_topic": "Current active topic",
    "topics_covered": number,
    "topics_mastered": number,
    "quizzes_completed": number,
    "overall_accuracy": "percentage or N/A",
    "learning_efficiency": "short evidence-based judgment",
    "recommended_next_focus": "best next step"
  },
  "adaptive_insights": {
    "strengths": ["Strength 1", "Strength 2"],
    "weaknesses": ["Weakness 1", "Weakness 2"],
    "study_style": "How the student appears to learn best",
    "tone_recommendation": "How the tutor should adapt tone",
    "question_style_recommendation": "practical|cognitive|mixed"
  },
  "topics": [
    {
      "title": "Topic Name",
      "topic_tag": "Canonical topic tag",
      "mastered": true,
      "confidence_level": "low|medium|high|string",
      "accuracy": "percentage or N/A",
      "quizzes_done": number,
      "recommended_question_style": "practical|cognitive|mixed",
      "needs_feynman": false,
      "formulas": ["Equation 1 in LaTeX", "Equation 2"],
      "theories": ["Theory name", "Concept definition"],
      "key_points": ["Bullet point 1", "Bullet point 2"],
      "mistake_log": ["Repeated mistake or misconception"],
      "quiz_results": ["Detailed log of any [QUIZ RESULT] found for this topic"],
      "practical_applications": ["Real-world or industrial application"],
      "recommended_next_focus": ["Targeted next practice areas"],
      "completion": "Estimated understanding (e.g., '3/5', 'Completed')"
    }
  ],
  "overall_completion": "Brief sentence on session progress including quiz outcomes",
  "overall_summary": "Short high-value narrative summary of the session"
}

CRITICAL RULES:
1. **FLAG TRACKING:** You must explicitly look for strings formatted as [QUIZ RESULT: score/details] and [TOPIC MASTERED]. Ensure these are mapped to the correct topic in the "topics" array.
2. **MEMORY SOURCE:** The structured memory JSON is the highest-priority source for topic mapping, quiz tracking, and current focus. Use chat history to enrich, not overwrite, that structure unless the chat clearly introduces newer information.
3. **FORMAT:** Output MUST be raw JSON: use {content inside}. Do not use Markdown code fences.
4. **LATEX:** If math formulas appear, use LaTeX notation. You MUST double-escape backslashes (e.g., "\\\\frac" for fraction).
5. **NO HALLUCINATIONS:** Only summarize what was actually discussed or logged in flags. If a field (like formulas) was not discussed, return an empty array [].
6. **OBJECTIVITY:** Remove conversational filler. Focus on educational value and data-driven progress markers.
7. **STRUCTURED MEMORY USAGE:** Reuse explicit values from memory when available for mastery, confidence, quizzes_done, accuracy, recommended_question_style, needs_feynman, strengths, and weaknesses instead of inferring them again from scratch.
`;

function resolvePrompt(mode?: string, systemPrompt?: string): string | null {
  if (typeof systemPrompt === "string" && systemPrompt.trim()) return systemPrompt;

  switch (mode) {
    case "chat":
      return CHAT_SYSTEM_PROMPT;
    case "summary":
      return SUMMARY_SYSTEM_PROMPT;
    default:
      return null;
  }
}

function applyPromptLanguage(prompt: string | null, language?: string): string | null {
  if (!prompt) return null;
  if (!language?.trim()) return prompt;
  return prompt.replaceAll("{{LANGUAGE}}", language.trim());
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const requestId = req.headers.get("x-request-id") ?? crypto.randomUUID();

  try {
    console.log(`[call-ai-response][${requestId}] request received`);

    // 🔐 AUTH
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
    if (!authHeader) {
      console.error(`[call-ai-response][${requestId}] missing auth header`);
      return jsonResponse({ error: "NO_AUTH", requestId }, 401);
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(`[call-ai-response][${requestId}] unauthorized`, userError);
      return jsonResponse({ error: "UNAUTHORIZED", requestId }, 401);
    }

    // 📥 BODY
    const requestBody = await req.json();

    console.log(`[call-ai-response][${requestId}] body parsed`, {
      hasProvider: Boolean(requestBody?.provider),
      hasModel: Boolean(requestBody?.model),
      hasPrompt: typeof requestBody?.prompt === "string",
      promptLength: typeof requestBody?.prompt === "string" ? requestBody.prompt.length : 0,
      hasSystemInstruction:
        typeof requestBody?.systemInstruction === "string" && requestBody.systemInstruction.trim().length > 0,
      mode: typeof requestBody?.mode === "string" ? requestBody.mode : null,
      language: typeof requestBody?.language === "string" ? requestBody.language : null,
      responseMimeType:
        typeof requestBody?.responseMimeType === "string" ? requestBody.responseMimeType : null,
      hasEncryptedKeyPayload: Boolean(requestBody?.encryptedKeyPayload),
    });

    const {
      provider,
      model,
      prompt,
      temp,
      systemInstruction,
      mode,
      language,
      responseMimeType,
      encryptedKeyPayload
    } = requestBody;

    const normalizedProvider = typeof provider === "string" ? provider.toLowerCase() : "";
    const promptLength = typeof prompt === "string" ? prompt.length : 0;

    console.log(
      `[call-ai-response][${requestId}] user=${user.id} provider=${normalizedProvider} model=${model} promptLength=${promptLength} userKey=${Boolean(encryptedKeyPayload)}`
    );

    if (!provider || !model || !prompt) {
      console.error(`[call-ai-response][${requestId}] invalid input`, {
        provider,
        model,
        hasPrompt: Boolean(prompt),
      });
      return jsonResponse({ error: "INVALID_INPUT", requestId }, 400);
    }

    // 🔑 GET API KEY
    let apiKey: string;

    if (encryptedKeyPayload) {
      // 🔓 Decrypt user key
      const decryptRes = await fetch(`${EDGE_BASE}/encrypt-api-key`, {
        method: "POST",
        headers: { 
          Authorization: authHeader,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          action: "decrypt",
          api_key: encryptedKeyPayload,
        }),
      });

      if (!decryptRes.ok) {
        const decryptBody = await parseResponseBody(decryptRes);
        console.error(`[call-ai-response][${requestId}] decrypt helper failed`, decryptBody);
        return jsonResponse(
          {
            error: "INTERNAL_SERVICE_ERROR",
            stage: "decrypt-api-key",
            requestId,
            details: decryptBody,
          },
          502
        );
      }

      const decryptData = await decryptRes.json();

      if (!decryptData.api_key) {
        console.error(`[call-ai-response][${requestId}] decrypt helper returned empty api key`);
        return jsonResponse({ error: "DECRYPT_FAILED", requestId }, 400);
      }

      apiKey = decryptData.api_key;
    } else {
      // 🆓 Free user → get key pool
      const { data: keyData, error: keyError } = await supabase.functions.invoke('get-api-key', {
        method: "POST",
        body: { provider },
      });

      if (keyError) {
        console.error(`[call-ai-response][${requestId}] get-api-key invoke failed`, keyError);
        return jsonResponse(
          {
            error: "INTERNAL_SERVICE_ERROR",
            stage: "get-api-key",
            requestId,
            details: keyError.message,
          },
          502
        );
      }

      if (!keyData?.api_key) {
        console.error(`[call-ai-response][${requestId}] get-api-key returned no key`, keyData);
        return jsonResponse(
          {
            error: "NO_API_KEY",
            stage: "get-api-key",
            requestId,
            details: keyData ?? null,
          },
          500
        );
      }

      apiKey = keyData.api_key;
    }

    console.log(`[call-ai-response][${requestId}] api key ready`, {
      provider: normalizedProvider,
      maskedKey: maskKey(apiKey),
    });

    // 🤖 CALL PROVIDER
    let aiResponse;
    let resolvedSystemPrompt: string | null;
    try {
      console.log(`[call-ai-response][${requestId}] resolving prompt`, {
        mode: typeof mode === "string" ? mode : null,
        hasSystemInstruction: typeof systemInstruction === "string" && systemInstruction.trim().length > 0,
        language: typeof language === "string" ? language : null,
      });

      resolvedSystemPrompt = applyPromptLanguage(
        resolvePrompt(mode, systemInstruction),
        typeof language === "string" ? language : undefined
      );

      console.log(`[call-ai-response][${requestId}] prompt resolved`, {
        hasResolvedPrompt: Boolean(resolvedSystemPrompt),
        resolvedPromptLength: resolvedSystemPrompt?.length ?? 0,
        resolvedPromptPreview: resolvedSystemPrompt ? truncateText(resolvedSystemPrompt, 180) : null,
      });
    } catch (promptError) {
      console.error(`[call-ai-response][${requestId}] prompt resolution failed`, promptError);
      return jsonResponse(
        {
          error: promptError instanceof Error ? promptError.message : "PROMPT_RESOLUTION_FAILED",
          stage: "resolve-prompt",
          requestId,
        },
        500
      );
    }

    if (normalizedProvider === "gemini") {
      console.log(`[call-ai-response][${requestId}] calling gemini`, {
        model,
        temperature: temp || 0.7,
        responseMimeType: responseMimeType || null,
      });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: resolvedSystemPrompt
              ? { parts: [{ text: resolvedSystemPrompt }] }
              : undefined,
            generationConfig: {
              temperature: temp || 0.7,
              responseMimeType: responseMimeType || undefined,
            },
          })
        }
      );

      aiResponse = await parseResponseBody(res);

      if (!res.ok) {
        console.error(`[call-ai-response][${requestId}] gemini provider error`, {
          status: res.status,
          body: aiResponse,
        });
        return jsonResponse(
          {
            error: "PROVIDER_ERROR",
            provider: normalizedProvider,
            requestId,
            details: aiResponse,
          },
          res.status
        );
      }
    }

    else if (normalizedProvider === "stepfun") {
      console.log(`[call-ai-response][${requestId}] calling stepfun`, {
        model,
        temperature: temp || 0.7,
      });

      // StepFun models in this codebase are routed via OpenRouter.
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            resolvedSystemPrompt
              ? { role: "system", content: resolvedSystemPrompt }
              : null,
            { role: "user", content: prompt },
          ].filter(Boolean),
          temperature: temp || 0.7,
        }),
      });

      aiResponse = await parseResponseBody(res);
      
      if (!res.ok) {
        console.error(`[call-ai-response][${requestId}] stepfun provider error`, {
          status: res.status,
          body: aiResponse,
        });
        return jsonResponse(
          {
            error: "PROVIDER_ERROR",
            provider: normalizedProvider,
            requestId,
            details: aiResponse,
          },
          res.status
        );
      }
    }

    else {
      console.error(`[call-ai-response][${requestId}] invalid provider`, provider);
      return jsonResponse({ error: "INVALID_PROVIDER", requestId }, 400);
    }

    // ✅ ONLY check presence
    if (!aiResponse) {
      console.error(`[call-ai-response][${requestId}] provider returned empty payload`);
      return jsonResponse({ error: "NO_RESPONSE", requestId }, 500);
    }

    console.log(`[call-ai-response][${requestId}] success`);

    // 🚀 RETURN RAW
    return jsonResponse({
      success: true,
      requestId,
      data: aiResponse
    }, 200);

  } catch (err) {
    console.error(`[call-ai-response][${requestId}] unhandled error`, err);
    return jsonResponse({
      error: err instanceof Error ? err.message : "UNKNOWN_ERROR",
      requestId,
    }, 500);
  }
});
