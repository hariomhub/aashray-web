"use client";

import { FileText, HelpCircle, Video } from "lucide-react";

interface Resource {
  title: string;
  type: "pdf" | "faq" | "video";
  url: string;
}

interface ProductResourcesProps {
  resources?: Resource[];
}

export default function ProductResources({ resources = [] }: ProductResourcesProps) {
  if (resources.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-12 border border-gray-100 dark:border-gray-800 max-w-2xl mx-auto">
          <FileText className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
          <h3 className="text-2xl font-sans font-bold text-gray-900 dark:text-white mb-4">
            Resources Coming Soon
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            We are currently preparing datasheets, FAQs, and video guides for this offering. Check back soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            className="group flex flex-col items-center text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-bg dark:bg-gray-800 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
              {resource.type === "pdf" && <FileText className="w-8 h-8 text-primary" />}
              {resource.type === "faq" && <HelpCircle className="w-8 h-8 text-primary" />}
              {resource.type === "video" && <Video className="w-8 h-8 text-primary" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <span className="text-primary font-medium text-sm flex items-center gap-1">
              View {resource.type.toUpperCase()}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
