import { Metadata } from "next";
import DemoForm from "@/components/home/DemoForm";

export const metadata: Metadata = {
  title: "Book a Demo | Aashray Infotech",
  description: "Request a demo of our DPDP compliance platforms and see how Aashray Infotech can help you secure your infrastructure.",
};

export default function BookADemoPage() {
  return (
    <div className="pt-32 pb-24 md:pt-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-text dark:text-white mb-6">
          Book a Demo
        </h1>
        <p className="text-xl text-text-secondary dark:text-gray-300 leading-relaxed">
          See our platform in action and learn how we can tailor it to your infrastructure.
        </p>
      </div>
      <DemoForm />
    </div>
  );
}
