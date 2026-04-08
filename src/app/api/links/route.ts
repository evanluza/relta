import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Get creator
  const { data: creator } = await supabase
    .from('creators')
    .select('id, username')
    .eq('wallet_address', wallet.toLowerCase())
    .single();

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  // Get links with transaction aggregates
  const { data: links, error } = await supabase
    .from('links')
    .select('*')
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }

  // Get earnings per link
  const linkIds = links?.map(l => l.id) || [];
  let earningsMap: Record<string, { total: number; count: number }> = {};

  if (linkIds.length > 0) {
    const { data: transactions } = await supabase
      .from('transactions')
      .select('link_id, amount')
      .in('link_id', linkIds);

    if (transactions) {
      for (const tx of transactions) {
        if (!earningsMap[tx.link_id]) {
          earningsMap[tx.link_id] = { total: 0, count: 0 };
        }
        earningsMap[tx.link_id].total += Number(tx.amount);
        earningsMap[tx.link_id].count += 1;
      }
    }
  }

  const linksWithEarnings = links?.map(link => ({
    ...link,
    earnings: earningsMap[link.id]?.total || 0,
    transaction_count: earningsMap[link.id]?.count || 0,
  }));

  return NextResponse.json({ links: linksWithEarnings, username: creator.username });
}

export async function POST(req: NextRequest) {
  const { walletAddress, type, title, description, price, slug, file_url } = await req.json();

  if (!walletAddress || !type || !title || !slug) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['tip', 'pay', 'download'].includes(type)) {
    return NextResponse.json({ error: 'Invalid link type' }, { status: 400 });
  }

  if (type !== 'tip' && (!price || price <= 0)) {
    return NextResponse.json({ error: 'Price required for pay and download links' }, { status: 400 });
  }

  if (type === 'download' && !file_url) {
    return NextResponse.json({ error: 'File required for download links' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Get creator
  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single();

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  // Check slug uniqueness
  const { data: existingSlug } = await supabase
    .from('links')
    .select('id')
    .eq('creator_id', creator.id)
    .eq('slug', slug)
    .single();

  if (existingSlug) {
    return NextResponse.json({ error: 'Slug already taken' }, { status: 409 });
  }

  const { data: link, error } = await supabase
    .from('links')
    .insert({
      creator_id: creator.id,
      type,
      title,
      description: description || null,
      price: type === 'tip' ? null : price,
      file_url: type === 'download' ? file_url : null,
      slug,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }

  return NextResponse.json({ link });
}
