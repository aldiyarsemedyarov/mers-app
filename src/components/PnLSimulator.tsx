"use client";

import { useState } from "react";

type PnLData = {
  revenue: number;
  cogs: number;
  marketing: number;
  overhead: number;
};

export function PnLSimulator() {
  const [before, setBefore] = useState<PnLData>({
    revenue: 10000,
    cogs: 6000,
    marketing: 3000,
    overhead: 1500,
  });

  const [after, setAfter] = useState<PnLData>({
    revenue: 15000,
    cogs: 7500,
    marketing: 3500,
    overhead: 1500,
  });

  const calculateProfit = (data: PnLData) =>
    data.revenue - data.cogs - data.marketing - data.overhead;

  const profitBefore = calculateProfit(before);
  const profitAfter = calculateProfit(after);
  const improvement = profitAfter - profitBefore;
  const improvementPct = ((improvement / Math.abs(profitBefore)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-white">P&L Simulator</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Compare your current vs. optimized financials
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Before */}
        <div className="space-y-4 rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Current (Before)
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400">Revenue</label>
              <input
                type="number"
                value={before.revenue}
                onChange={(e) => setBefore({ ...before, revenue: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">COGS</label>
              <input
                type="number"
                value={before.cogs}
                onChange={(e) => setBefore({ ...before, cogs: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Marketing</label>
              <input
                type="number"
                value={before.marketing}
                onChange={(e) => setBefore({ ...before, marketing: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Overhead</label>
              <input
                type="number"
                value={before.overhead}
                onChange={(e) => setBefore({ ...before, overhead: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="rounded-lg bg-red-500/10 p-4 ring-1 ring-red-500/20">
            <div className="text-xs text-red-300">Net Profit</div>
            <div className="mt-1 text-2xl font-bold text-red-400">
              ${profitBefore.toLocaleString()}
            </div>
          </div>
        </div>

        {/* After */}
        <div className="space-y-4 rounded-2xl bg-zinc-900/50 p-6 ring-1 ring-white/10">
          <div className="text-center">
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Optimized (After)
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-400">Revenue</label>
              <input
                type="number"
                value={after.revenue}
                onChange={(e) => setAfter({ ...after, revenue: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">COGS</label>
              <input
                type="number"
                value={after.cogs}
                onChange={(e) => setAfter({ ...after, cogs: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Marketing</label>
              <input
                type="number"
                value={after.marketing}
                onChange={(e) => setAfter({ ...after, marketing: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400">Overhead</label>
              <input
                type="number"
                value={after.overhead}
                onChange={(e) => setAfter({ ...after, overhead: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg bg-zinc-800 px-3 py-2 text-sm text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="rounded-lg bg-green-500/10 p-4 ring-1 ring-green-500/20">
            <div className="text-xs text-green-300">Net Profit</div>
            <div className="mt-1 text-2xl font-bold text-green-400">
              ${profitAfter.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Improvement Summary */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 ring-1 ring-blue-500/20">
        <div className="text-center">
          <div className="text-sm text-zinc-300">Projected Improvement</div>
          <div className="mt-2 text-4xl font-bold text-white">
            {improvement >= 0 ? "+" : ""}${improvement.toLocaleString()}
          </div>
          <div className="mt-1 text-lg font-medium text-blue-400">
            {improvement >= 0 ? "+" : ""}{improvementPct}%
          </div>
        </div>
      </div>
    </div>
  );
}
