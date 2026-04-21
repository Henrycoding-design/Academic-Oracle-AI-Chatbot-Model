/*
 * Copyright (c) 2026 Vo Tan Binh / Universal Academic Oracle
 * All Rights Reserved.
 *
 * This file is NOT licensed under Apache License 2.0.
 * No permission is granted to copy, redistribute, modify, reuse,
 * republish, or sublicense this file outside the official upstream
 * Universal Academic Oracle repository without prior written permission.
 *
 * See NOTICE and TRADEMARK_POLICY.md for additional terms.
 */

import React, { useState, useRef, useEffect } from 'react';
import type { Message, ChatHistoryItem, ChatTailoringMode } from './types';
import { sendMessageToBot, sendMessageToBotRace, runCronPromptGuard} from './services/geminiService';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import AuthPage from "./AuthPage";
import { supabase } from "./services/supabaseClient";
// import { resetChat } from "./services/geminiService";
import { readFileAsText } from "./services/fileReader";
import 'katex/dist/katex.min.css';
import ArcadeDemo from "./components/ArcadeDemo";
import { createPortal } from "react-dom";
import { useClickOutside } from './services/useClickOutside.ts';
import { generateSessionSummary } from './services/geminiService.ts';
import { createSummaryDoc } from './services/createSummaryDoc.ts';
import { Sparkles, SquarePen, ChevronDown, BrainCircuit, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import ProfilePage from './ProfilePage.tsx';
import { QuizView } from './components/QuizView'; // Added QuizView
import DashboardView from './components/DashboardView.tsx';
import { canSendMessage } from './services/sessionMarker.ts';
import { InvalidAPIError } from './types';
import { AppLanguage , LANGUAGE_DATA, LoadingModeLabel } from './lang/Language.tsx';
import { normalizeSummary } from './services/normalizeSummary.ts';
import { isRushHourUTC } from './services/rushHours.ts';
import { analyzePrompt } from './services/promptGuard.ts';
import { runQuotaSafeSearch } from './services/webSearchSafe.ts';
import { isWebSearchLimitReached, incrementWebSearch } from './services/webSearchQuota.ts';
import { classifyIntent } from './services/chatIntentClassifier.ts';
import { getNewlyMasteredTopicTag, hasReadyOracleMemory, recordQuizResultInMemory, serializeOracleMemory } from './services/oracleMemory.ts';

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
  </svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

const SystemStatus: React.FC<{ status: 'ok' | 'loading' | 'error', model: string, language: AppLanguage }> = ({ status, model, language }) => {
    const colors = {
        ok: 'bg-emerald-400',
        loading: 'bg-amber-400',
        error: 'bg-rose-500'
    };
    
    const labels = {
        ok: LANGUAGE_DATA[language].ui.oracleOnline,
        loading: LANGUAGE_DATA[language].ui.thinking,
        error: LANGUAGE_DATA[language].ui.syncError
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

const LoadingIndicator: React.FC<{ statusLabel: string }> = ({ statusLabel }) => (
    <div className="flex items-start gap-3 my-4 justify-start">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-lg border-2 border-white/20">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        </div>
        <div className="max-w-xl px-5 py-3 rounded-2xl shadow-sm bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span className="text-xs font-semibold tracking-[0.18em] text-indigo-500 dark:text-indigo-300 animate-pulse whitespace-nowrap">
                    {statusLabel}
                </span>
            </div>
        </div>
    </div>
);


// Trimmed History to control tokens -> put necessary info on oracleMemory (1 instance) instead
const MAX_HISTORY = 10;
const HANDLED_MASTERY_TOPICS_KEY = "academic-oracle-handled-mastery-topics";

function trimHistory(history: ChatHistoryItem[]) {
  return history.slice(-MAX_HISTORY);
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const App: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);

  // NEW STATE: View Switching
  const [currentView, setCurrentView] = useState<'chat' | 'quiz' | 'dashboard' | 'profile'>('chat');
  // NEW STATE: Mastery Popup
  const [showMasteryPopup, setShowMasteryPopup] = useState(false);
  // NEW STATE: Pending Explanation from Quiz
  const [pendingExplanation, setPendingExplanation] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  // catch routes from other pages
  const [route, setRoute] = useState(window.location.pathname);
  useEffect(() => {
    const onPopState = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Route and Popstate helper
  const navigate = (path: string) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  useEffect(() => { // handle route changes for profile/account and quiz
    if (route === "/quiz") {
      setCurrentView("quiz");
    } else if (route === "/dashboard") {
      setCurrentView("dashboard");
    } else if (route === "/profile") {
      setCurrentView("profile");
    } else {
      setCurrentView("chat");
    }
  }, [route]);

  // Language
  const [language, setLanguage] = useState<AppLanguage>(() => {
    if (typeof window === "undefined") return "en";
    return (localStorage.getItem("academic-oracle-lang") as AppLanguage) || "en";
  });

  useEffect(() => {
    localStorage.setItem("academic-oracle-lang", language);
  }, [language]);

  useEffect(() => {
    setChatHistory(prev => {
      if (prev.length === 0) return prev;

      // Only replace the FIRST system message
      const updated = [...prev];
      if (updated[0].role === "model") {
        updated[0] = {
          ...updated[0],
          content: LANGUAGE_DATA[language].shortGreeting,
        };
      }
      return updated;
    });
  }, [language]);

  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 0) return prev;

      // Only replace the FIRST system message
      const updated = [...prev];
      if (updated[0].role === "model") {
        updated[0] = {
          ...updated[0],
          content: LANGUAGE_DATA[language].greeting,
        };
      }
      return updated;
    });
  }, [language]);


  const [encryptedApiKey, setEncryptedApiKey] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = sessionStorage.getItem("academic-oracle-chat");
    if (saved) return JSON.parse(saved);

    return [
      {
        role: "model",
        content:
          LANGUAGE_DATA[language].greeting,
      },
    ];
  });

  const lastRequestRef = useRef<{ // for retry
    message: string;
    files?: File[];
  } | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>(() => {
    if (typeof window === "undefined") return [];

    const saved = sessionStorage.getItem("academic-oracle-history");
    if (saved) return JSON.parse(saved);

    return [
      {
        role: "model",
        content:
          LANGUAGE_DATA[language].shortGreeting,
      },
    ];
  });
  const [oracleMemory, setOracleMemory] = useState<string | null>(() => { // student profile
    if (typeof window === "undefined") return null;
    const saved = sessionStorage.getItem("academic-oracle-memory");
    return saved ? serializeOracleMemory(saved) : null;
  });

  const [showDemo, setShowDemo] = useState(false);
  // const [isFreeMode, setIsFreeMode] = useState(false);
  const [mode, setMode] = useState<'free' | 'full' | 'none'>('none');

  useEffect(() => { // for student profile
    if (oracleMemory) {
      sessionStorage.setItem("academic-oracle-memory", oracleMemory);
    } else {
      sessionStorage.removeItem("academic-oracle-memory");
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

  const [chatTailoring, setChatTailoring] = useState<ChatTailoringMode>(() => {
    if (typeof window === "undefined") return "standard";
    return (localStorage.getItem("academic-oracle-tailoring") as ChatTailoringMode) || "standard";
  });

  useEffect(() => {
    localStorage.setItem("academic-oracle-tailoring", chatTailoring);
  }, [chatTailoring]);

  const shouldUseRace = (): boolean => {
    if (chatTailoring === "no") return false;
    if (chatTailoring === "always") return true;

    // standard mode
    return isRushHourUTC();
  };

  useEffect(() => { // listen to tailoring changes from profile page and update state accordingly
    const update = () => {
      const value = (localStorage.getItem("academic-oracle-tailoring") as ChatTailoringMode) || "standard";
      setChatTailoring(value);
    };

    window.addEventListener("tailoring-change", update);
    return () => window.removeEventListener("tailoring-change", update);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingModeLabel, setLoadingModeLabel] = useState<LoadingModeLabel>("Standard");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('academic-oracle-theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  useEffect(() => { //code toggle
    const link = document.getElementById("hljs-theme") as HTMLLinkElement;

    link.href = isDark
      ? "/tokyo-night-dark.css"
      : "/tokyo-night-light.css";
  }, [isDark]);
  const [isOracleOpen, setIsOracleOpen] = useState(false);
  const [oraclePos, setOraclePos] = useState<{ top: number; left: number } | null>(null);
  const oracleButtonRef = useRef<HTMLButtonElement>(null);
  const oracleMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside([oracleButtonRef, oracleMenuRef], () => setIsOracleOpen(false), isOracleOpen); // hook to close oracle status on outside click

  // const [showProfile, setShowProfile] = useState(false); // set state for profile page
  const [isAuthenticated, setIsAuthenticated] = useState(false); // auth state -> easier management

  useEffect(() => {
    setIsAuthenticated(encryptedApiKey !== null || mode === 'free');
  }, [encryptedApiKey, mode]);

  useEffect(() => {
    if (!session) {
      setMode('none');
      setEncryptedApiKey(null);
      setIsAuthenticated(false);
    }
  }, [session]);

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside([userButtonRef, userMenuRef], () => setIsUserMenuOpen(false), isUserMenuOpen); // hook to close user menu on outside click

  // UX mouse select tools
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [followUpSelectionText, setFollowUpSelectionText] = useState<string | null>(null);
  const [selectionPos, setSelectionPos] = useState<{
    x:number,
    y:number,
    placeAbove:boolean
  } | null>(null);

  function selectionToLatexText(): string {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return ""; console.log("Failed first");

    const range = selection.getRangeAt(0);
    const fragment = range.cloneContents();

    let result = "";

    function walk(node: Node) {
      // console.log("got here"); // reached here

      // TEXT
      if (node.nodeType === Node.TEXT_NODE) {

        const parent = node.parentElement;

        if (parent?.closest(".katex")) return;
        // console.log("reached text"); // reached here
        result += node.textContent ?? "";
      }

      // ELEMENT LOGIC
      if (node instanceof Element) {
        // console.log("passed checks"); // reached here

        if (node.matches("annotation[encoding='application/x-tex']")) {
          // console.log("reached math"); // reached here

          const tex = node.textContent?.trim() ?? "";
          result += ` \\(${tex}\\) `;

          return;
        }
      }

      // ALWAYS WALK CHILDREN
      for (const child of node.childNodes) {
        // console.log("running"); // reached here
        walk(child);
      }
    }

    walk(fragment);
    // console.log(result); debug only
    return result.replace(/\s+/g, " ").trim();
  }

  useEffect(() => {
    let timeoutId: number;

    const handleSelection = () => {
      // 1. CLEAR existing timeouts to reset the "wait" timer
      if (timeoutId) window.clearTimeout(timeoutId);

      const selection = window.getSelection();

      // 2. IMMEDIATE HIDE: If the user clicks away or the selection is cleared,
      // we want the button to vanish instantly, not after a delay.
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        setSelectedText(null);
        setSelectionPos(null);
        return;
      }

      // 3. DELAYED SHOW: Wait for the user to finish selecting
      timeoutId = window.setTimeout(() => {
        if (!selection || selection.isCollapsed) return;

        const container = selection.getRangeAt(0)
          .commonAncestorContainer
          ?.parentElement
          ?.closest(".model-message");
        if (!container) return;

        const text = selectionToLatexText();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        setSelectedText(prev => {
          if (prev === text) return prev;
          return text;
        });

        const PADDING = 6;
        const APPROX_BUTTON_H = 32;
        const TOOLBAR_HEIGHT = 72;

        let y: number;
        let placeAbove: boolean;

        if (rect.top - APPROX_BUTTON_H - PADDING > TOOLBAR_HEIGHT) {
          y = rect.top - APPROX_BUTTON_H - PADDING;
          placeAbove = true;
        } else {
          y = rect.bottom + PADDING;
          placeAbove = false;
        }

        setSelectionPos({
          x: rect.left + rect.width / 2,
          y,
          placeAbove,
        });
      }, 150); // 150ms is usually the "sweet spot" for human pause detection
    };

    document.addEventListener("selectionchange", handleSelection);
    // document.addEventListener("mouseup", handleSelection);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      document.removeEventListener("selectionchange", handleSelection);
      // document.removeEventListener("mouseup", handleSelection);
    };
  }, []);

  const [model, setModel] = useState<string>('gemini-3-flash-preview'); // default model -> never empty/crash on this optional feature
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLElement>(null);
  const masteryTimerRef = useRef<number | null>(null);
  const handledMasteryTopicsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const raw = sessionStorage.getItem(HANDLED_MASTERY_TOPICS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        handledMasteryTopicsRef.current = new Set(
          parsed.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        );
      }
    } catch {
      handledMasteryTopicsRef.current = new Set();
    }
  }, []);

  const persistHandledMasteryTopics = () => {
    sessionStorage.setItem(
      HANDLED_MASTERY_TOPICS_KEY,
      JSON.stringify(Array.from(handledMasteryTopicsRef.current))
    );
  };

  const clearPendingMasteryPopup = () => {
    if (masteryTimerRef.current) {
      clearTimeout(masteryTimerRef.current);
      masteryTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearPendingMasteryPopup();
    };
  }, []);

  useEffect(() => {
    if (currentView !== "chat") {
      clearPendingMasteryPopup();
    }
  }, [currentView]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [route, currentView]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
  //   chatEndRef.current?.scrollIntoView({
  //     behavior: window.innerWidth < 640 ? 'auto' : 'smooth',
  //     block: "start",
  //   });
  // }, [messages, isLoading]);

  useEffect(() => {
    if (currentView === "chat" || route === "/") {
      chatEndRef.current?.scrollIntoView({
        behavior: window.innerWidth < 640 ? 'auto' : 'smooth',
        block: "start",
      });
    }
  }, [currentView, route]);

  useEffect(() => {
    if (currentView === "dashboard") {
      mainScrollRef.current?.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }
  }, [currentView]);

  useEffect(() => { // update oracle-api-key and only save it as string format
    if (encryptedApiKey) {
      sessionStorage.setItem("oracle-api-key", JSON.stringify(encryptedApiKey));
    }
  }, [encryptedApiKey]);

  useEffect(() => { // set encryptedApiKey on sessionStorage oracle-api-key change (changed to JSON object)
    const key = sessionStorage.getItem("oracle-api-key");
    if (key && !encryptedApiKey) setEncryptedApiKey(JSON.parse(key)); // prevent overwrite if the oracle-api-key is older than current state
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setEncryptedApiKey(null);
        sessionStorage.removeItem("oracle-api-key");
      }
    });
  }, []);

  const currentChatIdRef = useRef<string>(crypto.randomUUID());

  // ✅ Handle sending messages with dynamic encryptedApiKey
  const handleSendMessage = async (
    userMessage: string,
    files: File[] = [],
    isRetry = false
  ) => {
    if (!session?.access_token) { handleLogout(); return; }

    setIsLoading(true);
    setError(null);

    try {
      if (!isRetry) {
        // 🖼️ UI update (unchanged, clean)
        setMessages(prev => [
          ...prev,
          {
            role: "user",
            content: userMessage,
            attachments: files.length > 0
              ? files.map((file) => ({
                  name: file.name,
                  type: file.type,
                  size: file.size,
                }))
              : undefined,
          },
        ]);

        requestAnimationFrame(() => {
          chatEndRef.current?.scrollIntoView({
            behavior: window.innerWidth < 640 ? "auto" : "smooth",
            block: "start",
          });
        });
      }
      
      const guard = analyzePrompt(userMessage, language);
      let decision = guard;
      let webContext = "";
      let currentLoadingLabel: LoadingModeLabel = "Standard";

      // jailbreak block
      if (decision.jailbreak) {
        setMessages(prev => [
          ...prev,
          { role: "model", content: LANGUAGE_DATA[language].ui.jailbreakMessage },
        ]);

        setIsLoading(false);
        return;
      }

      // cron model verification
      if (guard.web_search || guard.jailbreak) {
        try {
          const res = await runCronPromptGuard(userMessage, encryptedApiKey);
          if (!res.reason.includes("Error")) {
            decision = res;
          }
        } catch (e) {
          console.warn("Cron guard failed", e);
        }
      }

      // jailbreak block: second round
      if (decision.jailbreak) {
        setMessages(prev => [
          ...prev,
          { role: "model", content: LANGUAGE_DATA[language].ui.jailbreakMessage },
        ]);

        setIsLoading(false);
        return;
      }

      if (!session) return;
      const token = session?.access_token;
      // increment quota here
      if (!encryptedApiKey){
        const result = await canSendMessage(currentChatIdRef, token!);
        if (!result.allowed) {
          setError(LANGUAGE_DATA[language].ui.freeSessionLimit);
          return;
        }
      }

      // web search
      if (decision.web_search && !isWebSearchLimitReached()) {
        try {
          console.log("running web search");
          currentLoadingLabel = "Web Search";
          setLoadingModeLabel("Web Search");
          incrementWebSearch();

          const webResults = await runQuotaSafeSearch(
            userMessage,
            encryptedApiKey,
            decision.web_search_topic ?? "general"
          );

          if (webResults && webResults.length > 0) {

            const overview = webResults
              .map(w => w.overview)
              .filter(Boolean)
              .join("\n\n");

            const seen = new Set();

            const results = webResults
              .flatMap(w => w.results ?? [])
              .filter(r => {
                if (seen.has(r.link)) return false;
                seen.add(r.link);
                return true;
              })
              .slice(0, 3); // limit total results

            webContext = `
          --- WEB SEARCH RESULTS ---
          ${overview}

          ${results.map((r: any) =>
          `${r.title}
          ${r.snippet}
          ${r.link}`
          ).join("\n\n")}

          --- END WEB SEARCH ---
          `;
          }

        } catch (e) {
          console.warn("Web search failed", e);
          setMessages(prev => [
            ...prev,
            { role: "model", content: LANGUAGE_DATA[language].ui.webSearchFailedMessage },
          ]);
          setIsLoading(false);
          return;
        }
      } else if (isWebSearchLimitReached()){
        console.warn("Web Search Limit reaches");
        // alert(LANGUAGE_DATA[language].ui.webSearchQuotaReached); remove alert, use in-chat message for better UX
        setMessages(prev => [
          ...prev,
          { role: "model", content: LANGUAGE_DATA[language].ui.webSearchQuotaReachedMessage },
        ]);
        setIsLoading(false);
        return;
      }

      let fileContext = "";

      if (files.length > 0) {
        const extractedFileTexts = await Promise.all(
          files.map(async (file) => {
            const extractedText = await readFileAsText(file);
            return `
  --- FILE CONTEXT (${file.name}) ---
  ${extractedText}
  --- END FILE CONTEXT ---
  `;
          })
        );

        fileContext = extractedFileTexts.join("\n");
      }

      let outgoingHistory = chatHistory;

      if (!isRetry) { // avoid double user questions if reTry
        const userEntry: ChatHistoryItem = {
          role: "user",
          content: `${webContext}\n${fileContext}\nUSER QUESTION:\n${userMessage}`.trim(),
        };

        outgoingHistory = trimHistory([...chatHistory, userEntry]);

        setChatHistory(outgoingHistory);
      }

      // cache for retry if failed
      lastRequestRef.current = {
        message: userMessage,
        files,
      };

      const isVeryShortPrompt = countWords(userMessage) < 3; // heuristic check to fast-forward short prompts directly to Balanced Racing mode -> better UX, save time, tokens cost
      const isShortPrompt = countWords(userMessage) < 8;
      const useRace = isVeryShortPrompt ? 
      true : isShortPrompt ?
      true : shouldUseRace(); // respect tailoring settings and rush hour optimization
      let raceIntent: "agentic" | "fast" | "balance" | null = null;

      if (isVeryShortPrompt) {
        raceIntent = "fast";
        currentLoadingLabel = "Fast";
      } else if (isShortPrompt) {
        raceIntent = "balance";
        currentLoadingLabel = "Balanced";
      } else if (useRace) {
        raceIntent = await classifyIntent(
          encryptedApiKey,
          outgoingHistory.map(h => `${h.role.toUpperCase()}: ${h.content}`).join("\n\n")
        );

        currentLoadingLabel =
          raceIntent === "agentic"
            ? "Agentic"
            : raceIntent === "fast"
              ? "Fast"
              : "Balanced";
      } else if (!decision.web_search) {
        currentLoadingLabel = "Standard";
      }

      setLoadingModeLabel(currentLoadingLabel);

      console.log(
        `Using ${useRace ? "RACE" : "standard"} strategy for this request`
      );

      const { answer, memory, model } =
        await (
          useRace
            ? sendMessageToBotRace({
                history: outgoingHistory,
                memory: oracleMemory,
                encryptedKeyPayload: encryptedApiKey,
                language: language,
                intent: raceIntent ?? "balance",
              })
            : sendMessageToBot({
                history: outgoingHistory,
                memory: oracleMemory,
                encryptedKeyPayload: encryptedApiKey,
                language: language,
              })
        );

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
        const newlyMasteredTopicTag = getNewlyMasteredTopicTag(oracleMemory, memory);
        setOracleMemory(memory);

        if (
          newlyMasteredTopicTag &&
          currentView === "chat" &&
          !handledMasteryTopicsRef.current.has(newlyMasteredTopicTag.toLowerCase())
        ) {
          clearPendingMasteryPopup();
          handledMasteryTopicsRef.current.add(newlyMasteredTopicTag.toLowerCase());
          persistHandledMasteryTopics();

          masteryTimerRef.current = window.setTimeout(() => {
            if (currentView === "chat") {
              setShowMasteryPopup(true);
            }
            masteryTimerRef.current = null;
          }, 8000);
        }
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
      if (err instanceof InvalidAPIError) {
        setError(LANGUAGE_DATA[language].ui.apiKeyExpired);
      } else if (status === 429) {
        const retryText = extractedRetryDelay
          ? LANGUAGE_DATA[language].ui.rateLimitRetry.replace("{delay}", extractedRetryDelay)
          : "Try again later";
        setError(
          LANGUAGE_DATA[language].ui.rateLimitError + "\n\n" +
          `⏳ ${retryText}, or\n` +
          "❤️ " + LANGUAGE_DATA[language].ui.rateLimitSupport
        );
      } else {
        // setError(message); debug only
        setError(LANGUAGE_DATA[language].ui.genericError); // never expose raw error to user
      }

    } finally {
      setIsLoading(false);
      setLoadingModeLabel("Standard");
    }
  };

  const handleRetry = () => {
    if (!lastRequestRef.current || isLoading) return;

    setError(null);

    handleSendMessage(
      lastRequestRef.current.message,
      lastRequestRef.current.files ?? [],
      true
    );
  };

  const getStatus = (): 'ok' | 'loading' | 'error' => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    return 'ok';
  };

  const resetChat = () => { // for new chat

    if (isLoading) return; // prevent reset during loading
    if (chatHistory.length <= 1) { // no existing chat or profile
      alert(LANGUAGE_DATA[language].ui.noExistingChat);
      return;
    }

    // 🧹 wipe persisted chat state
    sessionStorage.removeItem("academic-oracle-chat");
    sessionStorage.removeItem("academic-oracle-history");
    sessionStorage.removeItem("academic-oracle-quiz-state"); // Clear quiz cache on reset

    clearPendingMasteryPopup();
    handledMasteryTopicsRef.current = new Set();
    sessionStorage.removeItem(HANDLED_MASTERY_TOPICS_KEY);

    // ⚠️ optional: keep or wipe memory?
    if (window.confirm(LANGUAGE_DATA[language].ui.wipeProfile)) {
      sessionStorage.removeItem("academic-oracle-memory");
      setOracleMemory(null);
    }

    navigate("/"); // navigate back to chat

    // 🖼️ reset UI messages
    setMessages([
      {
        role: "model",
        content:
          LANGUAGE_DATA[language].greeting,
      },
    ]);

    // 🧠 reset model context
    setChatHistory([
      {
        role: "model",
        content:
          LANGUAGE_DATA[language].shortGreeting,
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
    // setIsFreeMode(false); // disable so that the App redirects to AuthPage (see conditional render below)
    setMode('none'); // reset mode - important! otherwise stays in 'free' mode and skips AuthPage -> a loop bug where the AuthPage stays loading forever
    setIsAuthenticated(false); // reset auth state
    setSession(null); // reset supabase session

    sessionStorage.removeItem("academic-oracle-chat"); // 🧹 wipe chat
    sessionStorage.removeItem("academic-oracle-history"); // wipe history
    sessionStorage.removeItem("oracle-api-key");
    sessionStorage.removeItem("academic-oracle-memory"); //wipe profile
    sessionStorage.removeItem("academic-oracle-quiz-state"); // Clear quiz cache on logout
    localStorage.removeItem("chat_input_draft"); // clear draft
    setOracleMemory(null);

    clearPendingMasteryPopup();
    handledMasteryTopicsRef.current = new Set();
    sessionStorage.removeItem(HANDLED_MASTERY_TOPICS_KEY);

    navigate("/"); // redirect to home/login page

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
    if (!session?.access_token) { handleLogout(); return; }
    if (!isAuthenticated) {
      alert(LANGUAGE_DATA[language].ui.pleaseLogin);
      return;
    }
    if (isLoading) {
      alert(LANGUAGE_DATA[language].ui.pleaseWait);
      return;
    }
    if (chatHistory.length <= 5 || !hasReadyOracleMemory(oracleMemory)) { // need enough context
      alert(LANGUAGE_DATA[language].ui.notEnoughHistory);
      return;
    }

    try {
      setIsGeneratingSummary(true);

      // move here: below the animation trigger to prevent the feel of 'laggy' delay
      if (!session) return;
      const token = session?.access_token;
      if (!encryptedApiKey){
        const result = await canSendMessage(currentChatIdRef, token!);
        if (!result.allowed) {
          setError(LANGUAGE_DATA[language].ui.freeSessionLimit);
          return;
        }
      }

      const summary = await generateSessionSummary({
        history: chatHistory,
        memory: oracleMemory,
        encryptedKeyPayload: encryptedApiKey,
        language: language,
      });

      const safeSummary = normalizeSummary(summary);

      await createSummaryDoc(safeSummary);
    } catch (err) {
      console.error(err);
      alert(LANGUAGE_DATA[language].ui.failedToGenerateSummary);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // --- QUIZ HANDLERS ---
  const handleExplainRequest = (context: string) => {
    setPendingExplanation(context);
    navigate("/chat"); // switch to chat view, which will trigger the effect to send the explanation request
  };

  // Effect to auto-fill input when explanation is requested
  useEffect(() => {
    if (pendingExplanation && currentView === 'chat') {
      // We essentially "mock" the user sending this message
      handleSendMessage(pendingExplanation);
      setPendingExplanation(null);
    }
  }, [pendingExplanation, currentView]);

  const handleAddToMemory = (summary: string, topicTag: string | null) => {
    setOracleMemory((prev) => recordQuizResultInMemory(prev, summary, topicTag, chatHistory));
    alert(LANGUAGE_DATA[language].ui.memoryAdded);
  };


  if (showDemo) {
    return <ArcadeDemo />;
  }

  if (!isAuthenticated) { // use state for auth check -> easier management -> unified for both free/full modes
    return (
      <AuthPage
        onLogin={(key, userMode) => {
          setEncryptedApiKey(key);
          setMode(userMode);
        }}
        onViewDemo={() => setShowDemo(true)}
      />
    );
  }

  const user = session?.user;

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.id}`;

  const openHome = () => {
    if (isLoading) {
      alert(LANGUAGE_DATA[language].ui.pleaseWait);
      return;
    }

    setIsSidebarOpen(false);
    window.open('/home', '_self');
  };

  const goToView = (path: string) => {
    setIsSidebarOpen(false);
    navigate(path);
  };
  
  // // normalize routes (for routing from other pages. Ex: src/pages/home/Navbar.tsx)
  // const isProfileRoute =
  // route === "/profile" || route === "/account";

  // if (isProfileRoute) {
  //   return (
  //     <ProfilePage
  //       user={user}
  //       encryptedApiKey={encryptedApiKey}
  //       language={language}
  //       onLanguageChange={setLanguage}
  //       onSave={(key) => setEncryptedApiKey(key)}
  //       onBack={() => {
  //         if (window.history.length > 1) {
  //           window.history.back();
  //         } else {
  //           navigate("/");
  //         }
  //       }}
  //     />
  //   );
  // }

  return (
    currentView === 'profile' ? (
      <ProfilePage
        user={user}
        encryptedApiKey={encryptedApiKey}
        language={language}
        onLanguageChange={setLanguage}
        onSave={(key) => setEncryptedApiKey(key)}
        onBack={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            navigate("/");
          }
      }}
      />
    ) : (
      /* Use flex-col and h-screen to ensure the container fills the viewport */
      <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans antialiased">
        {isSidebarOpen && ( // backdrop for mobile when sidebar is open
          <button
            type="button"
            aria-label="Close sidebar"
            className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* 1. Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 flex w-16 flex-col items-center border-r border-black/5 bg-white/85 pt-4 pb-4 backdrop-blur-md transition-transform duration-300 dark:border-white/10 dark:bg-slate-950/90 md:static md:w-14 md:translate-x-0 md:bg-white/30 md:dark:bg-white/5 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="mb-4 flex w-full justify-end px-3 md:hidden">
              <button
                type="button"
                aria-label="Close sidebar"
                className="rounded-lg p-1.5 text-slate-700 transition-colors hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="mb-6">
              {/* <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-indigo-500/90 text-white tracking-wide">UNIV</span> */}
              <div className="p-1 rounded-[8px] transition-colors hover:bg-black/5 dark:hover:bg-white/10">
              <a onClick={openHome}>
                <img src="/icon.png" alt="Academic Oracle Logo" className="w-8 h-7 select-none"/>
              </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200" onClick={() => { setIsSidebarOpen(false); resetChat(); }} title={LANGUAGE_DATA[language].tooltips.newChat}>
                <SquarePen size={18} />
              </button>

              <button
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
                }`}
                onClick={() => goToView("/dashboard")}
                title="Dashboard"
              >
                <LayoutDashboard size={18} />
              </button>

              {/* QUIZ BUTTON */}
              <button 
                className={`p-2 rounded-lg transition-colors ${
                  currentView === 'quiz' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                  : 'hover:bg-black/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200'
                }`}
                onClick={() => goToView("/quiz")} 
                title={LANGUAGE_DATA[language].tooltips.quiz}
              >
                <BrainCircuit size={18} />
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
                    <button className="flex items-center w-full px-3 py-2 text-left hover:bg-black/5" onClick={() => { setIsSidebarOpen(false); navigate("/profile"); }}>
                      <User size="17" /> <span className='mx-2'>{LANGUAGE_DATA[language].ui.profile}</span> 
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-3 py-2 text-left text-rose-600 hover:bg-black/5"
                    >
                      <LogOut size="16" /> <span className='mx-2'>{LANGUAGE_DATA[language].ui.logOut}</span> 
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
          <header className="h-16 flex items-center justify-between gap-3 px-3 sm:px-4 md:px-6 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-black/5 dark:border-white/10 z-20">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                aria-label="Open sidebar"
                className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-black/5 dark:text-slate-200 dark:hover:bg-white/10 md:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={18} />
              </button>
              <button 
                ref={oracleButtonRef}
                className="min-w-0 text-left text-sm font-medium text-slate-900 transition-colors hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400 sm:text-base md:text-lg"
                onClick={() => setIsOracleOpen(prev => !prev)}>
                  <span className="truncate">Academic Oracle</span> <ChevronDown size={16} className="inline-block ml-1 mb-0.5 shrink-0" />
              </button>
            </div>
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
                      {LANGUAGE_DATA[language].ui.oracleStatus}
                    </p>
                  </div>

                  <div className="px-4 py-3">
                    <SystemStatus status={getStatus()} model={model} language={language} />
                  </div>
                </div>,
                document.body
              )
            }
            <div className="flex shrink-0 items-center">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-1.5 mr-2 rounded-full bg-white/60 dark:bg-slate-950 
                text-slate-700 dark:text-slate-200 
                hover:bg-white/80 dark:hover:bg-slate-700 
                transition-colors 
                flex items-center justify-center"
              >
                {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>

              <button
                className="p-1.5 rounded-full bg-white/60 dark:bg-slate-950 
                text-slate-700 dark:text-slate-200 
                hover:bg-white/80 dark:hover:bg-slate-700 
                transition-colors 
                flex items-center justify-center"
                onClick={ ()=> window.open("https://buymeacoffee.com/votanbinh", "_blank")}
              >
                <img
                  src={isDark? "/buymeacoffeeblack.svg" : "/buymeacoffee.svg"}
                  alt="Buy Me A Coffee"
                  className="w-6 h-5 object-contain"
                />
              </button>
            </div>     
          </header>

          {/* MAIN VIEW SWITCHER */}
          <main ref={mainScrollRef} className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar relative">
            {currentView === 'chat' ? (
              <div className={`mx-auto max-w-4xl px-3 pt-6 sm:px-4 sm:pt-8 ${followUpSelectionText ? 'pb-44 sm:pb-40' : 'pb-32'}`}>
                {messages.map((msg, index) => {
                  const isLast = index === messages.length - 1;
                  const isUser = msg.role === "user";

                  return (
                    <ChatMessage
                      key={index}
                      message={msg}
                      scrollRef={isLast && isUser ? chatEndRef : undefined}
                    />
                  );
                })}
                {isLoading && (
                  <LoadingIndicator
                    statusLabel={LANGUAGE_DATA[language].ui.loadingModeLabels[loadingModeLabel]}
                  />
                )}
                {error && (
                  <div className="bg-rose-100/80 dark:bg-rose-900/20 text-rose-600 p-4 rounded-2xl text-center my-6">
                    <p>{error}</p>
                    <button onClick={handleRetry} className="mt-2 bg-rose-500 text-white px-4 py-1 rounded-full text-xs">{LANGUAGE_DATA[language].ui.retryButton}</button>
                  </div>
                )}
                <div ref={chatEndRef} />
                
                {/* MASTERY POPUP */}
                {showMasteryPopup &&
                  createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                      
                      {/* Backdrop */}
                      <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setShowMasteryPopup(false)}
                      />

                      {/* Popup Card */}
                      <div className="relative max-w-sm w-full mx-4 animate-in zoom-in-95 fade-in">
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl
                                        shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]
                                        border border-indigo-500/40
                                        ring-4 ring-indigo-500/10">
                          
                          <h3 className="font-bold text-lg mb-2 text-indigo-600 dark:text-indigo-400">
                            {LANGUAGE_DATA[language].ui.masteryDetected} 🏆
                          </h3>

                          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                            {LANGUAGE_DATA[language].ui.masteryPopupExplain}
                          </p>

                          <div className="flex gap-3">
                            <button 
                              onClick={() => {
                                navigate("/quiz");
                                setShowMasteryPopup(false);
                              }}
                              className="flex-1 bg-indigo-600 hover:bg-indigo-700
                                        text-white py-2 rounded-xl font-medium text-sm transition-colors"
                            >
                              {LANGUAGE_DATA[language].ui.masteryPopupYes}
                            </button>

                            <button 
                              onClick={() => setShowMasteryPopup(false)}
                              className="flex-1 bg-slate-100 dark:bg-slate-700
                                        hover:bg-slate-200 dark:hover:bg-slate-600
                                        text-slate-700 dark:text-slate-200
                                        py-2 rounded-xl font-medium text-sm transition-colors"
                            >
                              {LANGUAGE_DATA[language].ui.masteryPopuplLater}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )
                }
              </div>
            ) : currentView === 'dashboard' ? (
              <DashboardView
                language={language}
                memory={oracleMemory}
                history={chatHistory}
                isGeneratingSummary={isGeneratingSummary}
                onDownloadSummary={handleGenerateSummary}
                onBack={() => navigate("/")}
              />
            ) : (
              // QUIZ VIEW
              <QuizView 
                language={language}
                history={chatHistory} 
                memory={oracleMemory} 
                encryptedApiKey={encryptedApiKey}
                onBack={() => navigate("/")} // back to chat view
                onExplainRequest={handleExplainRequest}
                onAddToMemory={handleAddToMemory}
              />
            )}
            {selectedText && selectionPos &&
              createPortal(
                <div
                  data-explain-btn
                  style={{
                    position: "fixed",
                    top: selectionPos.y,
                    left: selectionPos.x,
                      transform: selectionPos.placeAbove
                      ? "translate(-50%, -25%)"
                      : "translate(-50%, 0)"
                  }}
                  className="
                    z-[9999] flex items-center gap-2 rounded-xl border border-slate-200/80
                    bg-white/95 p-1 shadow-xl backdrop-blur dark:border-slate-700/80
                    dark:bg-slate-900/95 animate-in fade-in zoom-in-95
                  "
                >
                  <button
                    type="button"
                    className="
                      flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5
                      text-xs font-medium text-white transition-colors hover:bg-indigo-500
                    "
                    onClick={() => {
                      if (isLoading) return;

                      const prompt = LANGUAGE_DATA[language].ui.explainSelectionPrompt.replace(
                        "{selection}",
                        selectedText
                      );

                      handleSendMessage(prompt);

                      window.getSelection()?.removeAllRanges();
                      setSelectedText(null);
                      setSelectionPos(null);
                    }}
                  >
                    <Sparkles size={14}/>
                    {LANGUAGE_DATA[language].ui.explainSelectionButton}
                  </button>
                  <button
                    type="button"
                    className="
                      flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
                      text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200
                      dark:hover:bg-slate-800
                    "
                    onClick={() => {
                      // if (isLoading) return;

                      setFollowUpSelectionText(selectedText);
                      window.getSelection()?.removeAllRanges();
                      setSelectedText(null);
                      setSelectionPos(null);
                    }}
                  >
                    <SquarePen size={14}/>
                    {LANGUAGE_DATA[language].ui.followUpSelectionButton}
                  </button>
                </div>,
                document.body
              )
            }
          </main>

          {/* INPUT FOOTER (Only show in Chat Mode) */}
          {currentView === 'chat' && (
            <footer className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
              <div className="pointer-events-auto bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/90 to-transparent">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  language={language}
                  followUpSelectionText={followUpSelectionText}
                  onClearFollowUpSelection={() => setFollowUpSelectionText(null)}
                />
              </div>
            </footer>
          )}
        </div>
      </div>
    )
  );
};

export default App;
