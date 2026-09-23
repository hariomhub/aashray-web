"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, PlayCircle, MessageCircle, ArrowRight, BookOpen, ShieldCheck, Route, TrendingUp, Mic, RefreshCw, Zap } from "lucide-react";
import RelatedProductsGrid from "./RelatedProductsGrid";
import CTABand from "./CTABand";
import NetworkBackground from "@/components/shared/NetworkBackground";

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
      <section className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 lg:pt-16 pb-0 overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full mb-8">
            
            {/* Left Column (Text) */}
            <div className={`${slug === 'esehmati' || slug === 'e-sehmati' ? 'lg:w-1/2' : 'max-w-4xl'} flex flex-col items-start text-left`}>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl 2xl:text-[9rem] font-sans font-bold text-white mb-6 whitespace-nowrap"
              >
                {name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-lg md:text-xl lg:text-2xl 2xl:text-3xl text-gray-200 mb-8 leading-relaxed font-light"
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
          <div className="flex gap-8 lg:gap-12 border-b border-white/20 w-full lg:w-fit translate-y-[1px]">
            <button 
              onClick={() => setActiveTab("overview")}
              className={`px-2 py-4 text-lg lg:text-xl 2xl:text-2xl border-b-2 font-medium transition-colors ${activeTab === "overview" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
              Overview
            </button>
            <button 
              onClick={() => setActiveTab("resources")}
              className={`px-2 py-4 text-lg lg:text-xl 2xl:text-2xl border-b-2 font-medium transition-colors ${activeTab === "resources" ? "border-white text-white" : "border-transparent text-gray-400 hover:text-white"}`}>
              Resources
            </button>
          </div>
        </div>
      </section>

      {activeTab === "overview" ? (
        <>
          {/* 4. Value Proposition Block */}
          <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 pt-2 lg:pt-4 pb-12 bg-white dark:bg-gray-950">
        <div className="flex flex-col lg:flex-row gap-16 items-start mt-2">
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-sans font-bold text-neutral-text dark:text-white mb-6">
              Empower your compliance journey
            </h2>
            <p className="text-lg md:text-xl 2xl:text-2xl text-black dark:text-gray-100 leading-relaxed mb-8 font-normal">
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

      {/* 5. Key Features Section (Redesigned) */}
      {/* Key Features Section - Refined, Premium Redesign */}
      {features && features.length > 0 && (
      <section className="relative w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#eef6ff] via-[#dcebfa] to-[#eef6ff] dark:from-[#0a192f] dark:via-[#020b18] dark:to-[#0a192f] py-[72px] px-4 sm:px-6 lg:px-12 xl:px-16 pb-[80px]">
        
        {/* Network Animation Background */}
        <NetworkBackground />

        {/* Subtle Background Gradients */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,rgba(228,240,255,0.55),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(20,50,100,0.4),transparent_70%)] pointer-events-none z-0"></div>
        <div className="absolute -top-10 right-[10%] w-[400px] h-[100px] border-t border-[#D9A83E] opacity-65 rounded-[100%] pointer-events-none z-0 rotate-12 blur-[1px]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,rgba(228,240,255,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(20,50,100,0.3),transparent_70%)] pointer-events-none z-0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_bottom_right,rgba(228,240,255,0.45),transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_right,rgba(20,50,100,0.3),transparent_70%)] pointer-events-none z-0"></div>

        <div className="w-full relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-[38px] gap-6">
            <div>
              <div className="w-[90px] h-[4px] bg-[#D9A83E] mb-6 rounded-full"></div>
              <h2 className="font-sans text-[36px] md:text-[40px] lg:text-[52px] 2xl:text-[64px] font-bold text-[#0B2B55] dark:text-white tracking-[-1.5px] leading-tight">
                Key Features
              </h2>
              <p className="font-sans text-[15px] font-semibold tracking-[4px] text-[#475569] dark:text-[#94A3B8] mt-3 uppercase">
                SMARTER LEARNING. STRONGER COMPLIANCE.
              </p>
            </div>
            
            <Link 
              href="/book-a-demo" 
              className="font-sans group inline-flex items-center justify-center gap-2 bg-[#123F6B] text-white px-7 py-4 rounded-[14px] font-bold text-[16px] 2xl:text-[20px] 2xl:px-10 2xl:py-5 shadow-[0_12px_28px_rgba(18,63,107,0.20)] hover:shadow-[0_16px_34px_rgba(18,63,107,0.26)] hover:-translate-y-[2px] transition-all duration-250 ease-out shrink-0"
            >
              Book a Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {/* Cards Grid */}
          <div className="flex flex-wrap justify-center gap-[24px]">
            {features.map((feature, idx) => {
              const icons = [BookOpen, ShieldCheck, Route, PlayCircle, TrendingUp, Mic, RefreshCw, Zap];
              const IconComp = icons[idx % icons.length];
              
              return (
                <div key={idx} className="relative group w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] z-10 hover:z-20 transition-all duration-300 ease-out flex flex-col">
                  
                  <div className="font-sans relative w-full h-full flex flex-col bg-[rgba(6,24,60,0.95)] dark:bg-[rgba(6,24,60,0.95)] backdrop-blur-xl border border-blue-500/40 rounded-[22px] min-h-[260px] p-6 shadow-[0_0_25px_rgba(30,120,255,0.3)] dark:shadow-[0_0_25px_rgba(30,120,255,0.3)] overflow-visible hover:-translate-y-[8px] hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(30,130,255,0.6)] hover:border-blue-400/90 transition-all duration-300 ease-out">
                    
                    {/* Icon */}
                    <div className="w-[64px] h-[64px] rounded-[16px] bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] flex items-center justify-center mb-4 relative z-10">
                      <IconComp className="w-7 h-7 text-white" strokeWidth={1.5} />
                      <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#D7A83D]"></div>
                    </div>
                    
                    <h4 className="text-[18px] 2xl:text-[22px] font-bold text-white leading-[1.25] tracking-[-0.3px] mb-2 relative z-10">
                      {feature.bold?.replace(/^[-?"\s]+/, "").trim() || `Capability 0${idx + 1}`}
                    </h4>
                    <p className="font-sans text-[14px] 2xl:text-[16px] text-blue-100 leading-[1.6] relative z-10 mb-6 flex-grow">
                      {feature.text?.replace(/^[-—\s]+/, "").trim() || "Advanced functionality designed to ensure compliance, streamline workflows, and mitigate risks."}
                    </p>
                    
                    <Link 
                      href="/book-a-demo" 
                      className="font-sans text-[14px] font-bold text-white flex items-center group/link mt-auto relative z-10 w-fit"
                    >
                      Book a Demo 
                      <span className="ml-1.5 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center group-hover/link:bg-white group-hover/link:border-white group-hover/link:text-[#0B2B55] transition-all duration-200">
                        <ChevronRight className="w-3 h-3 group-hover/link:translate-x-[1px] transition-transform" />
                      </span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}
        </>
      ) : (
        <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-16 bg-white dark:bg-gray-950 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="text-center max-w-2xl bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] p-12 border border-gray-100 dark:border-gray-800 shadow-xl">
            <h2 className="text-4xl font-sans font-bold text-neutral-text dark:text-white mb-6">
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
            <h3 className="text-2xl md:text-3xl font-sans font-bold mb-6">Expert Implementation</h3>
            <p className="text-base md:text-lg text-gray-200 mb-8 leading-relaxed">
              Let our experts deploy {name} directly into your on-premise or cloud environment, ensuring perfect integration with your existing architecture.
            </p>
            <Link href="/book-a-demo" className="inline-flex items-center text-accent hover:text-white font-bold transition-colors">
              Contact Consulting <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
          <div className="md:pl-16 pt-16 md:pt-0">
            <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">Ongoing Support</span>
            <h3 className="text-2xl md:text-3xl font-sans font-bold mb-6">24/7 Managed Governance</h3>
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
