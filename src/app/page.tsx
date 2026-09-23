import Hero from "@/components/home/Hero";
import OurApproach from "@/components/home/OurApproach";
import Products from "@/components/home/Products";
import DataControl from "@/components/home/DataControl";

import ConstantInnovation from "@/components/home/ConstantInnovation";
import TrustBand from "@/components/home/TrustBand";

export default function Home() {
  return (
    <div className="flex flex-col w-full !max-w-none !m-0 min-h-screen">
      <Hero />
      <Products />
      <DataControl />
      <OurApproach />

      <ConstantInnovation />
      <TrustBand />
    </div>
  );
}
