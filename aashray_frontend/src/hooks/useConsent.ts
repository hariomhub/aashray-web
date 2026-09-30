"use client";

import { useState, useEffect } from "react";

export type ConsentState = {
  essential: boolean;
  analytics: boolean;
  media: boolean;
  hasConsented: boolean; // True if they have made a choice
  timestamp: string | null;
};

const defaultConsent: ConsentState = {
  essential: true, // Always true
  analytics: false,
  media: false,
  hasConsented: false,
  timestamp: null,
};

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aashray_consent");
      if (stored) {
        setConsent(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read consent from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const updateConsent = (newConsent: Partial<ConsentState>) => {
    const updated = {
      ...consent,
      ...newConsent,
      essential: true, // enforce essential
      hasConsented: true,
      timestamp: new Date().toISOString(),
    };
    setConsent(updated);
    try {
      localStorage.setItem("aashray_consent", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save consent to localStorage", e);
    }
    
    // Dispatch a custom event so other components (like iframe wrappers) can listen
    window.dispatchEvent(new CustomEvent("consentUpdated", { detail: updated }));
  };

  const acceptAll = () => {
    updateConsent({ analytics: true, media: true });
  };

  const rejectNonEssential = () => {
    updateConsent({ analytics: false, media: false });
  };

  return { consent, updateConsent, acceptAll, rejectNonEssential, isLoaded };
}
