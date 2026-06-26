import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";
import { ArcadeDemo } from "@/src/components/ArcadeDemo";
import { AppWindow, Brain, Shield, Layout, X, BookOpen, Github, Zap , MessageCircleIcon , PackageCheckIcon, ClipboardCheck, RefreshCw, MessageSquare, ArrowRight, Database, TrendingUp, LayoutDashboard, FileText, GraduationCap, Sliders, CheckSquare } from "lucide-react";

export default function Products() {
  return (
    <PageLayout>
      <section id="home"></section>
      <PageHeader
        title="Academic Oracle"
        tag="Products"
        icon={PackageCheckIcon}
        subtitle="The tools and interfaces driving the Academic Oracle ecosystem."
        button="Start Learning"
        btnLink="/"
        imgLink="./products.jpg"
      />

      {/* Feature Section */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 py-20 scroll-offset"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Feature 1: Reasoning */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-white/80">
              <Brain className="w-6 h-6 text-blue-400" />
              <X className="w-4 h-4 opacity-50" />
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Guided Reasoning
            </h3>

            <h4 className="text-sm text-white/60">
              Progressive hints · Pattern recognition
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Unlock your potential through inquiry. Instead of simple answer dumping, the Oracle leads you through discovery loops to build true mental models.
            </p>
          </div>

          {/* Feature 2: UI */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-white/80">
              <Layout className="w-6 h-6 text-indigo-400" />
              <X className="w-4 h-4 opacity-50" />
              <AppWindow className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Cognitive Focus UI
            </h3>

            <h4 className="text-sm text-white/60">
              Minimalist · Dark Mode · Clean Markdown
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Designed for long-form thinking. A distraction-free environment that prioritizes content over noise, keeping you locked in the flow state.
            </p>
          </div>

          {/* Feature 3: Security */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-white/80">
              <Shield className="w-6 h-6 text-emerald-400" />
              <X className="w-4 h-4 opacity-50" />
              <Shield className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Academic Security
            </h3>

            <h4 className="text-sm text-white/60">
              Math rendering · Encrypted sessions
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Strong fundamentals power the experience. We handle complex KaTeX and code blocks within a secure, AES-encrypted infrastructure.
            </p>
          </div>
        </div>
        <hr className="border-white/5 my-12" />
        {/* Second Row: Quiz Integration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 4: Dynamic Quiz Loop */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-white/80">
              <ClipboardCheck className="w-6 h-6 text-orange-400" />
              <RefreshCw className="w-4 h-4 opacity-50 animate-spin-slow" />
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">Closed-Feedback Quizzing</h3>

            <h4 className="text-sm text-white/60">
              Real-time Sync · Dynamic UI Components
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Experience a seamless bridge between assessment and dialogue. Quiz results pipe directly back into the chat UI, triggering immediate remedial explanations for missed concepts.
            </p>
          </div>

          {/* Feature 5: Adaptive Memory */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-white/80">
              <Database className="w-6 h-6 text-purple-400" />
              <ArrowRight className="w-4 h-4 opacity-50" />
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">Oracle Memory Evolution</h3>

            <h4 className="text-sm text-white/60">
              Neural updates · Performance-driven flow
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              The Oracle learns how you learn. Structured memory now tracks topic progress, Feynman support needs, quiz history, and adaptive practice signals in real-time.
            </p>
          </div>

          {/* Feature 6: Dashboard + Summary */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 text-white/80">
              <LayoutDashboard className="w-6 h-6 text-emerald-400" />
              <ArrowRight className="w-4 h-4 opacity-50" />
              <FileText className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">Dashboard Insight Loop</h3>

            <h4 className="text-sm text-white/60">
              Progress visualization · Topic drilldowns · Summary export
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Review learner identity, efficiency, strengths, weaknesses, current topics, and downloadable session summaries from one focused dashboard built for reflection and next-step planning.
            </p>
          </div>
        </div>
        <hr className="border-white/5 my-12" />
        {/* Third Row: Real-Time Exam System (v2.5.x Core Feature) */}
        <div className="grid grid-cols-1">
          {/* Feature 7: Full-width Exam Core Test Module */}
          <div className="space-y-6 group p-8 rounded-2xl bg-gradient-to-b from-blue-500/[0.02] to-transparent border border-white/5 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-white/80">
                <GraduationCap className="w-7 h-7 text-blue-400" />
                <ArrowRight className="w-4 h-4 opacity-40" />
                <Sliders className="w-6 h-6 text-indigo-400" />
                <ArrowRight className="w-4 h-4 opacity-40" />
                <CheckSquare className="w-6 h-6 text-emerald-400" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 tracking-wider uppercase">
                New Feature v2.5.x
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-1 space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Real-Time Exam Core
                </h3>
                <h4 className="text-sm text-white/60 font-medium">
                  Timed Simulations · Tiered Help Systems
                </h4>
                <p className="text-sm text-white/70 leading-relaxed">
                  Transforms Academic Oracle from a learning companion into a high-stakes performance environment. Train focus, discipline, and strategic decision-making under strict, time-restricted examination rules.
                </p>
              </div>

              {/* Sub-feature Pillars */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                  <h5 className="font-semibold text-white flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Interactive Duration Controls
                  </h5>
                  <p className="text-white/60 leading-relaxed text-xs">
                    Configure simulations using a responsive 1–90 minute dual-control slider, backed by manual entry fields scaling up to 6 hours for complex papers.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                  <h5 className="font-semibold text-white flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    Tiered Guidance Systems
                  </h5>
                  <p className="text-white/60 leading-relaxed text-xs">
                    Choose your friction level: Level 0 for absolute exam lockdowns, scaling up to Level 3 for real-time worked solutions and structural step-by-step scaffolding.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                  <h5 className="font-semibold text-white flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Examiner-Style AI Grading
                  </h5>
                  <p className="text-white/60 leading-relaxed text-xs">
                    Evaluates performance using criteria-aligned rubrics rather than basic string parsing. Injects metrics downstream to auto-reshape summaries and active quizzes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                  <h5 className="font-semibold text-white flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    Pre-Test Blind Checklist
                  </h5>
                  <p className="text-white/60 leading-relaxed text-xs">
                    An automated, high-fidelity checklist generated by agentic models racing across your entire chat history, error trends, and exam memory for targeted night-before validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="h-20"/>

      {/* Demo Section */}
      <section
        className="max-w-6xl mx-auto px-6 py-20 scroll-offset"
        id="demo"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Explore the Features
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto md:text-nowrap">
            See how Academic Oracle guides your learning through interactions.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)] bg-black/50 backdrop-blur-xl">
            <ArcadeDemo />
        </div>
      </section>

      <div className="h-20" />

      {/* Journey Section */}
      <section
        id="guidance"
        className="px-4 sm:px-6 md:px-8 text-center my-15 sm:my-24"
      >
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
          Master the Curriculum
        </h2>

        <p className="mt-4 text-white/60 max-w-xl mx-auto">
          From deep-dive research to quick concept checks <br />
          <strong>Academic Oracle</strong> adapts to your level.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1"
          >
            <MessageCircleIcon size={18} />
            Start Chatting
          </a>

          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold border border-white/10 text-white hover:bg-white/5 transition-all"
          >
            <BookOpen size={18} />
            View Documentation
          </a>
        </div>
      </section>
      
    </PageLayout>
  );
}
