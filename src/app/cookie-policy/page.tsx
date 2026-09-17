import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Aashray Infotech",
  description: "Cookie Policy for Aashray Infotech",
};

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-primary mb-8">Cookie Policy</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mb-8 rounded-r-md">
            <strong>TODO: Legal Review Required.</strong> The following content is a placeholder and must be reviewed by legal counsel.
          </div>

          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">What Are Cookies?</h2>
          <p className="text-gray-600 mb-6">
            Cookies are small text files that are stored on your device when you visit our website. They help us understand how you interact with our site and allow us to improve your experience.
          </p>

          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">How We Use Cookies</h2>
          <p className="text-gray-600 mb-6">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6 space-y-2">
            <li><strong>Essential Cookies:</strong> Strictly necessary for the website to function.</li>
            <li><strong>Analytics Cookies:</strong> To understand anonymous visitor behavior.</li>
            <li><strong>Media Cookies:</strong> To allow third-party embedded media (e.g., YouTube) to function.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
