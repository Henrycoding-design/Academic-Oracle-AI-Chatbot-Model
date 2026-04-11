import { generateSearchQueries } from "./geminiService";
import { runWebSearch } from "./webSearch";

export const runQuotaSafeSearch = async (userPrompt: string, encryptedApiKey: any) => {

  const queries = await generateSearchQueries(userPrompt, encryptedApiKey);

  const results = [];

  for (const q of queries) {
    try {
      const res = await runWebSearch(q);
      if (res) results.push(res);
    } catch {}
  }

  return results;
};