"use client";

import { motion } from "framer-motion";
import { Cpu } from "lucide-react";

export default function Innovation() {
  return (
    <section className="py-12 lg:py-16 bg-neutral-bg">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="bg-white rounded-3xl p-8 lg:p-16 shadow-lg border border-gray-100 flex flex-col lg:flex-row items-center gap-24">
          
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-16"
            >
              <Cpu className="w-10 h-10" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-sans font-semibold text-primary mb-6"
            >
              Constant Innovation
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 leading-relaxed mb-6"
            >
              Our platform uses AI-enabled automation to simplify compliance work. As technology, regulation, and threats evolve, Aashray evolves too. 
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Every new version brings sharper AI and new tools without asking clients to start over, ensuring your compliance posture is always state-of-the-art.
            </motion.p>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shadow-inner"
            >
              {/* Abstract visualization of AI/Evolution */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border border-primary/20 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute w-48 h-48 rounded-full border border-accent/40 animate-[spin_7s_linear_infinite_reverse]"></div>
                <div className="absolute w-32 h-32 rounded-full border border-primary/60 animate-[spin_5s_linear_infinite]"></div>
                <ShieldIcon className="absolute w-12 h-12 text-primary" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function ShieldIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
