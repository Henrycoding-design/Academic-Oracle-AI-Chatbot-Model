// src/pages/home/Home.tsx
import HeroSection from "./HeroSection";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";
import InfiniteRail from "./InfiniteRail";
import FeatureGrid from "../ui/FeatureCard";
import ArcadeDemov2_3 from "@/src/components/ArcadeProductDemov2.3";
import { Mail, Github, MessageSquare} from "lucide-react";
import {motion , useReducedMotion, Variants} from "framer-motion";

// important!!
import PageLayout from "@/src/layout/PageLayout";

export default function Home() {
  const shouldReduce = useReducedMotion();
  const reveal : Variants = {
    hidden: { opacity: 0, y: shouldReduce? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <PageLayout>
    <main className="min-h-screen w-full overflow-hidden text-white bg-gradient-to-b from-[#05070d] via-[#070b16] to-black">
      <HeroSection />
      <InfiniteRail />
      <div className="h-20" />
      <section className="px-6 pb-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Track how learning evolves
          </h2>
          <p className="mt-3 text-white/60">
            The new dashboard, structured Oracle Memory, adaptive quiz loop, and session summary flow now work together as one guided learning system.
          </p>
        </div>
      </section>
      <FeatureGrid />
      {/* <section className="mt-16 px-4 sm:px-6 md:px-8 pb-3 sm:pb-5"> */}
      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-16 px-4 sm:px-6 md:px-8 pb-3 sm:pb-5"
        >
        <h2
            className="
            mb-8
            text-center
            font-bold
            tracking-tight
            text-2xl
            sm:text-3xl
            lg:text-4xl
            transition-all
            duration-300
            ease-out
            hover:text-blue-400
            motion-safe:hover:tracking-wide
            hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.45)]
            hover:cursor-default
            hover:-translate-y-[1px]
            "
        >
            Demo with Academic Oracle
        </h2>

        <div className="mx-auto max-w-5xl rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.15)]">
            <ArcadeDemov2_3 />
        </div>
      </motion.section>

      {/* Open Source Section */}
      <motion.section
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="mt-24 px-4 sm:px-6 md:px-8 text-center py-18 sm:py-24"
      >
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Open core, protected identity
        </h2>

        <p className="mt-3 text-white/60 max-w-xl mx-auto">
          Core components are licensed under <strong>Apache-2.0</strong>. 
          Specific files, branding, and core identity remain protected under 
          reserved-rights notices.
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/Henrycoding-design/Academic-Oracle-AI-Chatbot-Model"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-2xl
              text-sm font-bold
              bg-[#0b1225]/80
              border border-blue-400/20
              text-white
              hover:bg-[#0b1225]
              hover:border-blue-400/40
              hover:text-blue-300
              hover:-translate-y-1
              shadow-lg shadow-blue-500/10
              transition-all duration-300
            "
          >
            <Github size={20} />
            View on GitHub
          </a>
          <a
            href="/terms"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-2xl
              text-sm font-bold
              bg-white/5
              border border-white/10
              text-white
              hover:bg-white/10
              hover:border-white/20
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            View license terms
          </a>
        </div>
      </motion.section>

      {/* Spacer */}
      <div className="h-20" />

      {/* Start Journey Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 1.5 }}
        className="px-4 sm:px-6 md:px-8 text-center my-15 sm:my-24"
      >
        <motion.h2 variants={reveal} className="text-2xl sm:text-3xl font-bold tracking-tight">
          Start your learning journey
        </motion.h2>

        <motion.p
          variants={reveal}
          transition={{ delay: 0.1 }}
          className="mt-3 text-white/60 max-w-xl mx-auto"
        >
          Explore ideas, ask questions, and build knowledge with Academic Oracle.
        </motion.p>

        <motion.div
          variants={reveal}
          transition={{ delay: 0.2 }}
          className="mt-10 flex justify-center gap-4 flex-wrap"
        >
          {/* Chat Button */}
          <a
            href="/"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-2xl
              text-sm font-bold
              bg-blue-600
              text-white
              hover:bg-blue-500
              hover:-translate-y-1
              shadow-lg shadow-blue-500/25
              transition-all duration-300
            "
          >
            <MessageSquare size={20} />
            Start Chatting
          </a>

          {/* Contact Button */}
          <a
            href="mailto:tanbinvo.hcm@gmail.com"
            className="
              inline-flex items-center gap-2
              px-8 py-4 rounded-2xl
              text-sm font-bold
              bg-white/5
              border border-white/10
              text-white
              hover:bg-white/10
              hover:border-white/20
              hover:-translate-y-1
              transition-all duration-300
            "
          >
            <Mail size={20} />
            Contact
          </a>
        </motion.div>
      </motion.section>
    </main>
    </PageLayout>
  );
}
