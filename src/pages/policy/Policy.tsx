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
        subtitle="How Universal Academic Oracle approaches privacy, account protection, and responsible handling of public-facing data."
        button="See account guidance"
        btnLink="/docs/auth"
        imgLink="./privacy.png"
      />

      {/* Overview: Data Sovereignty */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="overview">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">01. Overview</h2>
            <p className="text-sm text-blue-400/60 mt-2">Privacy Commitments</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-slate-300">
              Universal Academic Oracle is designed to support learning while
              limiting unnecessary exposure of personal and operational data. We
              aim to collect only what is needed to provide the public-facing
              product experience and maintain account-related functionality.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Account Access</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Third-party sign-in and account services may be used to support
                  authentication. We do not ask users to provide third-party
                  account passwords directly to the application.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-white mb-2">Session Protection</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We take reasonable steps to protect active sessions and reduce
                  avoidable exposure of account-related activity during normal use.
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
            <p className="text-sm text-emerald-400/60 mt-2">Practical Safeguards</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <h3 className="text-white">Public-Facing Security Principles</h3>
            <p className="text-slate-400">
              We do not publish sensitive implementation details of our security
              controls. Public documentation focuses on user responsibilities,
              access boundaries, and the legal terms governing use of the project.
            </p>

            <ul className="space-y-4 mt-6">
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Least Exposure:</span>
                <span className="text-sm text-slate-400">We aim to avoid exposing protected logic, sensitive configuration, and internal operational details in public-facing materials.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-emerald-500 font-bold">Responsible Use:</span>
                <span className="text-sm text-slate-400">Users should protect their own accounts, devices, and credentials, and should avoid sharing secrets through public or client-visible channels.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap: Ethical Evolution */}
      <section className="max-w-6xl mx-auto px-6 py-20 scroll-offset" id="roadmap">
        <div className="grid md:grid-cols-[250px_1fr] gap-12">
          <div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">03. Updates</h2>
            <p className="text-sm text-indigo-400/60 mt-2">Ongoing Review</p>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-400">
              As the project evolves, this page may be updated to reflect changes
              in public-facing privacy practices, legal notices, and account
              handling expectations.
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-500 space-y-2 pt-4">
              <li>Clarifications to account and session handling.</li>
              <li>Updates to publicly documented privacy boundaries.</li>
              <li>Revisions tied to legal, security, or product changes.</li>
            </ul>
            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border-l-2 border-blue-500">
              <p className="text-xs text-blue-300 font-mono italic">
                "We share enough to inform users clearly, while avoiding disclosure of internal details that are better kept protected."
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
