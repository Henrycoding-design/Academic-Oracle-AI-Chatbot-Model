import React from "react";

export default function Auth() {
  const goToAccount = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent pb-2">
          Security & Authentication
        </h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
          Academic Oracle employs a hardened security posture. By centralizing sensitive logic within isolated environments, we ensure that your credentials remain invisible to the frontend at all times.
        </p>
      </section>

      {/* Security Infrastructure Card */}
      <section className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
        <h2 className="text-2xl font-semibold text-emerald-400 mt-0 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 Pel6.208 6.208 0 00-1.022 7.711a11.942 11.942 0 005.132 5.703L12 21l3.508-1.258a11.942 11.942 0 005.132-5.703 6.208 6.208 0 00-1.022-7.711z" />
          </svg>
          The Secure Core
        </h2>
        <p className="text-slate-300">
          Our infrastructure is designed around the principle of <strong>Zero-Exposure</strong>. We move the heavy lifting of security away from the browser and into protected, server-side environments.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Isolated Edge Decryption
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Decryption logic is strictly confined to <strong>Supabase Edge Functions</strong>. Raw API keys are never transmitted to or processed by the client, preventing side-channel attacks and memory sniffing.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Multi-Layer Auth Guard
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every request must pass a gauntlet of checks: <strong>JWT Verification</strong>, <strong>RWA (Row-Level Access)</strong>, and custom service-role validation before the edge function initiates decryption.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Process Section */}
      <section className="grid md:grid-cols-2 gap-12 border-l-2 border-emerald-500/30 pl-8 py-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Zero-Trust Architecture</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We treat the client-side as a "public" space. By utilizing <strong>AES-256-GCM</strong> within the Edge Function's environment variables and vault, we ensure that the cryptographic "keys to the kingdom" never touch the user's browser history or local storage.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Authenticated Orchestration</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our orchestration layer acts as a stateless gateway. It verifies your Google OAuth session through Supabase and injects temporary, short-lived tokens that expire immediately after the Socratic session concludes.
          </p>
        </div>
      </section>

      {/* API Key Management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Manage Your Credentials</h2>
        <p className="text-slate-400">
          Access your secure vault to rotate keys or update your encryption preferences through the protected dashboard.
        </p>

        <div className="group relative p-6 rounded-xl bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-emerald-400 font-mono text-sm">SECURE_EDGE_VAULT_VOOT</h4>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1 font-semibold">Status: Encapsulated & Guarded</p>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-bold">
                SUPABASE EDGE
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20 font-bold">
                AES-GCM
              </span>
            </div>
          </div>
          
          <a 
            onClick={goToAccount}
            href="/profile" 
            className="inline-flex items-center text-sm font-bold text-white hover:text-emerald-400 transition-colors"
          >
            Access Profile Dashboard
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}