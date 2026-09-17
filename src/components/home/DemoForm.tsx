"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function DemoForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong.");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to submit request. Please try again.");
    }
  };

  return (
    <section id="demo" className="py-24 lg:py-16 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-gray-700">
          
          {/* Left Side: Context */}
          <div className="md:w-5/12 bg-primary text-white p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/circuit-pattern.svg')] opacity-10"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-serif font-semibold mb-6">Request a Demo</h2>
              <p className="text-gray-300 leading-relaxed mb-20">
                See how Aashray Infotech can automate your DPDP compliance on your own infrastructure, keeping your data completely under your control.
              </p>
              
              <div className="space-y-6 mt-auto">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm text-gray-200">Zero data leaves your network</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm text-gray-200">Customized to your infrastructure</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-sm text-gray-200">Dedicated onboarding support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-7/12 p-10">
            {status === "success" ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-20"
              >
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-primary dark:text-white mb-2">Request Received</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-16 max-w-sm">
                  Thank you for your interest. Our team will contact you shortly to schedule your personalized demo.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Submit another request
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-sm font-medium text-neutral-text dark:text-gray-200">Full Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-neutral-text dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="company" className="text-sm font-medium text-neutral-text dark:text-gray-200">Company Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="company" 
                      name="company" 
                      required 
                      className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-neutral-text dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-neutral-text dark:text-gray-200">Work Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-neutral-text dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-sm font-medium text-neutral-text dark:text-gray-200">Phone Number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      pattern="[0-9\-\+\s\(\)]*"
                      title="Please enter a valid phone number"
                      className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-neutral-text dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="notes" className="text-sm font-medium text-neutral-text dark:text-gray-200">Additional Notes (Optional)</label>
                  <textarea 
                    id="notes" 
                    name="notes" 
                    rows={4}
                    className="px-4 py-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-neutral-text dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Tell us about your current compliance setup..."
                  ></textarea>
                </div>

                {status === "error" && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="mt-2 flex flex-col gap-4">
                  <button 
                    type="submit" 
                    disabled={status === "submitting"}
                    className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request a Demo
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center text-balance">
                    By submitting, you agree to our <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> and consent to us contacting you regarding your inquiry.
                  </p>
                </div>
                
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
