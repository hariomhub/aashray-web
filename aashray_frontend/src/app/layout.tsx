import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/consent/CookieBanner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import FloatingFAQButton from "@/components/shared/FloatingFAQButton";
import JsonLd, { getOrganizationSchema, getWebSiteSchema } from "@/components/seo/JsonLd";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aashrayinfotech.com"),
  title: {
    default: "Aashray Infotech | AI products for safer digital planet",
    template: "%s | Aashray Infotech",
  },
  description:
    "Aashray Infotech provides on-premise, AI-enabled platforms that help Indian organizations become DPDP Act 2023-compliant and audit-ready with zero data exposure.",
  keywords: [
    "DPDP Act compliance",
    "DPDP Act 2023",
    "Data Protection India",
    "On-premise AI compliance",
    "AI data security",
    "NiyamSaathi",
    "ComplianceQuest",
    "Suraksha Chinh",
    "E-Sehmati",
    "TPRM vendor risk management",
    "DPO as a service",
    "Consent Management Platform India",
    "Data privacy audit",
    "Aashray Infotech",
  ],
  authors: [{ name: "Aashray Infotech Private Limited", url: "https://www.aashrayinfotech.com" }],
  creator: "Aashray Infotech Private Limited",
  publisher: "Aashray Infotech Private Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.aashrayinfotech.com",
    siteName: "Aashray Infotech",
    title: "Aashray Infotech | AI products for safer digital planet",
    description:
      "Aashray Infotech provides on-premise, AI-enabled platforms that help Indian organizations become DPDP Act 2023-compliant and audit-ready.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aashray Infotech | AI products for safer digital planet",
    description:
      "On-premise, AI-enabled platforms that help Indian organizations become DPDP Act-compliant. 0 bytes leave your network.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
    shortcut: "/logo.jpg",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getWebSiteSchema()} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-white dark:bg-gray-950 text-neutral-text transition-colors duration-300 overflow-x-hidden">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y9WBSBBFY9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y9WBSBBFY9');
          `}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {/* Global Minimalistic Background */}
          <div className="fixed inset-0 z-[-1] bg-white dark:bg-gray-950 transition-colors duration-300">
            <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-[0.03] dark:opacity-[0.07] bg-repeat pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none transition-colors duration-300"></div>
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-accent/5 dark:bg-accent/10 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4 pointer-events-none transition-colors duration-300"></div>
          </div>

          <Header />
          <main className="flex-1 w-full !max-w-none !m-0 pt-20">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <FloatingFAQButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
