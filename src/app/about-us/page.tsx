import AboutHero from "@/components/about/AboutHero";
import LeadershipTeam from "@/components/about/LeadershipTeam";
import OurValues from "@/components/about/OurValues";
import OurAashray from "@/components/about/OurAashray";

export default function AboutUs() {
  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero />
      <OurValues />
      <OurAashray />
      <LeadershipTeam />
    </div>
  );
}
