import { createServiceClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { truncateAddress, formatUSDC } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = createServiceClient();

  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  if (!creator) notFound();

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-card-border">
        <Link href="/"><Image src="/relta-dark.png" alt="Relta" width={100} height={28} className="h-7 w-auto" /></Link>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">@{creator.username}</h1>
          <p className="text-muted font-mono text-sm">{truncateAddress(creator.wallet_address)}</p>
        </div>

        {(!links || links.length === 0) ? (
          <p className="text-center text-muted">No links yet</p>
        ) : (
          <div className="grid gap-4">
            {links.map((link) => (
              <Link key={link.id} href={`/${username}/${link.slug}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{link.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge type={link.type as 'tip' | 'pay' | 'download'} />
                        {link.description && (
                          <span className="text-sm text-muted">{link.description}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-lg font-bold">
                      {link.type === 'tip' ? 'Any amount' : formatUSDC(link.price)}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
