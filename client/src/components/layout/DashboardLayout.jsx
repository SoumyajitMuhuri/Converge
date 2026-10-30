import Header from "./Header";

function DashboardLayout({ children, onLogout, theme, onToggleTheme, userName }) {
  return (
    <div className="theme-page min-h-screen">
      <Header
        onLogout={onLogout}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />

      <div className="theme-divider border-b bg-[var(--surface-muted)]">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-7">
          <p className="theme-ink text-sm">
            Welcome <span className="font-semibold">{userName || "…"}</span>
          </p>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-7 sm:py-10">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
