import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";
import ArcadeEmbed from "@/src/components/ArcadeProductDemo";
import { AppWindow, Brain, Shield, Layout, X, BookOpen, Github, Zap , MessageCircleIcon} from "lucide-react";

export default function Products() {
  return (
    <PageLayout>
      <section id="home"></section>
      <PageHeader
        title="Products"
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
      </section>

      <div className="h-20"/>

      {/* Demo Section */}
      <section
        className="max-w-6xl mx-auto px-6 py-20 scroll-offset"
        id="demo"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Experience Guided Reasoning
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto md:text-nowrap">
            Try a real Socratic session below and see how understanding grows when the path is guided, not given.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)] bg-black/50 backdrop-blur-xl">
            <ArcadeEmbed />
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
          From deep-dive research to quick concept checks, Academic Oracle adapts to your level.
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