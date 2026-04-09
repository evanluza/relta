import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http, parseAbiItem, formatUnits } from 'viem';
import { base } from 'viem/chains';
import { createServiceClient } from '@/lib/supabase/server';
import { USDC_ADDRESS, USDC_DECIMALS, PLATFORM_FEE_PERCENT } from '@/lib/constants';

const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function POST(req: NextRequest) {
  const { txHash, linkId, buyerWallet } = await req.json();

  if (!txHash || !linkId || !buyerWallet) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Check if tx already recorded
  const { data: existingTx } = await supabase
    .from('transactions')
    .select('id')
    .eq('tx_hash', txHash)
    .single();

  if (existingTx) {
    return NextResponse.json({ error: 'Transaction already recorded' }, { status: 409 });
  }

  // Get link and creator details
  const { data: link } = await supabase
    .from('links')
    .select('*, creators(wallet_address)')
    .eq('id', linkId)
    .single();

  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  try {
    // Get transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash as `0x${string}`,
      timeout: 60_000,
    });

    if (receipt.status !== 'success') {
      return NextResponse.json({ error: 'Transaction failed onchain' }, { status: 400 });
    }

    // Parse USDC Transfer logs
    const transferEvent = parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)');
    const logs = receipt.logs.filter(
      (log) => log.address.toLowerCase() === USDC_ADDRESS.toLowerCase()
    );

    // Find matching transfer: from buyer to creator
    const creatorWallet = (link.creators as { wallet_address: string }).wallet_address;
    let transferAmount = BigInt(0);

    for (const log of logs) {
      try {
        if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
          const from = `0x${log.topics[1]!.slice(26)}`.toLowerCase();
          const to = `0x${log.topics[2]!.slice(26)}`.toLowerCase();
          const value = BigInt(log.data);

          if (from === buyerWallet.toLowerCase() && to === creatorWallet.toLowerCase()) {
            transferAmount = value;
            break;
          }
        }
      } catch {
        continue;
      }
    }

    if (transferAmount === BigInt(0)) {
      return NextResponse.json({ error: 'No matching USDC transfer found' }, { status: 400 });
    }

    const amount = parseFloat(formatUnits(transferAmount, USDC_DECIMALS));
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENT * 100) / 100;

    // Record transaction
    const { error: insertError } = await supabase
      .from('transactions')
      .insert({
        link_id: linkId,
        buyer_wallet: buyerWallet.toLowerCase(),
        amount,
        platform_fee: platformFee,
        tx_hash: txHash,
      });

    if (insertError) {
      return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 });
    }

    // If download type, generate signed URL
    let downloadUrl: string | undefined;
    if (link.type === 'download' && link.file_url) {
      const { data: signedUrl } = await supabase.storage
        .from('Downloads')
        .createSignedUrl(link.file_url, 3600);

      if (signedUrl) {
        downloadUrl = signedUrl.signedUrl;
      }
    }

    return NextResponse.json({ success: true, downloadUrl });
  } catch (err) {
    console.error('Transaction verification error:', err);
    return NextResponse.json({ error: 'Failed to verify transaction onchain' }, { status: 500 });
  }
}
