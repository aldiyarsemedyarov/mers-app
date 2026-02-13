type BarChartProps = {
  data: Array<{ label: string; value: number; color?: string }>;
  maxValue?: number;
};

export function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const percentage = (item.value / max) * 100;
        return (
          <div
            key={idx}
            className="group"
            style={{
              animation: `staggerFade 0.3s ease ${idx * 80}ms both`,
            }}
          >
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-300">{item.label}</span>
              <span className="font-semibold text-white">
                ${item.value.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  item.color || "bg-blue-500"
                }`}
                style={{
                  width: `${percentage}%`,
                  animation: `slideIn 0.8s ease ${idx * 100}ms both`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type LineChartProps = {
  data: Array<{ label: string; value: number }>;
  color?: string;
};

export function MiniLineChart({ data, color = "text-blue-500" }: LineChartProps) {
  const max = Math.max(...data.map((d) => d.value));
  const min = Math.min(...data.map((d) => d.value));
  const range = max - min;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="relative h-16 w-full">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          points={points}
          className={color}
          style={{
            animation: "slideIn 0.8s ease both",
          }}
        />
      </svg>
    </div>
  );
}

type SparklineProps = {
  values: number[];
  trend?: "up" | "down" | "neutral";
};

export function Sparkline({ values, trend = "neutral" }: SparklineProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const trendColors = {
    up: "stroke-green-400 fill-green-400/10",
    down: "stroke-red-400 fill-red-400/10",
    neutral: "stroke-zinc-400 fill-zinc-400/10",
  };

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100;
    const y = 50 - ((v - min) / range) * 40;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,50 ${points} 100,50`;

  return (
    <svg
      viewBox="0 0 100 50"
      className="h-8 w-20"
      preserveAspectRatio="none"
    >
      <polygon
        points={areaPoints}
        className={trendColors[trend]}
        strokeWidth="0"
        style={{
          animation: "staggerFade 0.5s ease both",
        }}
      />
      <polyline
        fill="none"
        strokeWidth="1.5"
        points={points}
        className={trendColors[trend].split(" ")[0]}
        style={{
          animation: "slideIn 0.6s ease 0.1s both",
        }}
      />
    </svg>
  );
}

type DonutChartProps = {
  data: Array<{ label: string; value: number; color: string }>;
  size?: number;
};

export function DonutChart({ data, size = 120 }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(39 39 42)"
          strokeWidth={strokeWidth}
        />
        {data.map((item, idx) => {
          const percentage = item.value / total;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -currentOffset * circumference;
          currentOffset += percentage;

          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-500"
              style={{
                animation: `staggerFade 0.5s ease ${idx * 100}ms both`,
              }}
            />
          );
        })}
      </svg>

      <div className="space-y-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2"
            style={{
              animation: `slideIn 0.3s ease ${idx * 80}ms both`,
            }}
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-zinc-300">{item.label}</span>
            <span className="text-sm font-semibold text-white">
              {((item.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
