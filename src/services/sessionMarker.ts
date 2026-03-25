import { supabase } from "../services/supabaseClient";

const MAX_CALLS_PER_SESSION = 60;
const MAX_CHATS = 3;
const CALLS_PER_CHAT = 20;

type SessionQuota = {
  used: number;
  chats: Record<string, number>;
};

const getQuota = (): SessionQuota => {
  const raw = sessionStorage.getItem("oracle-quota");
  return raw ? JSON.parse(raw) : { used: 0, chats: {} };
};

const saveQuota = (q: SessionQuota) =>
  sessionStorage.setItem("oracle-quota", JSON.stringify(q));

const isOutOfQuota = (quota: SessionQuota): boolean => {
    if (quota.used >= MAX_CALLS_PER_SESSION) return true;
    const chatCounts = Object.values(quota.chats);
    if (chatCounts.length >= MAX_CHATS && chatCounts.every(count => count >= CALLS_PER_CHAT)) {
      return true;
    }
    return false;
}

const checkQuota = async (accessToken) => {
  const { data, error } = await supabase.functions.invoke(
    "rate-limit-check",
    {
      method: "POST",
      headers: {
        // ensure enough validation for edge function
        "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY, 
        "Authorization": `Bearer ${accessToken}`
      },
    }
  );

  if (error) throw error;
  return data;
};

export const canSendMessage = async (chatId: string, accessToken?: string) => {
  try {
    const backend = await checkQuota(accessToken);

    if (!backend.allowed) {
      return { allowed: false, source: "backend", reason: backend.reason };
    }

    return { allowed: true, new_chat: backend.new_chat };
  } catch (err) {
    console.error("canSendMessage failed:", err);
    // Fail closed -> better option here
    return { allowed: false, reason: "QUOTA_CHECK_FAILED" };
  }
};

