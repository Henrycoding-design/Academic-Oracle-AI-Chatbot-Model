import React from "react";

export default function ExamPractice() {
  return (
    <div className="space-y-20 sm:space-y-24 lg:space-y-32">
      {/* Intro Header */}
      <header className="pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">New Feature v2.5.0</span>
        </div>
        <h1 className="mb-6 text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
          Exam <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Practice</span>
        </h1>
        <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
          A high-stakes simulation environment designed to bridge the gap between <span className="text-white">guided learning</span> and <span className="text-white">summative performance</span>.
        </p>
      </header>

      {/* The Simulation Environment */}
      <section className="space-y-10">
        <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-white">The Simulation</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
            <h3 className="text-xl font-bold text-white">Real-World Conditions</h3>
            <p className="text-slate-400 leading-relaxed">
              Unlike the standard chat mode, Exam Practice removes live feedback and conceptual scaffolding. It enforces time limits and tracks engagement to simulate the pressure of a real examination hall.
            </p>
          </div>
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
            <h3 className="text-xl font-bold text-white">Tiered Help System</h3>
            <p className="text-slate-400 leading-relaxed">
              Configure your help level from <strong>Level 0 (Strict)</strong> to <strong>Level 3 (Full Solutions)</strong>. Hints are hidden behind toggles and their detail level scales based on your pre-exam configuration.
            </p>
          </div>
        </div>
      </section>

      {/* Help Levels Table */}
      <section className="space-y-8">
        <h3 className="text-blue-400 text-sm font-black uppercase tracking-widest text-center">Help Level Architecture</h3>
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1d]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Level</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Mode</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500">Behavior</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { l: "0", m: "Strict", b: "No hints allowed. Pure simulation." },
                { l: "1", m: "Conceptual", b: "Broad hints focusing on core principles." },
                { l: "2", m: "Guided", b: "Specific steps and scaffolding for the problem." },
                { l: "3", m: "Full", b: "Complete solutions with pedagogical explanations." }
              ].map((row) => (
                <tr key={row.l} className="group hover:bg-white/[0.01] transition-colors">
                  <td className="px-6 py-4 font-mono text-indigo-400 font-bold">{row.l}</td>
                  <td className="px-6 py-4 text-white font-bold">{row.m}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{row.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Evaluation & Grading */}
      <section className="grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <h3 className="text-purple-400 text-sm font-black uppercase tracking-widest">Evaluation Layer</h3>
          <h2 className="text-3xl font-bold tracking-tight text-white">AI-Based <br/>Grading & Analysis</h2>
          <p className="text-slate-400 leading-relaxed">
            By uploading a mark scheme alongside your exam, the AI performs a granular evaluation of your responses. v2.4.8 migrates the <strong>Core Test prompt orchestration</strong> to Supabase Edge Functions for enhanced security and tighter backend-controlled evaluation.
          </p>
          <ul className="space-y-3">
            {[
              "Automated score & grade boundary estimation",
              "Performance breakdown by topic area",
              "Mistake pattern recognition",
              "Exportable DOCX analytics reports"
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 p-10 overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full group-hover:bg-indigo-500/20 transition-colors" />
          <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-[0.3em]">Learning Continuity</h4>
          <p className="text-lg font-medium text-white leading-snug">
            "Every exam result is fed back into your <strong>Oracle Memory</strong>, allowing the chatbot to prioritize your weak areas in future study sessions."
          </p>
        </div>
      </section>
      
      {/* Blind-Checklist Section */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-white italic">Blind-Checklist</h2>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <div className="relative p-1 rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent overflow-hidden group">
          <div className="absolute inset-0 bg-[#0a0f1d] m-[1px] rounded-[3rem]" />

          <div className="relative grid md:grid-cols-5 gap-0">
            {/* Visual Illustration Side */}
            <div className="md:col-span-2 p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent">
               <div className="relative h-48 w-full rounded-2xl border border-white/10 bg-[#070b14] overflow-hidden flex flex-col p-4 space-y-3">
                  <div className="h-2 w-2/3 rounded-full bg-indigo-500/20" />
                  <div className="h-2 w-1/2 rounded-full bg-purple-500/20" />
                  <div className="h-2 w-3/4 rounded-full bg-blue-500/20" />
                  <div className="flex-1 flex items-center justify-center">
                     <div className="px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black text-[10px] tracking-widest animate-pulse">
                        GENERATING PERSONALIZED GUIDE...
                     </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/[0.02]" />
                  <div className="h-2 w-5/6 rounded-full bg-white/[0.02]" />
               </div>
               <div className="mt-8 space-y-2">
                  <p className="text-white font-bold text-lg leading-tight">Last-Minute Mastery</p>
                  <p className="text-slate-500 text-sm">Designed for high-impact review exactly 24 hours before your exam.</p>
               </div>
            </div>

            {/* Bullet Points Side */}
            <div className="md:col-span-3 p-10 space-y-8">
               <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Synthesis</h4>
                     </div>
                     <ul className="space-y-3">
                        {[
                          "Aggregates chat patterns & quiz gaps",
                          "Identifies chronic error trends",
                          "Prioritizes high-weight weak areas"
                        ].map((item) => (
                          <li key={item} className="flex gap-2 text-xs text-slate-400 leading-relaxed group/li">
                            <span className="text-indigo-500 font-bold group-hover/li:translate-x-0.5 transition-transform">→</span>
                            {item}
                          </li>
                        ))}
                     </ul>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h4 className="font-bold text-white text-sm uppercase tracking-wider">Format</h4>
                     </div>
                     <ul className="space-y-3">
                        {[
                          "Short, high-density bullet points",
                          "No dense paragraphs or filler",
                          "Zero-latency intelligent caching"
                        ].map((item) => (
                          <li key={item} className="flex gap-2 text-xs text-slate-400 leading-relaxed group/li">
                            <span className="text-purple-500 font-bold group-hover/li:translate-x-0.5 transition-transform">→</span>
                            {item}
                          </li>
                        ))}
                     </ul>
                  </div>
               </div>

               <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border border-[#0a0f1d] bg-white/10" />)}
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Validated by Agentic-Routing Engine</p>
               </div>
            </div>
          </div>
        </div>
      </section>
      {/* Anti-Cheat Section */}
      <section className="rounded-[3rem] border border-white/5 bg-gradient-to-b from-red-500/5 to-transparent p-12 text-center space-y-6">
        <h2 className="text-xs font-black text-red-400 uppercase tracking-[0.4em]">Integrity System</h2>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          The environment includes lightweight <strong>Anti-Cheat</strong> measures such as tab-switch detection and timer freezing to encourage focused, honest assessment.
        </p>
      </section>
    </div>
  );
};
