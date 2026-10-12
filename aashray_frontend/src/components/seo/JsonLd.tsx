import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const SITE_URL = "https://www.aashrayinfotech.com";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Aashray Infotech Private Limited",
    alternateName: ["Aashray Infotech", "Aashray"],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.jpg`,
      caption: "Aashray Infotech Logo",
    },
    description:
      "Aashray Infotech provides on-premise, AI-enabled governance and data protection platforms that empower Indian organizations to achieve complete DPDP Act 2023 compliance and audit readiness with zero data exposure.",
    email: "support@aashrayinfotech.com",
    address: [
      {
        "@type": "PostalAddress",
        name: "Corporate Office",
        streetAddress:
          "Unit No. 902, 9th Floor, Block A, Unitech The Arcadia, South City-2",
        addressLocality: "Gurugram",
        addressRegion: "Haryana",
        postalCode: "122018",
        addressCountry: "IN",
      },
      {
        "@type": "PostalAddress",
        name: "Registered Office",
        streetAddress: "C-80, UGF, Shivaji Park, West Punjabi Bagh",
        addressLocality: "New Delhi",
        addressRegion: "Delhi",
        postalCode: "110026",
        addressCountry: "IN",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Support & Inquiries",
        email: "support@aashrayinfotech.com",
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
    sameAs: [
      "https://www.linkedin.com/company/aashrayinfotech",
      "https://twitter.com/aashrayinfotech",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Aashray Infotech",
    alternateName: "Aashray Infotech - AI Products for a Safer Digital Planet",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  };
}

export function getSoftwareAppSchema({
  name,
  description,
  url,
  image,
  applicationCategory = "SecurityApplication",
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${SITE_URL}${url}`,
    applicationCategory,
    operatingSystem: "Web, On-Premise, Linux, Windows, Cloud",
    softwareVersion: "1.0",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    ...(image ? { image: `${SITE_URL}${image}` } : {}),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
