import React, { useEffect, useState , useRef} from "react";
import { ChevronDown, Github, MessageSquare, Rocket, Menu, X } from "lucide-react";
import { motion, AnimatePresence, easeOut } from "framer-motion";
import { supabase } from "../../services/supabaseClient";
import {Link} from "react-router-dom";
import { useClickOutside } from "../../services/useClickOutside";

export default function Navbar() {
  const [session, setSession] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside([mobileMenuButtonRef, mobileMenuRef], () => setIsMobileMenuOpen(false), isMobileMenuOpen);

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
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#050814]/60 border-b border-blue-500/10 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex items-center justify-between gap-4">

        {/* LEFT */}
        <div className="flex min-w-0 items-center gap-4 md:gap-10">
          <a href="/home" className="flex min-w-0 items-center gap-3 font-bold text-base sm:text-lg">
            <div className="w-8 h-8 rounded-lg bg-[#0b1225]/80 border border-blue-400/20 flex items-center justify-center">
              <img src="/icon.png" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="truncate">Academic Oracle</span>
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
                { label: "Privacy Policy", href: "/policy#home"},
                { label: "Terms & Policies", href: "/terms#home"},
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
            <NavItem label="Support" href="https://buymeacoffee.com/votanbinh" target="_blank" />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3 sm:gap-5 sm:pr-3">
          <button
            onClick={() =>
              window.open(
                "https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="hidden text-white/70 transition hover:text-white sm:block"
          >
            <Github size={20} />
          </button>
          <button
            onClick={() =>
              window.open(
                "https://www.producthunt.com/products/academic-oracle/launches/academic-oracle-v2-0",
                "_blank",
                "noopener,noreferrer"
              )
            }
            className="hidden text-[#ff6154] transition hover:text-[#f4857b] sm:block"
          >
            <Rocket size={20} />
          </button>
          <a
            href="/"
            className="relative hidden rounded-xl px-4 py-2 text-sm font-medium
              bg-[#0b1225]/80 border border-blue-400/20
              text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.35)]
              transition md:flex items-center gap-2"
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

          <button
            ref={mobileMenuButtonRef}
            type="button"
            aria-label="Toggle navigation menu"
            className="rounded-xl border border-blue-400/20 bg-[#0b1225]/80 p-2 text-white/80 transition hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className="border-t border-blue-400/10 bg-[#050814]/95 px-4 py-4 backdrop-blur-md md:hidden"
          >
            <div className="flex flex-col gap-2 rounded-2xl border border-blue-400/10 bg-[#0b1225]/70 p-3">
              <MobileLink href="/products#home" label="Product" onNavigate={() => setIsMobileMenuOpen(false)} />
              <MobileLink href="/developers#home" label="Developers" onNavigate={() => setIsMobileMenuOpen(false)} />
              <MobileLink href="/docs/getting-started" label="Docs" onNavigate={() => setIsMobileMenuOpen(false)} />
              <MobileLink href="/changelog" label="Changelog" onNavigate={() => setIsMobileMenuOpen(false)} />
              <MobileLink href="https://buymeacoffee.com/votanbinh" label="Support" target="_blank" onNavigate={() => setIsMobileMenuOpen(false)} />
              <MobileLink href="/" label="Chat" onNavigate={() => setIsMobileMenuOpen(false)} />
              <div className="mt-2 flex items-center gap-3 border-t border-white/5 pt-3">
                <button
                  onClick={() =>
                    window.open(
                      "https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="rounded-lg p-2 text-white/70 transition hover:bg-white/5 hover:text-white"
                >
                  <Github size={18} />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.producthunt.com/products/academic-oracle/launches/academic-oracle-v2-0",
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                  className="rounded-lg p-2 text-[#ff6154] transition hover:bg-white/5 hover:text-[#f4857b]"
                >
                  <Rocket size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function MobileLink({
  href,
  label,
  target,
  onNavigate,
}: {
  href: string;
  label: string;
  target?: string;
  onNavigate: () => void;
}) {
  const sharedClassName = "block rounded-xl px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white";

  if (target) {
    return (
      <a
        href={href}
        target={target}
        rel="noreferrer"
        className={sharedClassName}
        onClick={onNavigate}
      >
        {label}
      </a>
    );
  }

  return (
    <Link to={href} className={sharedClassName} onClick={onNavigate}>
      {label}
    </Link>
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
          transition={{duration: 0.2, ease: easeOut}}
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
