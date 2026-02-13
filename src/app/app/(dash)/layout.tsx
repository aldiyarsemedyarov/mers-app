'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { Sidebar } from '@/components/dash/Sidebar';
import { Topbar } from '@/components/dash/Topbar';
import { LiveTicker } from '@/components/dash/LiveTicker';
import { ChatPanel } from '@/components/dash/ChatPanel';
import { CommandPalette } from '@/components/CommandPalette';

export default function DashLayout({ children }: { children: ReactNode }) {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  return (
    <>
      <CommandPalette />
      <Sidebar />
      <Topbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <main className="page">{children}</main>
      <LiveTicker />
      <ChatPanel />
    </>
  );
}
