import { Metadata } from "next";
import { PlayCircle, Clock, BookOpen, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Learning Hub | Aashray Infotech",
  description: "Watch and learn with Aashray Infotech. Stay updated with the latest insights on DPDP compliance, data security, and best practices.",
};

export default function LearningPage() {
  const placeholderVideos = [
    {
      id: 1,
      title: "Introduction to DPDP Act 2023",
      category: "Compliance Basics",
      duration: "Coming Soon",
      thumbnail: "bg-blue-900",
    },
    {
      id: 2,
      title: "How to conduct a Data Audit",
      category: "Practical Guides",
      duration: "Coming Soon",
      thumbnail: "bg-indigo-900",
    },
    {
      id: 3,
      title: "Setting up E-Sehmati for Consent Management",
      category: "Product Tutorials",
      duration: "Coming Soon",
      thumbnail: "bg-purple-900",
    },
    {
      id: 4,
      title: "Automating TPRM on your Infrastructure",
      category: "Product Tutorials",
      duration: "Coming Soon",
      thumbnail: "bg-slate-900",
    },
    {
      id: 5,
      title: "The role of a DPO under the new regulations",
      category: "Expert Insights",
      duration: "Coming Soon",
      thumbnail: "bg-teal-900",
    },
    {
      id: 6,
      title: "VAPT Testing Explained",
      category: "Security",
      duration: "Coming Soon",
      thumbnail: "bg-cyan-900",
    },
  ];

  return (
    <div className="min-h-screen pt-12 pb-24">
      {/* Header Section */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 text-center mb-16">
        <span className="text-sm font-semibold tracking-wide uppercase text-accent mb-3 block">
          Video Library
        </span>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-text dark:text-white mb-6">
          Learning Hub
        </h1>
        <p className="text-xl text-text-secondary dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Stay updated with the latest insights on DPDP compliance, data security, and best practices directly from our experts.
        </p>
      </div>

      {/* Featured YouTube Channel Link */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 mb-16">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-6 mb-6 md:mb-0">
            <div className="w-16 h-16 bg-[#FF0000]/10 rounded-full flex items-center justify-center shrink-0">
              <PlayCircle className="w-8 h-8 text-[#FF0000]" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-neutral-text dark:text-white mb-2">
                Official YouTube Channel
              </h2>
              <p className="text-text-secondary dark:text-gray-400">
                Subscribe for our latest tutorials, webinars, and deep-dives.
              </p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@AASHRAYINFOTECH"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-[#FF0000] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#CC0000] transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2 group w-full md:w-auto justify-center"
          >
            Visit Channel
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Video Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold text-neutral-text dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Upcoming Content
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {placeholderVideos.map((video) => (
            <div 
              key={video.id}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all group flex flex-col h-full"
            >
              {/* Thumbnail Placeholder */}
              <div className={`w-full aspect-video ${video.thumbnail} relative flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10 border border-white/20">
                  <PlayCircle className="w-6 h-6 text-white opacity-80" />
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-xs font-medium text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-xs font-semibold tracking-wider uppercase text-primary mb-3 block">
                  {video.category}
                </span>
                <h3 className="text-lg font-bold text-neutral-text dark:text-white leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                  {video.title}
                </h3>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button className="text-sm font-medium text-gray-400 cursor-not-allowed flex items-center gap-1">
                    Available Soon
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
