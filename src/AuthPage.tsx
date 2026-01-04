import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./services/supabaseClient";
import { encryptApiKey } from "./services/edgeCrypto";


const AuthPage: React.FC<{ onLogin: (apiKey: string) => void ; onViewDemo: () => void;}> = ({ onLogin , onViewDemo}) => {
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
        setLoading(false);
        onLogin(profile.api_key);
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
      onLogin(encrypted);
    };

    initAuth();
  }, [onLogin]);

  // 🚀 OAuth trigger
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
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
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Academic Oracle</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Continue with Google
      </button>
      <button
        onClick={onViewDemo}
        className="mt-4 px-6 py-3 border border-indigo-600 text-indigo-600
                  rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-900
                  transition-colors"
      >
        View Interactive Guide
      </button>
    </div>
  );
};

export default AuthPage;
