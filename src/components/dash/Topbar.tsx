'use client';

import { useState } from 'react';
import { Badge } from '../ui';

export function Topbar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="topbar-search"
            placeholder="Search... ⌘K"
            onClick={onOpenCommandPalette}
            readOnly
          />
        </div>
      </div>

      <div className="topbar-right">
        <Badge variant="status">
          <span className="status-dot"></span>
          Agent Active
        </Badge>

        {/* Notifications Bell */}
        <div className="notif-bell" onClick={() => setShowNotifs(!showNotifs)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <div className="notif-badge">3</div>
          <div className={`notif-panel${showNotifs ? ' open' : ''}`}>
            <NotificationItem
              type="agent"
              title="Mers suggested new task"
              message="Add urgency timer to product page — Est. +22% CR"
              time="2 min ago"
              unread
            />
            <NotificationItem
              type="system"
              title="Meta Ads alert"
              message="CPM exceeded $30 on Ad Set #2"
              time="18 min ago"
              unread
            />
            <NotificationItem
              type="agent"
              title="Store audit complete"
              message="14 issues found, 8 critical"
              time="1h ago"
            />
          </div>
        </div>

        {/* Avatar & Account Dropdown */}
        <div className="avatar-wrap">
          <div className="avatar" onClick={() => setShowAccountDropdown(!showAccountDropdown)}>
            A
          </div>
          <div className={`account-dropdown${showAccountDropdown ? ' open' : ''}`}>
            <div className="account-dropdown-header">
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Aldiyar Semedyarov</div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '2px' }}>
                aldiyar@mers.ai
              </div>
              <div style={{ fontSize: '10px', color: 'var(--accent)', marginTop: '4px', fontWeight: 600 }}>
                Owner
              </div>
            </div>
            <div className="account-dropdown-divider"></div>
            <a href="/app/account" className="account-dropdown-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Account Settings
            </a>
            <a href="/app/settings" className="account-dropdown-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              Settings
            </a>
            <div className="account-dropdown-divider"></div>
            <div className="account-dropdown-item" style={{ color: 'var(--red)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({
  type,
  title,
  message,
  time,
  unread,
}: {
  type: string;
  title: string;
  message: string;
  time: string;
  unread?: boolean;
}) {
  const iconBg = type === 'agent' ? 'var(--green)' : type === 'system' ? 'var(--blue)' : 'var(--purple)';
  const icon = type === 'agent' ? '🤖' : type === 'system' ? '⚙️' : '👤';

  return (
    <div className={`notif-item${unread ? ' unread' : ''}`}>
      <div className="notif-icon" style={{ background: `${iconBg}15`, color: iconBg }}>
        {icon}
      </div>
      <div>
        <div className="notif-text">
          <strong>{title}</strong>
          <br />
          {message}
        </div>
        <div className="notif-time">{time}</div>
      </div>
    </div>
  );
}
