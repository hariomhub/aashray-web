"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";

export default function AboutHero() {
  const { hero } = aboutContent;

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-primary-dark">
      {/* Minimalistic Background */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 z-0 pointer-events-none"></div>

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-8"
        >
          {hero.mission}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-4xl mx-auto"
        >
          {hero.description}
        </motion.p>
      </div>
    </section>
  );
}
