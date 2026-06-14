import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';
import TierListClient from './TierListClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TierList' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function TierListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  let langCode = 'en_US';
  switch (locale) {
    case 'ja': langCode = 'ja_JP'; break;
    case 'ko': langCode = 'ko_KR'; break;
    case 'vi': langCode = 'vn_VN'; break;
    case 'zh-TW': langCode = 'zh_TW'; break;
    default: langCode = 'en_US'; break;
  }

  let stats: any[] = [];
  let fetchError: string | null = null;

  try {
    const { data, error } = await supabase
      .from('champion_stats')
      .select('*')
      .order('win_rate', { ascending: false });

    if (error) throw error;

    let ddragonData: any = {};
    try {
      const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion.json`, { next: { revalidate: 3600 } });
      if (ddRes.ok) {
        const json = await ddRes.json();
        ddragonData = json.data;
      }
    } catch (e) {
      console.warn('Failed to fetch DataDragon localized names');
    }

    stats = data?.map(stat => {
      const ddKey = Object.keys(ddragonData).find(
        k => k.toLowerCase() === stat.champion_name_en.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
      );
      
      return {
        ...stat,
        champion_name: ddKey ? ddragonData[ddKey].name : stat.champion_name
      };
    }) || [];
  } catch (err: any) {
    fetchError = err.message;
  }

  return <TierListClient initialStats={stats} error={fetchError} />;
}
