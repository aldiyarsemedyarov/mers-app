'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');

  return (
    <div>
      <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Settings</h2>

      <div className="settings-section">
        <h4>Appearance</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`theme-btn${theme === 'dark' ? ' active' : ''}`}
            onClick={() => setTheme('dark')}
          >
            Dark
          </button>
          <button
            className={`theme-btn${theme === 'light' ? ' active' : ''}`}
            onClick={() => setTheme('light')}
          >
            Light
          </button>
          <button
            className={`theme-btn${theme === 'system' ? ' active' : ''}`}
            onClick={() => setTheme('system')}
          >
            System
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h4>Notifications</h4>
        <div className="settings-row">
          <span>Agent task suggestions</span>
          <ToggleSwitch on />
        </div>
        <div className="settings-row">
          <span>Price change alerts</span>
          <ToggleSwitch on />
        </div>
        <div className="settings-row">
          <span>Daily summary email</span>
          <ToggleSwitch />
        </div>
      </div>

      <div className="settings-section">
        <h4>Agent Behavior</h4>
        <div className="settings-row">
          <span>Autonomous execution (no approval needed)</span>
          <ToggleSwitch />
        </div>
        <div className="settings-row">
          <span>Proactive insights</span>
          <ToggleSwitch on />
        </div>
      </div>

      <div className="settings-section danger-zone">
        <h4>Danger Zone</h4>
        <div className="settings-row">
          <span>Delete all data</span>
          <Button variant="danger" size="sm">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ on = false }: { on?: boolean }) {
  const [isOn, setIsOn] = useState(on);
  return (
    <div
      className={`toggle-switch${isOn ? ' on' : ''}`}
      onClick={() => setIsOn(!isOn)}
    />
  );
}
