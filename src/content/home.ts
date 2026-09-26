interface PlatformResource {
  title: string;
  type: "pdf" | "faq" | "video";
  url: string;
}

export interface PlatformItem {
  name: string;
  slug: string;
  tagline: string;
  description?: string;
  category: string;
  image: string;
  logo?: string;
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
    description: "True digital safety doesn't happen overnight, and we don't pretend it does. We built our platforms around how the security journey actually unfolds.",
    imageAlt: "Ascending journey map: Learn, then Assess, then Operationalize, each step higher than the last",
    steps: [
      { title: "Learn", description: "Build internal capability first so your team understands threat landscapes, privacy standards, and safe practices." },
      { title: "Assess", description: "Identify vulnerabilities, policy gaps, and risks to know exactly where your digital posture stands." },
      { title: "Operationalize", description: "Deploy automated protection and safety controls with software that fits seamlessly into how you work." }
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
        image: "/products/compliance-quest.mp4",
        logo: "/products/compliancequest.png",
        features: [
          { bold: "Regulatory learning videos", text: "Access a curated library of high-quality video content designed to break down complex regulations into easily understandable concepts." },
          { bold: "Short lessons and visual learning", text: "Engage with bite-sized, visually rich modules that ensure maximum retention without overwhelming your employees." },
          { bold: "Quizzes and knowledge checks", text: "Evaluate comprehension in real-time with interactive assessments that pinpoint knowledge gaps and reinforce critical policies." },
          { bold: "Flashcards and gamified learning", text: "Make compliance training enjoyable with interactive flashcards, leaderboards, and scenarios that boost engagement and completion rates." },
          { bold: "Progress-oriented learning experience", text: "Track individual and team milestones through an intuitive dashboard that motivates continuous learning and guarantees audit-readiness." },
          { bold: "Content covering DPDP, RBI, SEBI, CERT-In, cybersecurity and AI governance topics", text: "Stay ahead of the curve with comprehensive, up-to-date modules on India's most critical regulatory frameworks and data security standards." },
          { bold: "Mobile-first access for ongoing learning", text: "Empower your team to learn anywhere, anytime, with a fully responsive mobile platform that syncs progress seamlessly across devices." }
        ],
        isPlaceholder: false
      },
      {
        name: "NiyamSaathi",
        tagline: "Compliance isn't hard because companies don't care. It's hard because most don't know where to start.",
        description: "Compliance isn't hard because companies don't care. It's hard because most don't know where to start. Our\u00A0AI\u00A0tool\u00A0tells\u00A0you\u00A0exactly\u00A0what\u00A0it\u00A0takes\u00A0and\u00A0where\u00A0you\u00A0currently\u00A0stand.",
        slug: "niyamsaathi",
        category: "platforms",
        image: "/products/niyamsathi.mp4",
        features: [
          { bold: "Role-based compliance learning videos", text: "Deliver tailored training content to employees based on their specific roles, ensuring everyone understands their unique compliance responsibilities." },
          { bold: "Control assignment and ownership", text: "Clearly define who is responsible for each compliance task by assigning controls to specific owners across departments and teams." },
          { bold: "Task and deadline tracking", text: "Never miss a regulatory milestone with automated alerts and real-time tracking for all pending compliance actions and SLA deadlines." },
          { bold: "Evidence upload and audit workflow", text: "Streamline the entire audit lifecycle with a centralized portal for uploading, reviewing, and approving compliance evidence securely." },
          { bold: "Internal and external auditor review", text: "Provide a structured, read-only workspace for auditors to evaluate controls, access evidence, and leave findings without disrupting daily operations." },
          { bold: "Executive readiness dashboards", text: "Equip leadership with real-time, consolidated views of organizational compliance posture, high-risk areas, and overall audit readiness." },
          { bold: "Cross-regulation control mapping", text: "Drastically reduce duplicate work by automatically mapping overlapping requirements across frameworks like DPDP, RBI, and CERT-In." },
          { bold: "AI Evidence Checker", text: "Automatically scan uploaded documents using AI to verify if they meet specific control requirements and flag any missing or insufficient data." },
          { bold: "AI gap and remediation guidance", text: "Instantly identify compliance vulnerabilities and receive step-by-step AI-driven recommendations to fix gaps before an audit occurs." },
          { bold: "Natural-language compliance questions", text: "Ask complex regulatory questions in plain English and receive instant, contextual answers based on your organization's unique policies." },
          { bold: "AI executive summaries", text: "Transform complex compliance metrics and lengthy audit reports into concise, actionable insights tailored for the C-suite." },
          { bold: "ComplianceQuest learning-completion integration", text: "Seamlessly connect employee training data with your compliance controls to prove that mandatory learning requirements have been met." }
        ],
        isPlaceholder: false
      },
      {
        name: "E-Sehmati",
        tagline: "Collecting consent is easy. Proving you honoured it, across every channel, is where most organisations fail. E\u2011Sehmati closes that gap.",
        description: "Collecting consent is easy. Proving you honoured it, across every channel, is where most organisations fail. E\u2011Sehmati closes that gap.",
        slug: "e-sehmati",
        category: "platforms",
        image: "/products/esehmati.mp4",
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
        image: "/products/parakh-360.mp4",
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
        name: "Digi Netra",
        tagline: "Bring data security to video.",
        slug: "surveillance",
        category: "products",
        image: "/products/digi-netra.mp4",
        logo: "/products/digi-netra.png",
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
        image: "/products/e-pragati.mp4",
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
        image: "/products/suraksha-chinh.mp4",
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
      "We're already using AI to take the manual, repetitive parts of compliance off your team's plate. And we're just getting\u00A0started.",
      "Regulations change, threats change, technology changes, and honestly, so do we. Every new version we ship brings smarter AI and better tools, so staying compliant gets easier over time, not harder. You'll never have to start from\u00A0scratch."
    ],
    attribution: "— Aashray Infotech Private Limited"
  },
  trustedBy: {
    heading: "Trusted By The Best",
    placeholder: "client names go here."
  }
};
