import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const { walletAddress, bio } = await req.json();

  if (!walletAddress) {
    return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
  }

  if (typeof bio !== 'string' || bio.length > 160) {
    return NextResponse.json({ error: 'Bio must be 160 characters or less' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('creators')
    .update({ bio: bio.trim() || null })
    .eq('wallet_address', walletAddress.toLowerCase())
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return NextResponse.json({ creator: data });
}
