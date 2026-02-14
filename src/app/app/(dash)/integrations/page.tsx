'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui';

type Integration = {
  provider: string;
  status: string;
  lastSync: string | null;
  metadata?: any;
};

type IntegrationsData = {
  store: {
    name: string;
    shopifyDomain: string;
  };
  integrations: Integration[];
};

function StatusPill({ status }: { status: 'active' | 'error' | 'disconnected' | string }) {
  const s = status === 'active' ? 'active' : status === 'error' ? 'error' : 'disconnected';
  const map: Record<string, { bg: string; border: string; text: string; label: string }> = {
    active: { bg: 'rgba(46, 213, 115, 0.10)', border: 'rgba(46, 213, 115, 0.35)', text: 'var(--green)', label: 'Connected' },
    error: { bg: 'rgba(255, 77, 77, 0.10)', border: 'rgba(255, 77, 77, 0.35)', text: 'var(--red)', label: 'Error' },
    disconnected: { bg: 'rgba(255, 255, 255, 0.04)', border: 'var(--border)', text: 'var(--text-dim)', label: 'Not connected' },
  };
  const ui = map[s];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 11,
        fontWeight: 600,
        padding: '6px 10px',
        borderRadius: 999,
        background: ui.bg,
        border: `1px solid ${ui.border}`,
        color: ui.text,
        userSelect: 'none',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 99, background: ui.text, opacity: 0.9 }} />
      {ui.label}
    </span>
  );
}

function IntegrationCard({
  title,
  subtitle,
  status,
  rows,
  actions,
}: {
  title: string;
  subtitle: string;
  status: string;
  rows: { label: string; value: string }[];
  actions?: React.ReactNode;
}) {
  return (
    <div className="dash-card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginTop: 2 }}>{subtitle}</div>
        </div>
        <StatusPill status={status} />
      </div>

      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr', gap: 10 }}>
        {rows.map((r) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'right', fontWeight: 600 }}>{r.value}</div>
          </div>
        ))}
      </div>

      {actions ? <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>{actions}</div> : null}
    </div>
  );
}

function IntegrationsContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<IntegrationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storeId = searchParams.get('store');
    const storeParam = storeId ? `?store=${storeId}` : '';

    fetch(`/api/integrations${storeParam}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setData(d.data);
        else setError(d.error || 'Failed to load integrations');
      })
      .catch(() => setError('Network error'))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const integrations = data?.integrations || [];
  const shopify = integrations.find((i) => i.provider === 'shopify');
  const meta = integrations.find((i) => i.provider === 'meta');

  const header = useMemo(() => {
    const storeName = data?.store?.name || 'your store';
    return {
      title: 'Integrations',
      subtitle: `Connections powering automation for ${storeName}.`,
    };
  }, [data]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 360 }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dash-card" style={{ padding: 18, borderColor: 'rgba(255,77,77,0.25)' }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Couldn’t load integrations</div>
        <div style={{ fontSize: 12, color: 'var(--red)' }}>{error}</div>
        <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--text-dim)' }}>
          Tip: run initialization first on the home page.
        </div>
      </div>
    );
  }

  const fmtSync = (t: string | null | undefined) =>
    t
      ? new Date(t).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700 }}>{header.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 3 }}>{header.subtitle}</p>
        </div>
        <Button variant="ghost" size="sm">
          + Add integration
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12, marginBottom: 14 }}>
        <IntegrationCard
          title="Shopify"
          subtitle="E‑commerce platform"
          status={shopify?.status || 'disconnected'}
          rows={[
            { label: 'Store', value: data?.store?.name || '—' },
            { label: 'Domain', value: data?.store?.shopifyDomain || '—' },
            { label: 'Last synced', value: fmtSync(shopify?.lastSync) },
          ]}
          actions={
            <>
              <Button variant="ghost" size="sm">
                View data
              </Button>
              <Button size="sm">Sync now</Button>
            </>
          }
        />

        <IntegrationCard
          title="Meta Ads"
          subtitle="Facebook & Instagram advertising"
          status={meta?.status || 'disconnected'}
          rows={[
            { label: 'Ad account', value: meta?.metadata?.accountName || '—' },
            { label: 'Account ID', value: meta?.metadata?.accountId || '—' },
            { label: 'Last synced', value: fmtSync(meta?.lastSync) },
          ]}
          actions={
            <>
              <Button variant="ghost" size="sm">
                Diagnostics
              </Button>
              <Button size="sm">Refresh</Button>
            </>
          }
        />
      </div>

      <div className="dash-card" style={{ padding: 18 }}>
        <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Coming next</div>
        <div style={{ display: 'grid', gap: 6, color: 'var(--text-dim)', fontSize: 12 }}>
          <div>• Multi-store switching (Slim&Fit + DermaLuxe)</div>
          <div>• Token health monitoring + rotation</div>
          <div>• TikTok Ads integration</div>
          <div>• Google Analytics integration</div>
        </div>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}> 
      <IntegrationsContent />
    </Suspense>
  );
}
