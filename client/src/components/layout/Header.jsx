import { LogOut } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

function Header({ onLogout, theme, onToggleTheme }) {
  return (
    <header className="theme-divider sticky top-0 z-20 border-b bg-[var(--surface)]">
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-7">
        <div className="flex items-center gap-3">
          <img
            src="/icon.png"
            alt=""
            aria-hidden="true"
            className="h-9 w-12 object-contain"
          />
          <span className="theme-ink text-lg font-semibold tracking-tight">
            converge<span className="theme-accent-text">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            onClick={onLogout}
            aria-label="Sign out"
            className="theme-secondary-button"
          >
            <LogOut size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
