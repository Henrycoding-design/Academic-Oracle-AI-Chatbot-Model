// index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// 🔑 Load keys
const GEMINI_KEYS = (Deno.env.get("GEMINI_KEYS") ?? "").split(",").filter(Boolean);
const STEPFUN_KEYS = (Deno.env.get("STEPFUN_KEYS") ?? "").split(",").filter(Boolean);

const KEY_MAP: Record<string, string[]> = {
  gemini: GEMINI_KEYS,
  stepfun: STEPFUN_KEYS,
};

function getRandomKey(keys: string[]) {
  if (keys.length === 0) return null;
  return keys[Math.floor(Math.random() * keys.length)];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth header" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // 🔐 Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.email || !user.id) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 📥 Parse request body
    let body: { provider?: string } = {};
    try {
      body = await req.json();
    } catch {}

    const provider = body.provider?.toLowerCase(); // no fallback since client want CORRECT key type

    if (!provider || !(provider in KEY_MAP)) {
      return new Response(JSON.stringify({ error: "INVALID_PROVIDER" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // 📥 Check profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("mode")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.mode !== "free") {
      return new Response(JSON.stringify({ error: "PROFILE_NOT_FOUND" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    // 🔀 Select key pool
    const keys = KEY_MAP[provider];
    if (!keys) { // shouldnt happen as we already checked earlier
      return new Response(JSON.stringify({ error: "INVALID_PROVIDER" }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    
    const key = getRandomKey(keys);

    if (!key) {
      return new Response(JSON.stringify({ error: "NO_KEYS_AVAILABLE" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const maskedKey = key.slice(0, 6) + "..." + key.slice(-4);

    return new Response(JSON.stringify({
      success: true,
      provider,
      mode: profile.mode,
      api_key: key,
      masked: maskedKey,
    }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});