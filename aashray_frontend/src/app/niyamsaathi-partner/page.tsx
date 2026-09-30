import { Metadata } from "next";
import NiyamSaathiForm from "@/components/home/NiyamSaathiForm";

export const metadata: Metadata = {
  title: "Become a NiyamSaathi Partner | Aashray Infotech",
  description: "Join us as a NiyamSaathi partner to offer AI-guided compliance assessments to your clients without needing a large in-house compliance team.",
};

export default function NiyamSaathiPartnerPage() {
  return (
    <div className="pt-20 pb-20 px-4 sm:px-6 lg:px-10 bg-neutral-bg dark:bg-gray-950 min-h-screen">
      <NiyamSaathiForm />
    </div>
  );
}
