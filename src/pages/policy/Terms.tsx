import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";
import {Scale} from "lucide-react";

export default function Terms() {
  return (
    <PageLayout>
      <section id="home"></section>
      <PageHeader
        title="Terms and Policies"
        tag="Terms"
        icon={Scale}
        subtitle="The legal framework for using Universal Academic Oracle, including Apache-2.0 licensing, reserved-rights exclusions, branding restrictions, and general use terms."
        button="View Apache-2.0"
        btnLink="https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model/blob/main/LICENSE"
        imgLink="./terms.jpg"
      />

      {/* Section 01: License & Usage */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="license">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">01. Licensing</h2>
            <p className="text-sm text-blue-400/60 mt-2">Mixed License Scope</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300">
              This repository is distributed under the <strong>Apache License 2.0</strong>
              unless otherwise stated. Some files are explicitly excluded from that
              license and remain <strong>All Rights Reserved</strong> under the
              repository's license-scope notice.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Apache-2.0 Scope</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Most repository contents may be used under Apache-2.0, subject to
                  the license terms, preserved notices, and any file-level
                  exclusions identified in the project materials.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Excluded Materials</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Files listed in the repository's scope notice are not granted for
                  copying, redistribution, republication, or reuse in derivative
                  repositories without prior written permission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Technical Terms */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-y border-white/5 bg-white/[0.01] scroll-offset" id="technical">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">02. Conduct</h2>
            <p className="text-sm text-emerald-400/60 mt-2">Use and Branding Rules</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-white">User Responsibility and Project Identity</h3>
            <p className="text-slate-400">
              By using this project, you agree to respect the repository's license
              boundaries, attribution requirements, and trademark restrictions.
            </p>

            <ul className="space-y-4 mt-6">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Attribution and Notices:</span>
                <span className="text-sm text-slate-400">Required copyright, license, attribution, and notice materials must remain in place where the governing terms require them.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Branding Restrictions:</span>
                <span className="text-sm text-slate-400">Project names, logos, icons, screenshots, and release identity may not be used to imply endorsement, continuity, or official status without prior written permission.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 03: Evolution */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="evolution">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">03. Policy Updates</h2>
            <p className="text-sm text-indigo-400/60 mt-2">Review and Revisions</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400">
              These terms, notices, and repository policies may be updated over time
              to reflect legal, security, product, or documentation changes.
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2 pt-4">
              <li>Clarified license scope and excluded-file treatment.</li>
              <li>Updated trademark and branding guidance.</li>
              <li>Refined user responsibilities and public-facing notices.</li>
            </ul>
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500">
              <p className="text-xs text-blue-300 font-mono italic">
                "Open where permitted, protected where necessary, and clear about the difference."
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
