import { generateSearchQueries } from "./geminiService";
import { runWebSearch } from "./webSearch";

export const runQuotaSafeSearch = async (
  userPrompt: string,
  encryptedApiKey: any,
  topic: "news" | "general" | "finance" = "general"
) => {
  let queries: string[];
  try {
    queries = await generateSearchQueries(userPrompt, encryptedApiKey);
  } catch {
    return {
      results: [],
      failed: true,
    };
  }

  const results = [];

  for (const q of queries) {
    try {
      const res = await runWebSearch(q, topic);
      if (res) results.push(res);
    } catch {}
  }

  return {
    results,
    failed: queries.length === 0 || results.length === 0,
  };
};
