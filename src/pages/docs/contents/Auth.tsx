import React from "react";

export default function Auth() {
  const goToAccount = (e) => {
    e.preventDefault();
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="space-y-32">
      {/* Header Section */}
      <section className="pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
          <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Identity Guard Active</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-500 bg-clip-text text-transparent pb-4">
          Security & Authentication
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-3xl font-medium">
          This page explains public-facing account and access expectations at a
          high level. It intentionally avoids disclosing sensitive operational
          details or protected implementation patterns.
        </p>
      </section>

      {/* Security Infrastructure Card */}
      <section className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
        {/* Animated Scanning Beam Effect */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent -translate-y-full animate-[scan_4s_linear_infinite]" />
        
        <div className="relative mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04a11.735 11.735 0 00-1.59 7.477c.282 1.499 1.05 2.872 2.103 3.93a11.954 11.954 0 0015.536 0c1.053-1.058 1.822-2.43 2.103-3.93a11.732 11.732 0 00-1.59-7.477z" />
              </svg>
            </div>
            Account Protection
          </h2>
          <p className="text-slate-400 max-w-2xl leading-relaxed text-lg">
            We aim to keep public guidance simple: protect accounts, avoid sharing
            secrets, and rely on approved access flows rather than client-visible
            workarounds.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mt-8">
          <div className="space-y-4 group/item">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              Limited Public Disclosure
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed pl-5 border-l border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
              Public docs describe security commitments and user responsibilities
              without publishing sensitive implementation specifics.
            </p>
          </div>
          <div className="space-y-4 group/item">
            <h4 className="text-white font-bold text-lg flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
              Account Responsibility
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed pl-5 border-l border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
              Users are responsible for protecting their own account access,
              devices, and credentials when using the public product.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Process Section */}
      <section className="grid md:grid-cols-2 gap-20 items-center">
        <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/5 blur-3xl rounded-full" />
            <div className="relative space-y-6">
                <h3 className="text-3xl font-bold text-white tracking-tight">High-Level Security Approach</h3>
                <p className="text-slate-400 leading-relaxed text-lg">
                    The client experience should not be treated as a safe place for
                    exposing secrets. Sensitive behavior belongs behind protected
                    boundaries rather than in public-facing code paths.
                </p>
            </div>
        </div>
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6 group">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-400 text-xs font-mono">02 //</span> 
            Approved Access Paths
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Use the official sign-in and account flows provided by the product.
            Avoid sharing keys, secrets, or private credentials in public or
            client-visible contexts.
          </p>
          <div className="h-[1px] w-full bg-gradient-to-r from-emerald-500/50 to-transparent" />
          <div className="flex gap-4">
             <div className="text-[10px] font-mono text-emerald-500/60 font-bold uppercase tracking-tighter">Guidance: Public</div>
             <div className="text-[10px] font-mono text-blue-500/60 font-bold uppercase tracking-tighter">Details: Limited</div>
          </div>
        </div>
      </section>

      {/* API Key Management - "The Vault UI" */}
      <section className="space-y-8">
        <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white tracking-tight">Credential Management</h2>
            <p className="text-slate-400 text-lg">
                Use official account surfaces to manage access-related settings.
            </p>
        </div>

        <div className="group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/20 via-black to-black border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-500 overflow-hidden">
          {/* Background Decorative Mesh */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          
          <div className="relative flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h4 className="text-emerald-400 font-mono text-lg font-bold tracking-tighter">SECURE_EDGE_VAULT_ROOT</h4>
                <div className="flex items-center justify-center md:justify-start gap-3 mt-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black italic">Status: Protected</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-xl border border-blue-500/20 font-black tracking-widest uppercase">
                  Official Access
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-black tracking-widest uppercase">
                  Limited Detail
                </span>
              </div>
            </div>
            
            <button 
              onClick={goToAccount}
              className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
            >
              Open Account Page
            </button>
          </div>
        </div>
      </section>

      {/* Security Disclaimer / Footnote */}
      <section className="text-center pt-10">
        <p className="text-[10px] font-mono text-slate-200 uppercase tracking-widest max-w-2xl mx-auto">
            Public documentation is intentionally limited. <br/>
            Refer to the repository's legal and policy files for usage boundaries
            and protected materials.
        </p>
      </section>
    </div>
  );
}
