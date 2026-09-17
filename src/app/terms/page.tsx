import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Aashray Infotech",
  description: "Terms of Service for Aashray Infotech",
};

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-primary mb-8">Terms of Service</h1>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 mb-8 rounded-r-md">
            <strong>TODO: Legal Review Required.</strong> The following content is a placeholder and must be reviewed by legal counsel.
          </div>

          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-6">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-semibold text-primary mt-8 mb-4">2. Use License</h2>
          <p className="text-gray-600 mb-6">
            Permission is granted to temporarily download one copy of the materials (information or software) on Aashray Infotech's website for personal, non-commercial transitory viewing only.
          </p>
        </div>
      </div>
    </div>
  );
}
