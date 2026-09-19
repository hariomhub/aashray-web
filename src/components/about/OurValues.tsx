"use client";

import { motion } from "framer-motion";
import { Shield, Lightbulb, Users, Heart } from "lucide-react";
import { aboutContent } from "@/content/about";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "shield": return <Shield className="w-8 h-8" />;
    case "lightbulb": return <Lightbulb className="w-8 h-8" />;
    case "users": return <Users className="w-8 h-8" />;
    case "heart": return <Heart className="w-8 h-8" />;
    default: return <Shield className="w-8 h-8" />;
  }
};

export default function OurValues() {
  const { values } = aboutContent;

  return (
    <section className="py-12 bg-slate-50 dark:bg-gray-900 relative">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {values.heading}
          </motion.h2>
          {/* @ts-ignore */}
          {values.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg text-gray-600 dark:text-gray-300"
            >
              {/* @ts-ignore */}
              {values.description}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-primary dark:bg-primary-dark rounded-2xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.2)] border border-primary-dark dark:border-gray-800 text-center hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Optional subtle glow inside the card on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="w-16 h-16 mx-auto bg-white/10 dark:bg-black/20 text-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                {getIcon(item.icon)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
              <p className="text-white/80 leading-relaxed relative z-10">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
