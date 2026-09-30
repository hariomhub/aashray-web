"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";

export default function AboutParagraphs() {
  const { hero } = aboutContent;

  return (
    <section className="w-full pb-16 px-2 lg:px-4 relative z-10 max-w-full mx-auto bg-neutral-bg dark:bg-gray-950">
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
    </section>
  );
}
