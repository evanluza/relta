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
}

export function PayPageClient({ link, creator }: PayPageClientProps) {
  const { isConnected } = useAccount();
  const [tipAmount, setTipAmount] = useState<number>(5);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const amount = link.type === 'tip' ? tipAmount : link.price!;

  function handleSuccess(result: { downloadUrl?: string }) {
    setPaymentSuccess(true);
    if (result.downloadUrl) {
      setDownloadUrl(result.downloadUrl);
    }
  }

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
                <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">Download File</Button>
                </a>
              )}
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
      </main>
    </div>
  );
}
