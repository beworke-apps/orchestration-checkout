'use client';

import { DashboardToolbar } from '@/widgets/dashboard';
import { EmployeesTable } from '@/widgets/employees';
import { KpiRow, SalesPerformanceCard, TrafficSourceCard } from '@/widgets/shared';

export function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 pt-4 pb-10">
      <DashboardToolbar />
      <KpiRow />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <SalesPerformanceCard />
        <TrafficSourceCard />
      </div>
      <EmployeesTable />
    </div>
  );
}
