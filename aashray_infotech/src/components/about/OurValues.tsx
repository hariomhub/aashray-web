"use client";

import { motion } from "framer-motion";
import { Shield, Lightbulb, Users, Heart } from "lucide-react";
import { aboutContent } from "@/content/about";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "shield": return <Shield className="w-10 h-10 lg:w-12 lg:h-12" />;
    case "lightbulb": return <Lightbulb className="w-10 h-10 lg:w-12 lg:h-12" />;
    case "users": return <Users className="w-10 h-10 lg:w-12 lg:h-12" />;
    case "heart": return <Heart className="w-10 h-10 lg:w-12 lg:h-12" />;
    default: return <Shield className="w-10 h-10 lg:w-12 lg:h-12" />;
  }
};

export default function OurValues() {
  const { values } = aboutContent;

  return (
    <section className="py-12 bg-slate-50 dark:bg-gray-900 relative">
      <div className="w-full px-2 lg:px-4 max-w-full mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {values.heading}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4 items-stretch">
          {values.items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary dark:bg-primary-dark rounded-2xl lg:rounded-[2rem] p-8 lg:p-14 shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-primary-light/10 text-center hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden flex flex-col justify-center"
            >
              {/* Optional subtle glow inside the card on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mb-8 lg:mb-10 shadow-[0_0_30px_rgba(251,191,36,0.4)] group-hover:shadow-[0_0_50px_rgba(251,191,36,0.7)] group-hover:scale-110 group-hover:bg-amber-400/20 group-hover:text-amber-300 transition-all duration-300 relative z-10">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 relative z-10 tracking-wide">{item.title}</h3>
              <p className="text-blue-100/90 leading-relaxed text-xl lg:text-2xl font-light relative z-10">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
