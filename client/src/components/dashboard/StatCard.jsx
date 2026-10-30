function StatCard({ title, value }) {
  return (
    <div className="theme-surface min-w-0 p-5 sm:p-6">
      <p className="theme-ink-secondary text-sm font-medium">{title}</p>
      <p className="theme-ink mt-4 text-3xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

export default StatCard;
