'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { FileUpload } from './FileUpload';
import { generateSlug } from '@/lib/utils';

type LinkType = 'tip' | 'pay' | 'download';

const typeOptions: { value: LinkType; label: string; desc: string }[] = [
  { value: 'tip', label: 'Tip Jar', desc: 'Pay what you want' },
  { value: 'pay', label: 'Pay Link', desc: 'Fixed price, nothing delivered' },
  { value: 'download', label: 'Digital Download', desc: 'Fixed price, file delivered' },
];

export function LinkForm() {
  const { address } = useAccount();
  const router = useRouter();
  const [type, setType] = useState<LinkType>('pay');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [slug, setSlug] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let file_url: string | null = null;

      // Upload file if download type
      if (type === 'download' && file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('walletAddress', address!);

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          setError(uploadData.error || 'File upload failed');
          setLoading(false);
          return;
        }
        file_url = uploadData.file_url;
      }

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          type,
          title,
          description,
          price: type === 'tip' ? null : parseFloat(price),
          slug,
          file_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create link');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a Pay Link</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Type selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">Type</label>
          <div className="grid grid-cols-3 gap-2">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  type === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-card-border hover:border-muted'
                }`}
              >
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <Input
          label="Title"
          placeholder="My awesome link"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">Description (optional)</label>
          <textarea
            className="px-3 py-2.5 rounded-lg bg-card border border-card-border text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
            placeholder="What is this for?"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {type !== 'tip' && (
          <Input
            label="Price (USDC)"
            type="number"
            placeholder="5.00"
            min="0.01"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        )}

        {type === 'download' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted">File</label>
            <FileUpload onFileSelected={setFile} selectedFile={file} />
          </div>
        )}

        <Input
          label="Slug"
          placeholder="my-awesome-link"
          value={slug}
          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
          required
        />

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" loading={loading}>
          Create Link
        </Button>
      </form>
    </Card>
  );
}
