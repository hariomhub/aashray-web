"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/content/home";
import { useState, useEffect } from "react";

export default function OurApproach() {
  const { ourApproach } = homeContent;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % ourApproach.steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [ourApproach.steps.length]);

  return (
    <section className="py-12 bg-white relative">
      <div className="w-full max-w-none mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="text-center max-w-5xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            {ourApproach.heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl text-gray-800 max-w-full font-medium"
          >
            {ourApproach.description}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-primary/20 hidden xl:block"></div>
              {ourApproach.steps.map((step, index) => (
                <div key={step.title} className="relative xl:pl-16 pb-12 last:pb-0 flex flex-col items-center xl:items-start text-center xl:text-left">
                  <div className="relative xl:absolute xl:left-2 xl:top-0 w-12 h-12 mb-4 xl:mb-0 xl:w-8 xl:h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl xl:text-lg shadow-lg shrink-0">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700 leading-relaxed text-xl font-medium">{step.description}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-gray-200 text-center xl:text-left">
              <p className="text-xl font-medium text-primary italic">
                {ourApproach.footer}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden shadow-2xl flex items-end justify-center aspect-video lg:h-[450px] bg-slate-50 border border-gray-100 p-6 lg:p-10"
          >
            {/* Ambient Halation Background */}
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary rounded-full blur-[100px] pointer-events-none"
            />

            <div className="w-full h-full flex items-end justify-center relative z-10">
              {ourApproach.steps.map((step, index) => (
                <div key={step.title} className="flex-1 flex flex-col items-center justify-end group h-full relative"
                     onMouseEnter={() => setActiveStep(index)}>
                  
                  {/* Step Title above the bar */}
                  <div className="absolute w-full flex justify-center z-20" style={{ bottom: `${30 + (index * 20)}%`, marginBottom: '2.5rem' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                      className="text-center"
                    >
                      <div className={`font-bold md:text-lg transition-colors duration-300 ${activeStep === index ? 'text-accent' : 'text-gray-900'}`}>{step.title}</div>
                    </motion.div>
                  </div>

                  {/* Rising Step Block */}
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${30 + (index * 20)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.3, ease: "easeOut" }}
                    className={`w-full relative border-r border-primary/20 transition-all duration-500 ${index === 0 ? 'rounded-tl-xl' : ''} ${index === ourApproach.steps.length - 1 ? 'rounded-tr-xl border-r-0' : ''} ${activeStep === index ? 'bg-primary/20 border-t-4 border-accent' : 'bg-primary/5 border-t-4 border-primary'}`}
                  >
                    {/* Halation / Glow effect on the active border */}
                    <motion.div 
                      animate={{ opacity: activeStep === index ? [0.4, 0.8, 0.4] : 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 left-0 right-0 h-4 bg-accent blur-[8px]"
                    />
                    
                    {/* Number Node with Halation */}
                    <div 
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-bold z-10 border-2 transition-all duration-500 ${activeStep === index ? 'bg-accent text-white border-white shadow-[0_0_20px_rgba(212,175,55,0.7)] scale-110' : 'bg-primary text-white border-white/50 scale-100'}`}
                    >
                      {index + 1}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
