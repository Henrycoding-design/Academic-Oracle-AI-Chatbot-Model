
import React, { useState } from 'react';

interface MarkdownContentProps {
  content: string;
}

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg bg-slate-900 dark:bg-black overflow-hidden border border-slate-800">
      <div className="absolute top-2 left-2 flex gap-2">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all backdrop-blur-sm flex items-center gap-1.5 text-xs font-medium"
          title="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 pt-12 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const InlineCode: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);
  const wordCount = code.trim().split(/\s+/).length;
  const isCopyable = wordCount > 2;

  const handleCopy = () => {
    if (!isCopyable) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <code
      onClick={handleCopy}
      className={`
        px-1.5 py-0.5 rounded font-mono text-sm
        bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400
        ${isCopyable ? 'cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors relative' : ''}
      `}
    >
      {code}
      {isCopyable && copied && (
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg pointer-events-none">
          Copied!
        </span>
      )}
    </code>
  );
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(<ul key={`list-${key}`} className="list-disc ml-6 my-3 space-y-1.5 text-slate-700 dark:text-slate-300">{[...currentList]}</ul>);
      currentList = [];
    }
  };

  const parseInline = (text: string) => {
    // Priority: 1. Inline Code, 2. Bold, 3. Italic
    let parts: (string | React.ReactNode)[] = [text];

    // Inline Code `text`
    parts = parts.flatMap(p => {
      if (typeof p !== 'string') return p;
      const regex = /(`[^`]+`)/g;
      return p.split(regex).map((chunk, i) => {
        if (chunk.startsWith('`') && chunk.endsWith('`')) {
          return <InlineCode key={i} code={chunk.slice(1, -1)} />;
        }
        return chunk;
      });
    });

    // Bold **text**
    parts = parts.flatMap(p => {
      if (typeof p !== 'string') return p;
      const regex = /(\*\*[^*]+\*\*)/g;
      return p.split(regex).map((chunk, i) => {
        if (chunk.startsWith('**') && chunk.endsWith('**')) {
          return <strong key={i} className="font-bold text-slate-900 dark:text-white">{chunk.slice(2, -2)}</strong>;
        }
        return chunk;
      });
    });

    // Italic *text*
    parts = parts.flatMap(p => {
      if (typeof p !== 'string') return p;
      const regex = /(\*[^*]+\*)/g;
      return p.split(regex).map((chunk, i) => {
        if (chunk.startsWith('*') && chunk.endsWith('*')) {
          return <em key={i} className="italic">{chunk.slice(1, -1)}</em>;
        }
        return chunk;
      });
    });

    return parts;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Code Block Check
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        // Ending a code block
        elements.push(<CodeBlock key={`code-${i}`} code={codeBlockLines.join('\n')} />);
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Starting a code block
        flushList(i);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Header Check
    if (trimmedLine.startsWith('### ')) {
      flushList(i);
      elements.push(<h3 key={`h3-${i}`} className="text-lg font-bold mt-6 mb-2 text-slate-900 dark:text-white">{parseInline(trimmedLine.slice(4))}</h3>);
      continue;
    }
    if (trimmedLine.startsWith('## ')) {
      flushList(i);
      elements.push(<h2 key={`h2-${i}`} className="text-xl font-bold mt-7 mb-3 text-slate-900 dark:text-white">{parseInline(trimmedLine.slice(3))}</h2>);
      continue;
    }
    if (trimmedLine.startsWith('# ')) {
      flushList(i);
      elements.push(<h1 key={`h1-${i}`} className="text-2xl font-black mt-8 mb-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">{parseInline(trimmedLine.slice(2))}</h1>);
      continue;
    }

    // List Item Check
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      currentList.push(<li key={`li-${i}`}>{parseInline(trimmedLine.slice(2))}</li>);
      continue;
    }

    // Regular line / Paragraph
    flushList(i);
    if (trimmedLine === '') {
      elements.push(<div key={`spacer-${i}`} className="h-4" />);
    } else {
      elements.push(<p key={`p-${i}`} className="mb-3 last:mb-0 text-slate-700 dark:text-slate-300">{parseInline(line)}</p>);
    }
  }
  
  // Final flush for remaining items
  flushList(lines.length);
  if (inCodeBlock) {
    elements.push(<CodeBlock key="code-final" code={codeBlockLines.join('\n')} />);
  }

  return <div className="markdown-container text-[15px] leading-relaxed selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-900 dark:selection:text-indigo-100">{elements}</div>;
};
