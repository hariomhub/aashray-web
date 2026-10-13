import type { Metadata } from "next";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Terms of Service | Legal & Platform Terms",
  description:
    "Terms of Service governing the use of Aashray Infotech Private Limited websites, enterprise software platforms, and partner programs.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service | Aashray Infotech",
    description:
      "Terms of Service governing the use of Aashray Infotech Private Limited websites and software platforms.",
    url: "https://www.aashrayinfotech.com/terms",
  },
};

export default function Terms() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Terms of Service", url: "/terms" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <JsonLd data={breadcrumbs} />
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 transition-colors">
        <h1 className="text-3xl md:text-4xl font-sans font-semibold text-primary dark:text-sky-400 mb-6">
          Terms of Service
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          Last Updated: October 2026 | Governing Law: Republic of India
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-base">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the website and digital platforms operated by Aashray Infotech Private Limited (&quot;Aashray Infotech&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              2. Intellectual Property Rights
            </h2>
            <p>
              All software, algorithms, watermarking technologies, user interfaces, documentation, logos, trademarks, and educational content associated with Aashray Infotech (including but not limited to NiyamSaathi, Suraksha Chinh, E-Sehmati, and ComplianceQuest) are the exclusive intellectual property of Aashray Infotech Private Limited. Unauthorized copying, reverse engineering, or distribution is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              3. Permitted Use &amp; Demonstrations
            </h2>
            <p>
              Access to trial platforms, interactive demonstrations, and evaluation licenses is granted solely for internal technical evaluation by prospective enterprise clients and authorized partners. You agree not to attempt to circumvent security controls, perform unauthorized vulnerability testing without written authorization, or scrape platform assets.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              4. Enterprise Deployments &amp; SLAs
            </h2>
            <p>
              Enterprise installations, on-premise software licenses, and dedicated support commitments are governed by individual Master Services Agreements (MSA) and Service Level Agreements (SLA) executed directly between your organization and Aashray Infotech Private Limited.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              5. Disclaimer of Warranties
            </h2>
            <p>
              While Aashray Infotech products are designed to assist organizations in achieving compliance with the Digital Personal Data Protection Act, 2023, usage of our software does not constitute formal legal counsel. Organizations remain responsible for reviewing their internal policies with qualified legal advisors.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              6. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in New Delhi, India.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              7. Contact Information
            </h2>
            <p>
              For legal inquiries or corporate notices, please write to:
            </p>
            <div className="bg-neutral-bg dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1 text-sm mt-3">
              <p><strong>Legal Department:</strong> Aashray Infotech Private Limited</p>
              <p><strong>Email:</strong> <a href="mailto:support@aashrayinfotech.com" className="text-primary dark:text-sky-400 hover:underline">support@aashrayinfotech.com</a></p>
              <p><strong>Corporate Office:</strong> Unit No. 902, 9th Floor, Block A, Unitech The Arcadia, South City-2, Gurugram, Haryana 122018, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
