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
    <div className={`flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center ${isImageRight ? "" : "lg:flex-row-reverse"}`}>
      {/* Text Block */}
      <motion.div
        initial={{ opacity: 0, x: isImageRight ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="lg:w-2/3 flex flex-col relative"
      >

        
        <div className={`mb-6 ${isPlaceholder ? 'opacity-70' : ''}`}>
          <h4 className="text-3xl lg:text-4xl font-serif font-semibold text-primary dark:text-white mb-3">
            {name}
          </h4>
          {tagline && (
            <p className="text-primary dark:text-white italic font-medium text-base lg:text-lg leading-relaxed mb-4">
              {tagline}
            </p>
          )}
          {description && (
            <p className="text-text-secondary dark:text-gray-300 text-lg lg:text-xl leading-relaxed mb-4">
              {description}
            </p>
          )}
        </div>
        
        <div className={`space-y-4 mb-16 ${isPlaceholder ? 'opacity-70' : ''}`}>
          {features.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3">
              {feat.isComingSoon ? (
                <Clock className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                {feat.bold && (
                  <>
                    <strong className="text-neutral-text dark:text-gray-200">{feat.bold}</strong>
                    <span className="text-neutral-text dark:text-gray-400 mx-1">-</span>
                  </>
                )}
                <span className={`text-lg ${feat.isComingSoon ? "text-gray-500" : "text-text-secondary dark:text-gray-300"}`}>
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
        className={`lg:w-1/3 flex items-center justify-center relative ${!isVideo ? "w-[240px] md:w-[320px] aspect-square mx-auto lg:mx-0 bg-neutral-bg dark:bg-gray-900 rounded-2xl border border-border-light dark:border-gray-800 overflow-hidden" : "w-full mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-xl"}`}
      >
        {!isVideo && <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-5 dark:opacity-10"></div>}
        {image ? (
          isVideo ? (
            <video 
              src={image} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto object-cover relative z-10 rounded-2xl"
            />
          ) : (
            <img src={image} alt={name} className="w-full h-full object-contain p-6 md:p-8 relative z-10" />
          )
        ) : (
          <Box className="w-16 h-16 text-primary/20 dark:text-white/10 relative z-10" />
        )}
      </motion.div>
    </div>
  );
}
