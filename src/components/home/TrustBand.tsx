"use client";

import { homeContent } from "@/content/home";
import { motion } from "framer-motion";

export default function TrustBand() {
  const { trustedBy } = homeContent;

  return (
    <section className="py-2 md:py-6 border-b border-gray-100 dark:border-gray-800 bg-transparent overflow-hidden">
      <div className="w-full px-0">
        
        <p className="text-center text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 md:mb-4">
          {trustedBy.heading}
        </p>

        <div className="w-full overflow-hidden flex py-1 relative">
          <motion.div 
            className="flex items-center min-w-max"
            animate={{ x: ["-50%", "0%"] }}
            transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          >
            {/* 4 Copies for ultra-wide seamless looping */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex opacity-70 hover:opacity-100 transition-opacity duration-300 items-center shrink-0 pr-8 md:pr-12">
                <div style={{ width: '220px', height: '40px', overflow: 'hidden' }}>
                  <img 
                    src="/client_logos.jpg" 
                    alt="Trusted by leading organizations" 
                    className="grayscale mix-blend-multiply dark:mix-blend-screen dark:invert opacity-80"
                    style={{ 
                      width: '220px', 
                      height: 'auto',
                      marginTop: '-36px'
                    }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
