import type { Metadata } from "next";
import Image from "next/image";
import AboutHero from "@/components/about/AboutHero";
import OurValues from "@/components/about/OurValues";
import OurAashray from "@/components/about/OurAashray";
import { aboutContent } from "@/content/about";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "About Us | AI-Driven Data Protection & DPDP Leadership",
  description:
    "Learn about Aashray Infotech's mission, leadership team, and our commitment to building on-premise AI privacy and DPDP Act compliance solutions for Indian enterprises.",
  keywords: [
    "About Aashray Infotech",
    "Data privacy leaders India",
    "DPDP Act compliance team",
    "Aashray leadership",
    "On-premise AI engineering",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Aashray Infotech",
    description:
      "Engineering on-premise AI solutions to make Indian enterprises DPDP Act-compliant and audit-ready.",
    url: "https://www.aashrayinfotech.com/about",
  },
};

export default function AboutPage() {
  const { members } = aboutContent.leadership;
  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about" },
  ]);

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950">
      <JsonLd data={breadcrumbData} />
      <AboutHero />

      <OurValues />
      <OurAashray />

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-12">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-gray-900 dark:text-white text-center mb-10">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {members?.map((leader, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] dark:hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8 text-center relative z-10 bg-white dark:bg-gray-900">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-bold text-accent uppercase tracking-widest">
                    {leader.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
