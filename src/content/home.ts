interface PlatformResource {
  title: string;
  type: "pdf" | "faq" | "video";
  url: string;
}

interface PlatformItem {
  name: string;
  tagline: string;
  description?: string;
  slug: string;
  category: string;
  image: string;
  features: { bold: string; text: string }[];
  isPlaceholder: boolean;
  placeholderText?: string;
  resources?: PlatformResource[];
}

export const homeContent = {
  hero: {
    headline: "Building a Safer Digital Planet",
    subheadline: "Empowering people and organisations to navigate the digital world with greater AI intelligence, productivity, and security",
    description: "Flexible, AI-and-agent-first platforms (on-premise or your cloud) built to make your organization compliant, capable, and future-ready",
    primaryCTA: "Book a Demo",
    secondaryCTA: "See Our Offerings",
    dataControlStatement: "Your Data. Your Infrastructure. Your Control.",
    dataControlDescription: "We know handing over your data feels risky, so we don't ask you to. Everything stays inside your own environment and under your control. **0 bytes leave your network**"
  },
  ourApproach: {
    heading: "Our Approach",
    description: "Compliance doesn't happen overnight, and we don't pretend it does. We built our platforms around how the journey actually unfolds.",
    imageAlt: "Ascending journey map: Learn, then Assess, then Operationalize, each step higher than the last",
    steps: [
      { title: "Learn", description: "build capability first so your team actually understands what they're doing" },
      { title: "Assess", description: "know where you really stand with our assessment tools" },
      { title: "Operationalize", description: "governance goes live with software that fits how you work" }
    ],
    footer: "One journey. Multiple platforms. Zero guesswork."
  },
  ourPlatforms: {
    heading: "OUR PRODUCTS",
    items: [
      {
        name: "ComplianceQuest",
        tagline: "Every compliance journey starts with understanding the regulations.",
        description: "Every compliance journey starts with understanding the regulations. Our free app uses AI to turn the DPDP Act into learning that's simple, fast, and made for you.",
        slug: "compliancequest",
        category: "platforms",
        image: "/products/Complaince quest.mp4",
        features: [
          { bold: "Know exactly what applies to you", text: "Learn what your role (CEO, CFO, CISCO, CMO, DPO, CLO) actually needs" },
          { bold: "Never lose a study minute", text: "Learning even continues when you’re on the move - flight, train, or cab — it syncs the second you're back online" },
          { bold: "Learn from the field experts", text: "Top insights from regulations, DPDP books and educational videos curated for you in one space, so you never waste time searching" },
          { bold: "Walk into any meeting prepared", text: "Your personalised notes on the topic, organized and searchable, ready the moment you need them" },
          { bold: "Never stay stuck on a doubt", text: "An AI DPDP expert available 24/7, offline or online, in your pocket for every question and clarification" },
          { bold: "Learning that actually sticks", text: "Flashcards, quizzes, and games inspired by the ones you already love. Think running-style dashes, obstacle based puzzles, and word search-inspired games" }
        ],
        isPlaceholder: false
      },
      {
        name: "NiyamSaathi",
        tagline: "Compliance isn't hard because companies don't care. It's hard because most don't know where to start.",
        description: "Compliance isn't hard because companies don't care. It's hard because most don't know where to start. Our AI tool tells you exactly what it takes and where you currently stand.",
        slug: "niyamsaathi",
        category: "platforms",
        image: "/products/Niyamsathi.mp4",
        features: [
          { bold: "Always know where you stand", text: "Real-time risk and compliance dashboards mean you're never waiting on a quarterly report to know your posture" },
          { bold: "An asset register that builds itself", text: "Connect to any cloud like AWS, Azure, GCP, Microsoft 365, or Google Workspace, and your assets are discovered and proposed automatically" },
          { bold: "Stay compliant across every regulation, from one place", text: "DPDP Act, RBI Data Localisation, CERT IN guidelines, IT Act, and SEBI Cybersecurity controls — pre-mapped and centrally updated, so you're never chasing regulatory changes yourself" },
          { bold: "Never lose a piece of compliance evidence", text: "Every submission is versioned and reviewed by an Internal Auditor before it counts — with full history preserved, even after rejections" },
          { bold: "Spot your gaps before an auditor does", text: "Auto-generated gap reports and overdue-task alerts surface risk on leadership dashboards before it becomes a problem" },
          { bold: "Access that stays in sync, automatically", text: "Connect Microsoft Entra ID once, and roles and departments stay in sync with your security groups" }
        ],
        isPlaceholder: false
      },
      {
        name: "E-Sehmati",
        tagline: "Collecting consent is easy. Proving you honoured it, across every channel, is where most organisations fail. E-Sehmati closes that gap.",
        description: "Collecting consent is easy. Proving you honoured it, across every channel, is where most organisations fail. E-Sehmati closes that gap.",
        slug: "e-sehmati",
        category: "platforms",
        image: "/products/Esehmati.mp4",
        features: [
          { bold: "Know where every piece of data lives", text: "Graph API-powered mapping that surfaces every system, vendor, and data point across your business, eliminating need for spreadsheets and guesswork" },
          { bold: "RoPA that is generated, not written from scratch", text: "Once your data is mapped, the legally required Record of Processing Activities builds itself, ready for any auditor" },
          { bold: "Never lose track of a customer’s consent", text: "every online, offline consent is recorded across Website, app, call centre, branch, field visit, or WhatsApp to a single consent library" },
          { bold: "Deadlines that enforce themselves", text: "Every principal rights request runs on a built-in SLA timer that auto-escalates to your DPO the moment it's overdue" },
          { bold: "Delete data with zero legal risk", text: "Every erasure is checked against RBI, tax, and retention rules first along with DPO sign-off required before anything final happens" },
          { bold: "A record no one can edit", text: "Every action across the platform is logged append-only — the same integrity standard a bank ledger holds itself to" }
        ],
        isPlaceholder: false
      },
      {
        name: "Parakh 360",
        tagline: "Know the risk behind every third party.",
        description: "Assess vendors, validate evidence and manage third-party risk from onboarding through offboarding.",
        slug: "tprm",
        category: "products",
        image: "/products/parakh 360.mp4",
        features: [
          { bold: "AI Vendor Assessment", text: "AI reads evidence, compares with control requirements, and flags missing or expired documents" },
          { bold: "Vendor Lifecycle", text: "Periodic reassessments, contract renewal alerts, and automated offboarding tasks" },
          { bold: "Executive Risk Dashboard", text: "Real-time visibility into vendor risk scores and compliance status" },
          { bold: "NiyamSaathi integration", text: "Link third-party data to your internal Record of Processing Activities (RoPA)" },
          { bold: "Contract AI", text: "Identify important privacy/security clauses and detect missing regulatory requirements" }
        ],
        isPlaceholder: false
      },

      {
        name: "Drishti AI",
        tagline: "Bring DLP thinking to video.",
        slug: "surveillance",
        category: "products",
        image: "/products/drishti ai.mp4",
        description: "Monitor multiple camera feeds, define contextual video policies and generate policy matches for human action.",
        features: [
          { bold: "Multi-vendor cameras", text: "No vendor-specific camera SDK required to integrate and monitor feeds" },
          { bold: "Natural-language policy", text: "Simply type a policy in plain English and VDLP creates the visual rule" },
          { bold: "Contextual Video Policies", text: "Create rules based on objects, color, speed, sequence, and time windows" },
          { bold: "Human-in-the-loop", text: "AI generates and prioritizes incidents, while a human decides what action to take" }
        ],
        isPlaceholder: false
      },
      {
        name: "E-Pragati",
        tagline: "Teach healthy digital habits. Don’t just block screens.",
        slug: "safe-gen",
        category: "products",
        image: "/products/E-pragati.mp4",
        description: "Help children become aware of their digital behavior, self-correct and gradually build healthier habits across home and school.",
        features: [
          { bold: "Behavioral Loop", text: "Awareness → Personalized Nudge → Child Reflects → Self-Correction" },
          { bold: "Child-First Philosophy", text: "Give the child an opportunity to understand and self-correct before involving a parent" },
          { bold: "School Privacy", text: "Anonymous class-level insights for teachers, protecting individual student identity" },
          { bold: "Adaptive Guidance", text: "Age-aware digital wellbeing guidance that learns what style of nudge works best" }
        ],
        isPlaceholder: false
      },
      {
        name: "Suraksha Chinh",
        tagline: "Visible deterrence. Invisible protection.",
        slug: "protection-mark",
        category: "products",
        image: "/products/suraksha chinh.mp4",
        description: "Protect sensitive information displayed on screen using configurable visible watermarks and Invisible Ink.",
        features: [
          { bold: "Configurable Watermark", text: "Display user name, IP, time, or custom text on screen at all times" },
          { bold: "Invisible Ink", text: "Embed a hidden pattern/code across displayed content for added traceability" },
          { bold: "Address the Camera Gap", text: "Protects against external phone photos, print screen, and snipping tools" },
          { bold: "Screen Sharing Protection", text: "Watermark remains visible on displayed content during Teams or Zoom screen sharing" }
        ],
        isPlaceholder: false
      }
    ] as PlatformItem[]
  },
  howItWorks: {
    heading: "HOW IT WORKS",
    subheading: "Three simple phases.",
    timeline: [
      { title: "Understand & Assess", description: "we start by figuring out where you stand" },
      { title: "Install", description: "we set up the tools that fit your world" },
      { title: "Implement", description: "governance goes live, and we stick around to help" }
    ],
    note: "as a timeline"
  },
  constantInnovation: {
    heading: "Constant Innovation",
    paragraphs: [
      "We're already using AI to take the manual, repetitive parts of compliance off your team's plate. And we're just getting started.",
      "Regulations change, threats change, technology changes, and honestly, so do we. Every new version we ship brings smarter AI and better tools, so staying compliant gets easier over time, not harder. You'll never have to start from scratch."
    ],
    attribution: "— Aashray Infotech Private Limited"
  },
  trustedBy: {
    heading: "Trusted By The Best",
    placeholder: "client names go here."
  }
};
