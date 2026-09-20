import { Metadata } from "next";
import { faqs } from "@/content/faq";
import FaqAccordion from "@/components/shared/FaqAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Aashray Infotech",
  description: "Frequently asked questions about Aashray Infotech's products, services, and AI-powered compliance solutions.",
};

export default function FAQPage() {
  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 pb-32">
      <div className="w-full px-4 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">Help Center</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-neutral-text dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 font-light max-w-3xl mx-auto">
            Everything you need to know about the product and billing. Can't find the answer you're looking for? Please contact our support team.
          </p>
        </div>

        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  );
}
