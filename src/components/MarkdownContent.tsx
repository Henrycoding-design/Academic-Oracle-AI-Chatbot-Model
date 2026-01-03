import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';

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
  // Unescape backslashes that might have been doubled during JSON transport

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg bg-slate-900 dark:bg-black overflow-hidden border border-slate-800">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all backdrop-blur-sm flex items-center gap-1.5 text-xs font-medium"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 pt-10 overflow-x-auto text-sm text-slate-300 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const InlineCode: React.FC<{ code: string }> = ({ code }) => {
  return (
    <code className="px-1.5 py-0.5 rounded font-mono text-sm bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
      {code}
    </code>
  );
};

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Pre-process the content: Normalize double backslashes to single ones 
  // ONLY if they are not part of a specific JSON-escaped sequence
  const processedContent = content;
  
  const lines = processedContent.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inMathBlock = false;
  let mathBlockLines: string[] = [];

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc ml-6 my-3 space-y-1.5 text-slate-700 dark:text-slate-300">
          {[...currentList]}
        </ul>
      );
      currentList = [];
    }
  };

  const parseInline = (text: string): React.ReactNode[] => {
    // Robust Regex to catch Inline Math ($...$), Bold (**...**), and Inline Code (`...`)
    const regex = /(`[^`]+`|\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|\*[^*]+\*)/g;

    return text.split(regex).map((part, index) => {
      if (!part) return null;

      // Block Math inside paragraph (sometimes happens)
      if (part.startsWith('$$')) {
        return <BlockMath key={index} math={part.slice(2, -2).trim()} />;
      }

      // Inline Math $...$
      if (part.startsWith('$')) {
        return <InlineMath key={index} math={part.slice(1, -1).trim()} />;
      }

      // Inline Code `...`
      if (part.startsWith('`')) {
        return <InlineCode key={index} code={part.slice(1, -1)} />;
      }

      // Bold **...**
      if (part.startsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900 dark:text-white">
            {parseInline(part.slice(2, -2))}
          </strong>
        );
      }

      // Italic *...*
      if (part.startsWith('*')) {
        return <em key={index} className="italic">{parseInline(part.slice(1, -1))}</em>;
      }

      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock key={`code-${i}`} code={codeBlockLines.join('\n')} />
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        flushList(i);
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue; // 🔒 NOTHING touches code
    }

    // 2. Block Math Logic
    if (trimmedLine === '$$') {
      if (inMathBlock) {
        elements.push(<div key={`math-${i}`} className="my-4 overflow-x-auto"><BlockMath math={mathBlockLines.join('\n')} /></div>);
        mathBlockLines = [];
        inMathBlock = false;
      } else {
        flushList(i);
        inMathBlock = true;
      }
      continue;
    }
    if (inMathBlock) {
      mathBlockLines.push(line);
      continue;
    }

    // 3. Headers
    if (trimmedLine.startsWith('#')) {
      flushList(i);
      const level = trimmedLine.match(/^#+/)?.[0].length || 1;
      const text = trimmedLine.replace(/^#+\s*/, '');
      const Tag = level === 1 ? 'h1' : level === 2 ? 'h2' : 'h3' as any;
      const classes = level === 1 ? "text-2xl font-black mt-8 mb-4 border-b pb-2" : "text-xl font-bold mt-6 mb-3";
      elements.push(<Tag key={`h-${i}`} className={`${classes} text-slate-900 dark:text-white`}>{parseInline(text)}</Tag>);
      continue;
    }

    // 4. Lists
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      currentList.push(<li key={`li-${i}`}>{parseInline(trimmedLine.slice(2))}</li>);
      continue;
    }

    // 5. Paragraphs
    if (trimmedLine === '') {
      flushList(i);
      elements.push(<div key={`spacer-${i}`} className="h-2" />);
    } else {
      flushList(i);
      elements.push(<p key={`p-${i}`} className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">{parseInline(line)}</p>);
    }
  }
  
  flushList(lines.length);
  return <div className="markdown-container py-2">{elements}</div>;
};