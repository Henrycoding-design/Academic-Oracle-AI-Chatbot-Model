
import React, { useLayoutEffect, useRef, useState, useEffect} from 'react';
import { LANGUAGE_DATA, AppLanguage } from '../lang/Language.tsx';

interface ChatInputProps {
  onSendMessage: (message: string, file?: File | null) => void;
  isLoading: boolean;
  language: AppLanguage;
}

const SendIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
      fill="currentColor"
    />
  </svg>
);

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, language }) => {
  const PLACEHOLDERS = {
    full: LANGUAGE_DATA[language].ui.placeholderFull,
    medium: LANGUAGE_DATA[language].ui.placeholderMedium,
    short: LANGUAGE_DATA[language].ui.placeholderShort,
  };
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS.full);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const savedDraft = localStorage.getItem("chat_input_draft");
    if (savedDraft) {
      setInputValue(savedDraft);
    }
  }, []);

  useEffect(() => { // auto-save draft to localStorage with debounce
    if (typeof window === "undefined") return;

    const timeout = setTimeout(() => {
      if (inputValue) {
        localStorage.setItem("chat_input_draft", inputValue);
      } else {
        localStorage.removeItem("chat_input_draft");
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [inputValue]);


  const handleSubmit = () => {
    if (!inputValue.trim() && !attachedFile) return;
    if (isLoading) return;


    onSendMessage(inputValue, attachedFile);
    setAttachedFile(null);
    setInputValue('');
    localStorage.removeItem("chat_input_draft");
  };

  const autosize = () => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    const maxHeight = 150;
    const nextHeight = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = `${nextHeight}px`;
    ta.style.overflowY = ta.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useLayoutEffect(() => {
    autosize();
  }, [inputValue]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return; // SSR guard

    const updatePlaceholder = () => {
      const w = window.innerWidth;

      if (w < 480) setPlaceholder(PLACEHOLDERS.short);
      else if (w < 768) setPlaceholder(PLACEHOLDERS.medium);
      else setPlaceholder(PLACEHOLDERS.full);
    };

    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);

    return () => window.removeEventListener("resize", updatePlaceholder);
  }, []);

  const fileIconFor = (name?: string) => {
    const t = (name || "").toLowerCase();

    if (t.includes("pdf")) return "📕";
    if (t.includes("png") || t.includes("jpg") || t.includes("jpeg")) return "🖼️";
    if (t.includes("doc") || t.includes("word")) return "📘";
    if (t.includes("txt")) return "📄";
    if (t.includes("ppt")) return "📊";
    if (t.includes("xls") || t.includes("sheet")) return "📈";

    return "📎";
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!isComposing) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);


  return (
    <div className="w-full px-4 pb-3 pt-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 p-2 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title={LANGUAGE_DATA[language].ui.uploadFile}
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.png,.jpg"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAttachedFile(file);
            }}
          />
          <textarea
            ref={taRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder={placeholder}
            rows={1}
            className="
              flex-grow px-4 py-3 bg-transparent
              text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none resize-none
              min-h-[48px]
            "
            style={{ lineHeight: "1.5" }}
          />
          {attachedFile && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5
                            bg-slate-200 dark:bg-slate-800
                            rounded-xl text-sm">
              <span className="truncate max-w-[200px] text-slate-900 dark:text-slate-100">
                <span>
                  {fileIconFor(attachedFile.name)}
                </span> {attachedFile.name}
              </span>
              <button
                onClick={() => setAttachedFile(null)}
                className="text-slate-500 hover:text-rose-500"
              >
                ✕
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            className={`
              flex-shrink-0 p-3 rounded-lg transition-all duration-200
              shadow-lg active:scale-95
              ${isLoading || !inputValue.trim()
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"}
            `}
            style={{ borderRadius: '8px' }}
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="mt-3 text-center text-[10.5px] leading-snug text-slate-400 dark:text-slate-500 select-none opacity-80">
        {LANGUAGE_DATA[language].ui.disclaimer}
      </div>
    </div>
  );
};
