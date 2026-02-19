import React, { useEffect, useRef, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import hljs from "../lib/highlight";

interface MarkdownContentProps {
  content: string;
  ismcq?: boolean; // new prop to indicate if it's for MCQ options
}

// ... (Keep CopyIcon, CheckIcon, CodeBlock, InlineCode as they are) ...

let codeLanguage: string | undefined;

const LANG_ALIASES: Record<string, string> = {
  // JavaScript / TS
  js: "javascript",
  jsx: "javascript",
  javascript: "javascript",

  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",

  // Python
  py: "python",
  python: "python",

  // Shell
  sh: "bash",
  shell: "bash",
  bash: "bash",

  // JSON / config
  json: "json",

  // C-family
  c: "c",
  h: "c",

  cpp: "cpp",
  cxx: "cpp",
  "c++": "cpp",

  cs: "csharp",
  csharp: "csharp",

  // Java / JVM
  java: "java",
  kotlin: "kotlin",
  kt: "kotlin",

  // Web
  html: "xml",
  xml: "xml",
  css: "css",
  scss: "scss",

  // Others
  yaml: "yaml",
  yml: "yaml",
  toml: "toml",
  md: "markdown",
};

const normalizeLang = (lang?: string) =>
  lang ? LANG_ALIASES[lang.toLowerCase()] ?? lang.toLowerCase() : undefined;

const CodeBlock: React.FC<{ code: string; language?: string }> = ({
  code,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!codeRef.current) return;
      const el = codeRef.current;
      // if (el.dataset.highlighted) return;
      // el.dataset.highlighted = "true";

      const normalized = normalizeLang(language);

      if (normalized && hljs.getLanguage(normalized)) {
        el.classList.add(`language-${normalized}`);
        hljs.highlightElement(el);
      } else {
        const result = hljs.highlightAuto(code);
        el.innerHTML = result.value;
        el.classList.add("hljs");
        setDetectedLang(result.language ?? null);
      }
    });
  }, [code, language]);


  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-6 rounded-xl bg-slate-50 dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-200/50 dark:bg-white/5 border-b border-slate-200 dark:border-slate-800">
        <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
          {normalizeLang(language) ?? detectedLang ?? "text"}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-slate-300/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 transition-colors flex items-center gap-1.5 text-xs font-medium"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      <pre className="p-4 overflow-x-auto text-sm font-mono leading-relaxed">
        <code 
          ref={codeRef} 
          /* Using !text-slate-900 and dark:!text-slate-200 ensures 
             the base code text is readable even if hljs fails 
          */
          className={`language-${normalizeLang(language) ?? detectedLang ?? ""} !bg-transparent !p-0 !text-slate-900 dark:!text-slate-200`}
        >
          {code}
        </code>
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

const isTableLine = (line: string) => {
  return line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|');
};

const TableBlock: React.FC<{ lines: string[], parseInline: (text: string) => React.ReactNode[] }> = ({ lines , parseInline }) => {
  const rows = lines.map(line =>
    line
      .trim()
      .slice(1, -1)
      .split('|')
      .map(cell => cell.trim()) // arrow function syntax, equivalent to .map(function(cell) { return cell.trim(); }
  );

  const header = rows[0];
  const body = rows.slice(2); // skip separator row

  return (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {header.map((cell, i) => (
              <th
                key={i}
                className="px-4 py-2 text-left text-sm font-semibold text-slate-900 dark:text-white border-b"
              >
                {parseInline(cell)} {/* using parseInline for header cells as well */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rIdx) => ( // map syntax: .map((element, index, array) => ...)
            <tr
              key={rIdx}
              className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800"
            >
              {row.map((cell, cIdx) => (
                <td
                  key={cIdx}
                  className="px-4 py-2 text-sm text-slate-700 dark:text-slate-300 border-b"
                >
                  {parseInline(cell)} {/* using parseInline for body cells */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, ismcq = false }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inMathBlock = false;
  let mathBlockLines: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];


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
    // UPDATED REGEX: 
    // Removed nested capturing groups (...) around $$ and $ patterns to prevent double-rendering
    const regex = /(`[^`]+`|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|[\s\S]*?\$\$[\s\S]+?\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|\*[^*]+\*)/g;

    return text.split(regex).map((part, index) => {
      if (!part) return null;

      // 1. Block Math: $$...$$ OR \[...\]
      if (part.startsWith('$$') && part.endsWith('$$')) {
        return <BlockMath key={index} math={part.slice(2, -2).trim()} />;
      }
      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        return <BlockMath key={index} math={part.slice(2, -2).trim()} />;
      }

      // 2. Inline Math: $...$ OR \(...\)
      if (part.startsWith('$') && part.endsWith('$')) {
        return <InlineMath key={index} math={part.slice(1, -1).trim()} />;
      }
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        return <InlineMath key={index} math={part.slice(2, -2).trim()} />;
      }

      // 3. Inline Code
      if (part.startsWith('`')) {
        return <InlineCode key={index} code={part.slice(1, -1)} />;
      }

      // 4. Bold
      if (part.startsWith('**')) {
        return (
          <strong key={index} className="font-bold text-slate-900 dark:text-white">
            {parseInline(part.slice(2, -2))}
          </strong>
        );
      }

      // 5. Italic
      if (part.startsWith('*')) {
        return <em key={index} className="italic">{parseInline(part.slice(1, -1))}</em>;
      }

      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // 1. Code Blocks
    if (trimmedLine.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${i}`}
            code={codeBlockLines.join('\n')}
            language={codeLanguage}
          />
        );
        codeBlockLines = [];
        codeLanguage = undefined;
        inCodeBlock = false;
      } else {
        flushList(i);
        inCodeBlock = true;
        codeLanguage = trimmedLine.slice(3).trim() || undefined;
      }
      continue;
    }


    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // 2. Block Math Logic (Handle standalone $$ or \[ lines)
    // Now supports both $$ and \[ opening tags
    if (trimmedLine === '$$' || trimmedLine === '\\[') {
      if (inMathBlock) {
        // If we are closing, we render (assuming matching close tag)
        elements.push(<div key={`math-${i}`} className="my-4 overflow-x-auto"><BlockMath math={mathBlockLines.join('\n')} /></div>);
        mathBlockLines = [];
        inMathBlock = false;
      } else {
        flushList(i);
        inMathBlock = true;
      }
      continue;
    }
    
    // Check for closing tags specifically if they are on their own line
    if (inMathBlock && (trimmedLine === '$$' || trimmedLine === '\\]')) {
       elements.push(<div key={`math-${i}`} className="my-4 overflow-x-auto"><BlockMath math={mathBlockLines.join('\n')} /></div>);
       mathBlockLines = [];
       inMathBlock = false;
       continue;
    }

    if (inMathBlock) {
      mathBlockLines.push(line);
      continue;
    }

    // TABLE START / CONTINUE
    if (isTableLine(line)) {
      flushList(i); // Flush any ongoing list before starting table
      inTable = true;
      tableLines.push(line);
      continue;
    }

    // TABLE END
    if (inTable && !isTableLine(line)) {
      elements.push(
        <TableBlock key={`table-${i}`} lines={[...tableLines]} parseInline={parseInline} />
      );
      tableLines = [];
      inTable = false;
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
  return <div className={ismcq ? "markdown-container" : "markdown-container py-2"}>{elements}</div>;
};