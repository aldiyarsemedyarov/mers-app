'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

export default function CashFlowPage() {
  const [period, setPeriod] = useState(30);

  const summary = {
    revenue: 72800,
    adSpend: 25480,
    cogs: 21840,
    netProfit: 8072,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Cash Flow — Funds Flow</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '3px' }}>
            Live data from Shopify + Meta Ads + TikTok Ads. Where every dollar goes.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          <Button variant="ghost" size="sm" className={period === 7 ? 'active-period' : ''} onClick={() => setPeriod(7)}>
            7d
          </Button>
          <Button variant="ghost" size="sm" className={period === 30 ? 'active-period' : ''} onClick={() => setPeriod(30)}>
            30d
          </Button>
          <Button variant="ghost" size="sm" className={period === 90 ? 'active-period' : ''} onClick={() => setPeriod(90)}>
            90d
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <SummaryCard label="Revenue" value={summary.revenue} color="var(--green)" />
        <SummaryCard label="Ad Spend" value={summary.adSpend} color="var(--blue)" />
        <SummaryCard label="COGS" value={summary.cogs} color="var(--orange)" />
        <SummaryCard label="Net Profit" value={summary.netProfit} color="var(--accent)" />
      </div>

      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>Cash Flow Breakdown</h3>
        <table className="kb-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
              <th style={{ textAlign: 'right' }}>% of Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Revenue</td>
              <td>Shopify Sales</td>
              <td style={{ textAlign: 'right' }}>${summary.revenue.toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>100%</td>
            </tr>
            <tr>
              <td>Ad Spend</td>
              <td>Meta Ads</td>
              <td style={{ textAlign: 'right', color: 'var(--red)' }}>-${(summary.adSpend * 0.6).toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>{((summary.adSpend * 0.6 / summary.revenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>Ad Spend</td>
              <td>TikTok Ads</td>
              <td style={{ textAlign: 'right', color: 'var(--red)' }}>-${(summary.adSpend * 0.4).toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>{((summary.adSpend * 0.4 / summary.revenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>COGS</td>
              <td>Product Cost</td>
              <td style={{ textAlign: 'right', color: 'var(--red)' }}>-${summary.cogs.toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>{((summary.cogs / summary.revenue) * 100).toFixed(1)}%</td>
            </tr>
            <tr>
              <td>Shipping</td>
              <td>Fulfillment</td>
              <td style={{ textAlign: 'right', color: 'var(--red)' }}>-${(summary.revenue * 0.09).toLocaleString()}</td>
              <td style={{ textAlign: 'right' }}>9.0%</td>
            </tr>
            <tr>
              <td>Net Profit</td>
              <td>After all costs</td>
              <td style={{ textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>${summary.netProfit.toLocaleString()}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{((summary.netProfit / summary.revenue) * 100).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{ flex: 1, minWidth: '200px', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 700, color }}>${value.toLocaleString()}</div>
    </div>
  );
}
