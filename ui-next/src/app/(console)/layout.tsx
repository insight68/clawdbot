'use client';

import { ReactNode } from 'react';
import { Navigation } from '@/components/navigation';

interface ConsoleLayoutProps {
  children: ReactNode;
}

export default function ConsoleLayout({ children }: ConsoleLayoutProps) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Navigation />
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
