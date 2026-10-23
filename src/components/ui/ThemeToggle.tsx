import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { theme, isLight, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isLight ? "Switch to Royal Midnight Mode" : "Switch to Sunlit Parchment Light Mode"}
      aria-label="Toggle visual theme"
      className={`group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all duration-300 shadow-md ${
        isLight
          ? "bg-amber-100/90 hover:bg-amber-200/90 text-amber-950 border border-amber-300 shadow-amber-900/10"
          : "bg-slate-800/90 hover:bg-slate-700/90 text-amber-300 border border-amber-500/30 shadow-black/40"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun className="w-4 h-4 text-amber-600 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-amber-400 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="text-xs font-bold tracking-wide select-none">
          {isLight ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};
