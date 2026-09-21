import { motion } from "framer-motion";
import { CheckCircle2, Clock, Box } from "lucide-react";
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
  category
}: PlatformCardProps) {
  const isImageRight = index % 2 === 0;
  const isVideo = image?.endsWith('.mp4');

  return (
    <div className={`group flex flex-col items-center bg-[linear-gradient(135deg,rgba(215,235,255,0.95)_0%,rgba(160,200,255,0.9)_100%)] dark:bg-[linear-gradient(135deg,rgba(30,58,138,0.7)_0%,rgba(15,23,42,0.95)_100%)] backdrop-blur-[12px] border border-[rgba(90,120,220,0.2)] rounded-[24px] p-6 md:p-8 lg:p-12 shadow-[0_15px_50px_rgba(50,80,150,0.15)] relative overflow-hidden`}>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[rgba(70,110,230,0.3)] rounded-tl-[24px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[rgba(70,110,230,0.3)] rounded-tr-[24px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[rgba(70,110,230,0.3)] rounded-bl-[24px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[rgba(70,110,230,0.3)] rounded-br-[24px] pointer-events-none"></div>
      
      {/* Top Center Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`w-full max-w-4xl text-center flex flex-col items-center mb-8 lg:mb-4 relative z-30 ${isPlaceholder ? 'opacity-70' : ''}`}
      >
        <h4 className="text-4xl lg:text-5xl font-serif font-[800] mb-4 pb-2 leading-tight tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#123F78,#4169E1)] dark:bg-[linear-gradient(90deg,#8BA4FF,#C4D2FF)]">
          {name}
        </h4>
        {tagline && (
          <p className="text-primary/90 dark:text-gray-200 font-medium text-lg lg:text-xl leading-relaxed mb-5 max-w-3xl">
            {tagline}
          </p>
        )}
        {description && (
          (() => {
            const cleanDesc = (tagline && description.startsWith(tagline)) ? description.substring(tagline.length).trim() : description;
            return cleanDesc ? (
              <p className="text-neutral-text/90 dark:text-gray-300 text-lg lg:text-xl leading-relaxed font-normal max-w-3xl">
                {cleanDesc}
              </p>
            ) : null;
          })()
        )}
      </motion.div>

      {/* MOBILE LAYOUT: Staggered Floating Stack (< 768px) */}
      <div className={`w-full flex flex-col md:hidden gap-8 items-center mt-6 ${isPlaceholder ? 'opacity-70' : ''}`}>
        
        {/* Top Features */}
        <div className="flex flex-col gap-5 w-full z-20 relative px-2">
          {features.slice(0, Math.ceil(features.length / 2)).map((feat, idx) => (
            <motion.div
              key={`mob-top-${idx}`}
              className="w-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4 + (idx % 3), ease: "easeInOut", delay: idx * 0.2 }}
            >
              <FeatureItem feat={feat} compact />
            </motion.div>
          ))}
        </div>

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
                <video src={image} autoPlay loop muted playsInline className="w-full h-auto object-cover relative z-10 rounded-[20px]" />
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

        {/* Bottom Features */}
        <div className="flex flex-col gap-5 w-full z-20 relative px-2">
          {features.slice(Math.ceil(features.length / 2)).map((feat, idx) => (
            <motion.div
              key={`mob-bot-${idx}`}
              className="w-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4 + (idx % 3), ease: "easeInOut", delay: idx * 0.2 }}
            >
              <FeatureItem feat={feat} compact />
            </motion.div>
          ))}
        </div>
      </div>

      {/* TABLET & DESKTOP LAYOUT: Orbital Floating (>= 768px) */}
      <div className={`hidden md:flex w-full min-h-[700px] lg:min-h-[800px] xl:min-h-[900px] relative items-center justify-center mt-12 ${isPlaceholder ? 'opacity-70' : ''}`}>
        
        {/* Center Video/Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute z-10 w-[clamp(280px,35vw,550px)] flex items-center justify-center group-hover:scale-105 transition-transform duration-700"
        >
          {/* Soft Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[rgba(80,120,255,0.15)] rounded-full blur-[60px] lg:blur-[80px] pointer-events-none z-[-1]"></div>
          
          {/* Decorations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-dashed border-[rgba(90,110,255,0.3)] pointer-events-none z-[-1] animate-[spin_60s_linear_infinite]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[135%] h-[135%] rounded-full border border-[rgba(90,110,255,0.1)] pointer-events-none z-[-1] animate-[spin_40s_linear_infinite_reverse]"></div>
          
          <div className={`relative w-full ${!isVideo ? "aspect-square" : ""} bg-[rgba(255,255,255,0.5)] dark:bg-[rgba(20,20,30,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.8)] dark:border-[rgba(255,255,255,0.15)] rounded-[24px] lg:rounded-[32px] shadow-[0_30px_70px_rgba(40,70,140,0.2)] overflow-hidden z-10 p-2 lg:p-3`}>
            {!isVideo && <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 dark:opacity-10"></div>}
            {image ? (
              isVideo ? (
                <video src={image} autoPlay loop muted playsInline className="w-full h-auto object-cover relative z-10 rounded-[16px] lg:rounded-[24px]" />
              ) : (
                <img src={image} alt={name} className="w-full h-full object-contain p-4 lg:p-6 relative z-10" />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center relative z-10">
                <Box className="w-16 h-16 lg:w-20 lg:h-20 text-primary/20 dark:text-white/10" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Floating Features */}
        {features.map((feat, idx) => {
          // Distribute items evenly around a circle
          const angle = (idx * (2 * Math.PI) / features.length) - (Math.PI / 2);

          return (
            <div 
              key={`desk-${idx}`}
              className="absolute z-20 w-[250px] lg:w-[300px] xl:w-[340px]"
              style={{
                // Responsive radii using clamp and vw, allowing seamless scaling from Tablet to Desktop
                left: `calc(50% + (clamp(260px, 38vw, 450px) * ${Math.cos(angle)}))`,
                top: `calc(50% + (clamp(240px, 32vw, 360px) * ${Math.sin(angle)}))`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                animate={{ y: [0, -12, 0] }}
                transition={{ 
                  y: { repeat: Infinity, duration: 4 + (idx % 3), ease: "easeInOut", delay: idx * 0.3 },
                  opacity: { duration: 0.5, delay: idx * 0.1 },
                  scale: { duration: 0.5, delay: idx * 0.1 }
                }}
              >
                <FeatureItem feat={feat} compact />
              </motion.div>
            </div>
          )
        })}
      </div>

      {slug && category && (
        <div className="mt-12 md:mt-16 lg:mt-12 flex justify-center w-full relative z-30">
          <Link 
            href={`/${category}/${slug}`}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-xl text-primary bg-primary/10 hover:bg-primary/20 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            Know More
          </Link>
        </div>
      )}
    </div>
  );
}

function FeatureItem({ feat, compact = false }: { feat: Feature, compact?: boolean }) {
  return (
    <div 
      className={`flex items-start gap-3 lg:gap-4 bg-[rgba(255,255,255,0.65)] dark:bg-[rgba(20,20,30,0.7)] backdrop-blur-md border border-[rgba(70,110,220,0.2)] rounded-[16px] shadow-[0_10px_30px_rgba(50,80,150,0.08)] hover:border-[rgba(70,110,240,0.4)] hover:shadow-[0_15px_40px_rgba(50,90,180,0.12)] transition-all duration-300 ease-in-out group/feature ${compact ? 'p-[14px] lg:p-[16px]' : 'p-[16px_18px]'}`}
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
            <strong className={`${compact ? 'text-[15px] lg:text-lg' : 'text-lg lg:text-xl'} text-neutral-text dark:text-gray-100 font-bold leading-tight block`}>
              {feat.bold}
            </strong>
          </div>
        )}
        <div className={`${compact ? 'text-[13px] lg:text-base' : 'text-lg lg:text-xl'} ${feat.isComingSoon ? "text-gray-500" : "text-text-secondary dark:text-gray-300"} group-hover/feature:text-neutral-text dark:group-hover/feature:text-gray-200 transition-colors leading-relaxed`}>
          {feat.text}
          {feat.isComingSoon && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wider align-middle">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
