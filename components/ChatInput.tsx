
import React, { useLayoutEffect, useRef, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
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

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
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

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!isComposing) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  return (
    <div className="w-full px-4 pb-6 pt-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3 p-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300">
          <textarea
            ref={taRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={onKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Type your academic inquiry here..."
            disabled={isLoading}
            rows={1}
            className="
              flex-grow px-4 py-3 bg-transparent
              text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none resize-none
              min-h-[48px]
            "
            style={{ lineHeight: "1.5" }}
          />
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
    </div>
  );
};
