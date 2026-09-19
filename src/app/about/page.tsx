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
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950">
      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 pt-28 pb-24 bg-primary dark:bg-gray-900 shadow-lg relative overflow-hidden">
        {/* Optional decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-dark rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2 dark:bg-primary/20"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3 dark:bg-accent/10"></div>
        
        <div className="text-center relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-extrabold text-white mb-6 tracking-tight">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed font-medium">
            We are dedicated to providing AI and Agentic-first compliance products to help your organization reach DPDP compliance more intuitively.
          </p>
        </div>
      </div>

      <OurValues />

      <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-12">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white text-center mb-10">
            Our Leadership Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leaders.map((leader, idx) => (
              <div
                key={idx}
                className="group bg-white dark:bg-gray-900 rounded-3xl shadow-sm hover:shadow-[0_0_40px_rgba(212,175,55,0.2)] dark:hover:shadow-[0_0_40px_rgba(212,175,55,0.1)] transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden transform hover:-translate-y-2"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={leader.image}
                    alt={leader.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-8 text-center relative z-10 bg-white dark:bg-gray-900">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-bold text-accent mb-4 uppercase tracking-widest">
                    {leader.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
