"use client";

import { homeContent } from "@/content/home";
import { motion } from "framer-motion";

export default function TrustBand() {
  const { trustedBy } = homeContent;

  return (
    <section className="py-6 border-b border-gray-100 dark:border-gray-800 bg-transparent overflow-hidden">
      <div className="w-full px-0">
        
        <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
          {trustedBy.heading}
        </p>

        <div className="w-full overflow-hidden flex py-4 relative">
          <motion.div 
            className="flex items-center min-w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {/* 4 Copies for ultra-wide seamless looping */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex opacity-70 hover:opacity-100 transition-opacity duration-300 items-center shrink-0 pr-16">
                <img 
                  src="/client_logos.jpg" 
                  alt="Trusted by leading organizations" 
                  className="h-28 md:h-40 w-auto object-contain grayscale brightness-110 contrast-125 dark:brightness-[2] dark:contrast-[3] mix-blend-multiply dark:mix-blend-screen dark:invert opacity-80"
                />
              </div>
            ))}
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
