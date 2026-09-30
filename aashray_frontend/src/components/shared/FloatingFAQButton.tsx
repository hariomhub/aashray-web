"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function FloatingFAQButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Link href="/faq" className="flex items-center gap-3 bg-primary text-white px-6 py-4 rounded-full shadow-2xl hover:bg-primary-dark transition-all hover:-translate-y-1 group">
        <MessageCircle className="w-6 h-6" />
        <span className="font-semibold text-lg max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          How can I help?
        </span>
      </Link>
    </div>
  );
}
