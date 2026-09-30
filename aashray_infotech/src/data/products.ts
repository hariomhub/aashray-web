export type Product = {
  id: string;
  name: string;
  tagline: string;
  image?: string;
  badge?: string; // e.g. "Free"
  capabilities: {
    text: string;
    isComingSoon?: boolean;
  }[];
};

export const products: Product[] = [
  {
    id: "niyamsaathi",
    name: "NiyamSaathi",
    tagline: "End-to-End Compliance & Readiness",
    image: "/products/niyamsaathi.jpeg",
    capabilities: [
      { text: "Master control library with custom control creation" },
      { text: "Streamlined asset onboarding" },
      { text: "End-to-end readiness assessments from the portal with the ability to conduct a compliance & security scan" },
      { text: "Task assignment/tracking across teams, officers, stakeholders" },
      { text: "Role-specific portals/dashboards per stakeholder" },
      { text: "Built-in risk analytics, risk scores, actionable insights" },
      { text: "LMS library for training/awareness/capability building" },
      { text: "Automated gap identification & remediation recommendations", isComingSoon: true },
    ]
  },
  {
    id: "esehmati",
    name: "e-sehmati",
    tagline: "Consent & Data Flow Management",
    image: "/products/esehmati.png",
    capabilities: [
      { text: "Full consent, cookie, and preference management (collection → withdrawal → renewal) in one portal" },
      { text: "Data discovery with suggested identification/classification of personal data" },
      { text: "Data flow maps (how personal data is collected/processed/stored/shared)" },
      { text: "Maintain a Record of Processing Activities (ROPA)" },
      { text: "Real-time consent management leveraging data flow maps" },
      { text: "Retrospective consent campaigns" },
      { text: "Multi-channel, 22-language consent banner creation/governance" },
      { text: "Data Principal Request & grievance workflow management" },
      { text: "Role-based access control / user management" },
      { text: "Audit-ready activity log" },
      { text: "Automated breach notification workflows" },
      { text: "Third-party vendor/processor management (invitations, contracts, compliance tracking)" },
    ]
  },
  {
    id: "vidhiai",
    name: "DPDP Quest",
    tagline: "Gamified DPDP Readiness",
    image: "/products/dpdpquest.jpeg",
    badge: "Free",
    capabilities: [
      { text: "Free, adaptive learning app for understanding the DPDP Act" },
      { text: "Interactive learning: videos, AI chatbot, flashcards, quizzes, games" },
      { text: "Progress tracking / real compliance-proficiency tracking" },
      { text: "Role-tailored, relevant content delivery" },
      { text: "Knowledge library (books + external resources)" },
    ]
  },
  {
    id: "compliance-assessment",
    name: "Compliance Assessment tool",
    tagline: "Structured gap assessment against requirements",
    image: "/products/compliance.jpeg",
    capabilities: [
      { text: "Structured gap assessment against DPDPA, IT act, SEBI, RBI, and CERT requirements" }
    ]
  },
  {
    id: "dpo-service",
    name: "DPO Service",
    tagline: "Go to Solution for Smaller, Significant Data Fiduciaries",
    image: "/products/dpo.jpeg",
    capabilities: [
      { text: "Dedicated Data Protection Officer services for your organization" },
      { text: "Compliance monitoring and advisory" }
    ]
  },
  {
    id: "dprm-software",
    name: "DPRM Software",
    tagline: "Data Protection Rights Management",
    image: "/products/tprm.jpeg",
    capabilities: [
      { text: "Streamline data principal rights requests and workflows" },
      { text: "Automated identity verification and data mapping" }
    ]
  },
  {
    id: "cyber-insurance",
    name: "Cyber Insurance",
    tagline: "Save yourself from massive unprecedented fines",
    image: "/products/cyber_insurance.jpeg",
    capabilities: [
      { text: "Comprehensive coverage against data breaches and cyber threats" },
      { text: "Financial protection and incident response support" }
    ]
  }
];
