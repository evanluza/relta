import { createServiceClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PayPageClient } from './PayPageClient';

export default async function PayPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const supabase = createServiceClient();

  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('username', username.toLowerCase())
    .single();

  if (!creator) notFound();

  const { data: link } = await supabase
    .from('links')
    .select('*')
    .eq('creator_id', creator.id)
    .eq('slug', slug)
    .single();

  if (!link) notFound();

  return (
    <PayPageClient
      link={{
        id: link.id,
        type: link.type,
        title: link.title,
        description: link.description,
        price: link.price,
        slug: link.slug,
      }}
      creator={{
        username: creator.username,
        wallet_address: creator.wallet_address,
      }}
    />
  );
}
