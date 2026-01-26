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
        subtitle="The legal agreements outlining rules for using Academic Oracle, covering open-source licensing, user conduct, and liability."
        button="View MIT License"
        btnLink="https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model/blob/main/LICENSE.md"
        imgLink="./terms.jpg"
      />

      {/* Section 01: License & Usage */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="license">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">01. Licensing</h2>
            <p className="text-sm text-blue-400/60 mt-2">Open Source Integrity</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300">
              Academic Oracle is distributed under the <strong>MIT License</strong>. We provide an open, transparent platform for academic growth, allowing you the freedom to use, copy, and modify the software.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Permission & Scope</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are granted permission to use the software for any purpose, including commercial applications, provided the original copyright notice and permission notice are included.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Liability Disclaimer</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The software is provided "as is", without warranty of any kind. Academic Oracle is not liable for any claims, damages, or other liability arising from the use of the model.
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
            <p className="text-sm text-emerald-400/60 mt-2">Operational Standards</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-white">User Responsibility & API Usage</h3>
            <p className="text-slate-400">
              While we provide the "Anarchitecture" layer and interface, users are responsible for their own interactions and the integrity of their integrated keys.
            </p>
            
            <ul className="space-y-4 mt-6">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Key Sovereignty:</span>
                <span className="text-sm text-slate-400">Users are responsible for maintaining the security of their own API keys. Our AES-GCM 256 encryption is a protective layer, not a substitute for user-side caution.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Identity Management:</span>
                <span className="text-sm text-slate-400">Authentication is handled via Supabase and Google OAuth. Users agree to provide accurate information for the personalization of their academic profile.</span>
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
            <p className="text-sm text-indigo-400/60 mt-2">Ethical Evolution</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400">
              As Academic Oracle expands its "Anarchitecture" and integrates deeper AI capabilities, these terms will evolve to address:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2 pt-4">
              <li>Governance of persistent cloud-based academic context storage.</li>
              <li>Terms for localized, high-sensitivity data processing.</li>
              <li>Verification protocols for advanced academic credentials and verification.</li>
            </ul>
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500">
              <p className="text-xs text-blue-300 font-mono italic">
                "Our mission is to ensure the legal and technical framework of Academic Oracle remains as robust and transparent as the open-source community that built it."
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}