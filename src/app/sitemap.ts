import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wildrift.hub-game.com';
  const locales = ['ja'];
  
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

  // Define active static paths (without locale prefix)
  const staticPaths = [
    '',
    '/champions',
    '/tier-list',
    '/patches',
    '/calculator',
    '/items',
    '/runes',
    '/spells',
    '/guide',
    '/terms',
    '/privacy',
    '/legal',
    '/contact',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages
  for (const path of staticPaths) {
    const isHome = path === '';
    const isHighFrequency = path === '/tier-list' || path === '/patches';
    
    // Generate alternates languages object
    const alternatesLanguages: Record<string, string> = {};
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}${path}`;
    }
    
    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: isHome || isHighFrequency ? 'daily' : 'weekly',
        priority: isHome ? 1.0 : isHighFrequency ? 0.9 : 0.7,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  // 2. Dynamic Champion Pages
  for (const champId of championIds) {
    // Generate alternates languages object
    const alternatesLanguages: Record<string, string> = {};
    for (const l of locales) {
      alternatesLanguages[l] = `${baseUrl}/${l}/champions/${champId}`;
    }

    for (const locale of locales) {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/champions/${champId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: alternatesLanguages
        }
      });
    }
  }

  return sitemapEntries;
}
