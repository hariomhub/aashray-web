"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
}

export default function FaqAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Function to process markdown-like bolding (e.g. **text**)
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-semibold text-neutral-text dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {faqs.map((faq, index) => {
        const isBlue = index % 2 === 0;
        
        const boxStyles = isBlue 
          ? "bg-[linear-gradient(135deg,rgba(215,235,255,0.95)_0%,rgba(160,200,255,0.9)_100%)] dark:bg-[linear-gradient(135deg,rgba(30,58,138,0.7)_0%,rgba(15,23,42,0.95)_100%)] backdrop-blur-[12px] border border-[rgba(90,120,220,0.2)] shadow-[0_15px_50px_rgba(50,80,150,0.15)] rounded-[24px]"
          : "bg-white dark:bg-gray-900 border border-[rgba(90,120,220,0.2)] shadow-[0_15px_50px_rgba(50,80,150,0.15)] rounded-[24px]";

        const textStyles = isBlue
          ? "text-neutral-text dark:text-white"
          : "text-neutral-text dark:text-white";

        const iconStyles = isBlue
          ? "text-primary dark:text-gray-300"
          : "text-primary dark:text-gray-400";
          
        const answerStyles = isBlue
          ? "text-text-secondary dark:text-gray-300"
          : "text-text-secondary dark:text-gray-400";

        return (
          <div 
            key={index} 
            className={`overflow-hidden transition-all duration-300 ${boxStyles}`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className={`w-full px-8 lg:px-14 py-8 lg:py-10 flex justify-between items-center text-left transition-colors ${isBlue ? 'hover:bg-white/10 dark:hover:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
            >
              <span className={`text-3xl lg:text-4xl font-bold pr-8 tracking-wide leading-tight ${textStyles}`}>
                {faq.question}
              </span>
              <ChevronDown 
                className={`w-8 h-8 lg:w-10 lg:h-10 transition-transform duration-300 shrink-0 ${iconStyles} ${openIndex === index ? "rotate-180" : ""}`} 
              />
            </button>
            
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className={`px-8 lg:px-14 pb-10 lg:pb-12 pt-2 leading-relaxed text-2xl lg:text-3xl ${answerStyles}`}>
                    {formatText(faq.answer)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
