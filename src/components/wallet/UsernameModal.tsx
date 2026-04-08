'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface UsernameModalProps {
  walletAddress: string;
  onComplete: (username: string) => void;
}

export function UsernameModal({ walletAddress, onComplete }: UsernameModalProps) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const slug = username.toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (slug.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (slug.length > 30) {
      setError('Username must be 30 characters or less');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, username: slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create account');
        return;
      }
      onComplete(slug);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-card-border rounded-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-2">Choose your username</h2>
        <p className="text-muted text-sm mb-6">
          This will be your public profile URL: relta.xyz/<span className="text-foreground">{username || 'username'}</span>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            error={error}
            autoFocus
          />
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
