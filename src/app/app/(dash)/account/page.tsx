'use client';

export default function AccountPage() {
  return (
    <div>
      <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Account Settings</h2>

      <div className="settings-section">
        <h4>Profile</h4>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--green))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: '#000',
            }}
          >
            A
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Aldiyar Semedyarov</div>
            <div style={{ fontSize: '13px', color: 'var(--text-dim)' }}>aldiyar@mers.ai</div>
          </div>
        </div>

        <label>Full Name</label>
        <input type="text" defaultValue="Aldiyar Semedyarov" />

        <label>Email</label>
        <input type="email" defaultValue="aldiyar@mers.ai" />

        <label>Timezone</label>
        <select defaultValue="Europe/Zurich">
          <option>Europe/Zurich</option>
          <option>America/New_York</option>
          <option>America/Los_Angeles</option>
        </select>
      </div>

      <div className="settings-section">
        <h4>API Keys</h4>
        <div className="settings-row">
          <span>Shopify API Key</span>
          <code className="api-key">shpca_****...ef98</code>
        </div>
        <div className="settings-row">
          <span>Meta Ads Token</span>
          <code className="api-key">EAAM****...1234</code>
        </div>
      </div>
    </div>
  );
}
