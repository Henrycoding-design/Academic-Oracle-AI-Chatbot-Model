import { JigsawStack } from "jigsawstack";
import { Buffer } from "buffer";

if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

const RAW_KEYS = import.meta.env.VITE_JIGSAW_KEYS || "";

// extract + clean keys
const API_KEYS = RAW_KEYS
  .split(",")
  .map((k: string) => k.trim())
  .filter(Boolean);

const startIndex = Math.floor(Math.random() * API_KEYS.length); // randomize to spread usage

const orderedKeys = [
  ...API_KEYS.slice(startIndex),
  ...API_KEYS.slice(0, startIndex)
];

export async function runWebSearch(query: string) {

  for (const key of orderedKeys) {
    try {
      const jigsaw = JigsawStack({
        apiKey: key,
      });

      const res = await jigsaw.web.search({ query });

      if (!res?.success) continue;

      const results = res.results?.slice(0, 5) ?? [];

      return {
        overview: res.ai_overview,
        results: results.map((r: any) => ({
          title: r.title,
          snippet: r.snippet || r.description || "",
          link: r.url
        })),
        links: res.links?.slice(0, 5)
      };

    } catch (err) {
      // silently try next key
      continue;
    }
  }

  // all keys failed
  return null;
}