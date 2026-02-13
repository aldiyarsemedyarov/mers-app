'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

const categories = ['all', 'ads', 'creative', 'store', 'sourcing', 'fulfillment', 'email', 'conflict'];
const categoryLabels: Record<string, string> = {
  all: 'All',
  ads: 'Meta Ads',
  creative: 'Creatives',
  store: 'Store CRO',
  sourcing: 'Sourcing',
  fulfillment: 'Fulfillment',
  email: 'Email/SMS',
  conflict: '⚠️ Conflicts',
};

const mockTactics = [
  {
    id: '1',
    tactic: 'Use broad targeting + Advantage+',
    detail: "Let Meta's algorithm find buyers. Interest stacking is dead for most niches.",
    category: 'ads',
    rule: 'IF CPM > $30 on interest → switch to broad\nKILL IF: no purchase after $50 spend',
    sources: ['Biaheza', 'Jordan Welsh', 'Foundr', 'AC Hampton'],
    confidence: 92,
    status: 'verified',
  },
  {
    tactic: 'UGC hooks outperform studio ads 2-3x',
    detail: 'Phone-recorded, authentic feel. First 3 sec = make or break.',
    category: 'creative',
    rule: 'Test 3 UGC hooks per product\nSCALE IF: hook rate > 30% + CTR > 2%',
    sources: ['Biaheza', 'Sara Finance', 'Arie Scherson', 'Sebastian Ghiorghiu'],
    confidence: 96,
    status: 'verified',
  },
  {
    tactic: 'Urgency elements lift CR 15-30%',
    detail: 'Countdown timers, low-stock badges, "X people viewing" popups.',
    category: 'store',
    rule: 'IF CR < 2% → add urgency\nA/B test 7 days before committing',
    sources: ['Jordan Welsh', 'Wholesale Ted', 'Foundr'],
    confidence: 88,
    status: 'verified',
  },
  {
    tactic: '⚠️ When to kill underperforming ad sets',
    detail: 'CONFLICT: Sources disagree on kill timeline.',
    category: 'ads',
    rule: 'A: Kill after 48h (Biaheza, Sara Finance)\nB: Wait 96h for learning (Davie Fogarty)',
    sources: ['Biaheza', 'Sara Finance', 'Davie Fogarty'],
    confidence: -1,
    status: 'conflict',
    isConflict: true,
  },
];

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  let filtered = mockTactics;
  if (categoryFilter === 'conflict') {
    filtered = filtered.filter((t) => t.isConflict);
  } else if (categoryFilter !== 'all') {
    filtered = filtered.filter((t) => t.category === categoryFilter);
  }

  if (search) {
    filtered = filtered.filter((t) =>
      [t.tactic, t.detail, t.rule, ...t.sources].join(' ').toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            className="search-box"
            placeholder="Search tactics, rules, sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {filtered.length} tactics · {mockTactics.length} sources · {mockTactics.filter((t) => t.isConflict).length} conflicts
          </span>
        </div>
        <Button>+ Add tactic</Button>
      </div>

      <div className="kb-filters" style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip${categoryFilter === cat ? ' active' : ''}`}
            onClick={() => setCategoryFilter(cat)}
          >
            {categoryLabels[cat]}{' '}
            <span style={{ opacity: 0.6 }}>
              {cat === 'all'
                ? mockTactics.length
                : cat === 'conflict'
                  ? mockTactics.filter((t) => t.isConflict).length
                  : mockTactics.filter((t) => t.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      <table className="kb-table">
        <thead>
          <tr>
            <th>Tactic</th>
            <th>Category</th>
            <th>Decision Rule</th>
            <th>Sources</th>
            <th>Confidence</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tactic) => (
            <tr key={tactic.id}>
              <td>
                <strong style={{ fontSize: '12.5px' }}>{tactic.tactic}</strong>
                <br />
                <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>{tactic.detail}</span>
              </td>
              <td style={{ fontSize: '12px', textTransform: 'capitalize' }}>{tactic.category}</td>
              <td style={{ fontSize: '11.5px', color: 'var(--text-dim)', whiteSpace: 'pre-line', maxWidth: '220px' }}>
                {tactic.rule}
              </td>
              <td>
                {tactic.sources.map((src, i) => (
                  <span key={i} className="source-badge">
                    {src}
                  </span>
                ))}
              </td>
              <td>
                {tactic.confidence < 0 ? (
                  <span className="confidence med">● Split</span>
                ) : (
                  <span className={`confidence ${tactic.confidence >= 85 ? 'high' : tactic.confidence >= 60 ? 'med' : 'low'}`}>
                    ● {tactic.confidence}%
                  </span>
                )}
                <br />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{tactic.sources.length} sources</span>
              </td>
              <td>
                {tactic.status === 'verified' && (
                  <span className="card-tag tag-agent" style={{ fontSize: '10.5px' }}>
                    Verified
                  </span>
                )}
                {tactic.status === 'conflict' && <span className="conflict-badge">⚠ Test</span>}
                {tactic.status === 'suggested' && (
                  <span className="card-tag tag-source" style={{ fontSize: '10.5px' }}>
                    Suggested
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
