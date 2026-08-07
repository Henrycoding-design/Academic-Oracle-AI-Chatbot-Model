import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CornerDownRight, Plus, Paperclip, Brain, Globe } from 'lucide-react';
import { LANGUAGE_DATA, AppLanguage } from '../lang/Language.tsx';
import { flashSelectionGlow } from '../services/selectionGlow';
import type { UserMessageUiMeta } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[], uiMeta?: UserMessageUiMeta) => void;
  isLoading: boolean;
  language: AppLanguage;
  followUpSelectionText?: string | null;
  followUpSelectionTargetId?: string | null;
  onClearFollowUpSelection?: () => void;
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


export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  language,
  followUpSelectionText,
  followUpSelectionTargetId,
  onClearFollowUpSelection,
}) => {
  const PLACEHOLDERS = {
    full: LANGUAGE_DATA[language].ui.placeholderFull,
    medium: LANGUAGE_DATA[language].ui.placeholderMedium,
    short: LANGUAGE_DATA[language].ui.placeholderShort,
  };
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDeepMode, setIsDeepMode] = useState(false);
  const [isWebSearch, setIsWebSearch] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ bottom: number; left: number } | null>(null);

  const plusButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS.full);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const toggleMenu = () => {
    if (!isMenuOpen && plusButtonRef.current) {
      const rect = plusButtonRef.current.getBoundingClientRect();
      setMenuPos({
        bottom: window.innerHeight - rect.top + 8,
        left: Math.max(12, rect.left),
      });
    }
    setIsMenuOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        plusButtonRef.current &&
        !plusButtonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleClose = () => setIsMenuOpen(false);

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('resize', handleClose);
    window.addEventListener('scroll', handleClose, true);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('resize', handleClose);
      window.removeEventListener('scroll', handleClose, true);
    };
  }, [isMenuOpen]);

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
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    if (isLoading) return;

    const selectionContext = followUpSelectionText
      && followUpSelectionTargetId
      ? {
          targetMessageId: followUpSelectionTargetId,
          actionLabel: LANGUAGE_DATA[language].ui.followUpSelectionButton,
          selectionText: followUpSelectionText,
        }
      : undefined;

    const nextMessage = followUpSelectionText
      ? LANGUAGE_DATA[language].ui.followUpSelectionPrompt
          .replace("{selection}", followUpSelectionText)
          .replace("{message}", inputValue)
      : inputValue;

    onSendMessage(nextMessage, attachedFiles, {
      displayContent: followUpSelectionText ? inputValue : nextMessage,
      selectionContext,
      forceDeepMode: isDeepMode,
      forceWebSearch: isWebSearch,
    });
    setAttachedFiles([]);
    setInputValue('');
    setIsDeepMode(false);
    setIsWebSearch(false);
    onClearFollowUpSelection?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

  const appendFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles?.length) return;

    setAttachedFiles((prev) => {
      const next = [...prev];

      Array.from(incomingFiles).forEach((file) => {
        const exists = next.some(
          (existing) =>
            existing.name === file.name &&
            existing.size === file.size &&
            existing.lastModified === file.lastModified
        );

        if (!exists) {
          next.push(file);
        }
      });

      return next;
    });
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    
    if (fileInputRef.current) { // this is to allow re-uploading the same file after deletion, as some browsers won't trigger onChange if the same file is selected again
      fileInputRef.current.value = '';
    }
  };

  // Handle paste event to allow pasting images directly from clipboard
  const handlePaste: React.ClipboardEventHandler<HTMLTextAreaElement> = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const renamedFile = new File(
            [file],
            `pasted-${Date.now()}.png`,
            { type: file.type }
          );
          files.push(renamedFile);
        }
      }
    }

    if (files.length > 0) {
      e.preventDefault(); // 🔥 prevent random text insertion

      // Convert File[] → FileList-like
      const dataTransfer = new DataTransfer();
      files.forEach((file) => dataTransfer.items.add(file));

      appendFiles(dataTransfer.files);
    }
  };

  return (
    <div className="w-full px-4 pb-4 pt-3 sm:pb-3 sm:pt-2">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl transition-all duration-300">
          {followUpSelectionText && (
            <div className="px-3 pt-3">
              <div className="flex items-start gap-3 rounded-2xl border border-indigo-200/80 bg-indigo-50/90 px-3 py-2.5 text-sm text-slate-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    if (!followUpSelectionTargetId) return;
                    flashSelectionGlow(followUpSelectionTargetId, followUpSelectionText);
                  }}
                  className="min-w-0 flex flex-1 items-start gap-2.5 rounded-xl text-left transition hover:bg-white/40 dark:hover:bg-slate-800/30"
                >
                  <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0 text-indigo-700 dark:text-indigo-300" />
                  <div className="min-w-0 max-h-12 overflow-hidden text-sm leading-5 text-slate-600 dark:text-slate-300">
                    "{followUpSelectionText}"
                  </div>
                </button>
                <button
                  type="button"
                  onClick={onClearFollowUpSelection}
                  className="shrink-0 rounded-lg px-2 py-1 text-slate-500 transition hover:bg-white/70 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200"
                  aria-label="Clear follow-up selection"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {(attachedFiles.length > 0 || isDeepMode || isWebSearch) && (
            <div className="px-2 pt-2">
              <div className="flex flex-wrap gap-2 items-center">
                {isDeepMode && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold">
                    <Brain className="w-3.5 h-3.5" />
                    <span>{LANGUAGE_DATA[language].ui.loadingModeLabels.Deep}</span>
                    <button
                      type="button"
                      onClick={() => setIsDeepMode(false)}
                      className="ml-1 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                      aria-label="Remove Deep mode"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {isWebSearch && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{LANGUAGE_DATA[language].ui.loadingModeLabels['Web Search']}</span>
                    <button
                      type="button"
                      onClick={() => setIsWebSearch(false)}
                      className="ml-1 text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200"
                      aria-label="Remove Web search"
                    >
                      ✕
                    </button>
                  </div>
                )}
                {attachedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                    className="inline-flex max-w-full items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 rounded-xl text-sm"
                  >
                    <span className="truncate max-w-[220px] text-slate-900 dark:text-slate-100">
                      <span>
                        {fileIconFor(file.name)}
                      </span> {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachedFile(index)}
                      className="shrink-0 text-slate-500 hover:text-rose-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 p-2 min-h-[56px]">
            <button
              ref={plusButtonRef}
              type="button"
              onClick={toggleMenu}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-600 dark:text-slate-300"
              title="Add options"
              aria-label="Add options"
            >
              <Plus className="w-5 h-5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.png,.jpg"
              multiple
              hidden
              onChange={(e) => appendFiles(e.target.files)}
            />
            <textarea
              ref={taRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPaste={handlePaste}
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
                max-h-[120px]
              "
              style={{ lineHeight: "1.5" }}
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || (!inputValue.trim() && attachedFiles.length === 0)}
              className={`
                flex-shrink-0 p-3 rounded-lg transition-all duration-200
                shadow-lg active:scale-95
                ${isLoading || (!inputValue.trim() && attachedFiles.length === 0)
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"}
              `}
              style={{ borderRadius: '8px' }}
              aria-label="Send message"
            >
              <SendIcon className="w-6 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-[10.5px] leading-snug text-slate-400 dark:text-slate-500 select-none opacity-80">
        {LANGUAGE_DATA[language].ui.disclaimer}
      </div>

      {isMenuOpen && menuPos && createPortal(
        <div
          ref={menuRef}
          className="
            fixed z-[9999] w-48 rounded-2xl
            bg-white/95 dark:bg-slate-900/95
            text-slate-800 dark:text-slate-100
            shadow-2xl border border-slate-200/80 dark:border-slate-800/80
            backdrop-blur-xl p-1.5 text-sm
            animate-in fade-in zoom-in-95 duration-150
          "
          style={{
            bottom: `${menuPos.bottom}px`,
            left: `${menuPos.left}px`,
          }}
        >
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              fileInputRef.current?.click();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition text-slate-700 dark:text-slate-200 text-sm font-medium"
          >
            <Paperclip className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>{LANGUAGE_DATA[language].ui.uploadFile}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsDeepMode(prev => !prev);
              setIsMenuOpen(false);
            }}
            className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-xl transition text-sm font-medium ${
              isDeepMode
                ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span>{LANGUAGE_DATA[language].ui.loadingModeLabels.Deep}</span>
            </div>
            {isDeepMode && (
              <span className="text-[10px] uppercase tracking-wider bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-semibold">
                ON
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsWebSearch(prev => !prev);
              setIsMenuOpen(false);
            }}
            className={`flex items-center justify-between w-full px-3 py-2 text-left rounded-xl transition text-sm font-medium ${
              isWebSearch
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>{LANGUAGE_DATA[language].ui.loadingModeLabels['Web Search']}</span>
            </div>
            {isWebSearch && (
              <span className="text-[10px] uppercase tracking-wider bg-emerald-600 text-white px-1.5 py-0.5 rounded-md font-semibold">
                ON
              </span>
            )}
          </button>
        </div>,
        document.body
      )}
    </div>
  );
};

