import type { Metadata } from "next";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Cookie Policy | Privacy & Consent Controls",
  description:
    "Cookie Policy for Aashray Infotech Private Limited explaining our privacy-preserving cookie architecture and how you can manage your preferences.",
  alternates: {
    canonical: "/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | Aashray Infotech",
    description:
      "Cookie Policy for Aashray Infotech Private Limited explaining our minimal, privacy-preserving cookie usage.",
    url: "https://www.aashrayinfotech.com/cookie-policy",
  },
};

export default function CookiePolicy() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Cookie Policy", url: "/cookie-policy" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <JsonLd data={breadcrumbs} />
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 transition-colors">
        <h1 className="text-3xl md:text-4xl font-sans font-semibold text-primary dark:text-sky-400 mb-6">
          Cookie Policy
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          Last Updated: October 2026 | Privacy-Preserving Architecture
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-base">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small data files placed on your browser or device when you visit a website. They enable websites to remember user preferences, ensure secure navigation, and maintain session continuity without identifying individuals by name.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              2. Our Privacy-First Stance
            </h2>
            <p>
              At Aashray Infotech, privacy is not an afterthought—it is our core engineering mandate. We do not use third-party behavioral advertising cookies, nor do we track your browsing activity across other websites.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              3. Categories of Cookies We Use
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-primary dark:text-sky-300 mb-1">Strictly Necessary Cookies</h3>
                <p className="text-sm">
                  Required for basic website functionality, CSRF attack prevention, and session state. These cookies do not store any personally identifiable information and cannot be switched off.
                </p>
              </div>

              <div className="p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-primary dark:text-sky-300 mb-1">Functional &amp; Preference Cookies</h3>
                <p className="text-sm">
                  Enable the website to remember user preferences, such as your chosen light or dark theme mode and cookie consent selections.
                </p>
              </div>

              <div className="p-4 bg-neutral-bg dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-primary dark:text-sky-300 mb-1">Anonymous Performance Telemetry</h3>
                <p className="text-sm">
                  Help us understand high-level page visit frequency and technical errors so we can improve site speed and reliability. All metrics are aggregated and fully anonymized.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              4. Managing &amp; Withdrawing Consent
            </h2>
            <p>
              You can adjust or withdraw your cookie preferences at any time by clicking the &quot;Cookie Settings&quot; link in our website footer. Additionally, all major web browsers allow you to modify cookie handling rules or purge existing cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              5. Inquiries
            </h2>
            <p>
              If you have any questions regarding our cookie practices, please contact us at{" "}
              <a href="mailto:support@aashrayinfotech.com" className="text-primary dark:text-sky-400 hover:underline">
                support@aashrayinfotech.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
