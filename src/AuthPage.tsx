import React, { useEffect, useRef, useState } from "react";
import { supabase } from "./services/supabaseClient";
import { encryptApiKey } from "./services/edgeCrypto";
import { ArrowBigLeftIcon } from "lucide-react";

const AuthPage: React.FC<{
  onLogin: (apiKey: any | null, mode: 'free' | 'full') => void;
  onViewDemo: () => void;
}> = ({ onLogin, onViewDemo }) => {
  const [loading, setLoading] = useState(true);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [user, setUser] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const ranRef = useRef(false);

  const validateApiKey = (key: string) => {
    // Basic validation for API key format
    return /^AIzaSy[a-zA-Z0-9_-]{30,}$/.test(key);
  }

  const resetToAuthPage = () => {
    setNeedsApiKey(false);
    setApiKeyInput("");
    setApiError(null);
    setUser(null);
    ranRef.current = false;
  }

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

      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("api_key, mode")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.mode === 'full' && profile.api_key) {
        onLogin(profile.api_key, "full"); // full mode
        return;
      }

      if (profile?.mode === 'free') {
        onLogin(null, "free"); // free mode
        return;
      }

      // 🆕 New user → show API setup screen
      // setNeedsApiKey(true);
      directSignIn(user); // Directly sign in with free mode for new users -> ZERO FRICTION
      setLoading(false);
    };

    initAuth();
  }, [onLogin]);

  const handleSaveApiKey = async () => {
    setApiError(null);

    const key = apiKeyInput.trim();

    if (!key) { setApiError("API key can’t be empty."); return; };

    if (!validateApiKey(key)) {
      setApiError("Please enter a valid Google AI Studio API key.");
      return;
    }

    const encrypted = await encryptApiKey(key);

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        api_key: encrypted,
        mode: "full",
      });

    if (error) {
      setApiError("Failed to save API key 😬");
      return;
    }

    onLogin(encrypted, "full");
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
  };

  const directSignIn = async (authUser: any) => {
    if (!authUser) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({ 
        id: authUser.id,
        email: authUser.email,
        api_key: null,
        mode: 'free' 
      });

    if (error) {
      setApiError("Failed to save preference.");
      return;
    }

    onLogin(null, "free");
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center
                      bg-slate-50 dark:bg-slate-950
                      text-slate-600 dark:text-slate-300">
        Initializing Oracle…
      </div>
    );
  }

  // 🔑 API SETUP SCREEN
  // if (needsApiKey) { // Current abandoned for simplicity
  //   return (
  //     <div className="h-screen relative flex flex-col items-center justify-center
  //                     bg-slate-50 dark:bg-slate-950 px-6 text-center">

  //       {/* ← Back button */}
  //       <button
  //         onClick={resetToAuthPage}
  //         className="absolute top-6 left-6 p-2 rounded-lg
  //                   text-slate-600 dark:text-slate-300
  //                   hover:bg-slate-200 dark:hover:bg-slate-800
  //                   transition"
  //         aria-label="Back"
  //       >
  //         <ArrowBigLeftIcon size={24} />
  //       </button>

  //       <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
  //         Custom Step: Connect Your Engine ⚙️
  //       </h1>

  //       <p className="text-slate-600 dark:text-slate-400 max-w-md mb-6">
  //         If you want Academic Oracle to run on your own{" "}
  //         <a
  //           href="https://aistudio.google.com/projects"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-indigo-600 dark:text-indigo-400 hover:underline"
  //         >
  //           API key
  //         </a>.
  //         <br />
  //         You stay in control of usage and limits.
  //         <br />
  //         Your key is encrypted and securely stored.
  //         {" "}
  //         <a
  //           href="/policy"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //           className="text-indigo-600 dark:text-indigo-400 hover:underline"
  //         >
  //           Read our policy
  //         </a>.
  //       </p>

  //       <input
  //         type="password"
  //         placeholder="Paste your API key here"
  //         value={apiKeyInput}
  //         onChange={(e) => setApiKeyInput(e.target.value)}
  //         className="w-full max-w-md px-4 py-3 rounded-lg
  //                   border border-slate-300 dark:border-slate-700
  //                   bg-white dark:bg-slate-900
  //                   text-slate-900 dark:text-slate-100 mb-2"
  //       />

  //       {apiError && (
  //         <div className="text-sm text-red-600 dark:text-red-400 mb-3">
  //           {apiError}
  //         </div>
  //       )}

  //       <button
  //         onClick={handleSaveApiKey}
  //         className="w-full max-w-md px-6 py-3 mt-4
  //                   bg-indigo-600 text-white rounded-lg
  //                   hover:bg-indigo-700 transition-colors"
  //       >
  //         Save & Enter Oracle 🚀
  //       </button>

  //       <button
  //         onClick={() => window.open("https://app.arcade.software/share/vfQU6Su4Dh6DmjWTNj9m", "_blank")}
  //         className="mt-6 text-indigo-600 border-b pb-3 border-slate-300 dark:border-slate-700"
  //       >
  //         Show me how to do it
  //       </button>

  //       <button
  //         onClick={async () => {
  //           // 1. Update the database so it remembers this choice
  //           const { error } = await supabase
  //             .from("profiles")
  //             .upsert({ 
  //               id: user.id,
  //               email: user.email,
  //               api_key: null,
  //               mode: 'free' 
  //             })
              
  //           if (error) {
  //             setApiError("Failed to save preference.");
  //             return;
  //           }

  //           // 2. Trigger the login in the parent App
  //           onLogin(null, "free");
  //         }}
  //         className="mt-3 text-md text-slate-500"
  //       >
  //         Proceed without custom key (default mode)
  //       </button>
  //     </div>
  //   );
  // }


  // 🔐 LOGIN SCREEN
  return (
    <div className="h-screen flex flex-col items-center justify-center
                    bg-slate-50 dark:bg-slate-950">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Academic Oracle
      </h1>

      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg
                   hover:bg-indigo-700 transition-colors"
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
      <button
        className="absolute bottom-8 text-sm text-slate-600 dark:text-slate-300
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  transition-colors"
        onClick={() => window.open("https://buymeacoffee.com/votanbinh", "_blank")}
        >
          Created by Vo Tan Binh (Parent: Ngo Ngoc Cuong)
      </button>
    </div>

  );
};

export default AuthPage;
