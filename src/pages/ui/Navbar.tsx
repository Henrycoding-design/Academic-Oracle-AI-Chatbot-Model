import React, { useEffect, useState , useRef} from "react";
import { ChevronDown, Github, MessageSquare } from "lucide-react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { supabase } from "../../services/supabaseClient";
import {Link} from "react-router-dom";

export default function Navbar() {
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  const user = session?.user;

  const avatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    (user?.id
      ? `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`
      : null);

  // ⚠️ Only special navigation stays imperative
  const goToAccount = () => {
    window.history.pushState({}, "", "/account");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#050814]/60 border-b border-blue-500/10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-10">
          <a href="/home" className="flex items-center gap-3 font-bold text-lg">
            <div className="w-8 h-8 rounded-lg bg-[#0b1225]/80 border border-blue-400/20 flex items-center justify-center">
              <img src="/icon.png" alt="Logo" className="w-5 h-5" />
            </div>
            Academic Oracle
          </a>

          <div className="hidden md:flex items-center gap-5 text-sm text-white/70">
            <NavItem
              label="Product"
              dropdown
              href="/products#home"
              items={[
                { label: "Features", href: "/products#features" },
                { label: "Demo", href: "/products#demo" },
                { label: "Guidance", href: "/products#guidance" },
                { label: "Terms & Policy", href: "/policy"}
              ]}
            />
            <NavItem 
            label="Developers" 
            dropdown
            href="/developers#home"
            items={[
              { label: "Features", href: "/developers#features" },
              { label: "Demo", href: "/developers#demo" },
              { label: "Guidance", href: "/developers#guidance" },
              { label: "Documentation", href: "/docs" },
            ]} />
            <NavItem label="Docs" href="/docs/getting-started" />
            <NavItem label="Changelog" href="/changelog" />
            <NavItem label="Donate" href="https://buymeacoffee.com/votanbinh" target="_blank" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5 pr-3">
          <button
            onClick={() =>
              window.open(
                "https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="text-white/70 hover:text-white transition"
          >
            <Github size={20} />
          </button>
          <a
            href="/"
            className="relative px-4 py-2 rounded-xl text-sm font-medium
              bg-[#0b1225]/80 border border-blue-400/20
              text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]
              transition flex items-center gap-2"
          >
            <MessageSquare size={16} />
            Chat
          </a>

          {user && (
            <img
              src={avatarUrl}
              alt="User avatar"
              className="w-9 h-9 rounded-full border border-white/20 cursor-pointer hover:ring-2 hover:ring-indigo-400/40 transition"
              onClick={goToAccount}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
function NavItem({
  label,
  href,
  target,
  dropdown,
  items = [],
}: {
  label: string;
  href?: string;
  target?:string;
  dropdown?: boolean;
  items?: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (closeTimeout.current) clearTimeout(closeTimeout.current);
        setOpen(true);
      }}
      onMouseLeave={() => { 
        closeTimeout.current = setTimeout(()=> setOpen(false), 80)
      }}
    >
      <Link
        to={href ?? "#"}
        target={target ?? ""}
        className={`flex items-center gap-1 font-bold transition
          ${open ? "text-indigo-400" : "text-white/70 hover:text-indigo-400"}`}
      >
        {label}
        {dropdown && (
          <motion.span
          animate={{rotate: open ? 180 : 0}}
          transition={{duration: 0.2, easeOut}}
          className="flex items-center">
            <ChevronDown size={14} />
          </motion.span>
        )}
      </Link>

      {dropdown && (
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full mt-4 w-44 rounded-xl bg-[#0b1225]/95 border border-blue-400/20 overflow-hidden"
            >
              {items.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={()=>setOpen(false)}
                  className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
