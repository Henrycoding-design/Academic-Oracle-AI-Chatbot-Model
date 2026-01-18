// src/layout/PageLayout.tsx
import React from "react";
import Navbar from "@/src/pages/ui/Navbar";
import Footer from "@/src/pages/ui/Footer";
import ScrollToHash from "./ScrollToHash";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#05070d] via-[#070b16] to-black text-white">
      <Navbar />
      <ScrollToHash />
      {children}
      <Footer />
    </main>
  );
}
