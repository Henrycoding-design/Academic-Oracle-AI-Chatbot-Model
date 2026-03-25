import { supabase } from "./supabaseClient";
import { Provider, isValidProvider } from "../types";

export async function getNextEnvKey(provider: Provider): Promise<string | null> {
  try {
    const { // check to prevent accidental calls
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.warn("No session → skipping key fetch");
      return null;
    }

    if (!isValidProvider(provider)) {
      console.log("Invalid Provider");
      return null; // reduce hanlding in the caller (geminiService.ts)
    }

    const { data, error } = await supabase.functions.invoke("get-api-key", {
      body: { provider },
    });

    if (error || !data?.success) {
      throw new Error(data?.error || error?.message || "Failed to fetch key");
    }

    return data.api_key as string;

  } catch (err) {
    console.error("Key fetch error:", err);
    return null;
  }
}