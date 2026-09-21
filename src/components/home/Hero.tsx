"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { homeContent } from "@/content/home";

export default function Hero() {
  const { hero } = homeContent;

  return (
    <section className="relative w-full !max-w-none !m-0 min-h-[60vh] lg:min-h-[70vh] pt-28 overflow-hidden bg-primary-dark">
      {/* Minimalistic Background */}
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 z-0 pointer-events-none"></div>

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 w-full pt-4 pb-12 md:pb-20 md:pt-8">
        {/* Split Content Section */}
        <div className="flex flex-col xl:flex-row items-center gap-12 xl:gap-20 w-full mb-20">
          
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
              className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white leading-tight mb-8 w-full"
            >
              {hero.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl md:text-3xl text-gray-200 mb-12 leading-relaxed w-full"
            >
              {hero.subheadline}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center xl:justify-start"
            >
              <Link
                href="/book-a-demo"
                className="inline-flex items-center justify-center gap-3 bg-primary text-white px-10 h-[64px] text-lg rounded-xl font-bold hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] w-full sm:w-auto"
              >
                {hero.primaryCTA}
                <ArrowRight className="w-6 h-6" />
              </Link>
              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center bg-transparent text-white border-2 border-primary px-10 h-[64px] text-lg rounded-xl font-bold hover:bg-primary/10 transition-all w-full sm:w-auto"
              >
                {hero.secondaryCTA}
              </a>
            </motion.div>
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
                  playsInline 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                />
              </motion.div>
            </div>
          </div>
        </div>

          {/* Data Control Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 bg-white/5 border border-white/10 p-10 md:p-12 lg:p-16 rounded-[2rem] backdrop-blur-md w-full relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-accent/20 transition-colors duration-700"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/30 transition-colors duration-700"></div>
            
            <div className="flex flex-col xl:flex-row items-center gap-16 md:gap-24 relative z-10">
              <div className="p-6 md:p-8 bg-accent/20 rounded-3xl shrink-0 self-center xl:self-start shadow-[0_0_40px_rgba(165,145,108,0.25)] border border-accent/20">
                <ShieldCheck className="w-16 h-16 md:w-20 md:h-20 text-accent" />
              </div>
              <div className="flex-1 flex flex-col items-center xl:items-start text-center xl:text-left w-full">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-gray-400 mb-6 leading-tight tracking-tight">
                  {hero.dataControlStatement}
                </h3>
                <p className="text-2xl md:text-3xl text-gray-200 leading-relaxed max-w-4xl font-medium">
                  We know handing over your data feels risky, so we don&apos;t ask you to. Everything stays inside your own environment and under your control.
                </p>
                <div className="mt-16">
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
