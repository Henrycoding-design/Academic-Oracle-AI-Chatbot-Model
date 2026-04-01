import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";
import ArcadeEmbed from "@/src/components/ArcadeProductDemo";
import { Laptop, Shield, BookOpen, Github, CodeXml, FileText } from "lucide-react";

export default function Developers() {
  return (
    <PageLayout>
      <section id="home"></section>
      <PageHeader
        title="Developer Hub"
        tag="Developers"
        icon={CodeXml}
        subtitle="Contributor-facing guidance for working with the public repository while respecting licensing boundaries, reserved-rights materials, and project identity."
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
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Public Contribution Surface
            </h3>

            <h4 className="text-sm text-white/60">
              Frontend docs · UI work · focused improvements
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Contributors are encouraged to improve the public app, docs, and
              user experience through clear, maintainable changes that align with
              the product's guided-learning goals.
            </p>
          </div>

          {/* Intelligence Stack */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3 text-white/80">
              <FileText className="w-6 h-6 text-indigo-400" />
              <div className="h-4 w-[1px] bg-white/10" />
              <Shield className="w-6 h-6 text-white/50" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              License Awareness
            </h3>

            <h4 className="text-sm text-white/60">
              Apache-2.0 · excluded files · notices
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Not every file in the repository is available under the same terms.
              Contributors should review the license, notice files, and excluded
              materials before reusing or redistributing project content.
            </p>
          </div>

          {/* Infrastructure Stack */}
          <div className="space-y-4 group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-3 text-white/80">
              <Shield className="w-6 h-6 text-emerald-400" />
              <div className="h-4 w-[1px] bg-white/10" />
              <Shield className="w-6 h-6 text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold text-white">
              Protected Implementation
            </h3>

            <h4 className="text-sm text-white/60">
              Reserved logic · limited disclosure
            </h4>

            <p className="text-sm text-white/70 leading-relaxed">
              Some product-defining logic, security-sensitive behavior, and
              implementation details are intentionally described only at a high
              level in the public repository.
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
              Public Experience Demo
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Explore the learner-facing experience and the tone of guided
              interaction without exposing internal operational details.
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
          Build responsibly with the public repo
        </h2>

        <p className="mt-4 text-white/60 max-w-xl mx-auto">
          Use the documentation to understand contribution expectations, public
          setup, and repository boundaries before making changes or derivatives.
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
