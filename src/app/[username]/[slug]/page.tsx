import { createServiceClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { PayPageClient } from './PayPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  const supabase = createServiceClient();

  const { data: creator } = await supabase
    .from('creators')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .single();

  if (!creator) return {};

  const { data: link } = await supabase
    .from('links')
    .select('title, description, type, price')
    .eq('creator_id', creator.id)
    .eq('slug', slug)
    .single();

  if (!link) return {};

  const priceText = link.type === 'tip' ? 'Pay what you want' : `$${link.price} USDC`;
  const title = `${link.title} — ${priceText} | @${creator.username}`;
  const description = link.description || `${link.title} by @${creator.username}. Pay with USDC on BASE.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.relta.xyz/${creator.username}/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

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

  // Get payment count for social proof
  const { count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('link_id', link.id);

  // Get other links by this creator for upsell
  const { data: otherLinks } = await supabase
    .from('links')
    .select('title, slug, type, price')
    .eq('creator_id', creator.id)
    .neq('id', link.id)
    .order('created_at', { ascending: false })
    .limit(3);

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
      paymentCount={count || 0}
      otherLinks={(otherLinks || []).map(l => ({
        title: l.title,
        slug: l.slug,
        type: l.type as 'tip' | 'pay' | 'download',
        price: l.price,
      }))}
    />
  );
}
