'use client';

import { WalletGuard } from '@/components/wallet/WalletGuard';
import { LinkForm } from '@/components/create/LinkForm';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import Image from 'next/image';
import Link from 'next/link';

export default function CreatePage() {
  return (
    <WalletGuard>
      <div className="min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-card-border">
          <Link href="/dashboard"><Image src="/relta-dark.png" alt="Relta" width={100} height={28} className="h-7 w-auto" /></Link>
          <ConnectButton />
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <LinkForm />
        </main>
      </div>
    </WalletGuard>
  );
}
