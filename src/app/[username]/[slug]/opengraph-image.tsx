import { ImageResponse } from 'next/og';
import { createServiceClient } from '@/lib/supabase/server';

export const runtime = 'edge';
export const alt = 'Relta Pay Link';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const supabase = createServiceClient();

  const { data: creator } = await supabase
    .from('creators')
    .select('id, username')
    .eq('username', username.toLowerCase())
    .single();

  if (!creator) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#6366f1', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
        Relta
      </div>,
      { ...size }
    );
  }

  const { data: link } = await supabase
    .from('links')
    .select('title, type, price')
    .eq('creator_id', creator.id)
    .eq('slug', slug)
    .single();

  if (!link) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#6366f1', color: 'white', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
        Relta
      </div>,
      { ...size }
    );
  }

  const priceText = link.type === 'tip' ? 'Pay what you want' : `$${Number(link.price).toFixed(2)} USDC`;
  const typeLabel = link.type === 'tip' ? 'Tip Jar' : link.type === 'download' ? 'Digital Download' : 'Pay Link';

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: 'white',
        padding: 60,
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', background: '#6366f1', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 20, fontWeight: 600 }}>
            {typeLabel}
          </div>
        </div>
        <div style={{ display: 'flex', fontSize: 24, color: '#6b7280' }}>
          relta.xyz
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 40 }}>
        <div style={{ display: 'flex', fontSize: 64, fontWeight: 700, color: '#0a0a0a', lineHeight: 1.1, marginBottom: 20 }}>
          {link.title}
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#6b7280' }}>
          {priceText}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto' }}>
        <div style={{ display: 'flex', fontSize: 24, color: '#6b7280' }}>
          by @{creator.username}
        </div>
      </div>
    </div>,
    { ...size }
  );
}
