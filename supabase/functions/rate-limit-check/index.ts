// index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const MAX_CALLS_PER_SESSION = 60;
const MAX_CHATS = 3;
const CALLS_PER_CHAT = 20;

serve(async (req) => {
  // 1. Handle CORS Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    
    const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");

    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth header provided" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // 🔐 Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const email = user.email;

    // 🧱 STEP 1: Ensure row exists (idempotent)
    const { error: upsertError } = await supabase.from("usage").upsert(
      { email, calls_per_chat: 0, chats: 1 },
      { onConflict: "email", ignoreDuplicates: true }
    );

    if (upsertError) {
      return new Response(JSON.stringify({ error: "DB_INIT_FAILED" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // 📥 STEP 2: Fetch fresh usage
    const { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("*")
      .eq("email", email)
      .single();

    if (usageError || !usage) {
      return new Response(JSON.stringify({ error: "Failed to fetch usage" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const now = new Date();
    const lastReset = new Date(usage.last_reset);

    // 24h reset window
    const RESET_INTERVAL = 24 * 60 * 60 * 1000;

    let usageData = usage;

    if (now.getTime() - lastReset.getTime() > RESET_INTERVAL) {
      // 🔄 Reset user usage
      const { data: resetData, error: resetError } = await supabase
        .from("usage")
        .update({
          calls_per_chat: 0,
          chats: 1,
          last_reset: now.toISOString(),
          updated_at: now.toISOString(),
        })
        .eq("email", email)
        .select()
        .single();

      if (resetError || !resetData) {
        return new Response(JSON.stringify({ error: "RESET_FAILED" }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      usageData = resetData;
    }

    const totalCalls = usageData.calls_per_chat + (usageData.chats - 1) * CALLS_PER_CHAT;

    // 🚫 LIMIT CHECKS
    if (totalCalls >= MAX_CALLS_PER_SESSION) {
      return new Response(JSON.stringify({ allowed: false, reason: "MAX_CALLS" }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // 🧠 CASE: chat limit reached → try new chat
    if (usageData.calls_per_chat >= CALLS_PER_CHAT) {
      if (usageData.chats >= MAX_CHATS) {
        return new Response(JSON.stringify({ allowed: false, reason: "MAX_CHATS" }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      // ➕ Start new chat
      const { data: newChatData, error: newChatError } = await supabase
        .from("usage")
        .update({
          chats: usageData.chats + 1,
          calls_per_chat: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .lt("chats", MAX_CHATS)
        .select();

      if (newChatError) {
        return new Response(JSON.stringify({ allowed: false, reason: "DB_ERROR" }), {
          status: 500,
          headers: corsHeaders,
        });
      }

      if (!newChatData || newChatData.length === 0) {
        return new Response(JSON.stringify({ allowed: false, reason: "MAX_CHATS_RACE" }), {
          status: 200,
          headers: corsHeaders,
        });
      }

      return new Response(JSON.stringify({ allowed: true, new_chat: true }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // ➕ Normal increment
    const { data, error: updateError } = await supabase
      .from("usage")
      .update({
        calls_per_chat: usageData.calls_per_chat + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .lt("calls_per_chat", CALLS_PER_CHAT)
      .select();

    if (updateError) {
      return new Response(JSON.stringify({ allowed: false, reason: "DB_ERROR" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({ allowed: false, reason: "LIMIT_REACHED_RACE" }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ allowed: true }), {
      status: 200,
      headers: corsHeaders,
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: `Error: ${err.message}` }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});