const MAX_CALLS_PER_SESSION = 60;
const MAX_CHATS = 3;
const CALLS_PER_CHAT = 20;

type SessionQuota = {
  used: number;
  chats: Record<string, number>;
};

export const getQuota = (): SessionQuota => {
  const raw = sessionStorage.getItem("oracle-quota");
  return raw ? JSON.parse(raw) : { used: 0, chats: {} };
};

export const saveQuota = (q: SessionQuota) =>
  sessionStorage.setItem("oracle-quota", JSON.stringify(q));

export const isOutOfQuota = (quota: SessionQuota): boolean => {
    if (quota.used >= MAX_CALLS_PER_SESSION) return true;
    const chatCounts = Object.values(quota.chats);
    if (chatCounts.length >= MAX_CHATS && chatCounts.every(count => count >= CALLS_PER_CHAT)) {
      return true;
    }
    return false;
}


