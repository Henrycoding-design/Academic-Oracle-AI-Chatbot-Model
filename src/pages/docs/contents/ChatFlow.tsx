import React from "react";

export default function ChatFlow() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent pb-2">
          The Learning Lifecycle
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl text-balance">
          Academic Oracle isn't just a chat interface; it is a seamless cognitive loop. We combine Socratic inquiry with high-performance engineering to keep students in the "Zone of Proximal Development."
        </p>
      </section>

      {/* The Cognitive Loop Section */}
      <section className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-28 h-28" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-blue-300 mb-6">Uninterrupted Intelligence</h2>
        
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <span className="p-1 rounded bg-blue-500/20 text-blue-400 text-xs">Logic</span>
              Socratic Engine & Model Routing
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every query triggers a selective model evaluation. By utilizing our <strong>Flask-series stack</strong> with automatic fallback routing, we ensure that session latency never interrupts the student's train of thought.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-white font-medium flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400 text-xs">State</span>
              Dynamic User Profiling
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              The Oracle maintains a <strong>hidden, evolving user profile</strong>. This profile tracks conceptual gaps and sentiment, adjusting the AI's "strictness" and "hints" in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* NEW: The Validation Loop (Quiz Platform) */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold text-white mb-2">The Validation Loop</h3>
            <p className="text-slate-400 text-sm">
              Once the Oracle detects conceptual mastery via chat, it triggers a <strong>React-native modal</strong> prompting a short quiz. This isn't a separate app—it's a synchronized state that pulls directly from your session's memory.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-8 rounded-full bg-blue-500" />
            <div className="h-2 w-8 rounded-full bg-blue-500/30" />
            <div className="h-2 w-8 rounded-full bg-blue-500/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">1</div>
            <h5 className="text-white font-semibold text-sm">Automated Config</h5>
            <p className="text-xs text-slate-500">Auto-selects level and MCQ/Open-answer ratios based on Oracle session memory.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">2</div>
            <h5 className="text-white font-semibold text-sm">Deep-Link Remediation</h5>
            <p className="text-xs text-slate-500">Wrong answers trigger AI explanations with buttons to "Re-ask Oracle" with full context auto-injected.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">3</div>
            <h5 className="text-white font-semibold text-sm">Memory Sync</h5>
            <p className="text-xs text-slate-500">Quiz performance is cached in <code>sessionStorage</code> and can be exported into your final .docx summary.</p>
          </div>
        </div>
      </section>

      {/* Visual Rendering Section */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-white italic">Premium Academic Rendering</h3>
        <p className="text-slate-400 text-sm">
          Communication is clearer when it's beautiful. Our UI supports high-fidelity rendering for complex subjects:
        </p>
        <div className="flex flex-wrap gap-3">
          {["LaTeX & KaTeX", "Syntactic Code Blocks", "Interactive Tables", "Markdown Prose"].map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] font-mono text-blue-400">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Export & Master Check */}
      <section className="grid md:grid-cols-[1fr_300px] gap-8 items-center bg-gradient-to-br from-blue-600/10 to-transparent p-8 rounded-2xl border border-blue-500/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">Mastery & Portability</h2>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-400 border border-white/10">v2.0</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            At the end of a session, the "Summary" button generates a structured <strong>.docx revision guide</strong>. By opting to "Add Quiz to Memory," your results and focus fields are automatically woven into the document.
          </p>
          <ul className="grid grid-cols-2 gap-2 text-xs text-white/60">
            <li className="flex items-center gap-2">✓ Real-world Case Studies</li>
            <li className="flex items-center gap-2">✓ AI-Graded Open Answers</li>
            <li className="flex items-center gap-2">✓ Focused Revision Fields</li>
            <li className="flex items-center gap-2">✓ Mastery Scorecards</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-3">
          <div className="p-4 bg-black/40 rounded-xl border border-white/5 text-center group">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2 font-bold group-hover:text-blue-400 transition-colors">Session Output</p>
            <div className="text-xs font-mono text-blue-400 truncate">Academic_Oracle_Summary.docx</div>
            <button className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold rounded transition-colors shadow-lg shadow-blue-500/20">
              Download Summary
            </button>
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="text-center py-10">
        <h4 className="text-white text-lg font-medium mb-2 text-balance">The ultimate learning flow, for all ages, anywhere.</h4>
        <p className="text-slate-500 text-sm mb-6">Ready to experience the future of pedagogy?</p>
        <a 
          href="/" 
          className="inline-flex items-center px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
        >
          Launch Oracle Session
        </a>
      </section>
    </div>
  );
}