import { Bell, ChevronDown, Search } from "lucide-react";

function Header({ activePage = "Overview" }) {
  const pageDescriptions = {
    Overview: "Here's what's happening with your links today.",
    "My Links": "Manage, organize, and track all your shortened links.",
    Analytics: "Understand your audience and link performance.",
    Settings: "Manage your account preferences.",
    "Help & Support": "Find answers and get help with Converge.",
  };

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-md sm:px-8">
      {/* Page title */}
      <div className="min-w-0">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          {activePage}
        </h1>

        <p className="mt-0.5 hidden text-xs text-slate-500 sm:block">
          {pageDescriptions[activePage] || "Welcome to Converge."}
        </p>
      </div>

      {/* Actions */}
      <div className="ml-4 flex shrink-0 items-center gap-3 sm:gap-5">
        {/* Search */}
        <div className="hidden items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <Search size={16} className="text-slate-400" />

          <input
            type="text"
            placeholder="Search links..."
            aria-label="Search links"
            className="w-32 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 md:w-44"
          />

          <kbd className="hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400 md:inline">
            /
          </kbd>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <Bell size={19} strokeWidth={1.8} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-violet-600" />
        </button>

        {/* Profile */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
          aria-label="Open profile menu"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
            Y
          </div>

          <ChevronDown
            size={15}
            className="hidden text-slate-400 sm:block"
          />
        </button>
      </div>
    </header>
  );
}

export default Header;