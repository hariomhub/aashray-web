"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Box } from "lucide-react";

interface FeatureBlockProps {
  heading: string;
  description: string;
  index: number;
}

export default function FeatureBlock({ heading, description, index }: FeatureBlockProps) {
  // Alternate layout: image left or image right based on index
  const isImageRight = index % 2 !== 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${isImageRight ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-16 py-12 border-b border-gray-100 dark:border-gray-800 last:border-0`}
    >
      {/* Content */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {heading ? (
          <h3 className="text-2xl font-sans font-bold text-gray-900 dark:text-white flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
            <span>{heading}</span>
          </h3>
        ) : null}
        <p className={`text-lg text-gray-600 dark:text-gray-300 leading-relaxed ${heading ? "ml-9" : "flex items-start gap-3"}`}>
          {!heading && <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />}
          <span>{description}</span>
        </p>
      </div>

      {/* Visual Block (Image) */}
      <div className="w-full lg:w-1/2 aspect-video bg-neutral-bg dark:bg-gray-900 rounded-xl border border-border-light dark:border-gray-800 flex items-center justify-center relative overflow-hidden shadow-sm group">
        <img 
          src="/feature_placeholder.jpg" 
          alt={heading || "Feature detail"} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none z-10"></div>
      </div>
    </motion.div>
  );
}
