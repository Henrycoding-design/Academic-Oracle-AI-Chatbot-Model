import React, { useState } from "react";
import { docsConfig } from "./docs.config";
import PageLayout from "@/src/layout/PageLayout";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function DocsSidebar({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <PageLayout>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside className="self-start lg:sticky lg:top-28">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left lg:hidden"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Documentation</span>
            <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${isSidebarOpen ? "rotate-180" : ""}`} />
          </button>
          <div className={`${isSidebarOpen ? "mt-3 block" : "hidden"} rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:mt-0 lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0`}>
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">Documentation</p>
          {docsConfig.map(doc => {
            const isActive = location.pathname === `/docs/${doc.slug}`;
            return (
              <Link
                key={doc.slug}
                to={`/docs/${doc.slug}`}
                onClick={() => setIsSidebarOpen(false)}
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
          </div>
        </aside>

        <main className="min-w-0 overflow-x-hidden pb-16 sm:pb-20">
          {children}
        </main>
      </div>
    </PageLayout>
  );
}
