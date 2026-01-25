import React from "react";
import { docsConfig } from "./docs.config";
import PageLayout from "@/src/layout/PageLayout";
import { Link, useLocation } from "react-router-dom";

export default function DocsSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 pt-28 grid grid-cols-[240px_1fr] gap-12">
        <aside className="sticky top-28 self-start space-y-1">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Documentation</p>
          {docsConfig.map(doc => {
            const isActive = location.pathname === `/docs/${doc.slug}`;
            return (
              <Link
                key={doc.slug}
                to={`/docs/${doc.slug}`}
                className={`block py-2 transition-all duration-200 ${
                  isActive 
                    ? "text-blue-400 font-medium" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                {doc.title}
              </Link>
            );
          })}
        </aside>

        <main className="prose prose-invert max-w-none pb-20">
          {children}
        </main>
      </div>
    </PageLayout>
  );
}