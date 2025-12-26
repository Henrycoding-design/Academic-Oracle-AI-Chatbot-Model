import { supabase } from "./supabaseClient";

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/encrypt-api-key`;

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No active session");
  return session.access_token;
}

export async function encryptApiKey(apiKey: string) {
  const token = await getAccessToken();

  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: "encrypt",
      api_key: apiKey,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Encryption failed: ${text}`);
  }
  return res.json(); // { iv, data }
}

export async function decryptApiKey(encrypted: {
  iv: string;
  data: string;
}) {
  const token = await getAccessToken();

  const res = await fetch(EDGE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      action: "decrypt",
      api_key: encrypted,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Decryption failed: ${text}`);
  }
  const { api_key } = await res.json();
  return api_key as string;
}
