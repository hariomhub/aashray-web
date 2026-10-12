import { Metadata } from "next";
import NiyamSaathiForm from "@/components/home/NiyamSaathiForm";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Partner Program | Become a NiyamSaathi Compliance Assessment Partner",
  description:
    "Join the NiyamSaathi Partner Program. Deliver AI-guided DPDP Act 2023 compliance assessments to your enterprise clients without building a massive in-house compliance advisory team.",
  keywords: [
    "NiyamSaathi partner",
    "DPDP compliance partner program",
    "Compliance consultant partnership",
    "Data audit partnership India",
    "Aashray Infotech partners",
  ],
  alternates: {
    canonical: "/niyamsaathi-partner",
  },
  openGraph: {
    title: "NiyamSaathi Partner Program | Aashray Infotech",
    description:
      "Deliver AI-guided compliance assessments to your clients with NiyamSaathi.",
    url: "https://www.aashrayinfotech.com/niyamsaathi-partner",
  },
};

export default function NiyamSaathiPartnerPage() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "NiyamSaathi Partner", url: "/niyamsaathi-partner" },
  ]);

  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-10 bg-neutral-bg dark:bg-gray-950 min-h-screen">
      <JsonLd data={breadcrumbs} />
      <NiyamSaathiForm />
    </div>
  );
}

