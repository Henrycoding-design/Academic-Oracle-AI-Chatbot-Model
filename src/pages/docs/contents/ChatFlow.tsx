import React from "react";

export default function ChatFlow() {
  return (
    <div className="space-y-20 sm:space-y-24 lg:space-y-32">
      {/* Header Section */}
      <section className="pt-10">
        <h1 className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text pb-4 text-4xl font-black tracking-tighter text-transparent sm:text-5xl">
          The Learning Lifecycle
        </h1>
        <p className="max-w-3xl text-balance text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
          Academic Oracle follows a scientifically grounded flow: <span className="text-white italic">Ask → Think → Hint → Attempt → Mastery</span>. We optimize for retention and intuition rather than passive consumption.
        </p>
      </section>

      {/* The Cognitive Loop Section */}
      <section className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-colors duration-500 hover:border-blue-500/30 sm:p-10">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
        
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:rotate-12 transition-transform duration-700">
          <svg className="w-20 h-20 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight">Structured Reasoning</h2>
        
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="space-y-4 relative">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] uppercase tracking-widest font-black">Logic</span>
              Hint-Based Flow
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Instead of dumping answers, we utilize <span className="text-white">progressive hinting</span>. Every interaction is shaped by Oracle Memory JSON returns, ensuring the AI thinks about the pedagogical path before it speaks.
            </p>
          </div>

          <div className="space-y-4 relative">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] uppercase tracking-widest font-black">Memory</span>
              Feynman Reinforcement
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              When a concept doesn't click, the system triggers <span className="text-white">first-principles rebuilding</span>. By mapping conceptual gaps, the Oracle adapts its phrasing to ensure durable mental models.
            </p>
          </div>
        </div>
      </section>

      {/* Contextual Clarification (Explain on Select) */}
      <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="order-2 md:order-1 relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
          <div className="relative bg-[#0a0f1a] border border-white/10 p-8 rounded-3xl shadow-2xl">
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 p-5 rounded-xl border border-white/5 relative">
                <p className="text-sm text-slate-300 italic leading-relaxed">
                  "Quantum entanglement is a physical phenomenon..."
                </p>
                <div className="absolute -bottom-4 right-10 flex gap-2">
                  <span className="px-3 py-1.5 bg-blue-600 text-xs font-bold text-white rounded-lg shadow-[0_10px_20px_rgba(37,99,235,0.4)] flex items-center gap-2 animate-bounce">
                    <span className="text-[10px]">✨</span> Follow up
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">v2.4.0: Selection Context</p>
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
          <h3 className="text-3xl font-bold text-white tracking-tight">Active <br/><span className="text-blue-400">Curiosity Triggers</span></h3>
          <p className="text-slate-400 leading-relaxed">
            Our <strong>"Follow-up Suggestion System"</strong> reduces the friction between curiosity and action. Highlight any text to trigger a context-aware follow-up mode that allows for deeper inquiry without auto-sending, keeping you in control.
          </p>
        </div>
      </section>

      {/* Augmented Search & Guardrails */}
      <section className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-6 sm:p-10">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.735 11.735 0 00-1.59 7.477c.282 1.499 1.05 2.872 2.103 3.93a11.954 11.954 0 0015.536 0c1.053-1.058 1.822-2.43 2.103-3.93a11.732 11.732 0 00-1.59-7.477z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Hallucination Suppression</h3>
        </div>
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="space-y-3">
            <h5 className="text-emerald-400 text-sm font-bold uppercase tracking-widest">Hybrid Reasoning</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              When search quotas are met or knowledge gaps are identified, the system switches to a controlled response protocol. No outdated answers are framed as current, ensuring high-fidelity academic integrity.
            </p>
          </div>
          <div className="space-y-3 border-t border-white/5 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <h5 className="text-rose-400 text-sm font-bold uppercase tracking-widest">Jailbreak Detection</h5>
            <p className="text-sm text-slate-400 leading-relaxed">
              Prompts are sanitized via a backend security layer before execution. This prevents prompt-injection misuse while strictly confining the AI to its role as a reasoning partner.
            </p>
          </div>
        </div>
      </section>

      {/* The Validation Loop (Quiz Platform) */}
      <section className="space-y-12">
        <div className="flex flex-col gap-6 border-b border-white/5 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Mastery Checks</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              Once pattern extraction is confirmed, the Oracle triggers an <strong>adaptive checkpoint</strong>. v2.4.8 introduces <strong>Topic Selection</strong>, allowing you to choose specific focus areas for quizzes. Redirection from mastery checkpoints now automatically pre-selects the relevant topic with per-topic configuration caching for a seamless study flow.
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
            { id: "01", label: "Pattern Discovery", color: "blue", text: "We prioritize identifying underlying logic over rote explanation of isolated facts." },
            { id: "02", label: "Adaptive Phrasing", color: "purple", text: "Incorrect attempts trigger a shift in pedagogical approach rather than repetitive loops." },
            { id: "03", label: "Memory Integration", color: "cyan", text: "Performance surfaces in your Dashboard circular efficiency indicator for progress reflection." }
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

        {/* The Exam Lifecycle (Exam Practice) */}
        <section className="space-y-12">
        <div className="flex flex-col gap-6 border-b border-white/5 pb-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight italic">Summative Performance</h3>
            <p className="text-slate-400 leading-relaxed text-sm md:text-base">
              The <strong>Exam Practice Module</strong> (v2.4.5) represents the final stage of the learning journey—transitioning from guided discovery to high-stakes simulation.
            </p>
          </div>
          <div className="flex gap-1.5 pb-2">
            <div className="h-1.5 w-6 rounded-full bg-white/10" />
            <div className="h-1.5 w-6 rounded-full bg-white/10" />
            <div className="h-1.5 w-12 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
            <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Simulation Phase</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real exam conditions: Timed sessions, no live feedback, and lightweight anti-cheat triggers. The goal is to measure retention and reasoning under pressure.
            </p>
          </div>
          <div className="p-8 rounded-[2rem] bg-purple-500/5 border border-purple-500/10 space-y-4">
            <h4 className="text-purple-400 font-bold uppercase tracking-widest text-xs">Evaluation Phase</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              AI-driven grading using provided mark schemes. We calculate scores, estimate grade boundaries, and map performance back to your learning profile.
            </p>
          </div>
        </div>
        </section>

        {/* Visual Rendering Section */}
      <section className="space-y-8 py-10">
        <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
            Visual Standards
        </div>
        <h3 className="text-3xl font-bold text-white italic tracking-tight">Cognitive Focus Rendering</h3>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          The interface is designed for minimal disruption, using high-fidelity rendering to turn complex data into visual insight:
        </p>
        <div className="flex flex-wrap gap-3">
          {["KaTeX Math", "Dynamic Tables", "Syntax Highlighting", "Oracle Memory Logs", "Dashboard Visuals"].map((tag) => (
            <span key={tag} className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-xs font-mono text-blue-300 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all cursor-default">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Export & Master Check */}
      <section className="group relative grid items-center gap-10 overflow-hidden rounded-[3rem] border border-blue-500/20 bg-gradient-to-br from-blue-600/15 via-blue-600/5 to-transparent p-6 sm:p-8 lg:grid-cols-[1fr_minmax(0,350px)] lg:gap-12 lg:p-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">Session Summary</h2>
            <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300 border border-blue-500/20 font-bold uppercase">v2.3.5+</span>
          </div>
          <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
            Directly from your <span className="text-white font-semibold">Learning Dashboard</span>, download a structured summary. v2.4.8 adds <strong>granular memory control</strong>—delete specific topics directly from the UI—and optimized summary views with "See More" expansion toggles.
          </p>
          <ul className="grid grid-cols-1 gap-4 text-sm text-white/70 sm:grid-cols-2">
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Learning Efficiency Index</li>
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Performance Scorecards</li>
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Adaptive Next-Focus</li>
            <li className="flex items-center gap-2 font-medium"><span className="text-blue-400">✦</span> Structured Revision Docs</li>
          </ul>
        </div>
        
        <div className="relative">
          <div className="p-8 bg-[#050810] rounded-3xl border border-white/10 text-center shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            </div>
            <p className="text-[10px] text-blue-400 uppercase tracking-[0.2em] mb-2 font-black">Dashboard Integrated</p>
            <div className="text-xs font-mono text-white/60 truncate bg-white/5 p-2 rounded-lg">learner-profile.summary</div>
            <button className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all shadow-lg shadow-blue-900/40 uppercase tracking-widest">
              View Insights
            </button>
          </div>
        </div>
      </section>

      {/* Closing Call to Action */}
      <section className="text-center py-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/5 blur-[120px] -z-10" />
        <h4 className="text-3xl font-bold text-white mb-4 tracking-tight">The goal is not memorization.</h4>
        <p className="mx-auto mb-10 max-w-xl text-base text-slate-500 sm:text-lg">It is deep, durable learning through a structured reasoning partner.</p>
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