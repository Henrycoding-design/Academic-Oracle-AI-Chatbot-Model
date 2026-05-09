import React from "react";

export default function AIStudio() {
  return (
    <div className="space-y-20 sm:space-y-24 lg:space-y-32">
      {/* Header Section */}
      <section className="pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Orchestration: Gemini-First (v2.4.8)</span>
        </div>
        <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text pb-4 text-4xl font-black tracking-tighter text-transparent sm:text-5xl">
          Intelligence Infrastructure
        </h1>
        <p className="max-w-3xl text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
          Academic Oracle is powered by a <span className="text-white">Gemini-first orchestration pipeline</span>. We prioritize direct Google GenAI integration with OpenRouter as a validated, last-resort fallback for pedagogical continuity.
        </p>
      </section>

      {/* Model Strategy Card - "The Server Rack" */}
      <section className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:p-10">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-40 h-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.641.32a4 4 0 01-2.574.345l-2.012-.402a2 2 0 01-1.428-1.428l-.402-2.012a4 4 0 01.345-2.574l.32-.641a6 6 0 00.517-3.86l-.477-2.387a2 2 0 00-.547-1.022L6 3" />
            </svg>
        </div>

        <div className="relative mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            Architectural Stability
          </h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Using <span className="text-indigo-300">validated racing logic</span>, the system ensures that only the first <i>valid</i> response from our multi-mode pipeline triggers the discovery loops.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              name: "gemini-3-flash", 
              role: "Agentic Mode", 
              desc: "The primary engine for deep Socratic dialogue and high-reasoning pedagogical inquiry.",
              color: "text-blue-400",
              border: "border-blue-500/20"
            },
            { 
              name: "gemini-2.5-flash", 
              role: "Balanced / Quiz", 
              desc: "Standard routing for adaptive testing and consistent mastery check generation.",
              color: "text-emerald-400",
              border: "border-emerald-500/20"
            },
            { 
              name: "gemini-3.1-lite", 
              role: "Task Offloader", 
              desc: "High-level orchestration for complex multi-tasking and parallel reasoning calls.",
              color: "text-purple-400",
              border: "border-purple-500/20"
            },
            { 
              name: "gemini-2.5-lite", 
              role: "Fast Execution", 
              desc: "Handles lightweight conversational cues and real-time interface validations.",
              color: "text-cyan-400",
              border: "border-cyan-500/20"
            }
          ].map((model) => (
            <div key={model.name} className={`p-6 rounded-2xl bg-[#0a0f1a] border ${model.border} hover:bg-white/[0.04] transition-all duration-300 group/card`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-2 h-2 rounded-full bg-current ${model.color} animate-pulse`} />
                <code className={`text-[10px] ${model.color} font-mono font-black tracking-tighter uppercase`}>v2.4.8.build</code>
              </div>
              <div>
                <h5 className="text-white text-sm font-bold mb-1 group-hover/card:text-indigo-300 transition-colors">{model.role}</h5>
                <code className="text-[11px] text-slate-500 font-mono block mb-4">{model.name}</code>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{model.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grounding and Reference Support */}
      <section className="group relative rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent p-6 sm:p-8 lg:p-12">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:gap-16">
          <div className="flex-1 space-y-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-white flex items-center gap-4 tracking-tight">
                <span className="p-3 bg-emerald-500/20 rounded-2xl ring-1 ring-emerald-500/40">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                Hybrid Grounding Layer
              </h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                To eliminate hallucinations, we integrate <span className="text-emerald-400 font-semibold">Tavily Web Search</span> as our primary provider. When knowledge gaps are detected, the system synthesis live data with a <span className="text-white">JigsawStack fallback</span> to maintain accuracy.
              </p>
            </div>

            <div className="flex flex-col gap-6 border-t border-white/5 pt-4 sm:flex-row sm:gap-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 font-black mb-2">Primary Search</p>
                <p className="text-sm font-mono text-white flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   Tavily AI
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-500/60 font-black mb-2">Resiliency Mode</p>
                <p className="text-sm font-mono text-white flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                   JigsawStack Fallback
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 bg-black/40 p-8 rounded-3xl border border-white/5 backdrop-blur-md">
            <ul className="space-y-4">
              {[
                "Neutralizes training cutoffs",
                "SPA & Dynamic site parsing",
                "Controlled hallucination safety",
                "Hybrid reasoning synthesis"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 group/li">
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/40 group-hover/li:bg-emerald-400 transition-colors" />
                  <span className="text-sm text-slate-300 group-hover/li:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Resiliency Section - "The Logic Cascade" */}
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
        <div className="space-y-8 relative">
          <div className="absolute -left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-transparent rounded-full opacity-20" />
          <h3 className="text-3xl font-bold text-white tracking-tight">Backend Orchestration</h3>
          <p className="text-slate-400 leading-relaxed text-lg">
            API calls are secured via <span className="text-white">Supabase Edge Functions</span>. v2.4.8 extends this by migrating <strong>Core Test exam prompts</strong> to the backend. This eliminates client-side key exposure and centralizes prompt sanitation, jailbreak detection, and routing logic within a hardened environment.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Security</p>
              <p className="text-sm font-mono text-indigo-400 font-bold">Prompt Sanitation</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-black mb-1">Architecture</p>
              <p className="text-sm font-mono text-emerald-400 font-bold">Edge Runtime</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 space-y-6">
           <h4 className="text-white font-bold flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-indigo-500" />
             Real-time State Visibility
           </h4>
           <p className="text-sm text-slate-400 leading-relaxed">
             The v2.4.8 updates introduce a dynamic Loading Status Bar and <strong>backend-enforced Oracle Memory constraints</strong>, ensuring that topics are only created upon explicit user intent, significantly reducing model hallucinations.
           </p>
           <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-[94%] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
           </div>
           <p className="text-[10px] text-white/30 font-mono uppercase tracking-tighter">System Reliability: 94% Validated Fallback Success</p>
        </div>
      </section>

      {/* UI Integrity Section */}
      <section className="group relative overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-transparent p-6 text-center sm:p-8 md:text-left lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-3xl font-bold text-white tracking-tight">Cognitive Flow Design</h2>
            <p className="text-slate-400 leading-relaxed">
              We prioritize minimalist UI to maintain student focus. From stacked file uploads to non-blocking UX architecture, every element is refined to prevent digital friction during the learning process.
            </p>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <span className="text-indigo-400 font-mono text-sm font-bold flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                Deployed: v2.4.8-Stable
              </span>
              <a 
                href="/docs/chatflow"
                className="group/link flex items-center text-sm font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-widest"
              >
                The Flow
                <svg className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          <div className="shrink-0">
             <div className="w-32 h-32 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin-slow flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center backdrop-blur-xl">
                   <span className="text-indigo-300 font-black text-xl tracking-tighter italic">AO</span>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
