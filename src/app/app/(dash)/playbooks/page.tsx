'use client';

import { Button } from '@/components/ui';

const mockPlaybooks = [
  {
    icon: '🎯',
    title: 'Meta Ads: Testing → Scaling',
    description: 'Full framework from $0 → first profitable campaign. Creative testing, audience structure, budget rules, kill criteria.',
    sources: 8,
    decisions: 12,
    kills: 5,
    conflicts: 2,
    nodes: ['Creative testing', 'Audience test', 'CBO scale', 'Horizontal scale', 'Retention loop'],
    active: 2,
  },
  {
    icon: '📱',
    title: 'TikTok Ads: Launch Playbook',
    description: 'Native content strategy, Spark Ads setup, audience targeting, scaling triggers specific to TikTok\'s algorithm.',
    sources: 5,
    decisions: 8,
    kills: 4,
    conflicts: 1,
    nodes: ['Content creation', 'Spark Ads', 'Audience test', 'Scale', 'Cross-platform'],
    active: 1,
  },
  {
    icon: '🏪',
    title: 'Store CRO Checklist',
    description: 'Every conversion lever for Shopify. Mobile-first, trust signals, urgency, checkout optimization.',
    sources: 6,
    decisions: 18,
    kills: 3,
    conflicts: 1,
    nodes: ['Hero section', 'Trust signals', 'Urgency', 'Checkout', 'Post-purchase'],
    active: 3,
  },
];

export default function PlaybooksPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 700 }}>Execution Playbooks</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '3px' }}>
            Auto-generated from knowledge base. Decision trees + kill rules + scale triggers.
          </p>
        </div>
        <Button>+ Generate new</Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
        {mockPlaybooks.map((playbook, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '20px',
              transition: 'var(--transition)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = 'var(--shadow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            <div style={{ fontSize: '26px', marginBottom: '10px' }}>{playbook.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '5px' }}>{playbook.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', lineHeight: 1.5, marginBottom: '10px' }}>
              {playbook.description}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Sources: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{playbook.sources}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Decisions: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{playbook.decisions}</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Kill rules: <span style={{ color: 'var(--text)', fontWeight: 600 }}>{playbook.kills}</span>
              </div>
              {playbook.conflicts > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Conflicts: <span style={{ color: 'var(--orange)', fontWeight: 600 }}>{playbook.conflicts}</span>
                </div>
              )}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
              {playbook.nodes.map((node, j) => (
                <span key={j}>
                  <div
                    style={{
                      fontSize: '10px',
                      padding: '4px 9px',
                      borderRadius: '4px',
                      background: j < playbook.active ? 'var(--accent-bg)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${j < playbook.active ? 'var(--accent)' : 'var(--border)'}`,
                      color: j < playbook.active ? 'var(--accent)' : 'var(--text-dim)',
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                    }}
                  >
                    {node}
                  </div>
                  {j < playbook.nodes.length - 1 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: '9px', margin: '0 2px' }}>→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
