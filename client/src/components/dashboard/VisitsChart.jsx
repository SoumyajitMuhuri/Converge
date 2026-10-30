import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3 } from "lucide-react";

const demoData = [
  { date: "Mon", visits: 42 },
  { date: "Tue", visits: 68 },
  { date: "Wed", visits: 51 },
  { date: "Thu", visits: 95 },
  { date: "Fri", visits: 74 },
  { date: "Sat", visits: 118 },
  { date: "Sun", visits: 89 },
];

function VisitsChart({ data = demoData }) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-100/60 sm:p-6">
      {/* Chart heading */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Visit activity
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Track how people interact with your links.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600">
          <BarChart3 size={14} className="text-violet-600" />
          Last 7 days
        </div>
      </div>

      {/* Chart */}
      <div className="mt-6 h-[260px] w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <BarChart3 size={20} />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-700">
              No visit data yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Your analytics will appear here once visits are recorded.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="visitsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="#7c3aed"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="#7c3aed"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#f1f5f9"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ stroke: "#c4b5fd", strokeDasharray: "4 4" }}
                contentStyle={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} visits`, "Visits"]}
              />

              <Area
                type="monotone"
                dataKey="visits"
                stroke="#7c3aed"
                strokeWidth={2.5}
                fill="url(#visitsGradient)"
                activeDot={{
                  r: 5,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
        <span className="h-2 w-2 rounded-full bg-violet-600" />
        <span className="text-xs text-slate-500">Total visits over time</span>
      </div>
    </section>
  );
}

export default VisitsChart;