"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, PlayCircle, MessageCircle, ArrowRight } from "lucide-react";
import RelatedProductsGrid from "./RelatedProductsGrid";
import CTABand from "./CTABand";

interface Feature {
  bold?: string;
  text: string;
  isComingSoon?: boolean;
}

interface ProductOverviewProps {
  name: string;
  slug: string;
  features: Feature[];
  description?: string;
  image?: string;
}

export default function ProductOverview({ name, slug, features, description, image }: ProductOverviewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const isVideo = image?.endsWith('.mp4');

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      {/* 2. Breadcrumbs */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-4 border-b border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link href="/#products" className="hover:text-primary transition-colors">Products</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{name}</span>
      </div>

      {/* 3. Hero Section */}
      <section className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-20 lg:py-32 overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 w-full mb-12">
            
            {/* Left Column (Text) */}
            <div className={`${slug === 'esehmati' || slug === 'e-sehmati' ? 'lg:w-1/2' : 'max-w-4xl'} flex flex-col items-start text-left`}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-bold text-white mb-6 break-words hyphens-auto"
              >
                {name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed font-light"
              >
                {description}
              </motion.p>
              
              <div className="flex gap-4">
                <Link href="/book-a-demo" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 h-[50px] rounded-md font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                  Explore {name}
                </Link>
              </div>
            </div>

            {/* Right Column (Media) */}
            {image && (
              <div className="lg:w-1/2 w-full mt-12 lg:mt-0 relative">
                {/* Strong halation glow behind the media */}
                <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/40 via-blue-400/30 to-cyan-500/40 rounded-[3.5rem] blur-[60px] opacity-80 mix-blend-screen pointer-events-none"></div>
                <div className="absolute -inset-2 bg-blue-500/20 rounded-[3rem] blur-xl opacity-50 pointer-events-none"></div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="w-full rounded-[2.5rem] overflow-hidden relative bg-black aspect-video shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10"
                >
                  {isVideo ? (
                    <video 
                      src={image} 
                      autoPlay 
                      loop 
                      muted
                      controls 
                      playsInline 
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <img 
                      src={image} 
                      alt={name} 
                      className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
                    />
                  )}
                </motion.div>
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex gap-8 border-b border-white/20 w-full lg:w-fit">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-1 py-3 border-b-2 font-medium transition-colors ${activeTab === "overview" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("resources")}
              className={`px-1 py-3 border-b-2 font-medium transition-colors ${activeTab === "resources" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
              Resources
            </button>
          </div>
        </div>
      </section>

      {activeTab === "overview" ? (
        <>
          {/* 4. Value Proposition Block */}
          <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-24 bg-white dark:bg-gray-950">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-neutral-text dark:text-white mb-6">
              Empower your compliance journey
            </h2>
            <p className="text-lg md:text-xl text-text-secondary dark:text-gray-300 leading-relaxed mb-8 font-light">
              {description} We've designed {name} to eliminate the friction between stringent regulatory requirements and your daily operations. Transform manual overhead into automated, secure workflows instantly.
            </p>
          </div>
          <div className="lg:w-1/2 w-full flex flex-col items-center lg:items-end mt-12 lg:mt-0">
            <div className="relative w-full max-w-2xl aspect-video bg-gray-100 dark:bg-gray-900 rounded-[2rem] overflow-hidden group cursor-pointer border-4 border-gray-50 dark:border-gray-800 shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors z-20">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <img src={`/products/${slug}.png`} alt={name} className="absolute inset-0 w-full h-full object-cover z-10 opacity-80" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-multiply"></div>
              <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-lg z-20 border border-white/20">
                2:45
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4 font-medium tracking-wide">Watch: See {name} in action</p>
          </div>
        </div>
      </section>

      {/* 5. Segmented Product Grid (Adapted to Features) */}
      {features && features.length > 0 && (
      <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-24 bg-neutral-bg dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-neutral-text dark:text-white mb-16">
          Core Capabilities
        </h2>
        
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
            <h3 className="text-2xl font-bold text-neutral-text dark:text-white">
              Key Features
            </h3>
            <Link href="/book-a-demo" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-md font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg text-sm">
              Book a Demo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-[linear-gradient(135deg,rgba(215,235,255,0.95)_0%,rgba(160,200,255,0.9)_100%)] dark:bg-[linear-gradient(135deg,rgba(30,58,138,0.7)_0%,rgba(15,23,42,0.95)_100%)] backdrop-blur-[12px] border border-[rgba(90,120,220,0.2)] shadow-[0_15px_50px_rgba(50,80,150,0.15)] p-8 rounded-[24px] flex flex-col h-full hover:-translate-y-1 transition-all duration-300">
                <h4 className="text-xl font-bold text-neutral-text dark:text-white mb-3">
                  {feature.bold?.replace(/^[-—\s]+/, "").trim() || `Capability 0${idx + 1}`}
                </h4>
                <p className="text-text-secondary dark:text-gray-400 mb-6 flex-grow">
                  {feature.text?.replace(/^[-—\s]+/, "").trim()}
                </p>
                <Link href="/book-a-demo" className="inline-flex items-center text-primary dark:text-white font-medium hover:underline mt-auto">
                  Explore feature <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
          

        </div>
      </section>
      )}
        </>
      ) : (
        <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-32 bg-white dark:bg-gray-950 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="text-center max-w-2xl bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-gray-800 shadow-xl">
            <h2 className="text-4xl font-serif font-bold text-neutral-text dark:text-white mb-6">
              Resources Coming Soon
            </h2>
            <p className="text-xl text-text-secondary dark:text-gray-400 font-light leading-relaxed">
              We are working hard to gather the best guides, case studies, and documentation for {name}. Check back later!
            </p>
          </div>
        </section>
      )}

      {/* 6. Cross-Sell / Solutions Carousel */}
      <RelatedProductsGrid currentSlug={slug} productName={name} />

      {/* 7. Services/Guidance Split Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 pt-24 pb-8 bg-primary text-white">
        <div className="grid md:grid-cols-2 gap-16 divide-y md:divide-y-0 md:divide-x divide-white/20">
          <div className="pr-8">
            <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">Deployment Services</span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">Expert Implementation</h3>
            <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
              Let our experts deploy {name} directly into your on-premise or cloud environment, ensuring perfect integration with your existing architecture.
            </p>
            <Link href="/book-a-demo" className="inline-flex items-center text-accent hover:text-white font-bold transition-colors">
              Contact Consulting <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className="md:pl-16 pt-16 md:pt-0">
            <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">Ongoing Support</span>
            <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6">24/7 Managed Governance</h3>
            <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
              Don't want to manage it yourself? Our managed services team will monitor, update, and manage your compliance posture around the clock.
            </p>
            <Link href="/book-a-demo" className="inline-flex items-center text-accent hover:text-white font-bold transition-colors">
              Explore Managed Services <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Closing Tool CTA */}
      <section className="w-full bg-primary pb-16">
        <CTABand productName={name} slug={slug} />
      </section>



    </div>
  );
}
