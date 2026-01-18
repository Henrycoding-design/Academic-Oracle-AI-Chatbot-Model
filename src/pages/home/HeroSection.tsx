// src/pages/home/HeroSection.tsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import { Brain, Sparkles, Shield, Globe } from "lucide-react";

const ICONS = [Brain, Sparkles, Shield, Globe];

export default function HeroSection() {
  const mouseX = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX]);

  const row1X = useTransform(mouseX, [0, window.innerWidth], [-60, 60]);
  const row2X = useTransform(mouseX, [0, window.innerWidth], [50, -50]);
  const row3X = useTransform(mouseX, [0, window.innerWidth], [-40, 40]);
  const row4X = useTransform(mouseX, [0, window.innerWidth], [40, -40]);
  const row5X = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const row6X = useTransform(mouseX, [0, window.innerWidth], [20, -20]);

  return (
    <section className="relative min-h-[500px] md:min-h-[580px] w-full
  flex items-center justify-center
  overflow-hidden pb-0 mb-0 pt-10
  bg-[radial-gradient(ellipse_at_center,rgba(30,58,138,0.12),transparent_65%)]"> {/*This is taking up too much vertical space*/}

      {/* ✨ Glass text container */}
      <div className="
        z-10 text-center
        px-12 py-10
        rounded-3xl
        backdrop-blur-xl
        bg-[#0b1020]/60
  border border-blue-500/10
  shadow-[0_0_40px_rgba(59,130,246,0.12)]
      ">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          The Future of <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">Learning</span>
        </h1>
        <p className="mt-4 text-white/70 max-w-2xl mx-auto">
          Intelligence. Motion. Precision.
        </p>
      </div>

      {/* 🌌 Parallax icon fields */}
      <div className="absolute inset-0 flex flex-col justify-center gap-8 pointer-events-none select-none [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"> {/*This is taking up too much vertical space*/}
        <IconRow icons={ICONS} motionX={row1X} />
        <IconRow icons={ICONS} motionX={row2X} />
        <IconRow icons={ICONS} motionX={row3X} />
        <IconRow icons={ICONS} motionX={row4X} />
        <IconRow icons={ICONS} motionX={row5X} />
        <IconRow icons={ICONS} motionX={row6X} />
      </div>
    </section>
  );
}

function IconRow({
  icons,
  motionX,
}: {
  icons: any[];
  motionX: any;
}) {
  return (
    <motion.div
      style={{ x: motionX }}
      className="flex justify-center gap-8 opacity-40"
    >
      {Array.from({ length: 16 }).map((_, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div
            key={i}
            className="
              w-12 h-12
              flex items-center justify-center
              rounded-xl
             bg-[#0a1225]/60
                backdrop-blur-sm
                border border-blue-400/10
                shadow-[0_0_12px_rgba(59,130,246,0.08)]
            "
            style={{
              transform: `rotate(${(i % 2 === 0 ? 1 : -1) * 6}deg)`,
            }}
          >
            <Icon size={20} className="text-blue-200/70" />
          </div>
        );
      })}
    </motion.div>
  );
}
