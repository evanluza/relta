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
    .select('id')
    .eq('wallet_address', wallet.toLowerCase())
    .single();

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  // Get creator's link IDs
  const { data: links } = await supabase
    .from('links')
    .select('id')
    .eq('creator_id', creator.id);

  const linkIds = links?.map(l => l.id) || [];

  if (linkIds.length === 0) {
    return NextResponse.json({ transactions: [] });
  }

  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .in('link_id', linkIds)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }

  return NextResponse.json({ transactions: transactions || [] });
}
