import Hero from "@/components/home/Hero";
import OurApproach from "@/components/home/OurApproach";
import Products from "@/components/home/Products";
import HowItWorks from "@/components/home/HowItWorks";
import ConstantInnovation from "@/components/home/ConstantInnovation";
import TrustBand from "@/components/home/TrustBand";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <TrustBand />
      <OurApproach />
      <Products />
      <HowItWorks />
      <ConstantInnovation />
    </div>
  );
}
