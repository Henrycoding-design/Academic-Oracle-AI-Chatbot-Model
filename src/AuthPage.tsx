import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./services/supabaseClient";
import {decryptApiKey, encryptApiKey} from "./services/edgeCrypto";


const AuthPage: React.FC<{ onLogin: (apiKey: string) => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(true);
  const ranRef = useRef(false);

  // 🔁 Runs AFTER OAuth redirect
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("api_key")
        .eq("id", user.id)
        .single();

      // 🟢 Existing user
      if (profile?.api_key) {
        let keyPayLoad = profile.api_key;
        if (typeof(keyPayLoad) == "string") { // already change api_key to jsonb on supabase, this is just for safety-net
          try {
            JSON.parse(keyPayLoad);
          } catch (e) {
            throw new Error("Failed to parsed store API Key");
          }
        }
        const apiKey = await decryptApiKey(keyPayLoad);
        setLoading(false);
        onLogin(apiKey);
        return;
      }

      // 🆕 New user
      const apiKey = prompt(
        "Welcome! Please paste your GG AI Studio API Key to continue:"
      );

      if (!apiKey) {
        alert("API Key is required.");
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      const encrypted = await encryptApiKey(apiKey);

      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        api_key: encrypted,
      });

      if (error) {
        alert("Failed to save API key.");
        setLoading(false);
        return;
      }

      setLoading(false);
      onLogin(apiKey);
    };

    initAuth();
  }, [onLogin]);

  // 🚀 OAuth trigger
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-600 dark:text-slate-300 
                bg-slate-50 dark:bg-slate-950">
        Initializing Oracle…
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Academic Oracle</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Continue with Google
      </button>
    </div>
  );
};

export default AuthPage;
