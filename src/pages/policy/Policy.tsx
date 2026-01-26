import PageLayout from "@/src/layout/PageLayout";
import PageHeader from "../ui/PageHeader";
import {ShieldCheck} from "lucide-react";

export default function Policy() {
  return (
    <PageLayout>
      <section id="home"></section>
      <PageHeader
        title="Privacy Policy"
        tag="Privacy"
        icon={ShieldCheck}
        subtitle="The legal and technical framework protecting the Academic Oracle ecosystem."
        button="See more about Auth"
        btnLink="/docs/auth"
        imgLink="./privacy.png"
      />

      {/* Overview: Data Sovereignty */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="overview">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">01. Overview</h2>
            <p className="text-sm text-blue-400/60 mt-2">Data Sovereignty</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300">
              Academic Oracle is committed to the principle of <strong>User Data Sovereignty</strong>. We believe your academic progress and technical credentials belong to you. Our policies are designed to ensure that your data is used exclusively to enhance your learning experience.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Google OAuth Implementation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We use Google OAuth via Supabase to manage identities. We never see, store, or transmit your Google password. We only access the minimum scope required to personalize your profile.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Stateless Sessions</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Most of your learning state is handled via JWT (JSON Web Tokens), ensuring that your sessions are secure, mobile, and difficult to hijack.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features: Security & Encryption */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-y border-white/5 bg-white/[0.01] scroll-offset" id="features">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">02. Security</h2>
            <p className="text-sm text-emerald-400/60 mt-2">Encryption Standards</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-white">API Key Protection (AES-GCM 256)</h3>
            <p className="text-slate-400">
              When you provide API keys for model integration, they are not stored in raw text. They are immediately passed through an <strong>AES-GCM 256-bit encryption</strong> layer.
            </p>
            
            
            
            <ul className="space-y-4 mt-6">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Encrypted at Rest:</span>
                <span className="text-sm text-slate-400">Stored within Supabase’s encrypted vault using unique initialization vectors (IV) for every record.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Decrypted on Demand:</span>
                <span className="text-sm text-slate-400">Keys are decrypted in volatile memory only during the active request lifecycle and purged immediately after completion.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap: Ethical Evolution */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="roadmap">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">03. Roadmap</h2>
            <p className="text-sm text-indigo-400/60 mt-2">Ethical Evolution</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400">
              As we integrate more Gemini models and "Anarchitecture" layers, our policy will evolve to include:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2 pt-4">
              <li>Secure cloud chat storage designed to preserve long-term learning context.</li>
              <li>Selective local-only storage options for high-sensitivity learner profiles.</li>
              <li>Hardened authentication flows with elevated verification for critical operations.</li>
            </ul>
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500">
              <p className="text-xs text-blue-300 font-mono italic">
                "Our security mission is simple: To provide an elite learning environment where the technology is as invisible and secure as the knowledge is profound."
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}