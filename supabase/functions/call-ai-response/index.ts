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
    const {
      provider,
      model,
      prompt,
      temp,
      systemInstruction,
      responseMimeType,
      encryptedKeyPayload
    } = await req.json();

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

    if (normalizedProvider === "gemini") {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: systemInstruction
              ? { parts: [{ text: systemInstruction }] }
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
            systemInstruction
              ? { role: "system", content: systemInstruction }
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
