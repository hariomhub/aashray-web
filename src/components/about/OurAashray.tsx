"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";

export default function OurAashray() {
  const { closing } = aboutContent as any;

  if (!closing) return null;

  return (
    <section className="py-12 bg-primary relative overflow-hidden">
      {/* Subtle Background Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10 z-0 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 text-center max-w-5xl mx-auto relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-sans font-extrabold text-white mb-10 tracking-tight"
        >
          {closing.heading}
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-8 items-center"
        >
          {closing.paragraphs.map((p: string, idx: number) => (
            <p 
              key={idx} 
              className={`text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-4xl ${
                idx === 1 
                  ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 my-4' 
                  : 'font-light text-blue-100'
              }`}
            >
              {p}
            </p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
