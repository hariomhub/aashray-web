"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface CTABandProps {
  productName: string;
  slug?: string;
}

export default function CTABand({ productName, slug }: CTABandProps) {
  // Extract main name without category prefix if present
  const displayName = productName.includes(':') ? productName.split(':')[0] : productName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-primary rounded-3xl p-10 md:p-12 text-center relative overflow-hidden mx-4 sm:mx-6 lg:mx-12 xl:mx-16"
    >
      <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl font-sans font-bold text-white mb-6">
          Ready to get started with {displayName}?
        </h2>
        <p className="text-primary-light text-lg mb-8">
          Connect with our team to see a live demonstration and learn how we can help your organization.
        </p>
        <Link 
          href={slug?.toLowerCase() === "dpdpquest" ? "/take-a-test" : "/book-a-demo"}
          className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-primary bg-white hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
        >
          {slug?.toLowerCase() === "dpdpquest" ? "Take a Test" : "Book a Demo"}
        </Link>
      </div>
    </motion.div>
  );
}
