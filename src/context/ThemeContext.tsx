import React, { createContext, useContext, useState, useEffect } from "react";

export type AppTheme = "dark" | "light";

interface ThemeContextType {
  theme: AppTheme;
  isLight: boolean;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  isLight: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    // Check saved theme or system preference
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bharat_food_atlas_theme");
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
        return "light";
      }
    }
    return "dark";
  });

  const isLight = theme === "light";

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("bharat_food_atlas_theme", newTheme);
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  // Sync class on root document element and body
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.classList.remove("bg-[#080a10]", "bg-[#0b0f19]", "text-slate-100");
      document.body.classList.add("bg-[#f7f4ee]", "text-slate-900");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.classList.remove("bg-[#f7f4ee]", "text-slate-900");
      document.body.classList.add("bg-[#080a10]", "text-slate-100");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, isLight, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
