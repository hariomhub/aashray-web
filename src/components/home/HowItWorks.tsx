"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeContent } from "@/content/home";

export default function HowItWorks() {
  const { howItWorks } = homeContent;
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold mb-4"
          >
            {howItWorks.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 font-medium"
          >
            {howItWorks.subheading}
          </motion.p>
        </div>

        <div className="mt-24 rounded-2xl p-8 lg:p-12 relative overflow-hidden max-w-5xl mx-auto">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-[120px] pointer-events-none"
          />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-16 md:gap-4 relative z-10 mb-16">
            {/* Global Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute h-[2px] bg-white/20 top-7 left-[15%] right-[15%] z-0"></div>
            
            {/* Active Line */}
            <div 
              className="hidden md:block absolute h-[2px] bg-accent top-7 left-[15%] z-0 transition-all duration-500 shadow-[0_0_12px_rgba(212,175,55,0.9)]"
              style={{ width: `${(activeStep / (howItWorks.timeline.length - 1)) * 70}%` }}
            >
              <div className="absolute inset-0 bg-accent blur-[4px] opacity-60"></div>
            </div>

            {howItWorks.timeline.map((step, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-4 w-full cursor-pointer group relative z-10"
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
              >
                {/* Mobile Connecting Line */}
                {idx < howItWorks.timeline.length - 1 && (
                  <div className="md:hidden absolute w-[2px] bg-white/20 top-7 h-[calc(100%+4rem)] left-1/2 -translate-x-1/2 -z-10"></div>
                )}
                {/* Mobile Active Line */}
                {idx < howItWorks.timeline.length - 1 && activeStep > idx && (
                  <div className="md:hidden absolute w-[2px] bg-accent top-7 h-[calc(100%+4rem)] left-1/2 -translate-x-1/2 -z-10 shadow-[0_0_12px_rgba(212,175,55,0.9)]">
                    <div className="absolute inset-0 bg-accent blur-[4px] opacity-60"></div>
                  </div>
                )}
                <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold z-10 relative text-xl transition-all duration-300 ${
                  activeStep >= idx 
                    ? "bg-accent border-accent text-primary-dark shadow-[0_0_15px_rgba(212,175,55,0.6)]" 
                    : "bg-primary-dark border-white/30 text-white group-hover:border-accent/50 group-hover:shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                } ${activeStep === idx ? "scale-110 shadow-[0_0_25px_rgba(212,175,55,1)]" : "scale-100"}`}>
                  {idx + 1}
                </div>
                <span className={`text-lg font-bold text-center transition-colors duration-300 ${
                  activeStep === idx ? "text-accent" : "text-white"
                }`}>{step.title}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center max-w-2xl w-full"
              >
                <p className="text-white leading-relaxed text-xl font-medium">
                  {howItWorks.timeline[activeStep].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
