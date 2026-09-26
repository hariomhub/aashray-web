"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Box, Apple, Play, QrCode } from "lucide-react";
import Link from "next/link";

interface Feature {
  bold: string;
  text: string;
  isComingSoon?: boolean;
}

interface PlatformCardProps {
  name: string;
  tagline?: string;
  description?: string;
  features: Feature[];
  isPlaceholder?: boolean;
  placeholderText?: string;
  index: number;
  image?: string;
  slug?: string;
  category?: string;
  statusBadge?: string;
}

export default function PlatformCard({
  name,
  tagline,
  description,
  features,
  isPlaceholder,
  placeholderText,
  index,
  image,
  slug,
  category,
  statusBadge
}: PlatformCardProps) {
  const isImageRight = index % 2 === 0;
  const isVideo = image?.endsWith('.mp4');
  const displayFeatures = features.slice(0, 6);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [logoStripWidth, setLogoStripWidth] = useState<number>(480);

  useEffect(() => {
    // Force play on mount since autoPlay can be unreliable in some browsers
    [mobileVideoRef.current, desktopVideoRef.current].forEach(v => {
      if (v) {
        v.defaultMuted = true;
        v.muted = true;
        v.play().catch(() => {/* silently ignore if browser blocks */});
      }
    });
  }, [image]);

  useEffect(() => {
    if (!buttonsRef.current) return;
    const observer = new ResizeObserver(() => {
      if (buttonsRef.current) setLogoStripWidth(buttonsRef.current.offsetWidth);
    });
    observer.observe(buttonsRef.current);
    setLogoStripWidth(buttonsRef.current.offsetWidth);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`group flex flex-col items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-[12px] border border-[rgba(90,120,220,0.15)] rounded-[24px] p-6 md:p-8 xl:px-12 xl:pt-12 ${slug === 'niyamsaathi' ? 'pb-0' : 'xl:pb-8'} shadow-[0_4px_25px_rgba(50,80,150,0.05)] relative overflow-hidden`}>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[rgba(70,110,230,0.3)] rounded-tl-[24px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[rgba(70,110,230,0.3)] rounded-tr-[24px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[rgba(70,110,230,0.3)] rounded-bl-[24px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[rgba(70,110,230,0.3)] rounded-br-[24px] pointer-events-none"></div>
      
      {/* App Store / Play Store / QR Code for ComplianceQuest */}
      {slug === 'compliancequest' && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 flex flex-col items-end gap-3 bg-white/60 dark:bg-gray-900/60 p-3 rounded-2xl backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-gray-800 transition-colors">
              <Apple className="w-4 h-4" /> App Store
            </div>
            <div className="flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer hover:bg-gray-800 transition-colors">
              <Play className="w-4 h-4" fill="currentColor" /> Play Store
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
            <QrCode className="w-14 h-14 text-black" />
            <span className="text-[9px] text-gray-600 font-extrabold mt-1 tracking-wider">SCAN TO DL</span>
          </div>
        </div>
      )}
      
      {/* Text Content */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-6xl flex flex-col text-center items-center mb-10 relative z-30 ${isPlaceholder ? 'opacity-70' : ''}`}
      >
        <h4 className={`text-4xl lg:text-5xl font-sans font-[800] mb-4 pb-2 leading-tight tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#123F78,#4169E1)] dark:bg-[linear-gradient(90deg,#8BA4FF,#C4D2FF)]`}>
          {name}
        </h4>
        {statusBadge && (
          <div className="mb-5 -mt-4">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold tracking-wide text-primary bg-primary/10 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
              {statusBadge}
            </span>
          </div>
        )}
        {tagline && (
          <p className="text-primary/90 dark:text-gray-200 font-medium text-lg lg:text-xl leading-relaxed mb-5">
            {tagline}
          </p>
        )}
        {description && (
          (() => {
            const cleanDesc = (tagline && description.startsWith(tagline)) ? description.substring(tagline.length).trim() : description;
            return cleanDesc ? (
              <p className={`text-neutral-text/90 dark:text-gray-300 text-base lg:text-lg leading-relaxed font-normal text-center`}>
                {cleanDesc}
              </p>
            ) : null;
          })()
        )}
      </motion.div>

      {/* MOBILE LAYOUT: Video Top, Features Bottom (< 768px) */}
      <div className={`w-full flex flex-col md:hidden gap-8 items-center mt-6 ${isPlaceholder ? 'opacity-70' : ''}`}>
        
        {/* Center Video/Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[280px] sm:max-w-[340px] flex items-center justify-center relative my-6"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-[rgba(80,120,255,0.12)] rounded-full blur-[40px] pointer-events-none z-[-1]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] rounded-full border border-dashed border-[rgba(90,110,255,0.25)] pointer-events-none z-[-1] animate-[spin_40s_linear_infinite]"></div>
          
          <div className={`relative w-full ${!isVideo ? "aspect-square" : ""} bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(20,20,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.7)] dark:border-[rgba(255,255,255,0.1)] rounded-[24px] shadow-[0_20px_50px_rgba(40,70,140,0.15)] overflow-hidden z-10 p-2`}>
            {!isVideo && <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 dark:opacity-10"></div>}
            {image ? (
              isVideo ? (
                <video ref={mobileVideoRef} key={image} src={image} autoPlay loop muted playsInline preload="auto" className="w-full h-auto object-cover relative z-10 rounded-[20px]" />
              ) : (
                <img src={image} alt={name} className="w-full h-full object-contain p-4 relative z-10" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <Box className="w-12 h-12 text-primary/20 dark:text-white/10" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col gap-5 w-full z-20 relative px-2">
          {displayFeatures.map((feat, idx) => (
            <motion.div
              key={`mob-feat-${idx}`}
              className="w-full"
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: idx * 0.5 }}
            >
              <FeatureItem feat={feat} compact />
            </motion.div>
          ))}
        </div>
      </div>

      {/* TABLET & DESKTOP LAYOUT: 3-Column (>= 768px) */}
      <div className={`hidden md:flex w-full items-center justify-between gap-6 lg:gap-8 xl:gap-12 mt-6 relative z-10 ${isPlaceholder ? 'opacity-70' : ''}`}>
        
        {/* Left Features */}
        <div className="flex-1 flex flex-col justify-center gap-6 z-20">
          {displayFeatures.slice(0, Math.ceil(displayFeatures.length / 2)).map((feat, idx) => (
            <motion.div
              key={`left-feat-${idx}`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -4, 0] }}
              transition={{ 
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: idx * 0.4 },
                opacity: { duration: 0.5, delay: idx * 0.1 },
                x: { duration: 0.5, delay: idx * 0.1 }
              }}
            >
              <FeatureItem feat={feat} compact={true} />
            </motion.div>
          ))}
        </div>

        {/* Center Video/Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-[300px] lg:w-[400px] xl:w-[480px] shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-700"
        >
          {/* Soft Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[rgba(80,120,255,0.15)] rounded-full blur-[60px] lg:blur-[80px] pointer-events-none z-[-1]"></div>
          
          {/* Decorations to maintain "Orbital" feel */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-dashed border-[rgba(90,110,255,0.3)] pointer-events-none z-[-1] animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] rounded-full border border-[rgba(90,110,255,0.1)] pointer-events-none z-[-1] animate-[spin_40s_linear_infinite_reverse]"></div>
          
          <div className={`relative w-full h-auto bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(20,20,30,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.8)] dark:border-[rgba(255,255,255,0.15)] rounded-[24px] lg:rounded-[32px] shadow-[0_30px_70px_rgba(40,70,140,0.2)] overflow-hidden z-10 p-2 lg:p-3 flex items-center justify-center`}>
            {!isVideo && <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 dark:opacity-10"></div>}
            {image ? (
              isVideo ? (
                <video ref={desktopVideoRef} key={image} src={image} autoPlay loop muted playsInline preload="auto" className="w-full h-auto max-h-[350px] lg:max-h-[450px] object-contain relative z-10 rounded-[16px] lg:rounded-[24px]" />
              ) : (
                <img src={image} alt={name} className="w-full h-auto max-h-[350px] lg:max-h-[450px] object-contain relative z-10 rounded-[16px] lg:rounded-[24px]" />
              )
            ) : (
              <div className="w-full h-full min-h-[200px] flex items-center justify-center relative z-10">
                <Box className="w-16 h-16 lg:w-20 lg:h-20 text-primary/20 dark:text-white/10" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Features */}
        <div className="flex-1 flex flex-col justify-center gap-6 z-20">
          {displayFeatures.slice(Math.ceil(displayFeatures.length / 2)).map((feat, idx) => (
            <motion.div
              key={`right-feat-${idx}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              animate={{ y: [0, -4, 0] }}
              transition={{ 
                y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: (idx + 3) * 0.4 },
                opacity: { duration: 0.5, delay: idx * 0.1 },
                x: { duration: 0.5, delay: idx * 0.1 }
              }}
            >
              <FeatureItem feat={feat} compact={true} />
            </motion.div>
          ))}
        </div>
      </div>

      {slug && category && (
        <div className="mt-4 lg:mt-6 flex flex-col items-center w-full relative z-30">
          {slug === 'niyamsaathi' && (
            <div className="max-w-4xl text-center mb-3 px-4">
              <p className="text-neutral-text/90 dark:text-gray-300 text-base lg:text-lg leading-relaxed font-normal">
                As a NiyamSaathi partner, you can offer compliance assessments to your clients without needing a large team of specialists. Our AI-guided platform helps your team deliver assessments even when dedicated compliance resources aren’t available.
              </p>
            </div>
          )}
          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${category}/${slug}`}
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-primary bg-primary/10 hover:bg-primary/20 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              Know More
            </Link>
            {slug === 'niyamsaathi' && (
              <Link 
                href="/book-a-demo"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
              >
                Become a NiyamSaathi Partner
              </Link>
            )}
          </div>

          {slug === 'niyamsaathi' && (
            <div
              className="overflow-hidden flex relative mt-2"
              style={{
                width: `${logoStripWidth}px`,
                maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
              }}
            >
              <motion.div 
                className="flex items-center min-w-max"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ ease: "linear", duration: 30, repeat: Infinity }}
              >
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="shrink-0 mr-6" style={{ width: '220px', height: '40px', overflow: 'hidden' }}>
                    <img 
                      src="/client_logos.jpg" 
                      alt="Partners" 
                      style={{ 
                        width: '220px', 
                        height: 'auto',
                        marginTop: '-36px',
                        filter: 'grayscale(1) contrast(1.2) opacity(0.85)'
                      }}
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FeatureItem({ feat, compact = false }: { feat: Feature, compact?: boolean }) {
  return (
    <div className="relative group/halo w-full h-full">
      {/* Halation glow */}
      <div className="absolute -inset-4 bg-[rgba(100,150,255,0.18)] dark:bg-[rgba(90,140,255,0.15)] rounded-[24px] blur-[15px] opacity-0 group-hover/halo:opacity-100 transition-opacity duration-500 z-0 pointer-events-none"></div>
      
      <div 
        className={`relative z-10 flex items-start gap-3 lg:gap-4 bg-[rgba(255,255,255,0.65)] dark:bg-[rgba(20,20,30,0.7)] backdrop-blur-md border border-[rgba(70,110,220,0.2)] rounded-[16px] shadow-[0_10px_30px_rgba(50,80,150,0.08)] hover:border-[rgba(70,110,240,0.4)] hover:shadow-[0_15px_40px_rgba(50,90,180,0.12)] transition-all duration-300 ease-in-out group/feature ${compact ? 'p-[14px] lg:p-[16px]' : 'p-[16px_18px]'}`}
      >
      <div className="flex items-center justify-center w-[30px] h-[30px] lg:w-[34px] lg:h-[34px] rounded-full bg-[rgba(70,120,240,0.12)] border border-[rgba(70,120,240,0.2)] shrink-0 mt-0.5">
        {feat.isComingSoon ? (
          <Clock className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-500" />
        ) : (
          <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#4169E1]" />
        )}
      </div>
      <div className="leading-snug mt-0.5">
        {feat.bold && (
          <div className="mb-1">
            <strong className={`${compact ? 'text-[14px] lg:text-[15px]' : 'text-lg lg:text-xl'} text-neutral-text dark:text-gray-100 font-bold leading-tight block`}>
              {feat.bold}
            </strong>
          </div>
        )}
        <div className={`${compact ? 'text-[12px] lg:text-[14px]' : 'text-lg lg:text-xl'} ${feat.isComingSoon ? "text-gray-500" : "text-text-secondary dark:text-gray-300"} group-hover/feature:text-neutral-text dark:group-hover/feature:text-gray-200 transition-colors leading-relaxed`}>
          {feat.text}
          {feat.isComingSoon && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wider align-middle">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
