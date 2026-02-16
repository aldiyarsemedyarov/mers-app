'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

const trendingProducts = [
  {name:'Neck & Jaw Exerciser',searchVolume:'+340%',margin:'8x',competition:'Low',status:'Hot'},
  {name:'LED Face Mask',searchVolume:'+180%',margin:'6x',competition:'Medium',status:'Rising'},
  {name:'Posture Corrector',searchVolume:'+120%',margin:'7x',competition:'High',status:'Saturated'},
  {name:'Compression Recovery Boots',searchVolume:'+215%',margin:'5.5x',competition:'Medium',status:'Hot'},
  {name:'Smart Hula Hoop',searchVolume:'+165%',margin:'7x',competition:'Low',status:'Rising'},
  {name:'Acupressure Mat Set',searchVolume:'+95%',margin:'6x',competition:'High',status:'Stable'},
  {name:'Foot Massager',searchVolume:'+280%',margin:'5x',competition:'High',status:'Hot'},
  {name:'Scalp Massager',searchVolume:'+145%',margin:'9x',competition:'Low',status:'Rising'},
  {name:'Ice Roller for Face',searchVolume:'+190%',margin:'7.5x',competition:'Medium',status:'Hot'},
];

export default function ResearchPage() {
  const [query, setQuery] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Product Research</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '3px' }}>
            Enter a product idea or niche — Mers analyzes demand, competition, and margins.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <input
          className="search-box"
          placeholder="e.g., posture corrector, LED face mask, compression socks..."
          style={{ width: '500px' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button disabled={!query.trim()}>🔍 Analyze</Button>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '20px' }}>
        Tip: paste a product idea or niche to unlock demand + margin estimates.
      </div>

      <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '14px' }}>🔥 Trending Products This Week</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {trendingProducts.map((product, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>{product.name}</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Search Volume</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--green)' }}>{product.searchVolume}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Margin</div>
                <div style={{ fontSize: '16px', fontWeight: 700 }}>{product.margin}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Competition</div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color:
                      product.competition === 'Low'
                        ? 'var(--green)'
                        : product.competition === 'Medium'
                          ? 'var(--orange)'
                          : 'var(--red)',
                  }}
                >
                  {product.competition}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '10px',
                padding: '3px 8px',
                borderRadius: '4px',
                background:
                  product.status === 'Hot'
                    ? 'rgba(46, 213, 115, 0.1)'
                    : product.status === 'Rising'
                      ? 'rgba(255, 159, 67, 0.1)'
                      : 'rgba(255, 77, 77, 0.1)',
                color:
                  product.status === 'Hot'
                    ? 'var(--green)'
                    : product.status === 'Rising'
                      ? 'var(--orange)'
                      : 'var(--red)',
                border: `1px solid ${
                  product.status === 'Hot'
                    ? 'rgba(46, 213, 115, 0.15)'
                    : product.status === 'Rising'
                      ? 'rgba(255, 159, 67, 0.15)'
                      : 'rgba(255, 77, 77, 0.15)'
                }`,
                fontWeight: 600,
              }}
            >
              {product.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
