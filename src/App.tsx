
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
import ArcadeDemo from "./components/ArcadeDemo";
import { createPortal } from "react-dom";
import { useClickOutside } from './services/useClickOutsite';
import { generateSessionSummary } from './services/geminiService.ts';
import { createSummaryDoc } from './services/createSummaryDoc.ts';
import { SquarePen, ScrollText, ChevronDown} from 'lucide-react';
import ProfilePage from './ProfilePage.tsx';

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

const SystemStatus: React.FC<{ status: 'ok' | 'loading' | 'error', model: string }> = ({ status, model }) => {
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
      <div className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
        {/* Top row: status */}
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${colors[status]} ${
              status === "loading" ? "animate-pulse" : ""
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-90">
            {labels[status]}
          </span>
        </div>

        {/* Bottom row: model name */}
        <div className="mt-1">
          <span className="
            text-[10px] font-mono
            bg-white/10 px-2 py-0.5
            rounded-full border border-white/20
            whitespace-nowrap
          ">
            {model}
          </span>
        </div>
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
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

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

  const [showDemo, setShowDemo] = useState(false);

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
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [oraclePos, setOraclePos] = useState<{ top: number; left: number } | null>(null);
  const oracleButtonRef = useRef<HTMLButtonElement>(null);
  const oracleMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside([oracleButtonRef, oracleMenuRef], () => setIsOracleOpen(false), isOracleOpen); // hook to close oracle status on outside click

  const [showProfile, setShowProfile] = useState(false); // set state for profile page

  useEffect(() => {
    if (isOracleOpen && oracleButtonRef.current) {
      const rect = oracleButtonRef.current.getBoundingClientRect();
      setOraclePos({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [isOracleOpen]);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside([userButtonRef, userMenuRef], () => setIsUserMenuOpen(false), isUserMenuOpen); // hook to close user menu on outside click

  const [model, setModel] = useState<string>('gemini-3-flash-preview'); // default model
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
    chatEndRef.current?.scrollIntoView({
      behavior: window.innerWidth < 640 ? 'auto' : 'smooth',
    });
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
      const { answer, memory, model } = await sendMessageToBot({
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

      if (model) {
        setModel(model);
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

  const resetChat = () => { // for new chat
    // 🧹 wipe persisted chat state
    sessionStorage.removeItem("academic-oracle-chat");
    sessionStorage.removeItem("academic-oracle-history");

    // ⚠️ optional: keep or wipe memory?
    // sessionStorage.removeItem("academic-oracle-memory");

    // 🖼️ reset UI messages
    setMessages([
      {
        role: "model",
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey.\n\nBefore we begin, what should I call you, and what academic challenge are we tackling today?",
      },
    ]);

    // 🧠 reset model context
    setChatHistory([
      {
        role: "model",
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey.",
      },
    ]);

    // 🔁 optional: wipe student profile
    // setOracleMemory(null); //no need to wipe profile on new chat

    // clean UI state
    setError(null);
    setIsLoading(false);
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

  const handleGenerateSummary = async () => { // generate summary docx
    if (!encryptedApiKey) return;
    if (chatHistory.length <=1 || !oracleMemory) {
      alert("No chat history or memory to summarize.");
      return;
    }

    try {
      setIsLoading(true);

      const summary = await generateSessionSummary({
        history: chatHistory,
        memory: oracleMemory,
        encryptedKeyPayload: encryptedApiKey,
      });

      await createSummaryDoc(summary);
    } catch (err) {
      console.error(err);
      alert("Failed to generate summary 😬");
    } finally {
      setIsLoading(false);
    }
  };


  if (showDemo) {
    return <ArcadeDemo />;
  }

  // ✅ Show AuthPage first if encryptedApiKey is missing
  if (!encryptedApiKey) {
    return <AuthPage
      onLogin={(key) => setEncryptedApiKey(key)}
      onViewDemo={() => setShowDemo(true)}
    />;
  }

  const user = session?.user;

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.id}`;

  return (
    showProfile ? (
      <ProfilePage
        user={user}
        encryptedApiKey={encryptedApiKey}
        onSave={(key) => setEncryptedApiKey(key)}
        onBack={() => setShowProfile(false)}
      />
    ) : (
      /* Use flex-col and h-screen to ensure the container fills the viewport */
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased">
        
        {/* 1. Sidebar - Kept as is, but removed fixed to let Flex handle it */}
        <aside className="w-14 flex flex-col items-center pt-4 pb-4 bg-white/30 dark:bg-white/5 backdrop-blur-md border-r border-black/5 dark:border-white/10 z-30">
            <div className="mb-6">
              <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-indigo-500/90 text-white tracking-wide">UNIV</span>
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200" onClick={handleGenerateSummary} title="Generate Summary Doc"> {/* Summary btn*/}
                <ScrollText size={18} />
              </button>

              <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200" onClick={resetChat} title="Start New Chat">
                <SquarePen size={18} />
              </button>
            </div>
            <div className="mt-auto relative">
              <button ref={userButtonRef} className="w-8 h-8 rounded-full overflow-hidden border border-white/20"
              onClick={() => setIsUserMenuOpen(prev => !prev)}>
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {isUserMenuOpen &&
                createPortal(
                  <div 
                  ref ={userMenuRef}
                  className="
                    absolute left-4 bottom-14 mb-1
                    w-32 rounded-xl
                    bg-white dark:bg-slate-900
                    text-black dark:text-slate-200
                    shadow-xl
                    border border-black/5 dark:border-white/10
                    text-sm z-[9999]
                  ">
                    <button className="block w-full px-3 py-2 text-left hover:bg-black/5" onClick={() => {setShowProfile(true)}}>
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 text-left text-rose-600 hover:bg-black/5"
                    >
                      Log out
                    </button>
                  </div>,
                  document.body
                )
              }
            </div>
        </aside>

        {/* 2. Right Side Content Area */}
        <div className="flex flex-col flex-1 h-full overflow-hidden relative">
          
          {/* Header - Fixed height */}
          <header className="h-16 flex items-center justify-between px-6 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-black/5 dark:border-white/10 z-20">
            <button 
              ref={oracleButtonRef}
              className="text-lg font-medium text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              onClick={() => setIsOracleOpen(prev => !prev)}>
                Academic Oracle <ChevronDown size={16} className="inline-block ml-1 mb-0.5" />
            </button>
            {isOracleOpen && oraclePos &&
              createPortal(
                <div
                  ref={oracleMenuRef}
                  className="
                    fixed
                    w-48 rounded-xl
                    bg-white dark:bg-slate-900
                    txt-black dark:text-slate-200
                    shadow-xl
                    border border-black/5 dark:border-white/10
                    text-sm z-[9999]
                  "
                  style={{
                    top: oraclePos.top,
                    left: oraclePos.left,
                  }}
                >
                  <div className="px-4 py-3 border-b border-black/5 dark:border-white/10">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                      Oracle Status
                    </p>
                  </div>

                  <div className="px-4 py-3">
                    <SystemStatus status={getStatus()} model={model} />
                  </div>
                </div>,
                document.body
              )
            }
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-white/60 dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-700 transition-colors">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </header>

          {/* Main Chat Area - THIS IS THE SCROLLING PART */}
          <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
            <div className="max-w-4xl mx-auto px-4 pt-8 pb-32">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} />
              ))}
              {isLoading && <LoadingIndicator />}
              {error && (
                <div className="bg-rose-100/80 dark:bg-rose-900/20 text-rose-600 p-4 rounded-2xl text-center my-6">
                  <p>{error}</p>
                  <button onClick={handleRetry} className="mt-2 bg-rose-500 text-white px-4 py-1 rounded-full text-xs">Retry</button>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </main>

          {/* Footer / Input - Sticks to bottom of the flex container */}
          <footer className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
            <div className="pointer-events-auto bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 to-transparent">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </footer>
        </div>
      </div>
    )
  );
};

export default App;