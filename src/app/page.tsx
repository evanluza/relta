'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import Image from 'next/image';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: 'Tip Jars',
    description: 'Let supporters pay what they want. Perfect for creators, streamers, and open-source devs.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    title: 'Pay Links',
    description: 'Fixed-price links for services, consultations, or anything. Share a URL, get paid.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
    title: 'Digital Downloads',
    description: 'Sell files that auto-unlock after payment. E-books, templates, presets — anything.',
  },
];

export default function LandingPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push('/dashboard');
    }
  }, [isConnected, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-card-border">
        <Image src="/relta-dark.png" alt="Relta" width={100} height={28} className="h-7 w-auto" />
        <ConnectButton />
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Gradient background effects */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-indigo-500/8 blur-[80px]" />
            <div className="absolute top-[20%] right-[15%] w-[250px] h-[250px] rounded-full bg-violet-500/8 blur-[80px]" />
          </div>

          <div className="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-card-border bg-card text-sm text-muted mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Live on BASE Mainnet
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-foreground">
              Get paid onchain
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-primary to-violet-600 bg-clip-text text-transparent">
                with a link
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              Create shareable payment links that accept USDC on BASE.
              Non-custodial — funds go directly to your wallet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ConnectButton />
              <span className="text-sm text-muted/60">Only 1.5% platform fee</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Three ways to get paid</h2>
            <p className="text-muted max-w-lg mx-auto">
              Create a link in seconds. Share it anywhere. Accept USDC instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative p-6 rounded-2xl border border-card-border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Dead simple</h2>
            <p className="text-muted">Three steps. No contracts to deploy. No KYC.</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-8 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-card-border to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
              {[
                { step: '1', title: 'Connect Wallet', desc: 'One click with Coinbase Smart Wallet. No seed phrases.' },
                { step: '2', title: 'Create a Link', desc: 'Pick your type, set a price, get a shareable URL.' },
                { step: '3', title: 'Get Paid in USDC', desc: 'Funds land directly in your wallet. Instant.' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-violet-500/10 border border-card-border flex items-center justify-center mb-5">
                    <span className="text-2xl font-bold bg-gradient-to-br from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed max-w-[240px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 py-24">
          <div className="relative rounded-3xl border border-card-border bg-card p-12 text-center overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
            </div>
            <Image src="/relta-dark-icon.png" alt="Relta" width={48} height={48} className="mx-auto mb-6 rounded-xl" />
            <h2 className="text-3xl font-bold mb-3">Start getting paid today</h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              No sign-up forms. No bank accounts. Just connect your wallet and create your first link.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-card-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image src="/relta-dark.png" alt="Relta" width={80} height={22} className="h-5 w-auto opacity-40" />
          <p className="text-muted/50 text-sm">Non-custodial payments on BASE. 1.5% platform fee.</p>
        </div>
      </footer>
    </div>
  );
}
