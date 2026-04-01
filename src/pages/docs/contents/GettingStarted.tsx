import React from "react";

export default function GettingStarted() {
  const goToQuiz = () => {
    window.history.pushState({}, "", "/quiz");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <div className="space-y-32">
      {/* Intro Header */}
      <header className="pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Documentation v2.3</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-6">
          The <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Academic Oracle</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed font-medium">
          A public overview of the learning experience, contributor entry points,
          and repository boundaries behind <span className="text-white">Universal Academic Oracle</span>.
        </p>
      </header>

      {/* Learning Methods Section */}
      <section className="space-y-16">
        <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-white">Learning Methods</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>
        
        {/* The Socratic AI Card */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-blue-400 text-sm font-black uppercase tracking-widest">The Socratic AI</h3>
                <p className="text-white text-2xl font-bold leading-snug">Strategic Elenchus & <br/>Discovery Loops</p>
            </div>
            <p className="text-slate-400 leading-relaxed text-lg">
              Instead of centering instant answers, Universal Academic Oracle is
              designed around guided reasoning, reflection, and progressive support.
            </p>
            <ul className="grid grid-cols-1 gap-4 pt-4">
              {[
                "Guided prompts before direct answers",
                "Reflection and active recall",
                "Learning flow that rewards understanding"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300 group">
                  <div className="w-5 h-5 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700" />
            <div className="relative bg-[#0a0f1d] border border-white/10 p-10 rounded-3xl text-center md:text-left shadow-2xl">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-[0.3em]">Product Focus</h4>
              <div className="flex items-baseline gap-2 mb-2 justify-center md:justify-start">
                <span className="text-4xl font-black text-white">Guided</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                The public product is presented first as a learning tool, not as a
                dump of internal system design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Mastery Assessment (Quiz) */}
      <section className="grid md:grid-cols-2 gap-20 items-center">
        <div className="bg-white/[0.03] border border-white/5 p-10 rounded-[2.5rem] order-2 md:order-1 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full" />
          
          <h4 className="text-xs font-black uppercase text-purple-400 mb-8 tracking-widest flex items-center gap-2">
            <span className="w-4 h-[1px] bg-purple-400" />
            Engine Features
          </h4>
          <div className="space-y-8 relative">
            {[
              { title: "Practice Layers", desc: "Assessment can reinforce understanding through short checks and guided follow-up." },
              { title: "Continuity", desc: "Learners can move between explanation and validation without breaking study flow." },
              { title: "Feedback Loops", desc: "Follow-up support is meant to help learners revisit weak areas with clarity." }
            ].map((f) => (
              <div key={f.title} className="group/item">
                <span className="text-white font-bold block mb-1 group-hover/item:text-purple-300 transition-colors">{f.title}</span>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 order-1 md:order-2">
          <div className="space-y-4">
            <h3 className="text-purple-400 text-sm font-black uppercase tracking-widest">Assessment Layer</h3>
            <h2 className="text-4xl font-bold text-white tracking-tight">Dynamic Mastery <br/><span className="italic font-serif">Assessment</span></h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              The assessment experience is intended to bridge conversation and
              retained knowledge without overwhelming learners with implementation
              details.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
            <button 
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95" 
              onClick={goToQuiz}
            >
              Try Quiz Now
            </button>
            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Sign-up required</span>
          </div>
        </div>
      </section>

      {/* Vision & Mission - "The Editorial Section" */}
      <section className="relative py-20 px-10 rounded-[3rem] bg-gradient-to-b from-blue-500/10 to-transparent border border-white/5 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/10 blur-[100px] rounded-full" />
        <div className="relative max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Our Philosophy</h2>
          <p className="text-3xl md:text-4xl font-medium text-white italic leading-tight text-balance">
            "To build an accessible guided-learning experience that keeps the
            learner's progress at the center."
          </p>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto">
            We believe learning should not be passive. The goal is not just the
            answer, but the understanding that comes from working toward it.
          </p>
        </div>
      </section>

      {/* Architecture & API */}
      <section className="space-y-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">Repository Boundaries</h2>
            <span className="px-3 py-1 text-[10px] font-black bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 uppercase tracking-[0.2em] whitespace-nowrap">
              Public Guidance
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-[1fr_400px] gap-12 items-center">
            <p className="text-slate-400 text-lg leading-relaxed">
              This documentation explains the public-facing product and repository
              at a high level. It does not disclose sensitive implementation
              details, protected orchestration logic, or reserved-rights material
              beyond what is necessary for contributors and users.
            </p>
            
            <div className="p-10 bg-[#060912] border border-white/10 rounded-3xl space-y-8 group hover:border-blue-500/40 transition-colors shadow-2xl">
              <div className="space-y-3">
                <code className="text-xs text-blue-400 font-black tracking-tighter block uppercase">license.and.public.docs</code>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Review the public usage boundaries and account guidance before
                  working deeper in the repository.
                </p>
              </div>
              <a 
                href="/docs/auth" 
                className="block w-full text-center px-6 py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                Read the guidance
              </a>
            </div>
        </div>
      </section>
    </div>
  );
}
