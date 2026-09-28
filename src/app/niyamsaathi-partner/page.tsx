import { Metadata } from "next";
import DemoForm from "@/components/home/DemoForm";

export const metadata: Metadata = {
  title: "Become a NiyamSaathi Partner | Aashray Infotech",
  description: "Join us as a partner to offer compliance assessments to your clients without needing a large team of specialists.",
};

export default function NiyamSaathiPartnerPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-neutral-text dark:text-white mb-6">
          Become a NiyamSaathi partner
        </h1>
        <p className="text-xl text-text-secondary dark:text-gray-300 leading-relaxed">
          Join us as a partner to offer compliance assessments to your clients without needing a large team of specialists.
        </p>
      </div>
      <DemoForm 
        title="Become a NiyamSaathi partner"
        description="As a NiyamSaathi partner, you can offer compliance assessments to your clients without needing a large team of specialists. Our AI-guided platform helps your team deliver assessments even when dedicated compliance resources aren’t available."
        buttonText="Become a NiyamSaathi partner"
      />
    </div>
  );
}
