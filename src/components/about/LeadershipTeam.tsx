"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";
import { Users } from "lucide-react";

export default function LeadershipTeam() {
  const { leadership } = aboutContent;

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6"
          >
            {leadership.heading}
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Empty state / placeholder for bios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center relative"
          >

            
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {leadership.placeholder}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Leadership team profiles and photos will be added here once provided by the client.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
