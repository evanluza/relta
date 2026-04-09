'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { WalletGuard } from '@/components/wallet/WalletGuard';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { UsernameModal } from '@/components/wallet/UsernameModal';
import { EarningsOverview } from '@/components/dashboard/EarningsOverview';
import { LinkCard } from '@/components/dashboard/LinkCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { useCreator } from '@/hooks/useCreator';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

interface LinkData {
  id: string;
  type: 'tip' | 'pay' | 'download';
  title: string;
  description: string | null;
  price: number | null;
  slug: string;
  earnings: number;
  transaction_count: number;
}

interface Transaction {
  id: string;
  buyer_wallet: string;
  amount: number;
  platform_fee: number;
  tx_hash: string;
  created_at: string;
}

export default function DashboardPage() {
  const { address } = useAccount();
  const { creator, loading: creatorLoading, needsUsername, onUsernameSet } = useCreator();
  const [links, setLinks] = useState<LinkData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [savingBio, setSavingBio] = useState(false);

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      try {
        const [linksRes, txRes] = await Promise.all([
          fetch(`/api/links?wallet=${address}`),
          fetch(`/api/transactions?wallet=${address}`),
        ]);
        const linksData = await linksRes.json();
        const txData = await txRes.json();
        setLinks(linksData.links || []);
        setTransactions(txData.transactions || []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [address]);

  async function handleDelete(id: string) {
    const res = await fetch(`/api/links/${id}?wallet=${address}`, { method: 'DELETE' });
    if (res.ok) {
      setLinks(links.filter(l => l.id !== id));
    }
  }

  useEffect(() => {
    if (creator?.bio !== undefined) {
      setBio(creator.bio || '');
    }
  }, [creator]);

  async function handleSaveBio() {
    setSavingBio(true);
    try {
      await fetch('/api/creators/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address, bio }),
      });
      setEditingBio(false);
    } catch {
      // silently fail
    } finally {
      setSavingBio(false);
    }
  }

  const totalEarnings = links.reduce((sum, l) => sum + l.earnings, 0);
  const totalTransactions = links.reduce((sum, l) => sum + l.transaction_count, 0);

  return (
    <WalletGuard>
      {needsUsername && address && (
        <UsernameModal walletAddress={address} onComplete={onUsernameSet} />
      )}
      <div className="min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <Link href="/dashboard"><Image src="/relta-dark.png" alt="Relta" width={100} height={28} className="h-7 w-auto" /></Link>
          <div className="flex items-center gap-3">
            <Link href="/create">
              <Button>+ New Link</Button>
            </Link>
            <ConnectButton />
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {(loading || creatorLoading) ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Profile card */}
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-bold">@{creator?.username}</h2>
                      <a
                        href={`/${creator?.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:text-primary-hover"
                      >
                        View profile
                      </a>
                    </div>
                    {editingBio ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-card-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="Add a short bio (160 chars)"
                          maxLength={160}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          autoFocus
                        />
                        <Button onClick={handleSaveBio} loading={savingBio} className="text-xs">Save</Button>
                        <Button variant="ghost" onClick={() => setEditingBio(false)} className="text-xs">Cancel</Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted">{bio || 'No bio yet'}</p>
                        <button onClick={() => setEditingBio(true)} className="text-xs text-primary hover:text-primary-hover">
                          {bio ? 'Edit' : 'Add bio'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <EarningsOverview
                totalEarnings={totalEarnings}
                totalTransactions={totalTransactions}
                totalLinks={links.length}
              />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Your Links</h2>
                </div>
                {links.length === 0 ? (
                  <div className="text-center py-12 text-muted">
                    <p className="mb-4">No links yet. Create your first one!</p>
                    <Link href="/create">
                      <Button>Create a Link</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {links.map((link) => (
                      <LinkCard
                        key={link.id}
                        link={link}
                        username={creator?.username || ''}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                <TransactionList transactions={transactions} />
              </div>
            </>
          )}
        </main>
      </div>
    </WalletGuard>
  );
}
