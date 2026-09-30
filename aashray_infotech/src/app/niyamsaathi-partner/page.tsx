import { Metadata } from "next";
import NiyamSaathiForm from "@/components/home/NiyamSaathiForm";

export const metadata: Metadata = {
  title: "Become a NiyamSaathi Partner | Aashray Infotech",
  description: "Join us as a NiyamSaathi partner to offer AI-guided compliance assessments to your clients without needing a large in-house compliance team.",
};

export default function NiyamSaathiPartnerPage() {
  return (
    <div className="pt-20">
      <NiyamSaathiForm />
    </div>
  );
}
