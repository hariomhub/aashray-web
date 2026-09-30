"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabNavProps {
  slug: string;
  category: string;
}

export default function TabNav({ slug, category }: TabNavProps) {
  const pathname = usePathname();
  const basePath = `/${category}/${slug}`;
  const isResources = pathname.endsWith("/resources");

  return (
    <div className="flex items-center gap-8 mt-12 border-b border-gray-200 dark:border-gray-800">
      <Link
        href={basePath}
        className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
          !isResources
            ? "border-primary text-primary dark:text-white"
            : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        }`}
      >
        Overview
      </Link>
      <Link
        href={`${basePath}/resources`}
        className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
          isResources
            ? "border-primary text-primary dark:text-white"
            : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
        }`}
      >
        Resources
      </Link>
    </div>
  );
}
