type MetricCardProps = {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
  delay?: number;
};

export function MetricCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  delay = 0,
}: MetricCardProps) {
  const changeColors = {
    positive: "text-green-400",
    negative: "text-red-400",
    neutral: "text-zinc-400",
  };

  return (
    <div
      className="group rounded-2xl bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-6 ring-1 ring-white/10 transition-all hover:ring-white/20 hover:shadow-lg hover:shadow-white/5"
      style={{
        animation: `staggerFade 0.4s ease ${delay}ms both`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {label}
          </div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </div>
          {change && (
            <div className={`mt-2 text-sm font-medium ${changeColors[changeType]}`}>
              {change}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl ring-1 ring-white/10 transition-all group-hover:bg-white/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: "up" | "down";
  };
  delay?: number;
};

export function StatCard({ title, value, subtitle, trend, delay = 0 }: StatCardProps) {
  return (
    <div
      className="rounded-2xl bg-zinc-900/50 p-5 ring-1 ring-white/10 transition-all hover:bg-zinc-900/70"
      style={{
        animation: `staggerFade 0.4s ease ${delay}ms both`,
      }}
    >
      <div className="text-xs font-medium text-zinc-400">{title}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-2xl font-semibold text-white">{value}</div>
        {trend && (
          <div className={`text-sm font-medium ${trend.direction === "up" ? "text-green-400" : "text-red-400"}`}>
            {trend.direction === "up" ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-zinc-500">{subtitle}</div>
      )}
    </div>
  );
}
