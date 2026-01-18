import React from "react";
import { docsConfig } from "./docs.config";
import PageLayout from "@/src/layout/PageLayout";
import { Link } from "react-router-dom";

export default function DocsSidebar({ children }: { children: React.ReactNode }) {
  return (
    <PageLayout>

      <div className="max-w-7xl mx-auto px-6 pt-28 grid grid-cols-[240px_1fr] gap-12">
        <aside className="text-sm">
          {docsConfig.map(doc => (
            <Link
              key={doc.slug}
              to={`/docs/${doc.slug}`}
              className="block py-2 text-white/60 hover:text-blue-400"
            >
              {doc.title}
            </Link>
          ))}
        </aside>

        <main className="prose prose-invert max-w-none">
          {children}
        </main>
      </div>
    </PageLayout>
  );
}
