import type { ReactNode } from 'react';

import { AppShell } from '@/templates/app';

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
