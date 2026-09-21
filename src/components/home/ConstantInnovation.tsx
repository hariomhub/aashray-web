"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/content/home";
import { Lightbulb } from "lucide-react";

export default function ConstantInnovation() {
  const { constantInnovation } = homeContent;

  return (
    <section className="py-24 bg-blue-50 dark:bg-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative group">
        {/* Halation glow effect similar to the Hero video - visible only on hover */}
        <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/40 via-blue-400/30 to-cyan-500/40 rounded-[3.5rem] blur-[60px] opacity-0 group-hover:opacity-80 transition-opacity duration-700 pointer-events-none dark:mix-blend-screen"></div>
        <div className="absolute -inset-2 bg-blue-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-primary dark:bg-primary-dark border border-white/10 rounded-3xl shadow-2xl p-10 lg:p-16 relative overflow-hidden z-10"
        >
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-16">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-16">
              {constantInnovation.heading}
            </h2>
            
            <div className="space-y-6 mb-20">
              {constantInnovation.paragraphs.map((para, index) => (
                <p key={index} className="text-[1.65rem] lg:text-[1.8rem] text-gray-200 leading-relaxed font-medium text-center xl:text-justify tracking-tight">
                  {para}
                </p>
              ))}
            </div>
            
            <div className="pt-8 border-t border-white/20 w-full">
              <p className="text-xl font-bold text-accent italic">
                {constantInnovation.attribution}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
