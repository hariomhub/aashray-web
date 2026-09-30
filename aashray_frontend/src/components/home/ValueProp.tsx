"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ValueProp() {
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10 flex flex-col items-center text-center">
        
        <div className="max-w-[700px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold text-neutral-text dark:text-white mb-6 leading-tight"
          >
            Compliance without giving up <span className="text-accent italic">control</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-text-secondary dark:text-gray-300 leading-relaxed mb-20"
          >
            Get compliant faster than relying on traditional consulting peers. Our AI-enabled platform automates the heavy lifting, saving costs and keeping your data strictly on-premise.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="#about"
              className="inline-flex items-center justify-center bg-transparent text-primary dark:text-white border-2 border-primary dark:border-white px-8 h-[50px] rounded-md font-semibold hover:bg-primary/5 dark:hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
