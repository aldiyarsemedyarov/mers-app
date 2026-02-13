'use client';

const tickerItems = [
  { text: 'Order #1847 — $39 — Slim&Fit', dot: 'var(--green)' },
  { text: 'Meta Ads spend: $142.30 today', dot: 'var(--blue)' },
  { text: 'New task: Add urgency timer', dot: 'var(--purple)' },
  { text: 'Mers analyzing competitor: SlimWear.co', dot: 'var(--orange)' },
  { text: 'TikTok Ads ROAS: 2.8x', dot: 'var(--green)' },
  { text: 'Shopify sync: 6 orders, 23 products', dot: 'var(--accent)' },
  { text: 'Order #1848 — $78 (bundle) — Slim&Fit', dot: 'var(--green)' },
  { text: 'Knowledge Base: 32 tactics verified', dot: 'var(--blue)' },
];

export function LiveTicker() {
  return (
    <div className="live-ticker" style={{ marginBottom: 0 }}>
      <div className="ticker-content">
        {/* Duplicate items for seamless loop */}
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
          <div key={i} className="ticker-item">
            <div className="dot" style={{ background: item.dot }}></div>
            {item.text}
          </div>
        ))}
      </div>
    </div>
  );
}
