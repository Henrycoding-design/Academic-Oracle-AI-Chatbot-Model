// src/pages/changelog/Changelog.tsx
import PageLayout from "@/src/layout/PageLayout";
import changelog from "./changelog.json";

export default function Changelog() {
    const orderedChangelog = [...changelog].sort((a, b) => {
        const dateDiff =
            new Date(b.date).getTime() - new Date(a.date).getTime();

        if (dateDiff !== 0) return dateDiff;

        // fallback: version comparison
        return b.version.localeCompare(a.version, undefined, {
            numeric: true,
            sensitivity: "base",
        });
    });


  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto px-6 pt-32">
        <h1 className="text-4xl font-bold mb-10">Changelog</h1>

        {orderedChangelog.map((v, i) => ( 
          <div key={v.version} className="mb-8">
            {i === 0 && (
            <span className="text-xs text-indigo-400 uppercase tracking-wide">
                Latest
            </span>
            )}
            <h2 className={v.version.match(/^v?\d+\.0\.0$/)? "text-xl font-bold flex items-center gap-3" : "text-xl font-semibold flex items-center gap-3"}>
                {v.version}
                <span className="text-sm font-normal text-white/40">
                    {new Date(v.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    })}
                </span>
            </h2>
            <ul className="mt-2 text-white/60 list-disc pl-5">
              {v.changes.map((c: string) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </PageLayout>
  );
}
