'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useState, useRef, useEffect } from 'react';
import { truncateAddress } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Deduplicate connectors by name
  const uniqueConnectors = connectors.filter(
    (c, i, arr) => arr.findIndex((x) => x.name === c.name) === i
  );

  if (isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-card-border hover:border-primary/30 transition-colors text-sm font-medium"
        >
          <span className="w-2 h-2 rounded-full bg-success" />
          {truncateAddress(address)}
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-card border border-card-border rounded-xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-card-border">
              <p className="text-xs text-muted">Connected</p>
              <p className="text-sm font-mono mt-0.5">{truncateAddress(address)}</p>
            </div>
            <button
              onClick={() => { disconnect(); setShowDropdown(false); }}
              className="w-full text-left px-4 py-3 text-sm text-danger hover:bg-danger/5 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Connect Wallet</Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-card-border rounded-2xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold">Connect Wallet</h3>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-foreground">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {uniqueConnectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector });
                    setShowModal(false);
                  }}
                  className="flex items-center gap-3 w-full p-3 rounded-xl border border-card-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center shrink-0">
                    {connector.icon ? (
                      <img src={connector.icon} alt={connector.name} className="w-7 h-7 rounded-lg" />
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {connector.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-sm">{connector.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
