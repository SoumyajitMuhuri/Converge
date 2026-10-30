import { Moon, Sun } from "lucide-react";

function ThemeToggle({ theme, onToggle }) {
  const targetTheme = theme === "dark" ? "light" : "dark";
  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${targetTheme} theme`}
      aria-pressed={theme === "dark"}
      className="theme-toggle-button"
    >
      <Icon size={16} aria-hidden="true" />
      <span className="hidden sm:inline">
        {targetTheme === "dark" ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;
