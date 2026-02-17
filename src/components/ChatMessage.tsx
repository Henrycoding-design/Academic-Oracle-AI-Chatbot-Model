
import React from 'react';
import type { Message } from '../types';
import { MarkdownContent } from './MarkdownContent';

interface ChatMessageProps {
  message: Message;
  scrollRef?: React.Ref<HTMLDivElement>;
}

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


export const ChatMessage: React.FC<ChatMessageProps> = ({ message, scrollRef }) => {
  const isModel = message.role === 'model';

  return (
    <div 
      ref={scrollRef}
      className={`flex items-start gap-3 my-6 animate-fade-in-up ${
        isModel ? 'justify-start' : 'justify-end'
      }`}
    >
      {isModel && <BotAvatar />}

      <div
        className={`max-w-[85%] sm:max-w-xl px-5 py-3.5 rounded-2xl shadow-sm border ${
          isModel
            ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border-slate-100 dark:border-slate-800'
            : 'bg-indigo-600 text-white rounded-br-none border-indigo-500 shadow-indigo-200 dark:shadow-none'
        }`}
      >
        {/* 📎 Attachment UI (inside bubble, above text) */}
        {message.attachment && (
          <div
            className={`
              mb-2 inline-flex items-center gap-2
              px-3 py-1.5 rounded-xl text-xs
              ${
                isModel
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  : 'bg-indigo-500/80 text-white'
              }
            `}
          >
            <span>
              {fileIconFor(message.attachment.type, message.attachment.name)}
            </span>
            <span className="font-medium truncate max-w-[160px]">
              {message.attachment.name}
            </span>
          </div>
        )}

        {/* 💬 Message content */}
        {isModel ? (
          <MarkdownContent content={message.content} />
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed text-[15px]">
            {message.content}
          </p>
        )}
      </div>

      {!isModel && <UserAvatar />}
    </div>
  );
};

