export default function GGAIStudio() {
  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent pb-2">
          Intelligence Infrastructure
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Academic Oracle is powered by Google’s most advanced Gemini models. We prioritize explicit versioning and resilient request handling to ensure a seamless pedagogical experience.
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
        
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "gemini-3-flash-preview", role: "High-reasoning Socratic loops" },
            { name: "gemini-2.5-flask", role: "Standard pedagogical tasks" },
            { name: "gemini-2.5-flask-lite", role: "Lightweight conversational cues" }
          ].map((model) => (
            <div key={model.name} className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
              <code className="text-xs text-indigo-400 font-mono font-bold">{model.name}</code>
              <p className="text-xs text-slate-500 mt-2">{model.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Resiliency & UX Section */}
      <section className="grid md:grid-cols-2 gap-12 border-l-2 border-indigo-500/30 pl-8 py-4">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Uninterrupted Learning</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-balance">
            Education cannot wait for a server refresh. We implement <strong>intelligent fallback routing</strong>: if a quota limit is reached on a primary model, the system automatically cascades the request to secondary backups without the student ever noticing a lag.
          </p>
          <div className="flex gap-4">
             <div className="text-center">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Retry Logic</p>
                <p className="text-sm font-mono text-indigo-400 font-bold">Exponential Backoff</p>
             </div>
             <div className="text-center border-l border-white/10 pl-4">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Error Handling</p>
                <p className="text-sm font-mono text-indigo-400 font-bold">Console-Only Logs</p>
             </div>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Dynamic Tailoring</h3>
          <p className="text-slate-400 text-sm leading-relaxed text-balance">
            The Oracle doesn't just use one model. It evaluates the complexity of the user's request and selects the optimal engine from our <strong>Flask-series stack</strong>. This balances speed, cost, and depth of reasoning in real-time.
          </p>
        </div>
      </section>

      

      {/* UI Interaction Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">User Interface Integrity</h2>
        <p className="text-slate-400">
          In the event of a persistent network failure, we provide a clean, non-intrusive <strong>Retry Action</strong> on the UI. All technical error stacks are directed to the developer console to maintain a distraction-free environment for the learner.
        </p>

        <div className="group relative p-6 rounded-xl bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
          <h4 className="text-indigo-400 font-mono mb-2 flex items-center gap-2">
            Pedagogical-Stability-Index: 99.9%
          </h4>
          <p className="text-sm text-white/50 mb-4 italic">
            "Engineered for the long-term, not just the next update."
          </p>
          <a 
            href="/docs/chatflow"
            className="inline-flex items-center text-sm font-bold text-white hover:text-indigo-400 transition-colors"
          >
            Read more on Chat Logic
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}