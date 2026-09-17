"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Box } from "lucide-react";
import TabNav from "./TabNav";

interface ProductHeroProps {
  name: string;
  tagline?: string;
  image?: string;
  slug: string;
  category: string;
  isPlaceholder?: boolean;
  placeholderText?: string;
}

export default function ProductHero({
  name,
  tagline,
  image,
  slug,
  category,
  isPlaceholder,
  placeholderText,
}: ProductHeroProps) {
  return (
    <div className="pt-8">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 flex flex-col relative w-full"
        >
          {isPlaceholder && (
            <div className="absolute -top-6 -left-4 bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded shadow-sm border border-yellow-200 z-10 flex items-center gap-1">
              <span className="text-[10px]">Pending Client Copy:</span> {placeholderText}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary dark:text-white mb-6 leading-tight">
            {name}
          </h1>
          
          {tagline && (
            <p className="text-primary italic font-medium text-xl leading-relaxed mb-8">
              {tagline}
            </p>
          )}

          <div>
            <Link 
              href={slug?.toLowerCase() === "dpdpquest" ? "/take-a-test" : "/book-a-demo"}
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold rounded-xl text-white bg-primary hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
            >
              {slug?.toLowerCase() === "dpdpquest" ? "Take a Test" : "Book a Demo"}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:w-1/2 w-full aspect-square bg-neutral-bg dark:bg-gray-900 rounded-2xl border border-border-light dark:border-gray-800 flex items-center justify-center relative overflow-hidden shadow-xl"
        >
          <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 dark:opacity-10"></div>
          {image ? (
            <img src={image} alt={name} className="w-full h-full object-cover relative z-10" />
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center text-primary/40 dark:text-white/20">
              <Box className="w-20 h-20 mb-4" />
              <p className="font-medium tracking-wide">Image Coming Soon</p>
            </div>
          )}
        </motion.div>
      </div>

      <TabNav slug={slug} category={category} />
    </div>
  );
}
