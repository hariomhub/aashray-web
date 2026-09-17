"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "Aashray Infotech completely transformed how we approach DPDP compliance. Having everything on-premise gives us the peace of mind we needed.",
    name: "Rajesh Kumar",
    title: "CISO",
    company: "FinServe India"
  },
  {
    quote: "The automated asset onboarding and data discovery tools saved our team hundreds of hours of manual work. Highly recommended.",
    name: "Priya Sharma",
    title: "Data Privacy Officer",
    company: "GovTech Solutions"
  },
  {
    quote: "Unlike other consultants, they delivered a platform that our entire team actually uses. The LMS is a game changer for capability building.",
    name: "Amit Patel",
    title: "VP Engineering",
    company: "RetailNet Edge"
  },
  {
    quote: "Secure, fast, and extremely cost-effective. We couldn't ask for a better partner in our DPDP compliance journey.",
    name: "Sneha Reddy",
    title: "Chief Compliance Officer",
    company: "Mfg Nexus"
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
  };

  return (
    <section className="py-24 lg:py-16 relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-neutral-text dark:text-white mb-6"
          >
            Trusted by the best
          </motion.h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 z-10">
            <button 
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 z-10">
            <button 
              onClick={next}
              className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-primary dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="overflow-hidden px-4 py-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-950 rounded-2xl p-8 md:p-12 shadow-sm border border-border-light dark:border-gray-800 flex flex-col items-center text-center"
              >
                <Quote className="w-12 h-12 text-accent/50 mb-6" />
                <p className="text-xl md:text-2xl text-neutral-text dark:text-gray-200 font-medium mb-16 leading-relaxed">
                  "{testimonials[currentIndex].quote}"
                </p>
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-white/10 flex items-center justify-center text-primary dark:text-white font-bold text-xl mb-3">
                    {testimonials[currentIndex].name.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-neutral-text dark:text-white">{testimonials[currentIndex].name}</h4>
                  <p className="text-sm text-text-secondary dark:text-gray-400">
                    {testimonials[currentIndex].title} &mdash; <span className="font-medium text-primary dark:text-primary">{testimonials[currentIndex].company}</span>
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-2 mt-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  idx === currentIndex ? "bg-primary dark:bg-white" : "bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
