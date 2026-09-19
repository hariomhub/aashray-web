"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/content/home";
import PlatformCard from "./PlatformCard";

export default function Products() {
  const { ourPlatforms } = homeContent;

  return (
    <section id="products" className="py-10 md:py-16 lg:py-24 relative overflow-hidden bg-white dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-neutral-text dark:text-white mb-6"
          >
            {ourPlatforms.heading}
          </motion.h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-16 lg:gap-24 mb-16 md:mb-24">
          {ourPlatforms.items.map((product, index) => (
            <PlatformCard
              key={`product-${index}`}
              index={index}
              name={product.name}
              tagline={product.tagline}
              description={product.description}
              features={product.features}
              isPlaceholder={product.isPlaceholder}
              placeholderText={product.placeholderText}
              image={product.image}
              slug={(product as any).slug}
              category={(product as any).category}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
