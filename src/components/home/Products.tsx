"use client";

import { motion } from "framer-motion";
import { homeContent } from "@/content/home";
import PlatformCard from "./PlatformCard";

export default function Products() {
  const { ourPlatforms } = homeContent;

  return (
    <section id="products" className="py-16 md:pt-20 md:pb-24 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(90,130,255,0.08),rgba(150,120,255,0.05),transparent_70%)] dark:bg-gray-950 border-y border-[rgba(70,110,220,0.12)] shadow-[0_20px_60px_rgba(40,70,140,0.08)] w-full mb-12">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        
        {/* Top Left Arc */}
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] rounded-full border-[1px] border-[rgba(90,120,255,0.16)] opacity-60"></div>
        <div className="absolute top-[-15%] left-[-5%] w-[45rem] h-[45rem] rounded-full border-[1px] border-[rgba(90,120,255,0.10)] opacity-40"></div>
        
        {/* Top Right Dotted Grid */}
        <div className="absolute top-10 right-10 w-48 h-48 bg-[radial-gradient(rgba(70,105,230,0.35)_2px,transparent_2px)] [background-size:14px_14px] opacity-65 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"></div>
        
        {/* Bottom Left Dotted Grid */}
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-[radial-gradient(rgba(80,120,230,0.25)_1.5px,transparent_1.5px)] [background-size:12px_12px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>
        
        {/* Bottom Right Wave Lines */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[50rem] h-[30rem] border-t border-[rgba(90,110,255,0.25)] rounded-[100%] opacity-70 transform rotate-12"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[55rem] h-[35rem] border-t border-[rgba(90,110,255,0.15)] rounded-[100%] opacity-50 transform rotate-12"></div>
        
        {/* Background Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] right-[-5%] w-[420px] h-[420px] bg-[rgba(100,130,255,0.10)] rounded-full blur-[70px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] bg-[rgba(130,100,255,0.06)] rounded-full blur-[80px]"
        />
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjEiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==')]"></div>
      </div>
      
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-12 flex items-center justify-center gap-6">
          <div className="hidden md:block h-[1px] w-[55px] bg-[rgba(80,110,220,0.35)]"></div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-[800] tracking-[2px] text-[#1F2937] dark:text-white uppercase"
          >
            {ourPlatforms.heading}
          </motion.h2>
          <div className="hidden md:block h-[1px] w-[55px] bg-[rgba(80,110,220,0.35)]"></div>
        </div>

        <div className="flex flex-col gap-10 md:gap-12 lg:gap-16 mb-16 md:mb-12">
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
