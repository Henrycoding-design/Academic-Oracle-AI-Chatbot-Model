// src/pages/products/Products.tsx
import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";

export default function Products() {
  return (
    <PageLayout>
      <PageHeader
        title="Products"
        subtitle="Tools built around Academic Oracle"
      />

      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="overview">
        {/* ProductGrid later */}
        <p className="text-white/60">
          Academic Oracle · Future integrations · Experiments
        </p>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="features">
        {/* ProductGrid later */}
        <p className="text-white/60">
          Academic Oracle · Future integrations · Experiments
        </p>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="roadmap">
        {/* ProductGrid later */}
        <p className="text-white/60">
          Academic Oracle · Future integrations · Experiments
        </p>
      </section>
    </PageLayout>
  );
}
