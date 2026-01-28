// src/pages/home/HeroSection.tsx
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect , useState } from "react";
import { Brain, Sparkles, Shield, Globe } from "lucide-react";

const ICONS = [Brain, Sparkles, Shield, Globe];
const ICON_SIZE = 80; // icon + gap
const ROW_HEIGHT = 72;

function useViewport() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}

export default function HeroSection() {
  const mouseX = useMotionValue(0);
  const { width, height } = useViewport();

  useEffect(() => {
    const handleMove = (e: MouseEvent) => mouseX.set(e.clientX);
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX]);

  const iconsPerRow = Math.max(6, Math.floor(width / ICON_SIZE));
  const rowCount = Math.max(3, Math.floor(height / ROW_HEIGHT) - 2);

  return (
    <section className="relative min-h-[520px] w-full flex items-center justify-center overflow-hidden pt-10">
      {/* Glass content */}
      <div className="z-10 text-center px-12 py-10 rounded-3xl backdrop-blur-xl bg-[#0b1020]/60 border border-blue-500/10">
        <h1 className="text-5xl font-bold text-white">
          The Future of{" "}
          <span className="text-blue-400 drop-shadow-glow">Learning</span>
        </h1>
        <p className="mt-4 text-white/70">
          Intelligence. Motion. Precision.
        </p>
      </div>

      {/* Auto-sized icon field */}
      <div className="absolute inset-0 flex flex-col justify-center gap-6 pointer-events-none">
        {Array.from({ length: rowCount }).map((_, i) => (
          <IconRow
            // key={i}
            icons={ICONS}
            count={iconsPerRow}
            direction={i % 2 === 0 ? 1 : -1}
            mouseX={mouseX}
            width={width}
          />
        ))}
      </div>
    </section>
  );
}

function IconRow({
  icons,
  count,
  direction,
  mouseX,
  width,
}: {
  icons: any[];
  count: number;
  direction: 1 | -1;
  mouseX: any;
  width: number;
}) {
  const motionX = useTransform(
    mouseX,
    [0, width],
    direction === 1 ? [-40, 40] : [40, -40]
  );

  return (
    <motion.div
      style={{ x: motionX }}
      className="flex justify-center gap-8 opacity-40"
    >
      {Array.from({ length: count }).map((_, i) => {
        const Icon = icons[i % icons.length];
        return (
          <div
            key={`${Icon.name}-${i}`}
            className="w-12 h-12 flex items-center justify-center rounded-xl
              bg-[#0a1225]/60 backdrop-blur-sm border border-blue-400/10"
            style={{ transform: `rotate(${i % 2 === 0 ? 6 : -6}deg)` }}
          >
            <Icon size={20} className="text-blue-200/70" />
          </div>
        );
      })}
    </motion.div>
  );
}