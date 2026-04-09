'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState, useCallback } from 'react';

interface Creator {
  id: string;
  wallet_address: string;
  username: string;
  bio: string | null;
  created_at: string;
}

export function useCreator() {
  const { address, isConnected } = useAccount();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsUsername, setNeedsUsername] = useState(false);

  const checkCreator = useCallback(async () => {
    if (!address) {
      setCreator(null);
      setNeedsUsername(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/creators/check-username?wallet=${address}`);
      const data = await res.json();
      if (data.creator) {
        setCreator(data.creator);
        setNeedsUsername(false);
      } else {
        setCreator(null);
        setNeedsUsername(true);
      }
    } catch {
      setCreator(null);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      checkCreator();
    } else {
      setCreator(null);
      setNeedsUsername(false);
      setLoading(false);
    }
  }, [isConnected, address, checkCreator]);

  const onUsernameSet = (username: string) => {
    setCreator({
      id: '',
      wallet_address: address!,
      username,
      bio: null,
      created_at: new Date().toISOString(),
    });
    setNeedsUsername(false);
    // Re-fetch to get the actual creator data
    checkCreator();
  };

  return { creator, loading, needsUsername, onUsernameSet, refetch: checkCreator };
}
