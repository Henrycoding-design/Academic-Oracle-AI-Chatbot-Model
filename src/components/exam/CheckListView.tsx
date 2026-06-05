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

import React from 'react';
import { ChevronLeft, ClipboardList, LoaderCircle } from 'lucide-react';
import { LANGUAGE_DATA, type AppLanguage } from '../../lang/Language';
import { MarkdownContent } from '../MarkdownContent';
import { ExamBackToChatButton } from './ExamBackToChatButton';

interface CheckListViewProps {
  language: AppLanguage;
  content?: string;
  isLoading: boolean;
  onBack: () => void;
  onBackToChat: () => void;
  chatLabel: string;
}

export const CheckListView: React.FC<CheckListViewProps> = ({
  language,
  content,
  isLoading,
  onBack,
  onBackToChat,
  chatLabel
}) => {
  const lang = LANGUAGE_DATA[language].ui.exam;
  const setupLang = LANGUAGE_DATA[language].ui.examSetup;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={lang.backToResults}
          >
            <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <ClipboardList className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              Blind Checklist
            </h1>
          </div>
        </div>

        <ExamBackToChatButton onClick={onBackToChat} label={chatLabel} />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <LoaderCircle className="h-10 w-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <p className="text-slate-600 dark:text-slate-400 animate-pulse font-medium">
                Generating your personalized test-day checklist...
              </p>
            </div>
          ) : content ? (
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownContent content={content} />
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                 <p className="text-xs text-slate-500 dark:text-slate-500 italic">
                    Best of luck on your exam! You've got this.
                 </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
               <p className="text-slate-500 dark:text-slate-400">
                  No checklist content available.
               </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
