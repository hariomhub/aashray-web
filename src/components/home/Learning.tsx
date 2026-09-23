"use client";

import { motion } from "framer-motion";
import { PlayCircle, ArrowRight } from "lucide-react";

export default function Learning() {
  return (
    <section id="learning" className="py-12 lg:py-16 scroll-mt-12">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <span className="text-sm font-semibold tracking-wide uppercase text-accent mb-3 block">
            Video Learning
          </span>
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-neutral-text dark:text-white mb-6">
            Watch & Learn with Aashray Infotech
          </h2>
          <p className="text-lg text-text-secondary dark:text-gray-300 leading-relaxed">
            Stay updated with the latest insights on DPDP compliance, data security, and best practices directly from our experts.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row group"
        >
          <div className="md:w-1/2 bg-gray-100 dark:bg-gray-900 relative min-h-[250px] md:min-h-[auto] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10 dark:opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
            <div className="w-20 h-20 bg-[#FF0000] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.4)] group-hover:scale-110 transition-transform duration-300 relative z-10">
              <PlayCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center xl:text-left">
            <h3 className="text-2xl font-sans font-bold text-neutral-text dark:text-white mb-4">
              Official YouTube Channel
            </h3>
            <p className="text-text-secondary dark:text-gray-400 mb-16 leading-relaxed">
              Subscribe to our channel for tutorials, webinars, and deep-dives into data governance and the new DPDP Act.
            </p>
            <a 
              href="https://www.youtube.com/@AASHRAYINFOTECH" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#FF0000] text-white px-6 h-[48px] rounded-md font-semibold hover:bg-[#CC0000] transition-colors self-center xl:self-start shadow-md hover:shadow-lg"
            >
              <PlayCircle className="w-5 h-5" />
              Visit Channel
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
