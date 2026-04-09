'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { PayButton } from '@/components/pay/PayButton';
import { TipAmountInput } from '@/components/pay/TipAmountInput';
import { formatUSDC } from '@/lib/utils';
import { useAccount } from 'wagmi';
import Link from 'next/link';

interface OtherLink {
  title: string;
  slug: string;
  type: 'tip' | 'pay' | 'download';
  price: number | null;
}

interface PayPageClientProps {
  link: {
    id: string;
    type: string;
    title: string;
    description: string | null;
    price: number | null;
    slug: string;
  };
  creator: {
    username: string;
    wallet_address: string;
  };
  paymentCount: number;
  otherLinks: OtherLink[];
}

export function PayPageClient({ link, creator, paymentCount, otherLinks }: PayPageClientProps) {
  const { isConnected } = useAccount();
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const amount = link.type === 'tip' ? tipAmount : link.price!;
  const pageUrl = `https://www.relta.xyz/${creator.username}/${link.slug}`;

  function handleSuccess(result: { downloadUrl?: string }) {
    setPaymentSuccess(true);
    if (result.downloadUrl) {
      setDownloadUrl(result.downloadUrl);
    }
  }

  function shareOnX() {
    const text = link.type === 'tip'
      ? `Just tipped @${creator.username} on Relta — get paid onchain with a link 👉`
      : `Just paid ${formatUSDC(amount)} USDC to @${creator.username} on Relta — get paid onchain with a link 👉`;
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function copyLink() {
    navigator.clipboard.writeText(pageUrl);
  }

  const socialProofText = paymentCount === 0
    ? 'Be the first to pay'
    : paymentCount === 1
      ? '1 payment so far'
      : `${paymentCount} payments so far`;

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-card-border">
        <Link href="/"><Image src="/relta-dark.png" alt="Relta" width={100} height={28} className="h-7 w-auto" /></Link>
        <ConnectButton />
      </nav>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          {paymentSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted mb-6">
                You paid {formatUSDC(amount)} USDC to @{creator.username}
              </p>

              {downloadUrl && (
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="block mb-4">
                  <Button className="w-full">Download File</Button>
                </a>
              )}

              {/* More from creator */}
              {otherLinks.length > 0 && (
                <div className="border-t border-card-border pt-5 mt-2 mb-4">
                  <p className="text-sm text-muted mb-3">More from @{creator.username}</p>
                  <div className="flex flex-col gap-2">
                    {otherLinks.map((ol) => (
                      <Link
                        key={ol.slug}
                        href={`/${creator.username}/${ol.slug}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-card-border hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Badge type={ol.type} />
                          <span className="text-sm font-medium">{ol.title}</span>
                        </div>
                        <span className="text-sm text-muted">
                          {ol.type === 'tip' ? 'Any amount' : formatUSDC(ol.price!)}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Share prompt */}
              <div className="border-t border-card-border pt-5">
                <p className="text-sm text-muted mb-3">Spread the word</p>
                <div className="flex gap-3">
                  <Button onClick={shareOnX} className="flex-1">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      Share on X
                    </span>
                  </Button>
                  <Button variant="secondary" onClick={copyLink} className="flex-1">
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                      </svg>
                      Copy Link
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Badge type={link.type as 'tip' | 'pay' | 'download'} />
                  <span className="text-sm text-muted">by @{creator.username}</span>
                </div>
                <h1 className="text-2xl font-bold">{link.title}</h1>
                {link.description && (
                  <p className="text-muted mt-2">{link.description}</p>
                )}
              </div>

              {link.type === 'tip' ? (
                <div className="mb-6">
                  <TipAmountInput value={tipAmount} onChange={setTipAmount} />
                </div>
              ) : (
                <div className="mb-6 text-center">
                  <span className="text-3xl font-bold">{formatUSDC(link.price!)}</span>
                  <span className="text-muted ml-2">USDC</span>
                </div>
              )}

              {/* Social proof */}
              <p className="text-center text-sm text-muted mb-4">{socialProofText}</p>

              {isConnected ? (
                <PayButton
                  amount={amount}
                  recipientAddress={creator.wallet_address as `0x${string}`}
                  linkId={link.id}
                  onSuccess={handleSuccess}
                />
              ) : (
                <div className="text-center">
                  <p className="text-muted mb-4">Connect your wallet to pay</p>
                  <div className="flex justify-center">
                    <ConnectButton />
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
        <p className="text-center text-sm text-muted/40 mt-6">
          <a href="https://www.relta.xyz" className="hover:text-muted transition-colors">
            Powered by Relta — create your own pay link
          </a>
        </p>
      </main>
    </div>
  );
}
