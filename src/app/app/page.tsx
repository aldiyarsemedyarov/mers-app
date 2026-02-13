'use client';

import { useEffect, useState } from 'react';
import { Card, Button, Badge } from '@/components/ui';

interface DashboardData {
  todayPerformance: {
    revenue: number;
    revenueChange: number;
    orders: number;
    ordersChange: number;
    roas: number;
    roasChange: number;
    netProfit: number;
    netProfitChange: number;
  };
  monthlyGoals: {
    revenue: { current: number; target: number };
    netMargin: { current: number; target: number };
    roas: { current: number; target: number };
    emailRevenue: { current: number; target: number };
    tasksCompleted: { current: number; target: number };
  };
  topProduct: {
    name: string;
    sellPrice: number;
    cogs: number;
    shipping: number;
    adCost: number;
    processing: number;
    margin: number;
    marginPercent: number;
  };
}

const insights = [
  {
    icon: '🚀',
    title: 'Scale opportunity',
    text: 'UGC Hook #3 has 4.2x ROAS over 72h. Recommend increasing budget 20% ($42/day → $50/day).',
    action: { label: '→ View in Tasks', page: 'tasks' },
  },
  {
    icon: '⚠️',
    title: 'Price war alert',
    text: "SlimWear.co dropped Compression Leggings from $39 → $29 yesterday. Your product is still competitive on quality/reviews but monitor closely.",
    action: { label: '→ View competitors', page: 'competitors' },
  },
  {
    icon: '💡',
    title: 'New tactic (92% confidence)',
    text: '4/5 creators agree — add countdown timer + stock counter to product page. Est. +22% CR.',
    action: { label: '→ View in KB', page: 'knowledge' },
  },
  {
    icon: '📧',
    title: 'Klaviyo performing',
    text: 'Abandoned cart flow hitting 8.2% recovery rate (target was 5%). Recovered $1,240 this week. Consider expanding to post-purchase flow.',
  },
  {
    icon: '🔥',
    title: 'Trending',
    text: 'Neck & Jaw Exerciser (+340% search volume, 8x margin). Low competition window closing in ~2 weeks.',
    action: { label: '→ Research it', page: 'research' },
  },
];

const recentActivity = [
  { type: 'agent', text: '<strong>Mers</strong> suggested <strong>Add urgency timer</strong>', time: '2 min ago' },
  { type: 'agent', text: '<strong>Mers</strong> detected conflict: <strong>kill ads at 48h vs 96h</strong>', time: '15 min ago' },
  { type: 'agent', text: '<strong>Mers</strong> suggested <strong>Launch TikTok Ads</strong>', time: '30 min ago' },
  { type: 'agent', text: '<strong>Mers</strong> ingested 12 videos from <strong>Jordan Welsh</strong>', time: '1h ago' },
  { type: 'human', text: '<strong>Aldiyar</strong> approved <strong>Meta Ads restructure</strong>', time: '2h ago' },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real data from API
    fetch('/api/dashboard/summary')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        // Use mock data on error
        setData({
          todayPerformance: {
            revenue: 2614,
            revenueChange: 12,
            orders: 68,
            ordersChange: 8,
            roas: 3.08,
            roasChange: 0.12,
            netProfit: 468,
            netProfitChange: 18,
          },
          monthlyGoals: {
            revenue: { current: 72800, target: 85000 },
            netMargin: { current: 11.1, target: 15 },
            roas: { current: 2.56, target: 3.0 },
            emailRevenue: { current: 8, target: 25 },
            tasksCompleted: { current: 11, target: 18 },
          },
          topProduct: {
            name: 'Compression Leggings — Black',
            sellPrice: 39.0,
            cogs: 8.4,
            shipping: 3.2,
            adCost: 12.8,
            processing: 1.37,
            margin: 13.23,
            marginPercent: 33.9,
          },
        });
        setLoading(false);
      });
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
        <div className="skeleton" style={{ width: '200px', height: '200px', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!data) return null;

  const { todayPerformance, monthlyGoals, topProduct } = data;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div className="dash-greeting">{greeting()}, Aldiyar</div>
        <div className="dash-sub">
          Here's your daily briefing from Mers.{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>⌘K to search anything</span>
        </div>
      </div>

      <div className="dash-grid">
        <div>
          {/* Today's Performance */}
          <Card variant="dash" style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '14px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Today's Performance
              </span>
              <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 500 }}>
                All systems healthy ✓
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Revenue</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--green)' }}>
                  ${todayPerformance.revenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--green)' }}>
                  ↑ {todayPerformance.revenueChange}% vs yesterday
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Orders</div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>{todayPerformance.orders}</div>
                <div style={{ fontSize: '11px', color: 'var(--green)' }}>↑ {todayPerformance.ordersChange}%</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ROAS</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
                  {todayPerformance.roas.toFixed(2)}x
                </div>
                <div style={{ fontSize: '11px', color: 'var(--green)' }}>↑ {todayPerformance.roasChange.toFixed(2)}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Net Profit</div>
                <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>
                  ${todayPerformance.netProfit}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--green)' }}>↑ {todayPerformance.netProfitChange}%</div>
              </div>
            </div>
          </Card>

          {/* AI Insights */}
          <Card variant="dash" style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: 'inline', marginRight: '6px' }}
              >
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
                <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              AI Insights
            </div>
            {insights.map((insight, i) => (
              <div key={i} className="insight-item">
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-text">
                  <strong>{insight.title}:</strong> {insight.text}
                  {insight.action && (
                    <span style={{ color: 'var(--accent)', cursor: 'pointer', marginLeft: '4px' }}>
                      {insight.action.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </Card>

          {/* Recent Activity */}
          <Card variant="dash">
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: 'inline', marginRight: '6px' }}
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Recent Agent Actions
            </div>
            {recentActivity.map((activity, i) => (
              <div key={i} className="insight-item" style={{ borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="insight-icon">{activity.type === 'agent' ? '🤖' : '👤'}</div>
                <div className="insight-text">
                  <div dangerouslySetInnerHTML={{ __html: activity.text }} />
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div>
          {/* Monthly Goals */}
          <Card variant="dash" style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: 'inline', marginRight: '6px' }}
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
              Monthly Goals
            </div>

            <GoalBar
              label="Revenue"
              current={monthlyGoals.revenue.current}
              target={monthlyGoals.revenue.target}
              format="currency"
              color="var(--accent)"
            />
            <GoalBar
              label="Net Margin"
              current={monthlyGoals.netMargin.current}
              target={monthlyGoals.netMargin.target}
              format="percent"
              color="var(--green)"
            />
            <GoalBar
              label="ROAS"
              current={monthlyGoals.roas.current}
              target={monthlyGoals.roas.target}
              format="roas"
              color="var(--blue)"
            />
            <GoalBar
              label="Email Revenue %"
              current={monthlyGoals.emailRevenue.current}
              target={monthlyGoals.emailRevenue.target}
              format="percent"
              color="var(--purple)"
            />
            <GoalBar
              label="Tasks Completed"
              current={monthlyGoals.tasksCompleted.current}
              target={monthlyGoals.tasksCompleted.target}
              format="number"
              color="var(--orange)"
            />
          </Card>

          {/* Product P&L Mini */}
          <Card variant="dash" style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                Product P&L
              </span>
              <span style={{ fontSize: '11px', color: 'var(--accent)', cursor: 'pointer' }}>View all →</span>
            </div>
            <div style={{ fontSize: '12px', marginBottom: '8px', color: 'var(--text-dim)' }}>Top performer today:</div>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>{topProduct.name}</div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Sell price</span>
              <span>${topProduct.sellPrice.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>COGS</span>
              <span className="pnl-neg">-${topProduct.cogs.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Shipping</span>
              <span className="pnl-neg">-${topProduct.shipping.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Ad cost (CPA)</span>
              <span className="pnl-neg">-${topProduct.adCost.toFixed(2)}</span>
            </div>
            <div className="pnl-row">
              <span style={{ color: 'var(--text-dim)' }}>Processing (3.5%)</span>
              <span className="pnl-neg">-${topProduct.processing.toFixed(2)}</span>
            </div>
            <div className="pnl-row total">
              <span>Contribution margin</span>
              <span className="pnl-pos">
                ${topProduct.margin.toFixed(2)} ({topProduct.marginPercent.toFixed(1)}%)
              </span>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card variant="dash">
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ display: 'inline', marginRight: '6px' }}
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Quick Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Button variant="ghost" size="sm" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                Get daily report
              </Button>
              <Button variant="ghost" size="sm" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Run store audit
              </Button>
              <Button variant="ghost" size="sm" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Research a product
              </Button>
              <Button variant="ghost" size="sm" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Check competitors
              </Button>
              <Button variant="ghost" size="sm" style={{ textAlign: 'left', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                ⌘K Command palette
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GoalBar({
  label,
  current,
  target,
  format,
  color,
}: {
  label: string;
  current: number;
  target: number;
  format: 'currency' | 'percent' | 'roas' | 'number';
  color: string;
}) {
  const percent = (current / target) * 100;
  const formatValue = (val: number) => {
    if (format === 'currency') return `$${(val / 1000).toFixed(1)}K`;
    if (format === 'percent') return `${val}%`;
    if (format === 'roas') return `${val.toFixed(2)}x`;
    return val.toString();
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
        <span>{label}</span>
        <span style={{ color }}>
          {formatValue(current)} / {formatValue(target)}
        </span>
      </div>
      <div className="goal-bar">
        <div className="goal-fill" style={{ width: `${Math.min(percent, 100)}%`, background: color }}></div>
      </div>
    </div>
  );
}
