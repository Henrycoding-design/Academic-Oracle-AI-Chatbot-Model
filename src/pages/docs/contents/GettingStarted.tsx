import React from "react";

export default function GettingStarted() {
  return (
    <div className="space-y-16">
      {/* Intro */}
      <header>
        <h1 className="text-5xl font-bold tracking-tight mb-4">The <span className="text-blue-400">Academic Oracle</span></h1>
        <p className="text-xl text-white/50 max-w-2xl">
          An intelligent pedagogical layer designed to move beyond simple information retrieval toward true cognitive mastery.
        </p>
      </header>

      {/* Learning Methods & Socratic Method */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Learning Methods</h2>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h3 className="text-blue-400 text-lg font-medium">The Socratic AI</h3>
            <p className="text-white/70 leading-relaxed">
              We leverage the <strong>Socratic Method</strong>—a form of cooperative argumentative dialogue. Instead of providing direct answers, Academic Oracle uses <strong>strategic elenchus</strong> (probing) to expose contradictions in a student's logic and guide them to self-correction.
            </p>
            <ul className="list-none p-0 space-y-2 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Inquiry-based discovery loops
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Active recall stimulation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Adaptive difficulty scaling
              </li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
             <h4 className="text-sm font-bold uppercase text-white/40 mb-4 tracking-wider">Effectiveness Metric</h4>
             <div className="text-4xl font-light text-blue-300 mb-2">92%</div>
             <p className="text-sm text-white/50">Engagement increase in students compared to traditional "Ask-and-Answer" AI models.</p>
          </div>
        </div>
      </section>

      

      {/* Vision & Mission */}
      <section className="bg-gradient-to-r from-blue-500/10 to-transparent p-8 rounded-2xl border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4">Vision & Mission</h2>
        <div className="space-y-4">
          <p className="italic text-lg text-white/80">
            "To build the world's most accessible mentor by codifying the art of teaching into scalable architecture."
          </p>
          <p className="text-sm text-white/50 leading-relaxed">
            We believe learning shouldn't be passive. Our vision is to replace the "search engine" mentality with a "tutor" mentality—where the goal is not to find the answer, but to understand the journey to it.
          </p>
        </div>
      </section>

      {/* Anarchitecture & API */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Anarchitecture & AI Integration</h2>
          <span className="px-2 py-1 text-[10px] font-bold bg-blue-500/20 text-blue-400 rounded border border-blue-500/30 uppercase tracking-tighter">
            V1.0 Stable
          </span>
        </div>

        <p className="text-white/70">
          Academic Oracle is built on a modular <strong>Anarchitecture</strong> (Analytic Architecture) that cleanly separates
          learning logic from AI inference. We leverage <strong>Google AI Studio</strong> as an external intelligence layer,
          while the <strong>Oracle Core</strong> governs reasoning depth, pacing, and instructional intent.
        </p>
        
        <div className="p-6 bg-[#0a0f1d] border border-white/5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="font-mono text-blue-400">gg-ai.integration.flow</h4>
            <p className="text-sm text-white/40">
              Learn how Google AI Studio is orchestrated within Academic Oracle’s guided learning pipeline.
            </p>
          </div>
          <a 
            href="/docs/ggaistudio" 
            className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-blue-400 hover:text-white transition-all shadow-lg shadow-blue-500/10"
          >
            View Integration Docs
          </a>
        </div>
      </section>

    </div>
  );
}