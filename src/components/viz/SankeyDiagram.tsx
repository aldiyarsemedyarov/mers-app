'use client';

import { useMemo } from 'react';

interface SankeyProps {
  data: {
    revenue: number;
    adSpend: number;
    cogs: number;
    shipping: number;
    fees: number;
    netProfit: number;
  };
}

type Node = {
  id: string;
  x: number;
  y: number; // center
  w: number;
  h: number;
  color: string;
  label: string;
};

function fmtK(v: number) {
  if (!Number.isFinite(v)) return '$0';
  if (Math.abs(v) >= 1000) return `$${(v / 1000).toFixed(1)}K`;
  return `$${Math.round(v)}`;
}

function ribbonPath(from: Node, to: Node, thickness: number) {
  const x0 = from.x + from.w;
  const x1 = to.x;
  const y0 = from.y;
  const y1 = to.y;

  const t = Math.max(6, thickness);

  const y0a = y0 - t / 2;
  const y0b = y0 + t / 2;
  const y1a = y1 - t / 2;
  const y1b = y1 + t / 2;

  const cpx0 = x0 + (x1 - x0) * 0.45;
  const cpx1 = x0 + (x1 - x0) * 0.55;

  return [
    `M ${x0} ${y0a}`,
    `C ${cpx0} ${y0a}, ${cpx1} ${y1a}, ${x1} ${y1a}`,
    `L ${x1} ${y1b}`,
    `C ${cpx1} ${y1b}, ${cpx0} ${y0b}, ${x0} ${y0b}`,
    'Z',
  ].join(' ');
}

export function SankeyDiagram({ data }: SankeyProps) {
  const vbW = 1000;
  const vbH = 420;

  const { nodes, flows } = useMemo(() => {
    const revenue = Math.max(1, data.revenue);

    // Visual scaling: keep readable even at small values
    const maxOut = Math.max(data.adSpend, data.cogs, data.shipping, data.fees, data.netProfit, 1);
    const scale = 260 / Math.max(revenue, maxOut * 2);

    const left: Node = {
      id: 'revenue',
      x: 60,
      y: vbH / 2,
      w: 120,
      h: Math.max(120, revenue * scale),
      color: 'var(--green)',
      label: `Revenue\n${fmtK(data.revenue)}`,
    };

    // Right column stacked
    const rightX = 420;
    const rightW = 120;
    const stackGap = 14;

    const outItems = [
      { id: 'adSpend', v: data.adSpend, color: 'var(--blue)', label: `Ad Spend\n${fmtK(data.adSpend)}` },
      { id: 'cogs', v: data.cogs, color: 'var(--orange)', label: `COGS\n${fmtK(data.cogs)}` },
      { id: 'shipping', v: data.shipping, color: 'var(--pink)', label: `Shipping\n${fmtK(data.shipping)}` },
      { id: 'fees', v: data.fees, color: 'var(--accent)', label: `Fees\n${fmtK(data.fees)}` },
    ];

    const outHeights = outItems.map((x) => Math.max(44, x.v * scale));
    const stackTotal = outHeights.reduce((a, b) => a + b, 0) + stackGap * (outHeights.length - 1);
    let cursor = (vbH - stackTotal) / 2;

    const outNodes: Node[] = outItems.map((it, idx) => {
      const h = outHeights[idx];
      const node: Node = {
        id: it.id,
        x: rightX,
        y: cursor + h / 2,
        w: rightW,
        h,
        color: it.color,
        label: it.label,
      };
      cursor += h + stackGap;
      return node;
    });

    const profit: Node = {
      id: 'netProfit',
      x: 780,
      y: vbH / 2,
      w: 140,
      h: Math.max(70, data.netProfit * scale),
      color: 'var(--green)',
      label: `Net Profit\n${fmtK(data.netProfit)}`,
    };

    const byId = new Map<string, Node>([
      [left.id, left] as const,
      [profit.id, profit] as const,
      ...outNodes.map((n) => [n.id, n] as const),
    ]);

    const flows = [
      { from: 'revenue', to: 'adSpend', v: data.adSpend, color: 'var(--blue)' },
      { from: 'revenue', to: 'cogs', v: data.cogs, color: 'var(--orange)' },
      { from: 'revenue', to: 'shipping', v: data.shipping, color: 'var(--pink)' },
      { from: 'revenue', to: 'fees', v: data.fees, color: 'var(--accent)' },
      { from: 'revenue', to: 'netProfit', v: data.netProfit, color: 'var(--green)' },
    ]
      .filter((f) => f.v > 0)
      .map((f) => ({
        ...f,
        fromNode: byId.get(f.from)!,
        toNode: byId.get(f.to)!,
        thickness: Math.max(10, f.v * scale),
      }));

    return { nodes: [left, ...outNodes, profit], flows };
  }, [data]);

  return (
    <svg
      viewBox={`0 0 ${vbW} ${vbH}`}
      width="100%"
      height={400}
      role="img"
      aria-label="Cash flow Sankey diagram"
      style={{ width: '100%', height: 400, display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* flows */}
      {flows.map((f) => (
        <path
          key={`${f.from}-${f.to}`}
          d={ribbonPath(f.fromNode, f.toNode, f.thickness)}
          fill={f.color}
          opacity={0.22}
        />
      ))}

      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.id} filter="url(#softShadow)">
          <rect
            x={n.x}
            y={n.y - n.h / 2}
            width={n.w}
            height={n.h}
            rx={10}
            fill={n.color}
            opacity={0.85}
          />
          <text
            x={n.x + n.w / 2}
            y={n.y - 6}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight={700}
            style={{ letterSpacing: '-0.01em' }}
          >
            {n.label.split('\n')[0]}
          </text>
          <text x={n.x + n.w / 2} y={n.y + 18} textAnchor="middle" fill="rgba(255,255,255,0.92)" fontSize={12}>
            {n.label.split('\n')[1]}
          </text>
        </g>
      ))}
    </svg>
  );
}
