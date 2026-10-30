import {
  Activity,
  BarChart3,
  CircleHelp,
  LayoutDashboard,
  Link2,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "My Links", icon: Link2 },
  { name: "Analytics", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "Settings", icon: Settings },
  { name: "Help & Support", icon: CircleHelp },
];

function Sidebar({ activePage = "Overview", onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <Link2 size={20} strokeWidth={2.5} />
        </div>

        <span className="text-xl font-bold tracking-tight text-slate-900">
          converge<span className="text-violet-600">.</span>
        </span>
      </div>

      {/* Primary navigation */}
      <div className="px-4 pt-3">
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map(({ name, icon: Icon }) => {
            const isActive = activePage === name;

            return (
              <button
                key={name}
                onClick={() => onNavigate?.(name)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
                <span>{name}</span>

                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-600" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Secondary navigation */}
      <div className="mt-7 px-4">
        <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Preferences
        </p>

        <nav className="space-y-1">
          {secondaryNavigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => onNavigate?.(name)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                activePage === name
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Sidebar footer */}
      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
            <Sparkles size={17} />
          </div>

          <p className="text-sm font-semibold text-slate-800">
            Make every link count.
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Shorter links. Clearer insights. One simple workspace.
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-violet-700">
            <ShieldCheck size={14} />
            Built for simplicity
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
            Y
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
              Your workspace
            </p>
            <p className="truncate text-xs text-slate-500">Free account</p>
          </div>

          <Activity size={17} className="text-slate-400" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;