import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  category: string;
  name: string;
}

export default function ProductBreadcrumb({ category, name }: ProductBreadcrumbProps) {
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <nav className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 pt-4">
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="capitalize">{displayCategory}</span>
      <ChevronRight className="w-4 h-4 mx-2" />
      <span className="text-gray-900 dark:text-gray-100 truncate max-w-[200px] sm:max-w-md">
        {name}
      </span>
    </nav>
  );
}
