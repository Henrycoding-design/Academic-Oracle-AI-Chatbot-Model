import React from "react";

export default function ExamPractice() {
  return (
    <div className="space-y-20 sm:space-y-24 lg:space-y-32">
      {/* Intro Header */}
      <header className="pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">New Feature v2.4.5</span>
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
