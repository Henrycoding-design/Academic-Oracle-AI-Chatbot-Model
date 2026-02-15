import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";
import ArcadeEmbed from "@/src/components/ArcadeProductDemo";
import { AppWindow, Brain, Shield, Laptop, Database, BookOpen, Github, Cpu ,CodeXml} from "lucide-react";

export default function Developers() {
  return (
    <PageLayout>
      <section id="home"></section>
      <PageHeader
        title="Developer Hub"
        tag="Developers"
        icon={CodeXml}
        subtitle="The high-performance stack powering Academic Oracle's Socratic Engine."
        button="View Docs"
        btnLink="/docs"
        imgLink="./Developer.png"
      />

      {/* Tech Stack Section */}
      <section
        id="features"
        className="max-w-6xl mx-auto px-6 py-20 scroll-offset"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Frontend Stack */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all">
            <div className="flex items-center gap-3 text-white/80">
              <Laptop className="w-6 h-6 text-blue-400" />
              <div className="h-4 w-[1px] bg-white/10" />
              <Cpu className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              React + Vite + TS
            </h3>

            <h4 className="text-sm text-white/60">
              Type-safe · HMR · Optimized Build
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Our frontend is built for speed. Using Vite's lightning-fast bundling and TypeScript's strict typing, we ensure a lag-free UI capable of handling complex LaTeX and code rendering in real-time.
            </p>
          </div>

          {/* Intelligence Stack */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3 text-white/80">
              <Brain className="w-6 h-6 text-indigo-400" />
              <div className="h-4 w-[1px] bg-white/10" />
              <span className="text-[10px] font-bold border border-white/20 px-1 rounded text-white/40 uppercase">V.1.22.0</span>
            </div>

            <h3 className="text-xl font-semibold text-white">
              Google AI Studio
            </h3>

            <h4 className="text-sm text-white/60">
              Gemini Flash · Custom Heuristics · Fallback
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Leveraging the <strong>Gemini-3-Flask</strong> series, we implement a resilient intelligence layer. Our routing logic manages fallbacks and selective model usage to maintain a continuous Socratic flow.
            </p>
          </div>

          {/* Infrastructure Stack */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 text-white/80">
              <Database className="w-6 h-6 text-emerald-400" />
              <div className="h-4 w-[1px] bg-white/10" />
              <Shield className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Supabase + OAuth
            </h3>

            <h4 className="text-sm text-white/60">
              AES-GCM 256 · Postgres · Secure Auth
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Security is non-negotiable. We use Google OAuth for identity and encrypt all sensitive API credentials using AES-GCM 256 before they ever reach our Supabase database.
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
              Pedagogical Interaction Demo
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Test the integration between our Socratic Engine and the frontend rendering. <br></br>
              Observe how the Oracle guides without giving away the solution.
            </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.1)] bg-black/50 backdrop-blur-xl">
            <ArcadeEmbed />
        </div>
      </section>

      <div className="h-20" />

      {/* Start Journey Section */}
      <section
        id="guidance"
        className="px-4 sm:px-6 md:px-8 text-center my-15 sm:my-24"
      >
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
          Ready to Build with the Oracle?
        </h2>

        <p className="mt-4 text-white/60 max-w-xl mx-auto">
          Access our comprehensive documentation for API endpoints, encryption standards, and pedagogical guidelines.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="/docs"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1"
          >
            <BookOpen size={18} />
            Explore Documentation
          </a>

          <a
            href="https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model"
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold border border-white/10 text-white hover:bg-white/5 transition-all"
          >
            <Github size={18} />
            Star on GitHub
          </a>
        </div>
      </section>
      
    </PageLayout>
  );
}