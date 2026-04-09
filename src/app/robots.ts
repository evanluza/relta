import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard', '/create'],
    },
    sitemap: 'https://www.relta.xyz/sitemap.xml',
  };
}
