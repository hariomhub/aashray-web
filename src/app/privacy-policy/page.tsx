import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Aashray Infotech",
  description: "Privacy Policy for Aashray Infotech",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-sans font-semibold text-primary mb-8">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mb-8 rounded-r-md">
            <strong>TODO: Legal Review Required.</strong> The following content is a placeholder and must be reviewed and replaced by legal counsel to ensure DPDP Act compliance.
          </div>

          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-600 mb-6">
            Aashray Infotech Private Limited ("we", "our", or "us") is committed to protecting your privacy and ensuring compliance with the Digital Personal Data Protection Act (DPDP Act). This Privacy Policy explains how we collect, use, and protect your personal data when you visit our website.
          </p>

          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">2. Data We Collect</h2>
          <p className="text-gray-600 mb-6">
            We collect personal data that you voluntarily provide to us when requesting a demo, including your name, email address, phone number, and company name.
          </p>
          
          {/* Add more sections as needed for the placeholder */}
        </div>
      </div>
    </div>
  );
}
