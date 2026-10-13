import type { Metadata } from "next";
import JsonLd, { getBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Privacy Policy | DPDP Act 2023 Compliance",
  description:
    "Privacy Policy for Aashray Infotech Private Limited. Learn how we handle personal data, ensure DPDP Act 2023 compliance, and respect Data Principal rights.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Aashray Infotech",
    description:
      "Privacy Policy for Aashray Infotech Private Limited detailing our data protection standards and DPDP Act 2023 compliance.",
    url: "https://www.aashrayinfotech.com/privacy-policy",
  },
};

export default function PrivacyPolicy() {
  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Privacy Policy", url: "/privacy-policy" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <JsonLd data={breadcrumbs} />
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 transition-colors">
        <h1 className="text-3xl md:text-4xl font-sans font-semibold text-primary dark:text-sky-400 mb-6">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
          Last Updated: October 2026 | Compliant with the Digital Personal Data Protection Act (DPDP Act) 2023
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed font-sans text-base">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              1. Introduction & Commitment
            </h2>
            <p>
              Aashray Infotech Private Limited (&quot;Aashray Infotech&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy, integrity, and confidentiality of personal data entrusted to us. As a provider of on-premise governance and privacy software solutions engineered in India, we strictly adhere to the Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;) and applicable Indian data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              2. Scope of this Policy
            </h2>
            <p>
              This Privacy Policy explains how we collect, process, store, and safeguard personal data when you visit our website (www.aashrayinfotech.com), interact with our partner programs, or schedule demonstrations of our enterprise platforms (including NiyamSaathi, Suraksha Chinh, and E-Sehmati).
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              3. Data We Collect
            </h2>
            <p className="mb-3">We collect only the minimal personal data necessary to provide our services and communications:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contact Information:</strong> Full name, professional email address, phone number, organization name, and designation when you submit demo requests, partner inquiries, or contact forms.</li>
              <li><strong>Technical Metadata:</strong> Anonymized server logs, browser type, device information, and interaction timestamps collected solely for system security and website performance.</li>
              <li><strong>Partner Applications:</strong> Business entity details, authorized representative credentials, and professional background for NiyamSaathi partner onboarding.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              4. Zero Data Exposure Principle
            </h2>
            <p>
              Our flagship platforms (including NiyamSaathi and Suraksha Chinh) operate on an on-premise and private cloud architecture. Customer data processed by our deployed enterprise products remains strictly within the customer&apos;s own infrastructure. Aashray Infotech does not harvest, transmit, or retain your proprietary enterprise data—<strong>0 bytes leave your network</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              5. Lawful Basis and Purpose of Processing
            </h2>
            <p className="mb-3">Under the DPDP Act 2023, personal data is processed based on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Consent:</strong> Explicit and informed consent provided by you when submitting inquiries or demonstration requests.</li>
              <li><strong>Legitimate Uses:</strong> Responding to authorized business communications, fulfilling contractual obligations, and ensuring cyber incident mitigation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              6. Rights of Data Principals
            </h2>
            <p className="mb-3">As recognized under Chapter III of the DPDP Act 2023, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right to Access Information:</strong> Request a summary of personal data processed by us and identities of data fiduciaries with whom it has been shared.</li>
              <li><strong>Right to Correction &amp; Erasure:</strong> Correct incomplete or inaccurate data, update information, or request deletion of personal data no longer necessary for the original purpose.</li>
              <li><strong>Right of Grievance Redressal:</strong> Avail readily accessible grievance redressal mechanisms regarding any act or omission in relation to your personal data.</li>
              <li><strong>Right to Nominate:</strong> Nominate an individual to exercise rights on your behalf in the event of death or incapacity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              7. Data Retention &amp; Security
            </h2>
            <p>
              We implement industry-standard encryption, strict access controls, and regular vulnerability assessments. Personal data obtained through website inquiries is retained only as long as necessary to fulfill the business relationship or satisfy regulatory requirements, after which it is securely purged.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-primary dark:text-white mb-3">
              8. Grievance Redressal &amp; Data Protection Officer
            </h2>
            <p className="mb-3">
              In compliance with the DPDP Act 2023, you may contact our designated Grievance Officer and Data Protection Officer regarding any privacy inquiries or to exercise your Data Principal rights:
            </p>
            <div className="bg-neutral-bg dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 space-y-1 text-sm">
              <p><strong>Grievance Officer:</strong> Data Protection Officer (DPO)</p>
              <p><strong>Entity:</strong> Aashray Infotech Private Limited</p>
              <p><strong>Email:</strong> <a href="mailto:support@aashrayinfotech.com" className="text-primary dark:text-sky-400 hover:underline">support@aashrayinfotech.com</a></p>
              <p><strong>Registered Office:</strong> C-80, UGF, Shivaji Park, West Punjabi Bagh, New Delhi 110026, India</p>
              <p><strong>Corporate Office:</strong> Unit No. 902, 9th Floor, Block A, Unitech The Arcadia, South City-2, Gurugram, Haryana 122018, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
