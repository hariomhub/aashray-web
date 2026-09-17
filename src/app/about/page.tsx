import Image from "next/image";
import OurValues from "@/components/about/OurValues";

export default function AboutPage() {
  const leaders = [
    {
      name: "Leader One",
      role: "Chief Executive Officer",
      bio: "Visionary leader with 15+ years in data privacy and compliance.",
      image: "https://i.pravatar.cc/300?img=11",
    },
    {
      name: "Leader Two",
      role: "Chief Technology Officer",
      bio: "Expert in building scalable, secure AI and Agentic compliance systems.",
      image: "https://i.pravatar.cc/300?img=12",
    },
    {
      name: "Leader Three",
      role: "Data Protection Officer",
      bio: "Certified privacy professional ensuring audit-ready compliance.",
      image: "https://i.pravatar.cc/300?img=13",
    },
  ];

  return (
    <div className="pt-24 min-h-screen bg-neutral-bg dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-neutral-text dark:text-white mb-4">
            About Us
          </h1>
          <p className="text-lg text-text-secondary dark:text-gray-300 max-w-2xl mx-auto">
            We are dedicated to providing AI and Agentic-first compliance products to help your organization reach DPDP compliance more intuitively.
          </p>
        </div>
      </div>

      <OurValues />

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 pb-16 pt-8">
        <div className="mb-20">
          <h2 className="text-3xl font-serif font-semibold text-primary dark:text-white text-center mb-12">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaders.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 overflow-hidden"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-neutral-text dark:text-white mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
                    {leader.role}
                  </p>
                  <p className="text-text-secondary dark:text-gray-400">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
