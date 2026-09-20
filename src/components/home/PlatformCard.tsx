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
    <div className={`group flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center bg-[linear-gradient(135deg,rgba(215,235,255,0.95)_0%,rgba(160,200,255,0.9)_100%)] dark:bg-[linear-gradient(135deg,rgba(30,58,138,0.7)_0%,rgba(15,23,42,0.95)_100%)] backdrop-blur-[12px] border border-[rgba(90,120,220,0.2)] rounded-[24px] p-6 md:p-8 lg:p-10 shadow-[0_15px_50px_rgba(50,80,150,0.15)] relative ${isImageRight ? "" : "lg:flex-row-reverse"}`}>
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-[rgba(70,110,230,0.3)] rounded-tl-[24px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-[rgba(70,110,230,0.3)] rounded-tr-[24px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-[rgba(70,110,230,0.3)] rounded-bl-[24px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-[rgba(70,110,230,0.3)] rounded-br-[24px] pointer-events-none"></div>
      {/* Text Block */}
      <motion.div
        initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="lg:w-2/3 flex flex-col relative"
      >

        
        <div className={`mb-8 ${isPlaceholder ? 'opacity-70' : ''}`}>
          <h4 className="text-4xl lg:text-5xl font-serif font-[800] mb-4 pb-2 leading-tight tracking-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#123F78,#4169E1)] dark:bg-[linear-gradient(90deg,#8BA4FF,#C4D2FF)]">
            {name}
          </h4>
          {tagline && (
            <p className="text-primary/90 dark:text-gray-200 font-medium text-lg lg:text-xl leading-relaxed mb-5">
              {tagline}
            </p>
          )}
          {description && (
            (() => {
              const cleanDesc = (tagline && description.startsWith(tagline)) ? description.substring(tagline.length).trim() : description;
              return cleanDesc ? (
                <p className="text-neutral-text/90 dark:text-gray-300 text-lg lg:text-xl leading-relaxed mb-4 font-normal">
                  {cleanDesc}
                </p>
              ) : null;
            })()
          )}
        </div>
        
        <div className={`mb-12 lg:mb-16 ${isPlaceholder ? 'opacity-70' : ''}`}>
          {features.map((feat, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-4 p-[16px_18px] bg-[rgba(255,255,255,0.55)] dark:bg-[rgba(20,20,30,0.5)] border border-[rgba(70,110,220,0.12)] rounded-[16px] mb-[10px] shadow-[0_5px_18px_rgba(50,80,150,0.035)] hover:-translate-y-[2px] hover:border-[rgba(70,110,240,0.3)] hover:shadow-[0_10px_25px_rgba(50,90,180,0.08)] transition-all duration-[0.25s] ease-in-out group/feature"
            >
              {feat.isComingSoon ? (
                <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[rgba(70,120,240,0.10)] border border-[rgba(70,120,240,0.18)] shrink-0 group-hover/feature:bg-[rgba(70,120,240,0.2)] transition-colors mt-0.5">
                  <Clock className="w-5 h-5 text-gray-500" />
                </div>
              ) : (
                <div className="flex items-center justify-center w-[38px] h-[38px] rounded-full bg-[rgba(70,120,240,0.10)] border border-[rgba(70,120,240,0.18)] shrink-0 group-hover/feature:bg-[rgba(70,120,240,0.2)] transition-colors mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-[#4169E1]" />
                </div>
              )}
              <div className="leading-relaxed mt-1">
                {feat.bold && (
                  <>
                    <strong className="text-lg lg:text-xl text-neutral-text dark:text-gray-100 font-semibold">{feat.bold}</strong>
                    <span className="text-lg lg:text-xl text-neutral-text/60 dark:text-gray-400 mx-2">-</span>
                  </>
                )}
                <span className={`text-lg lg:text-xl ${feat.isComingSoon ? "text-gray-500" : "text-text-secondary dark:text-gray-300"} group-hover/feature:text-neutral-text dark:group-hover/feature:text-gray-200 transition-colors`}>
                  {feat.text}
                </span>
                {feat.isComingSoon && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {slug && category && (
          <div className="mt-2">
            <Link 
              href={`/${category}/${slug}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-primary bg-primary/10 hover:bg-primary/20 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              Know More
            </Link>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: isImageRight ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className={`lg:w-1/3 flex items-center justify-center relative group-hover:-translate-y-[6px] transition-transform duration-[4s] ease-in-out`}
      >
        {/* Soft Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[rgba(80,120,255,0.12)] rounded-full blur-[60px] pointer-events-none z-[-1]"></div>
        
        {/* Decorations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[350px] h-[300px] md:h-[350px] rounded-full border-2 border-dashed border-[rgba(90,110,255,0.25)] pointer-events-none z-[-1] animate-[spin_40s_linear_infinite]"></div>
        
        {/* Radial Accent Lines (Left Side) */}
        <div className="absolute left-[-30px] top-1/2 -translate-y-1/2 flex flex-col gap-[6px] pointer-events-none z-0">
          <div className="w-6 h-[2px] bg-[rgba(70,110,230,0.35)] rounded-full"></div>
          <div className="w-10 h-[2px] bg-[rgba(70,110,230,0.35)] rounded-full ml-3"></div>
          <div className="w-6 h-[2px] bg-[rgba(70,110,230,0.35)] rounded-full"></div>
        </div>
        
        {/* Floating Shield/Check Icon */}
        <div className="absolute top-[5%] right-[-20px] w-12 h-12 bg-white dark:bg-gray-800 rounded-full border border-[rgba(80,110,230,0.15)] shadow-[0_10px_30px_rgba(50,80,150,0.12)] flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '4s' }}>
          <CheckCircle2 className="w-6 h-6 text-[#4169E1]" />
        </div>

        <div className={`relative w-full ${!isVideo ? "max-w-[240px] md:max-w-[320px] aspect-square mx-auto lg:mx-0" : "mx-auto lg:mx-0"} bg-[rgba(255,255,255,0.4)] dark:bg-[rgba(20,20,30,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.7)] dark:border-[rgba(255,255,255,0.1)] rounded-[24px] shadow-[0_25px_60px_rgba(40,70,140,0.15)] overflow-hidden z-10 p-2`}>
          {!isVideo && <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 dark:opacity-10"></div>}
          {image ? (
            isVideo ? (
              <video 
                src={image} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-auto object-cover relative z-10 rounded-[20px]"
              />
            ) : (
              <img src={image} alt={name} className="w-full h-full object-contain p-4 md:p-6 relative z-10" />
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center relative z-10">
              <Box className="w-16 h-16 text-primary/20 dark:text-white/10" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
