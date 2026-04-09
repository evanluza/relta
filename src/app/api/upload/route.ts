import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const walletAddress = formData.get('walletAddress') as string;

  if (!file || !walletAddress) {
    return NextResponse.json({ error: 'File and wallet address required' }, { status: 400 });
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });
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

  const filePath = `${creator.id}/${Date.now()}-${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from('Downloads')
    .upload(filePath, buffer, {
      contentType: file.type,
    });

  if (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file', detail: error.message }, { status: 500 });
  }

  return NextResponse.json({ file_url: filePath });
}
