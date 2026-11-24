import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, FileText, FileType, Share } from "lucide-react";
import { exportMessages, type ExportType } from "../services/exportMessages";
import { normalizeSummary } from "../services/normalizeSummary";
import type { Message } from "../types";
import { AppLanguage, LANGUAGE_DATA } from "../lang/Language";

interface Props {
  messages: Message[];
  oracleMemory: string | null;
  lang: AppLanguage;
  isLoading: boolean;
}

type Phase = "idle" | "working" | "done" | "error";

function safeFileNamePart(value: string, fallback: string): string {
  const safe = value
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
    .replace(/[. ]+$/g, "")
    .slice(0, 80);
  return safe || fallback;
}

export function ShareExportButton({ messages, oracleMemory, lang, isLoading }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [picked, setPicked] = useState<ExportType | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setPhase("idle");
    setPicked(null);
  }, []);

  const toggle = () => {
    if (open) return close();
    const r = btnRef.current?.getBoundingClientRect();
    if (r) {
      // anchor the menu's right edge to the button's right edge, just below it
      setPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
      setOpen(true);
    }
  };

  // close on outside click, Escape, resize, or scroll
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open, close]);

  useEffect(() => {
    if (isLoading && open) close();
  }, [isLoading, open, close]);

  const handlePick = async (type: ExportType) => {
    setPicked(type);
    setPhase("working");
    const normalizedMemory = normalizeSummary(oracleMemory);
    const fallbackName = LANGUAGE_DATA[lang].ui.dashboard.defaultStudentName;
    const studentName = safeFileNamePart(
      oracleMemory ? normalizedMemory.profile?.name ?? "" : "",
      fallbackName
    );
    const fileName = `Academic_Oracle_Learning_Conversation_${studentName}.docx`;
    const res = await exportMessages(messages, type, fileName, lang);
    if (res.status === "ok") {
      setPhase("done"); // caller-side UI update: show confirmation
      setTimeout(close, 1000);
    } else {
      setPhase("error");
    }
  };

  const item =
    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left " +
    "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 " +
    "transition-colors disabled:opacity-60";

  return (
    <>
      <button
        ref={btnRef}
        onClick={toggle}
        disabled={messages.length <= 1 || isLoading}
        aria-label={LANGUAGE_DATA[lang].ui.dashboard.shareExport}
        aria-haspopup="menu"
        aria-expanded={open}
        className="p-2 mr-2 rounded-lg bg-white/60 dark:bg-slate-950 
                text-blue-700
                hover:bg-white/80 dark:hover:bg-slate-700 dark:text-blue-400
                transition-colors 
                flex items-center justify-center disabled:opacity-50"
      >
        <Share className="w-5 h-5" />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ position: "fixed", top: pos.top, right: pos.right }}
            className="z-50 w-56 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700
                       bg-white dark:bg-slate-900 shadow-lg"
          >
            <p className="px-3 py-1.5 text-xs font-medium text-slate-500">{LANGUAGE_DATA[lang].ui.dashboard.exportConversationAs}</p>

            <button
              role="menuitem"
              className={item}
              disabled={phase === "working" || isLoading}
              onClick={() => handlePick("md")}
            >
              {phase === "done" && picked === "md" ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {phase === "done" && picked === "md"
                ? LANGUAGE_DATA[lang].ui.dashboard.copiedToClipboard
                : LANGUAGE_DATA[lang].ui.dashboard.markdownCopy}
            </button>

            <button
              role="menuitem"
              className={item}
              disabled={phase === "working" || isLoading}
              onClick={() => handlePick("docx")}
            >
              {phase === "done" && picked === "docx" ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <FileType className="w-4 h-4" />
              )}
              {phase === "done" && picked === "docx"
                ? LANGUAGE_DATA[lang].ui.dashboard.downloaded
                : LANGUAGE_DATA[lang].ui.dashboard.wordDocx}
            </button>

            {phase === "error" && (
              <p className="px-3 py-1.5 text-xs text-red-600">{LANGUAGE_DATA[lang].ui.dashboard.exportFailed}</p>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
