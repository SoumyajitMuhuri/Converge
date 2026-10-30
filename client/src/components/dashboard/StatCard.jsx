import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function StatCard({
  title,
  value,
  change,
  changeLabel = "vs. last month",
  icon: Icon,
  accent = "violet",
}) {
  const accentStyles = {
    violet: "bg-violet-50 text-violet-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const isPositive = Number(change) >= 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-100/60 transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </h2>
        </div>

        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              accentStyles[accent] || accentStyles.violet
            }`}
          >
            <Icon size={21} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {change !== undefined && change !== null && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold ${
              isPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}

            {Math.abs(Number(change))}%
          </span>

          <span className="text-xs text-slate-400">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;