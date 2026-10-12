import { Metadata } from "next";
import { faqs } from "@/content/faq";
import FaqAccordion from "@/components/shared/FaqAccordion";
import JsonLd, { getFaqSchema, getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | DPDP Act & Product Answers",
  description:
    "Find answers to frequently asked questions about Aashray Infotech, on-premise AI deployment, DPDP Act 2023 compliance, security architecture, and partner programs.",
  keywords: [
    "DPDP Act FAQ",
    "Aashray Infotech FAQ",
    "On-premise compliance questions",
    "Data privacy audit questions",
    "NiyamSaathi FAQ",
    "ComplianceQuest FAQ",
  ],
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "FAQ | Aashray Infotech",
    description:
      "Frequently asked questions about DPDP compliance, zero-data-leakage architecture, and AI platforms.",
    url: "https://www.aashrayinfotech.com/faq",
  },
};

export default function FAQPage() {
  const faqSchema = getFaqSchema(faqs);
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "FAQ", url: "/faq" },
  ]);

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen pt-24 pb-32">
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbs} />
      <div className="w-full px-4 lg:px-8 mx-auto">
        <div className="text-center mb-16">
          <span className="text-accent text-sm font-bold tracking-widest uppercase mb-4 block">Help Center</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-neutral-text dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-text-secondary dark:text-gray-400 font-light max-w-3xl mx-auto">
            Everything you need to know about our products, DPDP Act compliance, and on-premise architecture. Can't find the answer you're looking for? Please contact our support team.
          </p>
        </div>

        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  );
}

