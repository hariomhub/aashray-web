"use client";

import * as React from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return React.useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: string;
  disableTransitionOnChange?: boolean;
  enableSystem?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  // On mount, read persisted theme from localStorage and apply it
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("theme") as Theme | null;
      const resolved: Theme = stored === "dark" || stored === "light" ? stored : defaultTheme;
      setThemeState(resolved);
      applyTheme(resolved);
    } catch {
      applyTheme(defaultTheme);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyTheme(t: Theme) {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
