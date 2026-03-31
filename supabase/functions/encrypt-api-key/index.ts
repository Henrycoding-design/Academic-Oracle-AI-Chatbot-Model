import { serve } from "https://deno.land/std/http/server.ts";

// CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Text encoders
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Secret
const SECRET = Deno.env.get("API_KEY_ENCRYPTION_SECRET");
if (!SECRET) throw new Error("Missing encryption secret");


// Base64 helpers
function b64(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function fromB64(b64str: string) {
  return Uint8Array.from(atob(b64str), (c) => c.charCodeAt(0));
}

// AES key
const key = await crypto.subtle.importKey(
  "raw",
  fromB64(SECRET),
  "AES-GCM",
  false,
  ["encrypt", "decrypt"]
);

serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const { action, api_key } = payload;

  if (!action || !api_key) {
    return new Response("Missing action or api_key", {
      status: 400,
      headers: corsHeaders,
    });
  }

  try {
    if (action === "encrypt") {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoder.encode(api_key)
      );

      return new Response(
        JSON.stringify({
          iv: b64(iv.buffer),
          data: b64(encrypted),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (action === "decrypt") {
      if (!api_key.iv || !api_key.data) {
        throw new Error("Malformed encrypted payload");
      }

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromB64(api_key.iv) },
        key,
        fromB64(api_key.data).buffer
      );

      return new Response(
        JSON.stringify({ api_key: decoder.decode(decrypted) }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response("Invalid action", {
      status: 400,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("Encryption/Decryption Error:", err);
    
    return new Response("Crypto operation failed", {
      status: 400,
      headers: corsHeaders,
    });
  }
});
