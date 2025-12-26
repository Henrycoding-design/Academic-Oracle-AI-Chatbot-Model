import React, { useEffect, useState } from "react";
import { supabase } from "./services/supabaseClient";

const AuthPage: React.FC<{ onLogin: (apiKey: string) => void }> = ({ onLogin }) => {
  const [loading, setLoading] = useState(true);

  // 🔁 Runs AFTER OAuth redirect
  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !user.email) {
        setLoading(false);
        return;
      }

      // 🔍 Check if user already exists
      const { data: profile } = await supabase
        .from("profiles")
        .select("api_key")
        .eq("id", user.id)
        .single();

      // 🟢 Existing user → LOGIN
      if (profile?.api_key) {
        setLoading(false);
        onLogin(profile.api_key);
        return;
      }

      // 🆕 New user → SIGNUP
      const apiKey = prompt(
        "Welcome! Please paste your GG AI Studio API Key to continue:"
      );

      if (!apiKey) {
        alert("API Key is required.");
        setLoading(false);
        await supabase.auth.signOut();
        return;
      }

      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,          // 🔐 REQUIRED
        email: user.email,    // ok for display
        api_key: apiKey,
      });

      if (insertError) {
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
