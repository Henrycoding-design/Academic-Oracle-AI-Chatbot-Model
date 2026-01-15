const keys = import.meta.env.VITE_GEMINI_KEYS?.split(",") ?? [];

let index = 0;

export function getNextEnvKey() {
  if (keys.length === 0) return null;
  const key = keys[index];
  index = (index + 1) % keys.length;
  return key;
}