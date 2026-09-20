"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";

export default function AboutHero() {
  const { hero } = aboutContent;

    <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden bg-primary-dark">
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 z-0 pointer-events-none"></div>
      
      {/* Hero Header */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 text-center mb-16 lg:mb-24">
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
          className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto font-light"
        >
          {hero.paragraphs[0]}
        </motion.p>
      </div>

      {/* Paragraph Boxes Grid (Pushed to the end) */}
      <div className="w-full px-2 lg:px-4 relative z-10 max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 lg:gap-4 items-stretch">
          {hero.paragraphs.slice(1).map((p, idx) => {
            const isAlternate = idx % 2 === 0;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`p-5 xl:p-8 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] border relative overflow-hidden flex flex-col justify-start transform transition-all duration-300 hover:-translate-y-2 ${
                  isAlternate 
                    ? "bg-primary border-primary-light/20 text-white" 
                    : "bg-white dark:bg-gray-900 border-primary-light/10 text-gray-700 dark:text-gray-300"
                }`}
              >
                {/* Subtle inner accent */}
                <div className={`absolute top-0 left-0 w-full h-1 ${isAlternate ? 'bg-white/30' : 'bg-primary/50'}`}></div>
                
                <p className="text-sm md:text-base xl:text-lg leading-relaxed font-light">
                  {p}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
}
