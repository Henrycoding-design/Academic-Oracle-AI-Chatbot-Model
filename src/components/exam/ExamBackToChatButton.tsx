import React from 'react';
import { MessageSquare } from 'lucide-react';

type ExamBackToChatButtonProps = {
  onClick: () => void;
  label: string;
};

export const ExamBackToChatButton: React.FC<ExamBackToChatButtonProps> = ({
  onClick,
  label,
}) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-4 z-30 flex items-center gap-2 px-3 py-1.5 sm:left-6 sm:top-6 md:hidden
                    rounded-full
                    bg-white/75 dark:bg-slate-900/70
                    backdrop-blur-md
                    text-sm text-slate-600 dark:text-slate-300
                   hover:text-indigo-600 dark:hover:text-indigo-400
                    transition-all shadow-sm border border-black/5 dark:border-white/10"
  >
    ← <MessageSquare className="w-4 h-4" />
    {label}
  </button>
);

export default ExamBackToChatButton;
