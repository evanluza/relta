import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { walletAddress, username } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Check if creator already exists
  const { data: existing } = await supabase
    .from('creators')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single();

  if (existing) {
    return NextResponse.json({ creator: existing });
  }

  // Creating new creator — username required
  if (!username) {
    return NextResponse.json({ error: 'Username required for new account' }, { status: 400 });
  }

  // Check username availability
  const { data: taken } = await supabase
    .from('creators')
    .select('id')
    .eq('username', username.toLowerCase())
    .single();

  if (taken) {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
  }

  const { data: creator, error } = await supabase
    .from('creators')
    .insert({
      wallet_address: walletAddress.toLowerCase(),
      username: username.toLowerCase(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }

  return NextResponse.json({ creator });
}
