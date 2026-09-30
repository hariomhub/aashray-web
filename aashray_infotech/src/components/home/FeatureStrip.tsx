"use client";

import { motion } from "framer-motion";
import { Server, Sparkles, FileCheck2, Zap, ShieldCheck } from "lucide-react";

const features = [
  { icon: Server, title: "On-Premise" },
  { icon: Sparkles, title: "AI-Enabled" },
  { icon: FileCheck2, title: "DPDP Ready" },
  { icon: Zap, title: "Fast Deploy" },
  { icon: ShieldCheck, title: "Secure" }
];

export default function FeatureStrip() {
  return (
    <section className="py-12 lg:py-16">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-16 md:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center justify-center text-center group cursor-pointer"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-4 text-primary dark:text-white group-hover:scale-110 transition-transform duration-300">
                <feature.icon strokeWidth={1.5} className="w-12 h-12 md:w-16 md:h-16" />
              </div>
              <h3 className="text-base md:text-lg font-semibold text-neutral-text dark:text-gray-200">
                {feature.title}
              </h3>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
