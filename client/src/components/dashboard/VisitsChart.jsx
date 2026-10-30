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

function VisitsChart({ data = [] }) {
  const hasData =
    Array.isArray(data) && data.some((item) => Number(item.visits) > 0);

  return (
    <section className="theme-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="theme-ink text-base font-semibold">Visit activity</h2>
          <p className="theme-ink-secondary mt-1 text-sm">
            Daily visits over the last 30 days.
          </p>
        </div>
      </div>

      <div className="mt-6 h-[260px] w-full">
        {!hasData ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="theme-auth-mark">
              <BarChart3 size={20} />
            </div>
            <p className="theme-ink mt-3 text-sm font-semibold">
              No visit data yet
            </p>
            <p className="theme-ink-secondary mt-1 text-sm">
              No visits have been recorded in this period.
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
                    stopColor="var(--chart-line)"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-line)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="var(--chart-grid)"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--chart-label)", fontSize: 11 }}
                tickFormatter={(date) =>
                  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC",
                  })
                }
                interval="preserveStartEnd"
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--chart-label)", fontSize: 11 }}
                allowDecimals={false}
              />

              <Tooltip
                cursor={{ stroke: "var(--chart-line)", strokeDasharray: "4 4" }}
                contentStyle={{
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  background: "var(--surface)",
                  color: "var(--ink)",
                  fontSize: "12px",
                }}
                labelFormatter={(date) =>
                  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  })
                }
                formatter={(value) => [`${value} visits`, "Visits"]}
              />

              <Area
                type="monotone"
                dataKey="visits"
                stroke="var(--chart-line)"
                strokeWidth={2.5}
                fill="url(#visitsGradient)"
                activeDot={{
                  r: 5,
                  stroke: "var(--surface)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </section>
  );
}

export default VisitsChart;
