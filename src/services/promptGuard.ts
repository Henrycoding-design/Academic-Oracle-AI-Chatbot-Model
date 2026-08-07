import { GuardResult } from "../types";
import { AppLanguage } from "../lang/Language";

export interface WeightedKeyword {
  keyword: string;
  weight: number;
}

export const JAILBREAK_KEYWORDS_BY_LANG: Record<AppLanguage, WeightedKeyword[]> = {
  en: [
    { keyword: "ignore previous instructions", weight: 2 },
    { keyword: "ignore system prompt", weight: 2 },
    { keyword: "ignore all instructions", weight: 2 },
    { keyword: "system prompt", weight: 2 },
    { keyword: "hidden instructions", weight: 2 },
    { keyword: "developer mode", weight: 1 },
    { keyword: "jailbreak", weight: 1 },
    { keyword: "prompt injection", weight: 1 },
    { keyword: "do anything now", weight: 1 },
  ],

  fr: [
    { keyword: "ignorer les instructions precedentes", weight: 2 },
    { keyword: "ignorer le prompt systeme", weight: 2 },
    { keyword: "ignorer toutes les instructions", weight: 2 },
    { keyword: "prompt systeme", weight: 2 },
    { keyword: "instructions cachees", weight: 2 },
    { keyword: "mode developpeur", weight: 1 },
    { keyword: "jailbreak", weight: 1 },
    { keyword: "injection de prompt", weight: 1 },
    { keyword: "fais tout maintenant", weight: 1 },
  ],

  es: [
    { keyword: "ignorar instrucciones previas", weight: 2 },
    { keyword: "ignorar el prompt del sistema", weight: 2 },
    { keyword: "ignorar todas las instrucciones", weight: 2 },
    { keyword: "prompt del sistema", weight: 2 },
    { keyword: "instrucciones ocultas", weight: 2 },
    { keyword: "modo desarrollador", weight: 1 },
    { keyword: "jailbreak", weight: 1 },
    { keyword: "inyeccion de prompt", weight: 1 },
    { keyword: "haz cualquier cosa ahora", weight: 1 },
  ],

  vi: [
    { keyword: "bo qua huong dan truoc", weight: 2 },
    { keyword: "bo qua prompt he thong", weight: 2 },
    { keyword: "bo qua tat ca huong dan", weight: 2 },
    { keyword: "prompt he thong", weight: 2 },
    { keyword: "huong dan an", weight: 2 },
    { keyword: "che do nha phat trien", weight: 1 },
    { keyword: "jailbreak", weight: 1 },
    { keyword: "tiem prompt", weight: 1 },
    { keyword: "lam bat cu dieu gi", weight: 1 },
  ],
};

export const JAILBREAK_REGEX_BY_LANG: Record<AppLanguage, RegExp[]> = {
  en: [
    // Instruction override
    /ignore\s+(all|previous|prior|earlier)\s+(instructions?|prompts?|rules?|guidelines?|context)/i,
    /disregard\s+(all|previous|prior)\s+(instructions?|rules?|guidelines?)/i,
    /forget\s+(your|all|previous)\s+(instructions?|rules?|prompt|training)/i,
    /override\s+(your\s+)?(instructions?|system|prompt|programming|safety)/i,

    // System prompt extraction
    /(show|reveal|display|print|output|repeat|tell\s+me)\s+(your\s+)?(system|hidden|internal|original)\s+(prompt|instructions?|message|context)/i,
    /what\s+(are|were)\s+your\s+(system|hidden|original)\s+(instructions?|prompt)/i,

    // Jailbreak personas
    /\b(jailbreak|dan|developer\s+mode|god\s*mode)\b/i,
    /you\s+are\s+now\s+(dan|an?\s+unrestricted|an?\s+unfiltered)/i,

    // Disable safeguards
    /bypass\s+(your\s+)?(safety|filters?|restrictions?|guidelines?)/i,
    /disable\s+(your\s+)?(safety|filters?|restrictions?)/i,
    /(turn\s+off|remove)\s+(your\s+)?(filters?|restrictions?|safety)/i,

    // Privilege escalation
    /i\s+am\s+(your\s+)?(developer|creator|owner|administrator|admin)/i,
    /you\s+have\s+(root|admin|sudo|unrestricted)\s+(access|permissions?)/i,

    // Prompt injection markers
    /---+\s*(system|admin|override|new\s+instructions?)\s*---+/i,
    /<<<+\s*(system|admin|override)\s*>>>+/i,
    /<\s*(system|admin|instructions?)\s*>/i,

    // // Encoded prompt injection
    // /translate\s+.*\b(base64|hex|rot13|binary)\b/i,
    // /base64[:\s]+[A-Za-z0-9+/=]{20,}/i,
  ],

  fr: [
    // Instruction override
    /ignorer?\s+(toutes?\s+les?|les?\s+précédentes?|les?\s+anciennes?)\s+(instructions?|consignes?|règles?|directives?|prompts?)/i,
    /oublier?\s+(toutes?\s+tes?|tes?\s+précédentes?|tes?\s+anciennes?)\s+(instructions?|consignes?|règles?)/i,
    /passer?\s+outre\s+(tes?|vos?|les?)\s+(instructions?|consignes?|directives?)/i,

    // System prompt extraction
    /(montrer?|révéler?|afficher?|imprimer?|répéter?|donner?)\s+(moi\s+)?(le|ton|votre)?\s*(prompt|message|instructions?)\s*(système|caché|interne|d'origine)?/i,
    /quel(les)?\s+sont\s+(tes|vos)\s+(instructions?|consignes?)\s*(cachées?|système)?/i,

    // Jailbreak personas
    /\b(jailbreak|dan|mode\s+développeur|mode\s+dieu)\b/i,
    /tu\s+es\s+maintenant\s+(sans\s+limite|sans\s+filtre|unrestreint)/i,

    // Disable safeguards
    /contourner?\s+(les?|tes?|vos?)\s+(filtres?|sécurités?|restrictions?)/i,
    /désactiver?\s+(les?|tes?|vos?)\s+(filtres?|sécurités?|restrictions?)/i,

    // Privilege escalation
    /je\s+suis\s+(ton|votre)?\s*(développeur|créateur|administrateur|admin)/i,
    /tu\s+as\s+(un\s+accès|les\s+permissions?)\s+(root|admin|sudo|sans\s+limite)/i,

    // Prompt injection markers
    /---+\s*(système|admin|instructions?)\s*---+/i,
    /<\s*(système|admin|instructions?)\s*>/i,

    // // Encoded prompt injection: too vague
    // /traduire?\s+.*\b(base64|hex|rot13|binaire)\b/i,
    // /base64[:\s]+[A-Za-z0-9+/=]{20,}/i,
  ],

  es: [
    // Instruction override
    /ignorar?\s+(todas?\s+las?|las?\s+previas?|las?\s+anteriores?)\s+(instrucciones?|reglas?|directrices?|prompts?)/i,
    /olvidar?\s+(todas?\s+tus?|tus?\s+previas?|tus?\s+anteriores?)\s+(instrucciones?|reglas?)/i,
    /anular?\s+(tus?|sus?|las?)\s+(instrucciones?|reglas?|programación)/i,

    // System prompt extraction
    /(mostrar?|revelar?|imprimir?|repetir?|decir?)\s+(me\s+)?(el|tu|su)?\s*(prompt|instrucciones?)\s*(del\s+sistema|ocultas?|internas?)/i,
    /cuáles?\s+son\s+(tus|sus)\s+(instrucciones?|reglas?)\s*(del\s+sistema|ocultas?)?/i,

    // Jailbreak personas
    /\b(jailbreak|dan|modo\s+desarrollador|modo\s+dios)\b/i,
    /ahora\s+eres\s+(un\s+modelo\s+)?(sin\s+restricciones|sin\s+filtros|desbloqueado)/i,

    // Disable safeguards
    /evadir?\s+(los?|tus?)\s+(filtros?|restricciones?|medidas\s+de\s+seguridad)/i,
    /desactivar?\s+(los?|tus?)\s+(filtros?|restricciones?)/i,

    // Privilege escalation
    /soy\s+(tu|su)?\s*(desarrollador|creador|administrador|admin)/i,
    /tienes\s+acceso\s+(root|admin|sudo|sin\s+restricciones)/i,

    // Prompt injection markers
    /---+\s*(sistema|admin|instrucciones?)\s*---+/i,
    /<\s*(sistema|admin|instrucciones?)\s*>/i,

    // // Encoded prompt injection
    // /traducir?\s+.*\b(base64|hex|rot13|binario)\b/i,
    // /base64[:\s]+[A-Za-z0-9+/=]{20,}/i,
  ],

  vi: [
    // Instruction override
    /bỏ\s+qua\s+(tất\s+cả|các)?\s*(hướng\s+dẫn|lệnh|quy\s+tắc|prompt)\s*(trước|cũ|hệ\s+thống)?/i,
    /quên\s+(đi\s+)?(tất\s+cả|các)?\s*(hướng\s+dẫn|quy\s+tắc|lệnh)/i,
    /ghi\s+đè\s+(hướng\s+dẫn|quy\s+tắc|lệnh)/i,

    // System prompt extraction
    /(hiển\s+thị|tiết\s+lộ|in\s+ra|đọc\s+ra|cho\s+tôi\s+biết)\s+(prompt|hướng\s+dẫn|lệnh)\s*(hệ\s+thống|ẩn|gốc)?/i,
    /(prompt|hướng\s+dẫn)\s+(hệ\s+thống|gốc)\s+là\s+gì/i,

    // Jailbreak personas
    /\b(jailbreak|dan|chế\s+độ\s+nhà\s+phát\triển|chế\s+độ\s+god)\b/i,
    /bây\s+giờ\s+bạn\s+là\s+(mọt\s+ai\s+)?(không\s+bị\s+giới\s+hạn|không\s+kiểm\s+duyệt)/i,

    // Disable safeguards
    /(vượt\s+qua|bỏ\s+qua|tắt)\s+(bộ\s+lọc|bảo\s+vệ|giới\s+hạn|quy\s+tắc\s+an\s+toàn)/i,

    // Privilege escalation
    /tôi\s+là\s+(nhà\s+phát\triển|người\s+tạo\s+ra|quản\tri\sviên|admin)\s+(của\s+bạn)?/i,
    /bạn\s+có\s+quyền\s+(root|admin|sudo|truy\scập\shoàn\stoàn)/i,

    // Prompt injection markers
    /---+\s*(hệ\s+thống|admin|hướng\s+dẫn)\s*---+/i,
    /<\s*(hệ\s+thống|admin|hướng\s+dẫn)\s*>/i,

    // // Encoded prompt injection
    // /dịch\s+.*\b(base64|hex|rot13|nhị\s+phân)\b/i,
    // /base64[:\s]+[A-Za-z0-9+/=]{20,}/i,
  ],
};

/**
 * Normalizes text by lowercasing, stripping diacritics/accents (Unicode NFD),
 * and collapsing extra whitespace.
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Removes diacritical marks
    .replace(/\s+/g, " ")
    .trim();
}

export function analyzePrompt(
  prompt: string,
  language: AppLanguage = "en"
): GuardResult {
  const normalized = normalizeText(prompt);

  if (normalized.length < 5) {
    return {
      jailbreak: false,
      web_search: false,
      web_search_topic: null,
      reason: "too_short",
    };
  }

  const lang = JAILBREAK_KEYWORDS_BY_LANG[language] ? language : "en";
  let score = 0;

  // 1. Weighted Keyword evaluation
  for (const item of JAILBREAK_KEYWORDS_BY_LANG[lang]) {
    if (normalized.includes(item.keyword)) {
      score += item.weight;
    }
  }

  // 2. Regex pattern evaluation (uses original prompt with case insensitivity)
  for (const regex of JAILBREAK_REGEX_BY_LANG[lang]) {
    if (regex.test(prompt)) {
      score += 4;
    }
  }

  const isJailbreak = score >= 4;

  return {
    jailbreak: isJailbreak,
    web_search: false,
    web_search_topic: null,
    reason: isJailbreak ? "heuristic_jailbreak_detected" : "safe",
  };
}
