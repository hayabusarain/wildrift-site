import { createClient } from '@supabase/supabase-js';
import ChampionsClient from './ChampionsClient';
import { getTranslations } from 'next-intl/server';
import fallbackStats from "@/data/champion_stats.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChampionData {
  id: string;
  key: string;
  name: string;
  title: string;
  blurb: string;
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Champions' });
  return {
    title: `${t('title')} | Wild Rift Tactical Hub`,
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/champions`,
      languages: {
        'ja': '/ja/champions',
        'en': '/en/champions',
      },
    },
  };
}

export default async function ChampionsPage({ params: { locale } }: { params: { locale: string } }) {
  const langCode = locale === 'ja' ? 'ja_JP' : 'en_US';
  
  let ddData;
  try {
    const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion.json`, { next: { revalidate: 86400 } });
    ddData = await ddRes.json();
  } catch (err) {
    console.error('Failed to fetch champions from DataDragon:', err);
    ddData = { data: {} };
  }
  
  const champsArray = Object.values(ddData.data) as ChampionData[];
  
  const hasNorra = champsArray.some(c => c.id === 'Norra');
  if (!hasNorra) {
    champsArray.push({
      id: 'Norra', key: 'Norra', name: langCode === 'ja_JP' ? 'ノラ' : 'Norra',
      title: 'Wild Rift Exclusive', blurb: 'Wild Rift専用のチャンピオンです。', tags: ['Mage', 'Support'], info: { attack: 2, defense: 3, magic: 8, difficulty: 5 }
    });
  }
  if (!champsArray.some(c => c.id === 'Skarner')) {
    champsArray.push({
      id: 'Skarner', key: 'Skarner', name: langCode === 'ja_JP' ? 'スカーナー' : 'Skarner',
      title: '原始の守護者', blurb: '', tags: ['Fighter', 'Tank'], info: { attack: 7, defense: 8, magic: 5, difficulty: 5 }
    });
  }
  if (!champsArray.some(c => c.id === 'Zoe')) {
    champsArray.push({
      id: 'Zoe', key: 'Zoe', name: langCode === 'ja_JP' ? 'ゾーイ' : 'Zoe',
      title: '星の神髄', blurb: '', tags: ['Mage', 'Assassin'], info: { attack: 1, defense: 7, magic: 8, difficulty: 8 }
    });
  }
  
  const existingIds = new Set(champsArray.map(c => c.id));
  let tierData: Record<string, any[]> = {};
  
  try {
    const { data } = await supabase.from('champion_stats').select('*');
    if (data && data.length > 0) {
      tierData = data.reduce((acc, curr) => {
        if (!acc[curr.champion_name_en]) acc[curr.champion_name_en] = [];
        acc[curr.champion_name_en].push(curr);
        return acc;
      }, {} as Record<string, any[]>);
    } else {
      tierData = (fallbackStats as any[]).reduce((acc, curr) => {
        const champName = curr.champion_name_en;
        if (!acc[champName]) acc[champName] = [];
        acc[champName].push({
          champion_name_en: curr.champion_name_en,
          tier: curr.tier,
          win_rate: curr.win_rate,
          role: curr.role
        });
        return acc;
      }, {} as Record<string, any[]>);
    }
  } catch (err) {
    console.error('Failed to fetch champion stats:', err);
    tierData = (fallbackStats as any[]).reduce((acc, curr) => {
      const champName = curr.champion_name_en;
      if (!acc[champName]) acc[champName] = [];
      acc[champName].push({
        champion_name_en: curr.champion_name_en,
        tier: curr.tier,
        win_rate: curr.win_rate,
        role: curr.role
      });
      return acc;
    }, {} as Record<string, any[]>);
  }

  Object.keys(tierData).forEach(champId => {
    if (!existingIds.has(champId)) {
      const nameJa = tierData[champId][0]?.champion_name || champId;
      champsArray.push({
        id: champId,
        key: champId,
        name: langCode === 'ja_JP' ? nameJa : champId,
        title: 'Wild Rift Exclusive',
        blurb: 'Wild Rift専用のチャンピオンです。',
        tags: [tierData[champId][0]?.role || 'Mage'],
        info: { attack: 5, defense: 5, magic: 5, difficulty: 5 }
      } as ChampionData);
    }
  });

  const filteredChampsArray = champsArray.filter(champ => !!tierData[champ.id] || ['Norra', 'Heimerdinger', 'Skarner', 'Zoe'].includes(champ.id));

  return <ChampionsClient initialChampions={filteredChampsArray} tierData={tierData} />;
}
