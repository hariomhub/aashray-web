import { Metadata } from "next";
import DemoForm from "@/components/home/DemoForm";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Book a Demo | Experience On-Premise DPDP Compliance Platforms",
  description:
    "Schedule a live demonstration of Aashray Infotech's AI-enabled compliance platforms. See how your organization can achieve DPDP Act 2023 audit readiness with zero data leakage.",
  keywords: [
    "Book a demo Aashray Infotech",
    "DPDP compliance demo",
    "AI data protection demo",
    "NiyamSaathi live demo",
    "On-premise compliance demo",
  ],
  alternates: {
    canonical: "/book-a-demo",
  },
  openGraph: {
    title: "Book a Demo | Aashray Infotech",
    description:
      "Schedule a personalized walkthrough of our DPDP compliance platforms tailored to your infrastructure.",
    url: "https://www.aashrayinfotech.com/book-a-demo",
  },
};

export default function BookADemoPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Book a Demo", url: "/book-a-demo" },
  ]);

  return (
    <div className="pt-32 pb-24 md:pt-40">
      <JsonLd data={breadcrumbs} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-neutral-text dark:text-white mb-6">
          Book a Demo
        </h1>
        <p className="text-xl text-text-secondary dark:text-gray-300 leading-relaxed">
          See our platform in action and learn how we can tailor it to your infrastructure.
        </p>
      </div>
      <DemoForm />
    </div>
  );
}

