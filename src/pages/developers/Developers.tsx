// src/pages/developers/Developers.tsx
import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";

export default function Developers() {
  return (
    <PageLayout>
      <PageHeader
        title="Developers"
        subtitle="APIs, architecture, and internals"
      />

      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="overview">
        <p className="text-white/60">
          API access, system design, and contribution guides.
        </p>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="features">
        <p className="text-white/60">
          API access, system design, and contribution guides.
        </p>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="roadmap">
        <p className="text-white/60">
          API access, system design, and contribution guides.
        </p>
      </section>
    </PageLayout>
  );
}
