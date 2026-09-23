"use client";

import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";
import { Users } from "lucide-react";

export default function LeadershipTeam() {
  const { leadership } = aboutContent;

  return (
    <section className="py-12 bg-white dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white mb-6"
          >
            {leadership.heading}
          </motion.h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {leadership.members?.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-white dark:border-gray-800 shadow-lg relative bg-white dark:bg-gray-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-1">
                  {member.name}
                </h3>
                <p className="text-primary dark:text-blue-400 font-medium text-center">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
