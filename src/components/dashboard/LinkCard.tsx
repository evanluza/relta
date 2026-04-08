'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatUSDC } from '@/lib/utils';
import { useState } from 'react';

interface LinkData {
  id: string;
  type: 'tip' | 'pay' | 'download';
  title: string;
  price: number | null;
  slug: string;
  earnings: number;
  transaction_count: number;
}

interface LinkCardProps {
  link: LinkData;
  username: string;
  onDelete: (id: string) => void;
}

export function LinkCard({ link, username, onDelete }: LinkCardProps) {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}/${link.slug}`;

  function copyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{link.title}</h3>
          <Badge type={link.type} />
        </div>
        {link.price && (
          <span className="text-lg font-bold">{formatUSDC(link.price)}</span>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4">
        <code className="text-xs text-muted bg-background px-2 py-1 rounded flex-1 truncate">
          /{username}/{link.slug}
        </code>
        <Button variant="ghost" onClick={copyUrl} className="text-xs shrink-0">
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="text-muted">
          {formatUSDC(link.earnings)} earned &middot; {link.transaction_count} txns
        </div>
        <Button variant="danger" onClick={() => onDelete(link.id)} className="text-xs">
          Delete
        </Button>
      </div>
    </Card>
  );
}
