"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";
import { useConsent } from "@/hooks/useConsent";
import Link from "next/link";

export default function CookieBanner() {
  const { consent, updateConsent, acceptAll, rejectNonEssential, isLoaded } = useConsent();
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  
  // Local state for preferences modal
  const [prefs, setPrefs] = useState({ analytics: false, media: false });

  useEffect(() => {
    if (isLoaded && !consent.hasConsented) {
      setShowBanner(true);
    }
  }, [isLoaded, consent.hasConsented]);

  useEffect(() => {
    // Listen for footer button click
    const handleOpenSettings = () => {
      setPrefs({ analytics: consent.analytics, media: consent.media });
      setShowPreferences(true);
    };
    
    const btn = document.getElementById("open-cookie-settings");
    if (btn) {
      btn.addEventListener("click", handleOpenSettings);
      return () => btn.removeEventListener("click", handleOpenSettings);
    }
  }, [consent]);

  const handleSavePreferences = () => {
    updateConsent(prefs);
    setShowPreferences(false);
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    acceptAll();
    setShowPreferences(false);
    setShowBanner(false);
  };

  const handleReject = () => {
    rejectNonEssential();
    setShowPreferences(false);
    setShowBanner(false);
  };

  if (!isLoaded) return null;

  return (
    <>
      {/* Main Banner */}
      <AnimatePresence>
        {showBanner && !showPreferences && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
          >
            <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-6 pointer-events-auto flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-neutral-text dark:text-white text-lg">Your Privacy & Data Control</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  As a DPDP compliance platform, we practice what we preach. We use cookies to improve your experience, but we believe you should be in control. Read our{" "}
                  <Link href="/cookie-policy" className="text-primary hover:underline">Cookie Policy</Link> and{" "}
                  <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link> for details.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setShowPreferences(true)}
                  className="px-4 py-2 text-sm font-medium text-primary dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  Manage Preferences
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-primary dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                >
                  Reject Non-Essential
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors whitespace-nowrap"
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
              onClick={() => setShowPreferences(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-xl font-semibold text-neutral-text font-serif">Consent Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6">
                {/* Essential */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-neutral-text mb-1">Essential (Strictly Necessary)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Required for the website to function properly. Cannot be disabled.</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300 opacity-50 shrink-0">
                    <span className="absolute left-7 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </div>
                </div>
                
                <hr className="border-gray-100 dark:border-gray-800" />
                
                {/* Analytics */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-neutral-text mb-1">Analytics</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Helps us understand how visitors interact with the website anonymously.</p>
                  </div>
                  <button 
                    onClick={() => setPrefs({ ...prefs, analytics: !prefs.analytics })}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors shrink-0 ${prefs.analytics ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.analytics ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />
                
                {/* Media */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-semibold text-neutral-text mb-1">Embedded Media (YouTube)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Allows third-party video players to load, which may set their own tracking cookies.</p>
                  </div>
                  <button 
                    onClick={() => setPrefs({ ...prefs, media: !prefs.media })}
                    className={`relative inline-block w-12 h-6 rounded-full transition-colors shrink-0 ${prefs.media ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${prefs.media ? 'left-7' : 'left-1'}`}></span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center">
                <button
                  onClick={handleReject}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Reject Non-Essential
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={handleSavePreferences}
                    className="px-5 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                  >
                    Save My Choices
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
