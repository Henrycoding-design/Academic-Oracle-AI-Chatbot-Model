export default function Auth() {
  const goToAccount = () => {
    window.history.pushState({}, "", "/account");
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
          Academic Oracle employs a hardened security posture. We prioritize cryptographic assurance and identity integrity to protect your intellectual property and user data.
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
          Our authentication layer is built on industry-standard protocols to ensure that every request to the Oracle is verified and every secret is shielded.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Google OAuth + Supabase
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              We leverage <strong>Supabase Auth</strong> for robust session management. Identity is verified via Google OAuth, ensuring we never store passwords. Your account is protected by Google's multi-layered security infrastructure.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              AES-GCM 256 Encryption
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              All sensitive API credentials are encrypted at rest using <strong>AES-256-GCM</strong>. This provides both confidentiality and authenticity, ensuring that data hasn't been tampered with since encryption.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Process Section */}
      <section className="grid md:grid-cols-2 gap-12 border-l-2 border-emerald-500/30 pl-8 py-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Minimal Runtime Exposure</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our architecture is designed to minimize the "blast radius." Raw API keys exist in memory only for the millisecond duration of a request. We use a just-in-time decryption pattern to fetch secrets from the encrypted vault and flush them immediately after use.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-2">End-to-End Assurance</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            From the moment you sign in to the final API call, your data is wrapped in TLS 1.3. Combined with GCM's tag-based validation, we ensure a zero-trust environment between your platform and our Socratic engine.
          </p>
        </div>
      </section>

      

      {/* API Key Management */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Manage Your Credentials</h2>
        <p className="text-slate-400">
          Ready to integrate? Access and manage your encrypted credentials from the profile dashboard.
        </p>

        <div className="group relative p-6 rounded-xl bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="text-emerald-400 font-mono text-sm">SECURE_API_ACCESS_VOOT</h4>
              <p className="text-xs text-white/40 uppercase tracking-widest mt-1 font-semibold">Status: Active & Encrypted</p>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">
              AES-256 Protected
            </span>
          </div>
          
          <a 
            onClick={goToAccount}
            href="#" // just for the cursor effect, doesn't affect functionality
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