import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wildrift.hub-game.com';
  
  // Set up Supabase Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  let championIds: string[] = [];
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Fetch active champions from stats table to filter out PC LoL only entries
    const { data } = await supabase.from('champion_stats').select('champion_name_en');
    if (data) {
      championIds = Array.from(new Set(data.map(c => c.champion_name_en))).filter(Boolean);
    }
  }

  // Define active static paths (Only Japanese locale)
  const staticPaths = [
    '/ja',
    '/ja/champions',
    '/ja/tier-list',
    '/ja/patches',
    '/ja/calculator',
    '/ja/terms',
    '/ja/privacy',
    '/ja/legal',
    '/ja/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  for (const path of staticPaths) {
    const isHome = path === '/ja';
    const isHighFrequency = path === '/ja/tier-list' || path === '/ja/patches';
    
    sitemapEntries.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: isHome || isHighFrequency ? 'daily' : 'weekly',
      priority: isHome ? 1.0 : isHighFrequency ? 0.9 : 0.7,
    });
  }

  // 2. Dynamic Champion Pages
  for (const champId of championIds) {
    sitemapEntries.push({
      url: `${baseUrl}/ja/champions/${champId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  return sitemapEntries;
}
