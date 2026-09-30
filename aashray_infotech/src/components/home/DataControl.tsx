"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { homeContent } from "@/content/home";

export default function DataControl() {
  const { hero } = homeContent;

  return (
    <section className="relative w-full !max-w-none !m-0 bg-[radial-gradient(ellipse_at_top,rgba(90,130,255,0.08),rgba(150,120,255,0.05),transparent_70%)] dark:bg-gray-950 pb-12 md:pb-16 pt-8">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary-dark/95 border border-primary/20 p-10 md:p-12 lg:p-16 rounded-[2rem] backdrop-blur-md w-full relative overflow-hidden group shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-700"></div>
          
          <div className="flex flex-col xl:flex-row items-center gap-16 md:gap-24 relative z-10">
            <div className="p-6 md:p-8 bg-accent/20 rounded-3xl shrink-0 self-center xl:self-start shadow-[0_0_40px_rgba(165,145,108,0.25)] border border-accent/20">
              <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-accent" />
            </div>
            <div className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left w-full">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 mb-6 leading-tight tracking-tight">
                {hero.dataControlStatement}
              </h3>
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-4xl font-medium">
                We know handing over your data feels risky, so we don&apos;t ask you to. Everything stays inside your own environment and under your control.
              </p>
              <div className="mt-12 md:mt-16">
                <span className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 text-white rounded-xl font-bold border border-white/20 text-base md:text-lg tracking-wider uppercase shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse"></div>
                  0 bytes leave your network
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
