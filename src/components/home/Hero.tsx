"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { homeContent } from "@/content/home";

export default function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative w-full !max-w-none !m-0 min-h-[60vh] lg:min-h-[70vh] pt-24 lg:pt-32 pb-20 lg:pb-32 overflow-hidden bg-primary-dark">
      {/* Minimalistic Background */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 z-0 pointer-events-none"></div>

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 w-full pt-0 pb-0">
        {/* Split Content Section */}
        <div className="flex flex-col xl:flex-row items-center gap-8 xl:gap-16 w-full">
          
          {/* Left Column (Text & Buttons) */}
          <div className="xl:w-1/2 flex flex-col items-center xl:items-start text-center xl:text-left w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white border border-white/20 text-sm font-semibold tracking-wide uppercase mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
              Designed & Engineered in India
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white leading-tight mb-6 w-full"
            >
              {hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-200 mb-0 leading-relaxed w-full"
            >
              {hero.subheadline}
            </motion.p>
            

          </div>

          {/* Right Column (Video) */}
          <div className="xl:w-1/2 w-full mt-12 xl:mt-0 flex justify-center items-center">
            <div className="relative w-[90%] sm:w-[80%] lg:w-full max-w-[600px]">
              {/* Strong halation glow behind the video */}
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/40 via-blue-400/30 to-cyan-500/40 rounded-[3.5rem] blur-[50px] opacity-80 mix-blend-screen pointer-events-none"></div>
              <div className="absolute -inset-2 bg-blue-500/20 rounded-[3rem] blur-xl opacity-50 pointer-events-none"></div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="w-full rounded-[2.5rem] overflow-hidden relative bg-black aspect-video shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
              >
                <video 
                  src="/dpdp_v1.mp4" 
                  autoPlay 
                  loop
                  muted
                  controls 
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            </div>
          </div>
        </div>

        </div>
      </section>
    );
  }
