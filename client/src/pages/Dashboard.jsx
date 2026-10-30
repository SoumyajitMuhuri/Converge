import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import QuickShorten from "../components/dashboard/QuickShorten";
import LinksTable from "../components/dashboard/LinksTable";
import VisitsChart from "../components/dashboard/VisitsChart";
import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const dashboard = useDashboard();

  const { analytics, links, loading } = dashboard;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <QuickShorten
          onShorten={dashboard.handleShorten}
          loading={dashboard.shortening}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Links"
            value={loading ? "—" : analytics?.totalLinks ?? links.length}
          />
          <StatCard
            title="Total Visits"
            value={loading ? "—" : analytics?.totalVisits ?? 0}
          />
          <StatCard
            title="Top Links"
            value={loading ? "—" : analytics?.topLinks?.length ?? 0}
          />
        </div>

        <VisitsChart data={analytics?.visitsOverTime ?? []} />

        <LinksTable
          links={links}
          onDelete={dashboard.handleDelete}
          onShowQr={dashboard.handleShowQr}
        />

        {dashboard.error && (
          <p className="text-sm text-red-600">{dashboard.error}</p>
        )}

        {dashboard.successMessage && (
          <p className="text-sm text-green-600">
            {dashboard.successMessage}
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;