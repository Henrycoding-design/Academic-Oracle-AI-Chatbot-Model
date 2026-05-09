import React from "react";

export default function Auth() {
  const goToAccount = (e) => {
    e.preventDefault();
    // Simplified navigation logic for the demo
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="space-y-20 sm:space-y-24 lg:space-y-32">
      {/* Header Section */}
      <section className="pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Identity Guard Active</span>
        </div>
        <h1 className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text pb-4 text-4xl font-black tracking-tighter text-transparent sm:text-5xl">
          Security & Authentication
        </h1>
        <p className="max-w-3xl text-lg font-medium leading-relaxed text-slate-400 sm:text-xl">
          Academic Oracle employs a <span className="text-white">hardened security posture</span>. By isolating sensitive logic in encrypted edge environments, we ensure your credentials never touch the client-side.
        </p>
      </section>

      {/* Security Infrastructure Card */}
      <section className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:p-10">
        {/* Animated Scanning Beam Effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent -translate-y-full animate-[scan_4s_linear_infinite]" />
        
        <div className="relative mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.735 11.735 0 00-1.59 7.477c.282 1.499 1.05 2.872 2.103 3.93a11.954 11.954 0 0015.536 0c1.053-1.058 1.822-2.43 2.103-3.93a11.732 11.732 0 00-1.59-7.477z" />
              </svg>
            </div>
            The Secure Core
          </h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
            Our architecture is built on <span className="text-emerald-300 font-semibold italic text-balance">Zero-Exposure Principles</span>. Cryptographic heavy lifting is moved away from the browser into protected server-side environments.
          </p>
        </div>
        
        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-12">
          <div className="space-y-4 group/item">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Isolated Edge Decryption
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed pl-5 border-l border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
              Sensitive operations are confined to <strong>Supabase Edge Functions</strong>. Raw API keys are never processed by the client, neutralizing side-channel risks.
            </p>
          </div>
          <div className="space-y-4 group/item">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              Multi-Layer Auth Guard
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed pl-5 border-l border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
              Every request passes through <strong>JWT Verification</strong> and <strong>Row-Level Security (RLS)</strong> before reaching the decryption layer.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Process Section */}
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
        <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-full" />
            <div className="relative space-y-6">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Zero-Trust Protocol</h3>
                <p className="text-base leading-relaxed text-slate-400 sm:text-lg">
                    The client-side is treated as a public space. By utilizing <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">AES-256-GCM</span> within high-security vaults, we ensure keys never touch browser memory or history.
                </p>
            </div>
        </div>
        <div className="group space-y-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 sm:p-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-400 text-xs font-mono">02 //</span> 
            Authenticated Orchestration
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Stateless gateway verification through Supabase. We inject temporary, ephemeral tokens that expire immediately after the Socratic session concludes.
          </p>
          <div className="h-[1px] w-full bg-gradient-to-r from-emerald-500/50 to-transparent" />
          <div className="flex gap-4">
             <div className="text-[10px] font-mono text-emerald-500/60 font-bold uppercase tracking-tighter">Handshake: Verified</div>
             <div className="text-[10px] font-mono text-blue-500/60 font-bold uppercase tracking-tighter">Session: Ephemeral</div>
             <div className="text-[10px] font-mono text-slate-500/60 font-bold uppercase tracking-tighter">Logout: State Flush</div>
          </div>
        </div>
      </section>

      {/* API Key Management - "The Vault UI" */}
      <section className="space-y-8">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Credential Management</h2>
            <p className="text-slate-400 text-lg">
                Manage your secure vault and encryption preferences via your protected dashboard.
            </p>
        </div>

        <div className="group relative overflow-hidden rounded-[2.5rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-900/20 via-black to-black p-6 transition-all duration-500 hover:border-emerald-500/40 sm:p-10">
          {/* Background Decorative Mesh */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row md:gap-10">
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h4 className="text-emerald-400 font-mono text-lg font-bold tracking-tighter">SECURE_EDGE_VAULT_ROOT</h4>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black italic">Status: Encapsulated</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 font-black tracking-widest uppercase">
                  Supabase Edge
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-black tracking-widest uppercase">
                  AES-256-GCM
                </span>
              </div>
            </div>
            
            <button 
              onClick={goToAccount}
              className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
            >
              Manage Profile
            </button>
          </div>
        </div>
      </section>

      {/* Security Disclaimer / Footnote */}
      <section className="text-center pt-10">
        <p className="text-[10px] font-mono text-slate-200 uppercase tracking-widest max-w-2xl mx-auto leading-relaxed">
            Encryption logic is audited against common injection vectors. <br/>
            Academic Oracle does not store plain-text credentials at any layer of the stack.
        </p>
      </section>
    </div>
  );
}
