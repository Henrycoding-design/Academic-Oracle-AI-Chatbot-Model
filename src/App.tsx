
import React, { useState, useRef, useEffect } from 'react';
import type { Message } from './types';
import { sendMessageToBot } from './services/geminiService';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import AuthPage from "./AuthPage";
import { supabase } from "./services/supabaseClient";
import { resetChat } from "./services/geminiService";

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

const App: React.FC = () => {
  const [userApiKey, setUserApiKey] = useState<string | null>(null); // ✅ Add this
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey. \n\nBefore we begin, what should I call you, and what academic challenge are we tackling today?"
    }
  ]);
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

  // useEffect(() => {
  //   chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages, isLoading]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setUserApiKey(null);
      }
    });
  }, []);

  // ✅ Handle sending messages with dynamic userApiKey
  const handleSendMessage = async (userMessage: string) => {
    if (!userApiKey) return alert("API key missing. Please log in first.");
    setError(null);
    const newMessage: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const botResponse = await sendMessageToBot(userMessage, userApiKey);
      const botMessage: Message = { role: "model", content: botResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setMessages(prev => [...prev, { role: "model", content: "The Oracle is currently contemplating." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = (): 'ok' | 'loading' | 'error' => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    return 'ok';
  };

  const handleLogout = async () => {
    await supabase.auth.signOut(); // 🔐 kill auth
    resetChat();                  // 🧠 wipe AI memory
    setUserApiKey(null);           // 🚪 back to AuthPage

    // Optional but recommended: reset chat UI
    setMessages([
      {
        role: 'model',
        content:
          "Welcome to the Universal Academic Oracle. From SATs and IELTS to University research and Industrial practices, I am here to guide your journey. \n\nBefore we begin, what should I call you, and what academic challenge are we tackling today?",
      },
    ]);
  };

  // ✅ Show AuthPage first if userApiKey is missing
  if (!userApiKey) {
    return <AuthPage onLogin={(key) => setUserApiKey(key)} />;
  }

  return (
    <div className="flex flex-col h-screen font-sans antialiased text-gray-800 dark:text-gray-100 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <header className="px-6 py-4 bg-slate-900 text-white shadow-xl z-20 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-black tracking-tighter flex items-center">
          <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-sm mr-2 shadow-[0_0_10px_rgba(99,102,241,0.5)]">UNIV</span>
          ACADEMIC ORACLE
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
            <div className="bg-rose-100/80 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-center my-6 border border-rose-200 dark:border-rose-800/30 backdrop-blur-sm animate-pulse">
              {error}
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