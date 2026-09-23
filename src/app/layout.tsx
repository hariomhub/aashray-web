import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/consent/CookieBanner";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import FloatingFAQButton from "@/components/shared/FloatingFAQButton";

export const metadata: Metadata = {
  title: "Aashray Infotech | DPDP Compliance, On Your Infrastructure",
  description: "Aashray Infotech provides on-premise, AI-enabled platforms that help Indian organizations become DPDP Act-compliant and audit-ready.",
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
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white dark:bg-gray-950 text-neutral-text transition-colors duration-300 overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
