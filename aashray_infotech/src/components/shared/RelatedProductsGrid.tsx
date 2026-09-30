"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { homeContent } from "@/content/home";
import { useRef } from "react";

interface RelatedProductsGridProps {
  currentSlug: string;
  productName?: string;
}

export default function RelatedProductsGrid({ currentSlug, productName }: RelatedProductsGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine platforms, products, and services, then exclude the current one
  const allOfferings = [
    ...homeContent.ourPlatforms.items
  ].filter(item => item.slug !== currentSlug);

  if (allOfferings.length === 0) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-12 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
        <div>
          <h2 className="text-3xl lg:text-4xl font-sans font-bold text-neutral-text dark:text-white mb-4">
            Complete your compliance suite
          </h2>
          <p className="text-xl text-text-secondary dark:text-gray-400 max-w-2xl">
            Integrate {productName ? productName : "this product"} with our other platforms for end-to-end governance.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
            aria-label="Previous"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
            aria-label="Next"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <Link href="/#products" className="hidden lg:inline-flex items-center justify-center bg-primary text-white px-6 h-[48px] ml-4 rounded-md font-semibold hover:bg-primary/90 transition-all">
            Find your solution
          </Link>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allOfferings.map((item) => (
          <Link
            key={item.slug}
            href={`/${item.category}/${item.slug}`}
            className="snap-start shrink-0 w-[320px] md:w-[400px] group flex flex-col bg-neutral-bg dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30"
          >
            <div className="w-full h-48 mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
              <img 
                src={`/products/${item.slug}.png`} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors mix-blend-multiply"></div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {item.name}
            </h3>
            {item.statusBadge && (
              <div className="mb-3">
                <span className="inline-block px-2 py-0.5 text-[11px] font-semibold tracking-wide text-primary bg-primary/10 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
                  {item.statusBadge}
                </span>
              </div>
            )}
            <p className="text-base text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-grow">
              {item.tagline || item.description || "Learn more about this offering"}
            </p>
            <div className="flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all mt-auto">
              Explore solution <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
