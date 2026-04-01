import React from "react";

export default function ChatFlow() {
  return (
    <div className="space-y-32">
      {/* Header Section */}
      <section className="pt-10">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent pb-4">
          The Learning Lifecycle
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl text-balance font-medium">
          Universal Academic Oracle is more than a chat surface. The public
          experience is designed as a <span className="text-white">guided learning loop</span>
          that supports reasoning without overexposing internal mechanics.
        </p>
      </section>

      {/* The Cognitive Loop Section */}
      <section className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-blue-500/30 transition-colors duration-500">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
        
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform duration-700">
          <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">Guided Learning Flow</h2>
        
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-4 relative">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase tracking-widest font-black">Logic</span>
              Guided Interaction
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Each interaction is meant to move the learner forward with hints,
              pacing, and follow-up that support understanding rather than answer
              dumping.
            </p>
          </div>

          <div className="space-y-4 relative">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase tracking-widest font-black">State</span>
              Learning Continuity
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              The public product may preserve continuity across interactions to
              keep learning coherent, but internal adaptation logic is not fully
              described here.
            </p>
          </div>
        </div>
      </section>

      {/* NEW: Contextual Clarification (Explain on Select) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          <div className="relative bg-[#0a0f1a] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 p-5 rounded-xl border border-white/5 relative">
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "Quantum entanglement is a physical phenomenon..."
                </p>
                {/* Floating Tooltip Mockup */}
                <div className="absolute -bottom-4 right-10 flex gap-2">
                  <span className="px-3 py-1.5 bg-blue-600 text-xs font-bold text-white rounded-lg shadow-[0_10px_20px_rgba(37,99,235,0.4)] flex items-center gap-2 animate-bounce">
                    <span className="text-[10px]">✨</span> Explain this
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Feature: Selection Trigger</p>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                    <div className="w-1 h-1 rounded-full bg-blue-500/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 space-y-6">
          <h3 className="text-3xl font-bold text-white tracking-tight">Frictionless <br/><span className="text-blue-400">Deep-Dives</span></h3>
          <p className="text-slate-400 leading-relaxed">
            Learners should be able to ask for clarification without losing the
            thread of study. The emphasis is on reducing friction while preserving
            focus and rigor.
          </p>
        </div>
      </section>

      {/* NEW: Augmented Search & Guardrails */}
      <section className="p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.735 11.735 0 00-1.59 7.477c.282 1.499 1.05 2.872 2.103 3.93a11.954 11.954 0 0015.536 0c1.053-1.058 1.822-2.43 2.103-3.93a11.732 11.732 0 00-1.59-7.477z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Safety & Grounding</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-3">
            <h5 className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Real-time Web Search</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              Public-facing responses may be supported by grounding or reference
              tools where appropriate, without exposing detailed internal service
              design.
            </p>
          </div>
          <div className="space-y-3 border-l border-white/5 pl-8">
            <h5 className="text-rose-400 text-sm font-bold uppercase tracking-widest">Jailbreak Prevention</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              Safety-related protections exist to preserve an appropriate learning
              environment, but implementation specifics are intentionally limited
              in public documentation.
            </p>
          </div>
        </div>
      </section>

      {/* The Validation Loop (Quiz Platform) */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">The Validation Loop</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Practice checkpoints help learners test understanding and revisit
              weak areas. Public descriptions focus on the learner outcome rather
              than underlying implementation details.
            </p>
          </div>
          <div className="flex gap-1.5 pb-2">
            <div className="h-1.5 w-12 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <div className="h-1.5 w-6 rounded-full bg-white/10" />
            <div className="h-1.5 w-6 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: "01", label: "Targeted Practice", color: "blue", text: "Checks can be tuned to the learner's current level and goals." },
            { id: "02", label: "Follow-Up Support", color: "purple", text: "Missed concepts can lead back into guided explanation and review." },
            { id: "03", label: "Learning Continuity", color: "cyan", text: "Progress can inform later study steps without exposing internal logic publicly." }
          ].map((item) => (
            <div key={item.id} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-blue-500/20 transition-all duration-300 group">
              <div className={`text-xs font-black mb-6 text-${item.color}-400 flex items-center gap-2`}>
                <span className={`w-6 h-6 rounded-full border border-${item.color}-400/30 flex items-center justify-center`}>{item.id}</span>
                PHASE
              </div>
              <h5 className="text-white font-bold text-lg mb-3 group-hover:text-white transition-colors">{item.label}</h5>
              <p className="text-xs text-slate-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Rendering Section */}
      <section className="space-y-8 py-10">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Visual Standards
        </div>
        <h3 className="text-3xl font-bold text-white italic tracking-tight">Premium Academic Rendering</h3>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Communication is clearer when the interface is readable and calm. The
          product supports rich academic content without making the system details
          the center of attention:
        </p>
        <div className="flex flex-wrap gap-3">
          {["LaTeX & KaTeX", "Syntactic Code Blocks", "Interactive Tables", "Markdown Prose", "Adaptive Diagrams"].map((tag) => (
            <span key={tag} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-blue-300 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Export & Master Check */}
      <section className="grid md:grid-cols-[1fr_350px] gap-12 items-center bg-gradient-to-br from-blue-600/15 via-blue-600/5 to-transparent p-12 rounded-[3rem] border border-blue-500/20 relative overflow-hidden group">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">Mastery & Portability</h2>
            <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 border border-blue-500/20 font-bold uppercase">Learner Focused</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-lg">
            Learners may have ways to carry forward their study results and review
            materials. Public docs describe the outcome without unpacking all of
            the underlying generation flow.
          </p>
          <ul className="grid grid-cols-2 gap-4 text-sm text-white/70">
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Revision support</li>
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Learning summaries</li>
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Focused review areas</li>
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Guided follow-up</li>
          </ul>
        </div>
        
        <div className="relative">
          <div className="p-8 bg-[#050810] rounded-3xl border border-white/10 text-center shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <p className="text-[10px] text-blue-400 uppercase tracking-[0.2em] mb-2 font-black">Study Summary</p>
            <div className="text-xs font-mono text-white/60 truncate bg-white/5 p-2 rounded-lg">session-summary.docx</div>
            <button className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-blue-900/40 uppercase tracking-widest">
              Download
            </button>
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="text-center py-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] -z-10" />
        <h4 className="text-3xl font-bold text-white mb-4 tracking-tight">The future of pedagogy is flow.</h4>
        <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">Ready to explore a guided learning experience with clearer public boundaries?</p>
        <a 
          href="/" 
          className="inline-flex items-center px-12 py-4 bg-white text-black font-black rounded-2xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          Launch Oracle Session
        </a>
      </section>
    </div>
  );
}
