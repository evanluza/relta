import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const wallet = req.nextUrl.searchParams.get('wallet');
  const username = req.nextUrl.searchParams.get('username');

  const supabase = createServiceClient();

  // Check if wallet already has an account
  if (wallet) {
    const { data } = await supabase
      .from('creators')
      .select('*')
      .eq('wallet_address', wallet.toLowerCase())
      .single();

    return NextResponse.json({ creator: data || null });
  }

  // Check if username is available
  if (username) {
    const { data } = await supabase
      .from('creators')
      .select('id')
      .eq('username', username.toLowerCase())
      .single();

    return NextResponse.json({ available: !data });
  }

  return NextResponse.json({ error: 'Provide wallet or username param' }, { status: 400 });
}
