import { Metadata } from "next";
import Hero from "@/components/home/Hero";
import OurApproach from "@/components/home/OurApproach";
import Products from "@/components/home/Products";
import DataControl from "@/components/home/DataControl";
import ConstantInnovation from "@/components/home/ConstantInnovation";
import TrustBand from "@/components/home/TrustBand";
import JsonLd, { getSoftwareAppSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Aashray Infotech | AI products for safer digital planet",
  description:
    "Aashray Infotech provides on-premise, AI-enabled platforms helping Indian organizations become DPDP Act 2023-compliant and audit-ready with zero data exposure.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const featuredApps = [
    getSoftwareAppSchema({
      name: "ComplianceQuest",
      description:
        "AI-powered mobile app turning the DPDP Act 2023 into bite-sized, gamified learning for organizations and individuals.",
      url: "/platforms/compliancequest",
    }),
    getSoftwareAppSchema({
      name: "NiyamSaathi",
      description:
        "AI-guided compliance assessment platform helping organizations assess and remediate DPDP Act controls with ease.",
      url: "/platforms/niyamsaathi",
    }),
    getSoftwareAppSchema({
      name: "Suraksha Chinh",
      description:
        "On-screen active and invisible watermarking software preventing unauthorized screen captures, snipping, and camera recording.",
      url: "/products/protection-mark",
    }),
    getSoftwareAppSchema({
      name: "E-Sehmati",
      description:
        "End-to-end DPDP consent architecture platform managing customer consent across digital and offline touchpoints with automated RoPA and SLA tracking.",
      url: "/platforms/e-sehmati",
    }),
  ];

  return (
    <div className="flex flex-col w-full !max-w-none !m-0 min-h-screen">
      {featuredApps.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <Hero />
      <Products />
      <DataControl />
      <OurApproach />
      <ConstantInnovation />
      <TrustBand />
    </div>
  );
}

