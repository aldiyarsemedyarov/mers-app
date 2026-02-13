'use client';

import { Button } from '@/components/ui';

const mockCompetitors = [
  {
    name: 'SlimWear.co',
    url: 'https://slimwear.co',
    category: 'Activewear',
    price: 29,
    priceChange: -10,
    rating: 4.6,
    reviews: 2834,
    lastChecked: '2h ago',
  },
  {
    name: 'FitComfort',
    url: 'https://fitcomfort.com',
    category: 'Activewear',
    price: 42,
    priceChange: 0,
    rating: 4.8,
    reviews: 1592,
    lastChecked: '5h ago',
  },
];

export default function CompetitorsPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Competitor Intelligence</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '3px' }}>
            Live monitoring of competitor stores, prices, and ad creatives.
          </p>
        </div>
        <Button>+ Track competitor</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        {mockCompetitors.map((comp, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '18px',
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>{comp.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              {comp.category} · Last checked {comp.lastChecked}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Price</div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>${comp.price}</div>
                {comp.priceChange !== 0 && (
                  <div style={{ fontSize: '11px', color: comp.priceChange < 0 ? 'var(--red)' : 'var(--green)' }}>
                    {comp.priceChange > 0 ? '↑' : '↓'} ${Math.abs(comp.priceChange)}
                  </div>
                )}
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Rating</div>
                <div style={{ fontSize: '18px', fontWeight: 700 }}>
                  {comp.rating} ⭐
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{comp.reviews} reviews</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" style={{ width: '100%' }}>
              View details →
            </Button>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>
        🎨 Competitor Ad Creatives — Meta Ad Library
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '14px' }}>
        Top-performing creatives in your niche, auto-scraped daily. Click to view hooks and CTAs.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '12px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '160px',
                background: 'var(--surface)',
                borderRadius: 'var(--radius-xs)',
                marginBottom: '8px',
              }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>SlimWear.co · Meta</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Hook: "I wore these for 30 days..."</div>
          </div>
        ))}
      </div>
    </div>
  );
}
