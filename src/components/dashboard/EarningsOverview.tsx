'use client';

import { Card } from '@/components/ui/Card';
import { formatUSDC } from '@/lib/utils';

interface EarningsOverviewProps {
  totalEarnings: number;
  totalTransactions: number;
  totalLinks: number;
}

export function EarningsOverview({ totalEarnings, totalTransactions, totalLinks }: EarningsOverviewProps) {
  const stats = [
    { label: 'Total Earned', value: formatUSDC(totalEarnings) },
    { label: 'Transactions', value: totalTransactions.toString() },
    { label: 'Active Links', value: totalLinks.toString() },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <p className="text-sm text-muted">{stat.label}</p>
          <p className="text-2xl font-bold mt-1">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
