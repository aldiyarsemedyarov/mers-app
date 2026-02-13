'use client';

import { Button } from '@/components/ui';

const mockProducts = [
  {
    name: 'Compression Leggings — Black',
    sellPrice: 39.0,
    cogs: 8.4,
    shipping: 3.2,
    adCost: 12.8,
    processing: 1.37,
    margin: 13.23,
    marginPercent: 33.9,
  },
  {
    name: 'Compression Leggings — Grey',
    sellPrice: 39.0,
    cogs: 8.4,
    shipping: 3.2,
    adCost: 15.2,
    processing: 1.37,
    margin: 10.83,
    marginPercent: 27.8,
  },
  {
    name: 'Sports Bra — Black',
    sellPrice: 29.0,
    cogs: 6.2,
    shipping: 2.8,
    adCost: 10.4,
    processing: 1.02,
    margin: 8.58,
    marginPercent: 29.6,
  },
  {
    name: 'Compression Leggings — Navy',
    sellPrice: 39.0,
    cogs: 8.4,
    shipping: 3.2,
    adCost: 13.5,
    processing: 1.37,
    margin: 12.53,
    marginPercent: 32.1,
  },
  {
    name: 'Sports Bra — Grey',
    sellPrice: 29.0,
    cogs: 6.2,
    shipping: 2.8,
    adCost: 11.2,
    processing: 1.02,
    margin: 7.78,
    marginPercent: 26.8,
  },
  {
    name: 'High-Impact Sports Bra — Black',
    sellPrice: 34.0,
    cogs: 7.1,
    shipping: 2.9,
    adCost: 12.1,
    processing: 1.19,
    margin: 10.71,
    marginPercent: 31.5,
  },
  {
    name: 'Compression Shorts — Black',
    sellPrice: 32.0,
    cogs: 6.8,
    shipping: 2.6,
    adCost: 11.5,
    processing: 1.12,
    margin: 10.0,
    marginPercent: 31.3,
  },
  {
    name: 'Seamless Leggings — Pink',
    sellPrice: 42.0,
    cogs: 9.2,
    shipping: 3.3,
    adCost: 14.8,
    processing: 1.47,
    margin: 13.23,
    marginPercent: 31.5,
  },
];

export default function PnLPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Product P&L — Unit Economics</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '3px' }}>
            Per-product profitability. Live data from Shopify + Meta Ads + Stripe.
          </p>
        </div>
        <Button>+ Add product</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {mockProducts.map((product, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '18px',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>{product.name}</div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Sell price</span>
              <span>${product.sellPrice.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>COGS</span>
              <span className="pnl-neg">-${product.cogs.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Shipping</span>
              <span className="pnl-neg">-${product.shipping.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Ad cost (CPA)</span>
              <span className="pnl-neg">-${product.adCost.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Processing (3.5%)</span>
              <span className="pnl-neg">-${product.processing.toFixed(2)}</span>
            </div>
            <div className="pnl-row total">
              <span>Contribution margin</span>
              <span className="pnl-pos">
                ${product.margin.toFixed(2)} ({product.marginPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
