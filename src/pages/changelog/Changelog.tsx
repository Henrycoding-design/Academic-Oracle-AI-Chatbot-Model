// src/pages/changelog/Changelog.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageLayout from "@/src/layout/PageLayout";
import changelog from "./changelog.json";

const getBadgeStyles = (type: string) => {
  switch (type) {
    case "feature":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "improve":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "security":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "fix":
      return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    case "internal":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  }
};

export default function Changelog() {
  const { hash, pathname } = useLocation();

  const orderedChangelog = [...changelog].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return b.version.localeCompare(a.version, undefined, { numeric: true });
  });

  useEffect(() => {
    if (hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <PageLayout>
      <section className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <header className="mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">What's New</h1>
          <p className="text-white/50 text-lg">New features, improvements, and bug fixes.</p>
        </header>

        <div className="relative border-l border-white/10 ml-4 md:ml-0">
          {orderedChangelog.map((v, i) => (
            <div key={v.version} className="relative pl-8 mb-16 last:mb-0">
              {/* The Timeline Dot */}
              <div className={`absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full border-2 bg-zinc-950 ${
                i === 0 ? "border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "border-white/20"
              }`} />

              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4">
                <h2 className="text-2xl font-bold tracking-tight">
                  {v.version}
                </h2>
                
                <span className="text-sm font-medium text-white/40">
                  {new Date(v.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {i === 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                    Latest Release
                  </span>
                )}
              </div>

              <ul className="space-y-4">
                {v.changes.map((item: { type: string; text: string }, idx: number) => (
                  <li key={idx} className="flex gap-4 items-start group">
                    {/* Fixed-width column for the Badge 
                        w-20 (80px) is usually enough for "Improvement" 
                    */}
                    <div className="w-20 shrink-0 pt-0.5">
                      <span 
                        className={`block text-center px-1 py-0.5 rounded text-[10px] font-bold uppercase border tracking-wider transition-opacity group-hover:opacity-100 opacity-80 ${getBadgeStyles(item.type)}`}
                      >
                        {item.type === "internal" ? "tech" : item.type}
                      </span>
                    </div>

                    {/* Change Text - Now always starts at the same horizontal offset */}
                    <span className="text-white/70 group-hover:text-white/90 transition-colors leading-relaxed text-sm md:text-base">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
