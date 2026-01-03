
import React, { useState, useRef, useEffect } from 'react';
import type { Message, ChatHistoryItem } from './types';
import { sendMessageToBot } from './services/geminiService';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import AuthPage from "./AuthPage";
import { supabase } from "./services/supabaseClient";
// import { resetChat } from "./services/geminiService";
import { readFileAsText } from "./services/fileReader";
import 'katex/dist/katex.min.css';

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const SystemStatus: React.FC<{ status: 'ok' | 'loading' | 'error' }> = ({ status }) => {
    const colors = {
        ok: 'bg-emerald-400',
        loading: 'bg-amber-400',
        error: 'bg-rose-500'
    };
    
    const labels = {
        ok: 'Oracle Online',
        loading: 'Thinking...',
        error: 'Sync Error'
    };

    return (
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <div className={`w-2 h-2 rounded-full ${colors[status]} ${status === 'loading' ? 'animate-pulse' : ''}`}></div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-90 hidden sm:inline">{labels[status]}</span>
        </div>
    );
};

const LoadingIndicator = () => (
    <div className="flex items-start gap-3 my-4 justify-start">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg border-2 border-white/20">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        </div>
        <div className="max-w-xl px-5 py-3 rounded-2xl shadow-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700">
            <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
        </div>
    </div>
);


// Trimmed History to control tokens -> put necessary info on oracleMemory (1 instance) instead
const MAX_HISTORY = 10;

function trimHistory(history: ChatHistoryItem[]) {
  return history.slice(-MAX_HISTORY);
}

const App: React.FC = () => {
  const [encryptedApiKey, setEncryptedApiKey] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = sessionStorage.getItem("academic-oracle-chat");
    if (saved) return JSON.parse(saved);

    return [
      {
        role: "model",
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey.\n\nBefore we begin, what should I call you, and what academic challenge are we tackling today?",
      },
    ];
  });

  const lastRequestRef = useRef<{ // for retry
    message: string;
    file?: File | null;
  } | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = sessionStorage.getItem("academic-oracle-history");
    if (saved) return JSON.parse(saved);

    return [
      {
        role: "model",
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey.",
      },
    ];
  });
  const [oracleMemory, setOracleMemory] = useState<string | null>(() => { // student profile
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("academic-oracle-memory");
  });

  useEffect(() => { // for student profile
    if (oracleMemory) {
      sessionStorage.setItem("academic-oracle-memory", oracleMemory);
    }
  }, [oracleMemory]);

  useEffect(() => { // for model
    sessionStorage.setItem(
      "academic-oracle-history",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  useEffect(() => { // for UI
    sessionStorage.setItem(
      "academic-oracle-chat",
      JSON.stringify(messages)
    );
  }, [messages]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('academic-oracle-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ⚡ Theme handling
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('academic-oracle-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('academic-oracle-theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => { // update oracle-api-key and only save it as string format
    if (encryptedApiKey) {
      sessionStorage.setItem("oracle-api-key", JSON.stringify(encryptedApiKey));
    }
  }, [encryptedApiKey]);

  useEffect(() => { // set encryptedApiKey on sessionStorage oracle-api-key change (changed to JSON object)
    const key = sessionStorage.getItem("oracle-api-key");
    if (key) setEncryptedApiKey(JSON.parse(key));
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setEncryptedApiKey(null);
        sessionStorage.removeItem("oracle-api-key");
      }
    });
  }, []);

  // ✅ Handle sending messages with dynamic encryptedApiKey
  const handleSendMessage = async (
    userMessage: string,
    file?: File | null,
    isRetry = false
  ) => {
    if (!encryptedApiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      let fileContext = "";

      if (file) {
        const extractedText = await readFileAsText(file);
        fileContext = `
  --- FILE CONTEXT (${file.name}) ---
  ${extractedText}
  --- END FILE CONTEXT ---
  `;
      }

      let outgoingHistory = chatHistory;

      if (!isRetry) { // avoid double user questions if reTry
        // 🖼️ UI update (unchanged, clean)
        setMessages(prev => [
          ...prev,
          {
            role: "user",
            content: userMessage,
            attachment: file
              ? {
                  name: file.name,
                  type: file.type,
                  size: file.size,
                }
              : undefined,
          },
        ]);

        const userEntry: ChatHistoryItem = {
          role: "user",
          content: `${fileContext}\nUSER QUESTION:\n${userMessage}`.trim(),
        };

        outgoingHistory = trimHistory([...chatHistory, userEntry]);

        setChatHistory(outgoingHistory);
      }

      // cache for retry if failed
      lastRequestRef.current = {
        message: userMessage,
        file: file ?? null,
      };

      // 🔁 Stateless call with full history
      const { answer, memory } = await sendMessageToBot({
        history: outgoingHistory,
        memory: oracleMemory,
        encryptedKeyPayload: encryptedApiKey,
      });

      // 🖼️ UI response
      setMessages(prev => [
        ...prev,
        { role: "model", content: answer },
      ]);

      // 🧠 AI memory response (trimmed)
      setChatHistory(prev =>
        trimHistory([
          ...prev,
          { role: "model", content: answer },
        ])
      );

      // Student profile/memory
      if (memory) {
        setOracleMemory(memory);
      }

    } catch (err: unknown) {
      console.error(err);

      let status: number | undefined;
      let message = "Sorry, an unexpected error occurred.";
      let extractedRetryDelay: string | undefined;

      try {
        // Case 1: string error (Gemini SDK common)
        if (typeof err === "string") {
          try {
            const parsed = JSON.parse(err);

            status =
              parsed?.error?.code ??
              parsed?.error?.status;

            message =
              parsed?.error?.message ?? message;

            extractedRetryDelay =
              parsed?.error?.details?.find(
                (d: any) =>
                  d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
              )?.retryDelay;
          } catch {
            // Plain string
            message = err;
            if (err.includes("429")) status = 429;
          }
        }

        // Case 2: object / Error
        else if (typeof err === "object" && err !== null) {
          const anyErr = err as any;

          status =
            anyErr?.status ??
            anyErr?.code ??
            anyErr?.error?.status ??
            anyErr?.error?.code;

          message =
            anyErr?.message ??
            anyErr?.error?.message ??
            message;

          extractedRetryDelay =
            anyErr?.error?.details?.find(
              (d: any) =>
                d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
            )?.retryDelay;
        }
      } catch {
        // absolutely never crash UI error handling
      }

      if (status === 429) {
        setError(
          "You’ve hit the free rate limit 😅\n\n" +
          `⏳ ${
            extractedRetryDelay
              ? "Try again after " + extractedRetryDelay
              : "Try again later"
          }, or\n` +
          "❤️ Support the project to unlock higher limits"
        );
      } else {
        setError(message);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (!lastRequestRef.current || isLoading) return;

    setError(null);

    handleSendMessage(
      lastRequestRef.current.message,
      lastRequestRef.current.file,
      true
    );
  };

  const getStatus = (): 'ok' | 'loading' | 'error' => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    return 'ok';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // 🔐 kill auth
    // resetChat();                  // 🧠 wipe AI memory
    setEncryptedApiKey(null);           // 🚪 back to AuthPage

    sessionStorage.removeItem("academic-oracle-chat"); // 🧹 wipe chat
    sessionStorage.removeItem("academic-oracle-history"); // wipe history
    sessionStorage.removeItem("oracle-api-key");
    sessionStorage.removeItem("academic-oracle-memory"); //wipe profile
    setOracleMemory(null);

    // reset chat UI
    setMessages([
      {
        role: 'model',
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey. \n\nBefore we begin, what should I call you, and what academic challenge are we tackling today?",
      },
    ]);

    // reset chat history for model
    setChatHistory([
      {
        role: "model",
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey.",
      },
    ]);

  };

  // ✅ Show AuthPage first if encryptedApiKey is missing
  if (!encryptedApiKey) {
    return <AuthPage onLogin={(key) => setEncryptedApiKey(key)} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-gray-800 dark:text-gray-100 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <header className="px-6 py-4 bg-slate-900 text-white shadow-xl z-20 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-black tracking-tighter flex items-center">
          <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm mr-2 shadow-[0_0_10px_rgba(99,102,241,0.5)]">UNIV</span>
          Academic Oracle
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs font-semibold rounded-full
                      bg-white/10 hover:bg-white/20
                      text-slate-300 hover:text-white
                      transition-colors"
          >
            Logout
          </button>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
            aria-label="Toggle theme"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
          <SystemStatus status={getStatus()} />
        </div>
      </header>

      <main className="flex-grow overflow-y-auto pb-32 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
        <div className="max-w-4xl mx-auto px-4 pt-8">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {isLoading && <LoadingIndicator />}
          {error && (
            <div className="bg-rose-100/80 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-center my-6 border border-rose-200 dark:border-rose-800/30 backdrop-blur-sm">
              <p className="whitespace-pre-line text-sm">{error}</p>

              <div className="mt-3 flex justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full
                            bg-rose-500 hover:bg-rose-600
                            text-white transition-colors"
                >
                  Retry
                </button>

                <button
                  onClick={() => setError(null)}
                  className="px-4 py-1.5 text-xs font-semibold rounded-full
                            bg-white/50 dark:bg-white/10
                            hover:bg-white/70 dark:hover:bg-white/20
                            transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-30 pointer-events-none">
        <div className="pointer-events-auto bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent transition-colors duration-300">
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
};

export default App;