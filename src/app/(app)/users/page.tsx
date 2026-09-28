import { Suspense } from 'react';

import { UsersPage } from '@/components/pages/app/users';

export default function Page() {
  return (
    <Suspense fallback={<div className="text-muted px-5 pt-4 text-sm">Loading users…</div>}>
      <UsersPage />
    </Suspense>
  );
}
