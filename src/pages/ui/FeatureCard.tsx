import React, { useRef } from "react";
import { motion, useMotionValue , useMotionTemplate , useSpring } from "framer-motion";
import { Brain, Globe, Shield, Sparkles, Database } from "lucide-react";

const FEATURES = [
  { id: 1, icon: Brain, title: "AI Core", span: "md:col-span-2" },
  { id: 2, icon: Database, title: "Data Layer" },
  { id: 3, icon: Globe, title: "Platform" },
  { id: 4, icon: Shield, title: "Security" },
  { id: 5, icon: Sparkles, title: "Experience", span: "md:col-span-2" },
  { id: 6, icon: Globe, title: "Platform" },
];

export default function FeatureGrid() {
  return (
    <section className="px-6 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-5"
>
          {FEATURES.map((f) => (
            <FeatureCard {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeatureCard({ icon: Icon, title, span }: { icon: any; title: string; span?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // 1. Initialize Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const x = mouseX;
  const y = mouseY;

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (!inside) {
        opacity.set(0);
        return;
    }
    const clamp = (v: number, min: number, max: number) =>
        Math.max(min, Math.min(v, max));

    opacity.set(1);
    mouseX.set(clamp(e.clientX - rect.left, 0, rect.width));
    mouseY.set(clamp(e.clientY - rect.top, 0, rect.height));
  }


  // 3. Update template to use spring values
  const spotlight = useMotionTemplate`radial-gradient(
    300px circle at ${x}px ${y}px, 
    rgba(59, 130, 246, 0.25), 
    transparent 80%
  )`;

  return (
    <motion.a
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={(e) => handleMouseMove(e)} // Fade In
      onMouseLeave={() => opacity.set(0)} // Fade Out
      className={`
        relative overflow-hidden rounded-2xl
        bg-[#0b1225]/70 backdrop-blur
        border border-white/10
        group transition-colors duration-1000 hover:border-blue-500/30
        hover:scale-[1.01]
        ${span ?? ""}
      `}
    >
      {/* 4. The Spotlight Layer */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: spotlight,
          opacity: opacity, // Applied opacity animation
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex flex-col items-start justify-end p-8">
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon size={24} className="text-blue-400" />
        </div>
        <div className="text-xl font-medium tracking-tight text-white/90">{title}</div>
      </div>
    </motion.a>
  );
}
