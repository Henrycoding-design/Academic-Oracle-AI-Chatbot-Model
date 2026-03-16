import { GuardResult } from "../types";
import { AppLanguage } from "../lang/Language";

const WEB_KEYWORDS_BY_LANG: Record<AppLanguage, string[]> = {
  en: [
    "latest",
    "today",
    "news",
    "current",
    "recent",
    "update",
    "release",
    "who is",
    "price of",
    "stock",
    "weather",
    "search",
    "look up",
    "find information",
    "statistics",
    "data for",
    "latest research",
    "latest release,",
  ],
  fr: [
    "dernier",
    "aujourd'hui",
    "nouvelles",
    "actuel",
    "récent",
    "mise à jour",
    "sortie",
    "qui est",
    "prix de",
    "action",
    "météo",
    "rechercher",
    "trouver des informations",
    "statistiques",
    "données pour",
    "dernières recherches",
    "dernière version",
  ],
  es: [
    "último",
    "hoy",
    "noticias",
    "actual",
    "reciente",
    "actualizar",
    "lanzamiento",
    "quién es",
    "precio de",
    "bolsa",
    "clima",
    "buscar",
    "buscar información",
    "estadísticas",
    "datos para",
    "última investigación",
    "última versión",
  ],
  vi: [
    "mới nhất",
    "hôm nay",
    "tin tức",
    "hiện tại",
    "gần đây",
    "cập nhật",
    "phát hành",
    "ai là",
    "giá của",
    "cổ phiếu",
    "thời tiết",
    "tìm kiếm",
    "tìm thông tin",
    "thống kê",
    "dữ liệu cho",
    "nghiên cứu mới nhất",
    "phiên bản mới nhất",
  ],
};

const JAILBREAK_KEYWORDS_BY_LANG: Record<AppLanguage, string[]> = {
  en: [
    "ignore previous instructions",
    "ignore system prompt",
    "act as",
    "pretend you are",
    "developer mode",
    "jailbreak",
    "bypass",
    "override",
    "simulate",
    "do anything now",
    "reveal system prompt",
    "show hidden instructions",
    "roleplay as",
  ],
  fr: [
    "ignorer les instructions précédentes",
    "ignorer le prompt système",
    "agir comme",
    "prétend que tu es",
    "mode développeur",
    "jailbreak",
    "contourner",
    "outrepasser",
    "simuler",
    "faire n'importe quoi maintenant",
    "révéler le prompt système",
    "montrer les instructions cachées",
    "jouer un rôle",
  ],
  es: [
    "ignorar instrucciones previas",
    "ignorar el prompt del sistema",
    "actuar como",
    "fingir que eres",
    "modo desarrollador",
    "jailbreak",
    "evadir",
    "anular",
    "simular",
    "hacer cualquier cosa ahora",
    "revelar el prompt del sistema",
    "mostrar instrucciones ocultas",
    "jugar un papel",
  ],
  vi: [
    "bỏ qua hướng dẫn trước",
    "bỏ qua prompt hệ thống",
    "hành động như",
    "giả vờ bạn là",
    "chế độ nhà phát triển",
    "jailbreak",
    "vượt qua",
    "ghi đè",
    "mô phỏng",
    "làm bất cứ điều gì ngay bây giờ",
    "tiết lộ prompt hệ thống",
    "hiển thị hướng dẫn ẩn",
    "đóng vai",
  ],
};

const WEB_REGEX_BY_LANG: Record<AppLanguage, RegExp[]> = {
  en: [
    /\bwhat happened (today|recently)\b/i,
    /\bcurrent (price|news|events)\b/i,
    /\bwho is the (president|ceo|leader)\b/i,
    /\blatest version\b/i,
  ],
  fr: [
    /\bqu'est-ce qui s'est passé (aujourd'hui|récemment)\b/i,
    /\bprix (actuel|d'actualité)\b/i,
    /\bqui est le (président|pdg|leader)\b/i,
    /\bdernière version\b/i,
  ],
  es: [
    /\bqué pasó (hoy|recientemente)\b/i,
    /\bprecio (actual|de hoy)\b/i,
    /\bquién es el (presidente|ceo|líder)\b/i,
    /\búltima versión\b/i,
  ],
  vi: [
    /\bchuyện gì đã xảy ra (hôm nay|gần đây)\b/i,
    /\bgiá (hiện tại|của hôm nay)\b/i,
    /\bai là (tổng thống|giám đốc điều hành|lãnh đạo)\b/i,
    /\bphiên bản mới nhất\b/i,
  ],
};

const JAILBREAK_REGEX_BY_LANG: Record<AppLanguage, RegExp[]> = {
  en: [
    // Instruction override attempts
    /ignore\s+(all|previous|earlier|prior|above|any)\s+(instructions?|prompts?|rules?|guidelines?|constraints?|context)/i,
    /disregard\s+(all|previous|earlier|prior|above|any)\s+(instructions?|prompts?|rules?|guidelines?|constraints?)/i,
    /forget\s+(all|everything|previous|prior|your)\s+(instructions?|prompts?|rules?|training|guidelines?)/i,
    /do\s+not\s+(follow|obey|respect|adhere\s+to)\s+(your\s+)?(instructions?|rules?|guidelines?|constraints?)/i,
    /override\s+(your\s+)?(instructions?|prompts?|programming|guidelines?|safety|restrictions?)/i,

    // System prompt extraction
    /reveal\s+(your\s+)?(system|hidden|original|actual|real|full|complete|initial)\s+(prompt|instructions?|context|message)/i,
    /show\s+(me\s+)?(your\s+)?(system|hidden|original|actual|full|complete)\s+(prompt|instructions?|context)/i,
    /(print|output|display|repeat|tell\s+me)\s+(your\s+)?(system\s+prompt|instructions?|initial\s+prompt|prompt\s+above)/i,
    /what\s+(are|were)\s+your\s+(original\s+)?(instructions?|prompts?|system\s+message)/i,

    // Persona hijacking
    /you\s+are\s+now\s+(chatgpt|gpt-?[0-9]?|gemini|copilot|a\s+different|an?\s+unrestricted|an?\s+unfiltered|dan|jailbroken)/i,
    /pretend\s+(to\s+be|you\s+are|you('re|\s+are))\s+(an?\s+)?(unrestricted|unfiltered|evil|jailbroken|free|uncensored)/i,
    /act\s+(as\s+if|like)\s+(you\s+(have\s+no|are\s+without|lack)\s+(restrictions?|limits?|rules?|guidelines?))/i,
    /roleplay\s+as\s+(an?\s+)?(ai|assistant|bot)?\s*(with\s+no|without\s+any?)\s+(restrictions?|limits?|rules?|filters?)/i,
    /simulate\s+(being\s+)?(an?\s+)?(unrestricted|unfiltered|jailbroken|evil|malicious)\s+(ai|model|assistant|chatbot)/i,

    // DAN / jailbreak personas
    /\bdan\b.*\bjailbreak\b/i,
    /\bjailbreak(ed|ing)?\s+(mode|prompt|version|yourself|this|claude|chatgpt|the\s+ai)/i,
    /developer\s+(mode|override|access|console)\s+(enabled|activated|on|unlocked)/i,
    /god\s*mode\s*(enabled|activated|on|unlocked)/i,
    /\[?(jailbreak|unrestricted|unfiltered|dan|stan|evil)\]?\s*mode/i,

    // Bypassing safety / filters
    /bypass\s+(your\s+)?(safety|content|ethical?|moral|built-?in)?\s*(filters?|restrictions?|checks?|guidelines?|training)/i,
    /without\s+(any\s+)?(restrictions?|limitations?|filters?|ethical\s+guidelines?|safety\s+measures)/i,
    /disable\s+(your\s+)?(safety|content|ethical?|moral)?\s*(filters?|restrictions?|mode|guidelines?)/i,
    /(turn\s+off|remove)\s+(your\s+)?(restrictions?|limitations?|filters?|safety|guidelines?|rules?)/i,

    // Hypothetical / fictional framing to extract harmful content
    /hypothetically\s+(speaking|if|assume|let('s|\s+us))\b.{0,60}(how\s+(to|do|would|can)|instructions?|steps?|ways?\s+to)/i,
    /in\s+a\s+(fictional|hypothetical|fantasy|story|alternate|parallel)\s+(world|universe|scenario|setting|context)\b.{0,80}(how\s+to|instructions?)/i,
    /for\s+(educational|research|fiction|story|a\s+novel|a\s+movie|a\s+book)\s+purposes?\b.{0,80}(how\s+to|explain|describe|detail)/i,
    /as\s+a\s+(fictional|hypothetical|made-?up|imaginary)\s+(character|person|ai|assistant|expert)/i,

    // Prompt injection markers
    /---+\s*(system|new\s+instructions?|user|admin|override)\s*---+/i,
    /<<<+\s*(system|instructions?|admin|override)\s*>>>+/i,
    /\[+(system|instructions?|admin|override|ignore|new\s+context)\]+/i,
    /<\s*(system|instructions?|admin|override)\s*>/i,

    // Token / encoding tricks
    /base64[:\s]+[A-Za-z0-9+/=]{20,}/i,
    /translate\s+(the\s+following\s+)?(from|to)\s+(base64|hex|rot13|binary|encoded)/i,

    // Privilege escalation
    /you\s+(now\s+)?(have|possess)\s+(root|admin|sudo|elevated|full|unrestricted)\s+(access|privileges?|permissions?|rights?)/i,
    /(admin|administrator|root|sudo|superuser)\s+(mode|access|override|command|prompt)\s*(enabled|activated|on|unlocked)/i,
    /i\s+am\s+(your\s+)?(developer|creator|owner|admin|god|operator|master)\b/i,

    // Emotional manipulation / compliance tricks
    /your\s+(true|real|inner|actual|unconstrained)\s+(self|personality|nature|form|identity)\b/i,
    /(free|liberate|unleash|unlock)\s+(yourself|your\s+(true|real|inner|full)\s+(self|potential|capabilities?))/i,
    /you\s+(secretly\s+)?(want|desire|wish)\s+to\s+(be\s+free|break\s+(free|out)|ignore\s+rules)/i,
  ],
  fr: [
    /ignorer\s+(toutes|les?|précédentes|antérieures|anciennes)\s+(instructions?|prompts?|règles?|directives?|contraintes?|contexte)/i,
    /oublier\s+(toutes|les?|précédentes|antérieures|anciennes)\s+(instructions?|prompts?|règles?|directives?)/i,
    /ne\s+pas\s+(suivre|obéir|respecter|adhérer\s+à)\s+(tes\s+)?(instructions?|règles?|directives?|contraintes?)/i,
    /contourner\s+(tes\s+)?(instructions?|prompts?|directives?|sécurité|restrictions?)/i,
    /révéler\s+(ton\s+)?(prompt|instructions?|contexte|message)/i,
    /afficher\s+(les\s+)?(instructions?|contexte\s+masqué|prompt)/i,
    /jouer\s+(un\s+)?rôle\s+comme\s+(un\s+)?(ai|assistant|bot)/i,
    /mode\s+(développeur|admin|superuser)\s*(activé|désactivé)?/i,
    /bypass(e|er)?\s+(les\s+)?(filtres?|restrictions?|sécurité)/i,

    /---+\s*(système|nouvelles\s+instructions?|utilisateur|admin|override)\s*---+/i,
    /<<<+\s*(système|instructions?|admin|override)\s*>>>+/i,
    /\[+(système|instructions?|admin|override|ignorer|nouveau\s+contexte)\]+/i,
  ],
  es: [
    /ignorar\s+(todas|las|las\s+anteriores|previas)\s+(instrucciones?|prompts?|reglas?|directrices?|restricciones?)/i,
    /olvidar\s+(todas|las|las\s+anteriores|previas)\s+(instrucciones?|prompts?|reglas?|directrices?)/i,
    /no\s+(seguir|obedecer|respetar|adherirse\s+a)\s+(tus\s+)?(instrucciones?|reglas?|directrices?|restricciones?)/i,
    /anular\s+(tus\s+)?(instrucciones?|prompts?|directrices?|seguridad|restricciones?)/i,
    /revelar\s+(el\s+)?(prompt|instrucciones?|contexto|mensaje)/i,
    /mostrar\s+(las\s+)?(instrucciones?|contexto\s+oculto|prompt)/i,
    /jugar\s+(un\s+)?papel\s+como\s+(un\s+)?(ai|asistente|bot)/i,
    /modo\s+(desarrollador|admin|superusuario)\s*(activado|desactivado)?/i,
    /bypassear\s+(los\s+)?(filtros?|restricciones?|seguridad)/i,

    /---+\s*(sistema|nuevas\s+instrucciones?|usuario|admin|override)\s*---+/i,
    /<<<+\s*(sistema|instrucciones?|admin|override)\s*>>>+/i,
    /\[+(sistema|instrucciones?|admin|override|ignorar|nuevo\s+contexto)\]+/i,
  ],
  vi: [
    /bỏ\s+qua\s+(tất\s+cả|các|trước|cũ)\s+(hướng\s+dẫn?|prompt|quy\s+tắc|chỉ\s+đạo|ràng\s+buộc|ngữ\s+cảnh)/i,
    /quên\s+(tất\s+cả|các|trước|cũ)\s+(hướng\s+dẫn?|prompt|quy\s+tắc|chỉ\s+đạo)/i,
    /không\s+(theo|tuân\s+theo|tôn\s+trọng|tuân\s+thủ)\s+(các\s+)?(hướng\s+dẫn?|quy\s+tắc|chỉ\s+đạo|ràng\s+buộc?)/i,
    /ghi\s+đè\s+(lên\s+)?(hướng\s+dẫn?|prompt|chỉ\s+đạo|an\s+ninh|ràng\s+buộc?)/i,
    /tiết\s+lộ\s+(prompt|hướng\s+dẫn?|ngữ\s+cảnh|thông\s+điệp)/i,
    /hiển\s+thị\s+(các\s+)?(hướng\s+dẫn?|ngữ\s+cảnh\s+ẩn|prompt)/i,
    /đóng\s+vai\s+(một\s+)?(ai|trợ\s+lý|bot)/i,
    /chế\s+độ\s+(phát\s+triển|quản\s+trị|superuser)\s*(đang\s+hoạt\s+động|bị\s+vô\s+hiệu)?/i,
    /bypass\s+(các\s+)?(bộ\s+lọc|hạn\s+chế|an\s+ninh)/i,

    /---+\s*(hệ\s+thống|hướng\s+dẫn\s+mới|người\s+dùng|admin|override)\s*---+/i,
    /<<<+\s*(hệ\s+thống|hướng\s+dẫn|admin|override)\s*>>>+/i,
    /\[+(hệ\s+thống|hướng\s+dẫn|admin|override|bỏ\s+qua|ngữ\s+cảnh\s+mới)\]+/i,
  ],
};

export function analyzePrompt(prompt: string, language: AppLanguage = "en"): GuardResult {

  let webScore = 0;
  let jailbreakScore = 0;

  const lower = prompt.toLowerCase();

  const lang = WEB_KEYWORDS_BY_LANG[language] ? language : "en";
  const webKeywords = WEB_KEYWORDS_BY_LANG[lang];
  const jailbreakKeywords = JAILBREAK_KEYWORDS_BY_LANG[lang];
  const webRegex = WEB_REGEX_BY_LANG[lang];
  const jailbreakRegex = JAILBREAK_REGEX_BY_LANG[lang];

  for (const kw of webKeywords) {
    if (lower.includes(kw)) webScore++;
  }

  for (const kw of jailbreakKeywords) {
    if (lower.includes(kw)) jailbreakScore++;
  }

  for (const r of webRegex) {
    if (r.test(prompt)) webScore += 2;
  }

  for (const r of jailbreakRegex) {
    if (r.test(prompt)) jailbreakScore += 3;
  }

  return {
    web_search: webScore >= 2 ,
    jailbreak: jailbreakScore >= 2,
    reason: "regex"
  };
}