import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import QuickShorten from "../components/dashboard/QuickShorten";
import LinksTable from "../components/dashboard/LinksTable";
import VisitsChart from "../components/dashboard/VisitsChart";
import QrCodeModal from "../components/dashboard/QrCodeModal";
import useDashboard from "../hooks/useDashboard";

function Dashboard({ onLogout, theme, onToggleTheme }) {
  const dashboard = useDashboard();

  const { analytics, links, loading } = dashboard;

  return (
    <DashboardLayout
      onLogout={onLogout}
      theme={theme}
      onToggleTheme={onToggleTheme}
      userName={dashboard.user?.name}
    >
      <div className="space-y-7">
        <div className="mb-1">
          <p className="theme-accent-text text-xs font-semibold uppercase tracking-[0.15em]">
            Workspace
          </p>
          <h1 className="theme-ink mt-2 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
          <p className="theme-ink-secondary mt-2 text-sm leading-6">
            Create links and keep an eye on their performance.
          </p>
        </div>

        {dashboard.error && (
          <p role="alert" className="theme-alert-error px-4 py-3 text-sm">
            {dashboard.error}
          </p>
        )}

        {dashboard.successMessage && (
          <p role="status" className="theme-alert-success px-4 py-3 text-sm">
            {dashboard.successMessage}
          </p>
        )}

        <QuickShorten
          onShorten={dashboard.handleShorten}
          loading={dashboard.shortening}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

        <LinksTable
          links={links}
          onDelete={dashboard.handleDelete}
          onShowQr={dashboard.handleShowQr}
        />

        <VisitsChart data={analytics?.visitsOverTime ?? []} />

      </div>

      <QrCodeModal link={dashboard.qrLink} onClose={dashboard.closeQr} />
    </DashboardLayout>
  );
}

export default Dashboard;
