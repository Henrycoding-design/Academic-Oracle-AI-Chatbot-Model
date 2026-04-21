import { generateSearchQueries } from "./geminiService";
import { runWebSearch } from "./webSearch";

export const runQuotaSafeSearch = async (
  userPrompt: string,
  encryptedApiKey: any,
  topic: "news" | "general" | "finance" = "general"
) => {

  const queries = await generateSearchQueries(userPrompt, encryptedApiKey);

  const results = [];

  for (const q of queries) {
    try {
      const res = await runWebSearch(q, topic);
      if (res) results.push(res);
    } catch {}
  }

  return results;
};
