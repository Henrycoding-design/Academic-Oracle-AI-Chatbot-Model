import React from 'react';
import { CornerDownRight } from 'lucide-react';
import type { Message } from '../types';
import { MarkdownContent } from './MarkdownContent';

interface ChatMessageProps {
  message: Message;
  scrollRef?: React.Ref<HTMLDivElement>;
}

const SELECTION_HIGHLIGHT_NAME = "oracle-selection-glow";
const SELECTION_HIGHLIGHT_STYLE_ID = "oracle-selection-highlight-style";
const SELECTION_FALLBACK_CLASS = "oracle-selection-bubble-glow";

let clearSelectionGlowTimeout: number | null = null;

const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg border-2 border-white/20">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    </div>
);

const UserAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-slate-400 dark:bg-slate-700 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);


const fileIconFor = (type?: string, name?: string) => {
  const t = (type || name || "").toLowerCase();

  if (t.includes("pdf")) return "📕";
  if (t.includes("png") || t.includes("jpg") || t.includes("jpeg")) return "🖼️";
  if (t.includes("doc") || t.includes("word")) return "📘";
  if (t.includes("txt")) return "📄";
  if (t.includes("ppt")) return "📊";
  if (t.includes("xls") || t.includes("sheet")) return "📈";

  return "📎";
};

const normalizeWhitespace = (text: string) => text.replace(/\s+/g, " ").trim();

const ensureSelectionHighlightStyle = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(SELECTION_HIGHLIGHT_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = SELECTION_HIGHLIGHT_STYLE_ID;
  style.textContent = `
    ::highlight(${SELECTION_HIGHLIGHT_NAME}) {
      background: rgba(168, 85, 247, 0.18);
      box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.18);
      text-shadow: 0 0 12px rgba(192, 132, 252, 0.45);
      color: inherit;
    }

    .${SELECTION_FALLBACK_CLASS} {
      box-shadow: 0 0 0 1px rgba(168, 85, 247, 0.18), 0 0 18px rgba(168, 85, 247, 0.14);
      transition: box-shadow 180ms ease;
    }
  `;
  document.head.appendChild(style);
};

const findSelectionRange = (container: HTMLElement, selectionText: string): Range | null => {
  const normalizedQuery = normalizeWhitespace(selectionText);
  if (!normalizedQuery) return null;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const chars: Array<{ node: Text; offset: number }> = [];
  let normalizedText = "";
  let previousWasWhitespace = true;

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const value = node.textContent ?? "";

    for (let i = 0; i < value.length; i += 1) {
      const char = value[i];
      const isWhitespace = /\s/.test(char);

      if (isWhitespace) {
        if (!previousWasWhitespace && normalizedText.length > 0) {
          normalizedText += " ";
          chars.push({ node, offset: i });
          previousWasWhitespace = true;
        }
        continue;
      }

      normalizedText += char;
      chars.push({ node, offset: i });
      previousWasWhitespace = false;
    }
  }

  const startIndex = normalizedText.indexOf(normalizedQuery);
  if (startIndex === -1) return null;

  const endIndex = startIndex + normalizedQuery.length - 1;
  const start = chars[startIndex];
  const end = chars[endIndex];
  if (!start || !end) return null;

  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset + 1);
  return range;
};

const flashSelectionGlow = (targetMessageId: string, selectionText: string) => {
  const target = document.getElementById(targetMessageId) as HTMLElement | null;
  if (!target) return;

  ensureSelectionHighlightStyle();
  target.scrollIntoView({ behavior: "smooth", block: "center" });

  if (clearSelectionGlowTimeout != null) {
    window.clearTimeout(clearSelectionGlowTimeout);
    clearSelectionGlowTimeout = null;
  }

  const highlightRegistry = (CSS as any)?.highlights;
  const HighlightCtor = (window as any).Highlight;
  const range = findSelectionRange(target, selectionText);

  if (highlightRegistry && HighlightCtor && range) {
    highlightRegistry.delete(SELECTION_HIGHLIGHT_NAME);
    highlightRegistry.set(SELECTION_HIGHLIGHT_NAME, new HighlightCtor(range));

    clearSelectionGlowTimeout = window.setTimeout(() => {
      highlightRegistry.delete(SELECTION_HIGHLIGHT_NAME);
      clearSelectionGlowTimeout = null;
    }, 1500);

    return;
  }

  target.classList.remove(SELECTION_FALLBACK_CLASS);
  void target.offsetWidth;
  target.classList.add(SELECTION_FALLBACK_CLASS);

  clearSelectionGlowTimeout = window.setTimeout(() => {
    target.classList.remove(SELECTION_FALLBACK_CLASS);
    clearSelectionGlowTimeout = null;
  }, 1500);
};


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, scrollRef }) => {
  const isModel = message.role === 'model';
  const attachments = message.attachments ?? (message.attachment ? [message.attachment] : []);
  const hasUserText = !isModel && message.content.trim().length > 0;
  const bubbleId = message.id ?? undefined;

  return (
    <div 
      ref={scrollRef}
      className={`flex items-start gap-3 my-6 animate-fade-in-up ${
        isModel ? 'justify-start' : 'justify-end'
      }`}
    >
      {isModel && <BotAvatar />}

      <div
        id={bubbleId}
        className={`max-w-[85%] sm:max-w-xl px-5 py-3.5 rounded-2xl shadow-sm border ${
          isModel
            ? 'model-message bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-100 dark:border-slate-800'
            : 'bg-indigo-600 text-white rounded-br-none border-indigo-500 shadow-indigo-200 dark:shadow-none'
        }`}
      >
        {/* 📎 Attachment UI (inside bubble, above text) */}
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((attachment, index) => (
              <div
                key={`${attachment.name}-${attachment.size}-${index}`}
                className={`
                  inline-flex max-w-full items-center gap-2
                  px-3 py-1.5 rounded-xl text-xs
                  ${
                    isModel
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                      : 'bg-indigo-500/80 text-white'
                  }
                `}
              >
                <span>
                  {fileIconFor(attachment.type, attachment.name)}
                </span>
                <span className="font-medium truncate max-w-[160px]">
                  {attachment.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {!isModel && message.selectionContext?.targetMessageId && (
          <div className="mb-3">
            <a
              href={`#${message.selectionContext.targetMessageId}`}
              className="flex items-start gap-2 rounded-xl bg-white/15 px-3 py-2 text-left text-sm text-white/95 transition hover:bg-white/20"
              onClick={(event) => {
                event.preventDefault();
                flashSelectionGlow(
                  message.selectionContext!.targetMessageId,
                  message.selectionContext!.selectionText
                );
              }}
            >
              <CornerDownRight className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0">
                <div className="font-medium">{message.selectionContext.actionLabel}</div>
                <div className="truncate text-xs text-white/80">
                  "{message.selectionContext.selectionText}"
                </div>
              </div>
            </a>
          </div>
        )}

        {/* 💬 Message content */}
        {isModel ? (
          <MarkdownContent content={message.content} />
        ) : hasUserText ? (
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
            {message.content}
          </p>
        ) : null}
      </div>

      {!isModel && <UserAvatar />}
    </div>
  );
};

