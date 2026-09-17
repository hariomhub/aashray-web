"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/content/home";
import { Lightbulb } from "lucide-react";

export default function ConstantInnovation() {
  const { constantInnovation } = homeContent;

  return (
    <section className="py-24 bg-blue-50 dark:bg-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl p-10 lg:p-16 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-16">
              <Lightbulb className="w-8 h-8 text-accent" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-16">
              {constantInnovation.heading}
            </h2>
            
            <div className="space-y-6 mb-20">
              {constantInnovation.paragraphs.map((para, index) => (
                <p key={index} className="text-2xl text-gray-800 leading-relaxed font-medium">
                  {para}
                </p>
              ))}
            </div>
            
            <div className="pt-8 border-t border-gray-200 w-full">
              <p className="text-xl font-bold text-primary italic">
                {constantInnovation.attribution}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
