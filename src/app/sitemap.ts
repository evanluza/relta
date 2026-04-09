import { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase/server';

const siteUrl = 'https://www.relta.xyz';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // Creator profiles
  const { data: creators } = await supabase
    .from('creators')
    .select('username, created_at');

  const creatorPages: MetadataRoute.Sitemap = (creators || []).map((creator) => ({
    url: `${siteUrl}/${creator.username}`,
    lastModified: new Date(creator.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Individual pay links
  const { data: links } = await supabase
    .from('links')
    .select('slug, created_at, creators(username)');

  const linkPages: MetadataRoute.Sitemap = (links || []).map((link) => ({
    url: `${siteUrl}/${(link.creators as unknown as { username: string }).username}/${link.slug}`,
    lastModified: new Date(link.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...creatorPages, ...linkPages];
}
