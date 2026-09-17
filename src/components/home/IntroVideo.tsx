"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function IntroVideo() {
  return (
    <section className="py-20 bg-neutral-bg dark:bg-gray-950 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-neutral-text dark:text-white mb-4"
          >
            Meet Aashray
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-secondary dark:text-gray-300"
          >
            Watch our quick introduction to see how we simplify DPDP compliance.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 bg-black group flex items-center justify-center"
        >
          {/* Aashray Intro Video */}
          <video 
            className="absolute inset-0 w-full h-full object-cover z-10"
            controls
            playsInline
            preload="metadata"
            poster="/circuit-pattern.svg" // Fallback poster
          >
            <source src="/aashray-intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <div className="absolute inset-0 bg-primary/20 pointer-events-none z-0"></div>
        </motion.div>

      </div>
    </section>
  );
}
