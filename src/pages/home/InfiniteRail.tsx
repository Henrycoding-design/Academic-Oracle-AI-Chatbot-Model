import { motion } from "framer-motion";

const TOOLS = [
  "Supabase",
  "Gemini-3-Flash",
  "Gemini-2.5-Flash",
  "Gemini-2.5-Pro",
  "TypeScript",
  "Vite",
  "Tailwind CSS",
  "Framer Motion",
  "Lucide",
];

export default function InfiniteRail() {
  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* soft navy fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#05070d] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#05070d] to-transparent z-10" />

      <motion.div
        className="flex w-max gap-6 px-6 pointer-events-none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 35,
          ease: "linear",
        }}
      >
        {/* duplicate list for seamless loop */}
        {[...TOOLS, ...TOOLS].map((tool,_) => (
          <RailItem label={tool} />
        ))}
      </motion.div>
    </div>
  );
}

function RailItem({ label }: { label: string }) {
  return (
    <div
      className="
        px-6 py-3
        rounded-xl
        bg-[#0b1225]/70
        backdrop-blur
        border border-blue-400/15
        text-sm font-medium
        text-blue-200/90
        whitespace-nowrap
        shadow-[0_0_18px_rgba(59,130,246,0.12)]
        hover:shadow-[0_0_28px_rgba(59,130,246,0.35)]
        transition
      "
    >
      {label}
    </div>
  );
}
