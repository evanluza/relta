'use client';

import { Card } from '@/components/ui/Card';
import { truncateAddress, formatUSDC } from '@/lib/utils';

interface Transaction {
  id: string;
  buyer_wallet: string;
  amount: number;
  platform_fee: number;
  tx_hash: string;
  created_at: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <p className="text-muted text-center py-4">No transactions yet</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted border-b border-card-border">
            <th className="text-left pb-3 font-medium">Date</th>
            <th className="text-left pb-3 font-medium">Buyer</th>
            <th className="text-right pb-3 font-medium">Amount</th>
            <th className="text-right pb-3 font-medium">Fee</th>
            <th className="text-right pb-3 font-medium">Tx</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-card-border/50 last:border-0">
              <td className="py-3">
                {new Date(tx.created_at).toLocaleDateString()}
              </td>
              <td className="py-3 font-mono text-muted">
                {truncateAddress(tx.buyer_wallet)}
              </td>
              <td className="py-3 text-right">{formatUSDC(tx.amount)}</td>
              <td className="py-3 text-right text-muted">{formatUSDC(tx.platform_fee)}</td>
              <td className="py-3 text-right">
                <a
                  href={`https://basescan.org/tx/${tx.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-hover"
                >
                  {tx.tx_hash.slice(0, 8)}...
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
