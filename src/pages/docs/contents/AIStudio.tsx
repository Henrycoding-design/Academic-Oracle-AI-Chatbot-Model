import React from "react";

export default function AIStudio() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent pb-2">
          Intelligence Infrastructure
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Academic Oracle is powered by a multi-modal mesh led by Google’s Gemini-3. We prioritize explicit versioning and cross-provider off-loading to ensure a seamless pedagogical experience even during global traffic surges.
        </p>
      </section>

      {/* Model Strategy Card */}
      <section className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-indigo-300 mt-0 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Explicit Model Architecture
        </h2>
        <p className="text-slate-300 mb-8">
          We avoid ambiguous aliases. By targeting specific builds, we guarantee <strong>behavioral stability</strong> and future-proof our socratic prompting logic against unexpected model shifts.
        </p>
        
        {/* Updated Grid to include Stepfun-3.5 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { 
              name: "gemini-3-flash", 
              role: "Primary Socratic Flow", 
              desc: "The core engine for high-reasoning inquiry and strategic elenchus.",
              color: "text-blue-400"
            },
            { 
              name: "stepfun-3.5", 
              role: "High-Level Off-loader", 
              desc: "Maintains reasoning parity during Gemini traffic spikes or quota limits.",
              color: "text-emerald-400"
            },
            { 
              name: "gemini-2.5-flask", 
              role: "Quiz Assessment", 
              desc: "Grades open-answers and generates hybrid MCQ sets via session memory.",
              color: "text-purple-400"
            },
            { 
              name: "gemini-2.5-flask-lite", 
              role: "UI Logic & Cues", 
              desc: "Manages simple validations and lightweight conversational cues.",
              color: "text-cyan-400"
            }
          ].map((model) => (
            <div key={model.name} className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col justify-between">
              <div>
                <code className={`text-[11px] ${model.color} font-mono font-bold tracking-tighter`}>{model.name}</code>
                <h5 className="text-white text-sm font-semibold mt-1">{model.role}</h5>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 leading-tight">{model.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resiliency & UX Section */}
      <section className="grid md:grid-cols-2 gap-12 border-l-2 border-indigo-500/30 pl-8 py-4">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Uninterrupted Learning</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-balance">
            Education cannot wait for a server refresh. We implement <strong>intelligent fallback routing</strong>: if a quota limit is reached on `gemini-3-flash`, the system automatically cascades the reasoning task to `stepfun-3.5` nodes to maintain the student's flow.
          </p>
          <div className="flex gap-4">
             <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Retry Logic</p>
                <p className="text-sm font-mono text-indigo-400 font-bold">Exponential Backoff</p>
             </div>
             <div className="text-center border-l border-white/10 pl-4">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Traffic Balancing</p>
                <p className="text-sm font-mono text-emerald-400 font-bold">Stepfun Off-load</p>
             </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">The Flask-Series Stack</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-balance">
            By leveraging the <strong>Gemini Flask-Series</strong>, we ensure that every specialized task—from deep Socratic dialogue to rapid quiz generation—is handled by the engine best suited for the latency requirements of that specific state.
          </p>
        </div>
      </section>

      {/* UI Interaction Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">User Interface Integrity</h2>
        <p className="text-slate-400">
          In the event of a persistent network failure across all providers, we provide a clean, non-intrusive <strong>Retry Action</strong>. All technical error stacks are directed to the developer console to maintain a distraction-free environment for the learner.
        </p>

        <div className="group relative p-6 rounded-xl bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
          <h4 className="text-indigo-400 font-mono mb-2 flex items-center gap-2">
            Pedagogical-Stability-Index: 99.9%
          </h4>
          <p className="text-sm text-white/50 mb-4 italic">
            "Engineered for the long-term, utilizing multi-model redundancy."
          </p>
          <a 
            href="/docs/chatflow"
            className="inline-flex items-center text-sm font-bold text-white hover:text-indigo-400 transition-colors"
          >
            Read more on Routing Logic
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}