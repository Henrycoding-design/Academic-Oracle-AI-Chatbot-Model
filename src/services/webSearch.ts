import { JigsawStack } from "jigsawstack";
import { Buffer } from "buffer";
import { supabase } from "./supabaseClient";

if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

type WebSearchTopic = "news" | "general" | "finance";

type NormalizedWebSearchResult = {
  overview: string;
  results: {
    title: string;
    snippet: string;
    link: string;
  }[];
  links: string[];
};

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

const normalizeTavilyResult = (res: any): NormalizedWebSearchResult | null => {
  const results = Array.isArray(res?.results)
    ? res.results
        .slice(0, 5)
        .map((r: any) => ({
          title: r?.title ?? "",
          snippet: r?.content ?? "",
          link: r?.url ?? "",
        }))
        .filter((r: any) => r.title || r.snippet || r.link)
    : [];

  if (!res?.answer && results.length === 0) {
    return null;
  }

  return {
    overview: res?.answer ?? "",
    results,
    links: results.map((r) => r.link).filter(Boolean),
  };
};

const normalizeJigsawResult = (res: any): NormalizedWebSearchResult | null => {
  if (!res?.success) return null;

  const results = (res.results?.slice(0, 5) ?? []).map((r: any) => ({
    title: r.title,
    snippet: r.snippet || r.description || "",
    link: r.url,
  }));

  return {
    overview: res.ai_overview ?? "",
    results,
    links: res.links?.slice(0, 5) ?? results.map((r: any) => r.link).filter(Boolean),
  };
};

const runTavilySearch = async (
  query: string,
  topic: WebSearchTopic
): Promise<NormalizedWebSearchResult | null> => {
  try {
    const { data, error } = await supabase.functions.invoke("tavily-search", {
      method: "POST",
      body: {
        query,
        topic,
      },
    });

    if (error) {
      console.warn("Tavily edge function failed", error);
      return null;
    }

    return normalizeTavilyResult(data);
  } catch (error) {
    console.warn("Tavily edge function failed", error);
    return null;
  }
};

const runJigsawFallbackSearch = async (
  query: string
): Promise<NormalizedWebSearchResult | null> => {

  for (const key of orderedKeys) {
    try {
      const jigsaw = JigsawStack({
        apiKey: key,
      });

      const res = await jigsaw.web.search({ query });
      const normalized = normalizeJigsawResult(res);
      if (normalized) return normalized;

    } catch (err) {
      // silently try next key
      continue;
    }
  }

  // all keys failed
  return null;
}

export async function runWebSearch(
  query: string,
  topic: WebSearchTopic = "general"
) {
  const tavilyResult = await runTavilySearch(query, topic);
  if (tavilyResult) return tavilyResult;

  return runJigsawFallbackSearch(query);
}
