const DashboardShell = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {title}
        </h1>

        <p className="text-slate-500 mt-1">
          {subtitle}
        </p>
      </div>

      {/* CONTENT */}
      {children}
    </div>
  );
};

export default DashboardShell;