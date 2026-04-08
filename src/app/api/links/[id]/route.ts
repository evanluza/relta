import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const wallet = req.nextUrl.searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Wallet required' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Verify ownership
  const { data: creator } = await supabase
    .from('creators')
    .select('id')
    .eq('wallet_address', wallet.toLowerCase())
    .single();

  if (!creator) {
    return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
  }

  const { error } = await supabase
    .from('links')
    .delete()
    .eq('id', id)
    .eq('creator_id', creator.id);

  if (error) {
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
