import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getTranslations } from 'next-intl/server';
import { parseLocalizedText, parseVariables } from '@/utils/localization';
import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import fallbackStats from '@/data/champion_stats.json';
import ChampionDetailClient from './ChampionDetailClient';
import combosData from '@/../public/data/combos.json';
import guidesData from '@/../public/data/champion_guides.json';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({ params }: { params: Promise<{ locale: string, id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;
  const champId = id;
  const t = await getTranslations({ locale, namespace: 'ChampionDetail' });
  
  const matchedStats = (fallbackStats as any[]).filter(
    (s) => s.champion_name_en.toLowerCase() === champId.toLowerCase()
  );

  let fallbackName = champId;
  if (matchedStats.length > 0) {
    fallbackName = locale === 'ja' ? matchedStats[0].champion_name : matchedStats[0].champion_name_en;
  } else if (champId.toLowerCase() === 'norra') {
    fallbackName = locale === 'ja' ? 'ノラ' : 'Norra';
  }

  return {
    title: `${fallbackName} Build, Runes & Counters`,
    description: t('buildsDesc') || `${fallbackName} stats and builds.`,
  };
}

export default async function ChampionDetailsPage({ params }: { params: Promise<{ locale: string, id: string }> }) {
  const { locale, id } = await params;
  const champId = id;

  let langCode = 'en_US';
  switch (locale) {
    case 'ja': langCode = 'ja_JP'; break;
    case 'ko': langCode = 'ko_KR'; break;
    case 'vi': langCode = 'vn_VN'; break;
    case 'zh-TW': langCode = 'zh_TW'; break;
    default: langCode = 'en_US'; break;
  }

  // 1. DataDragon Fetch
  let champData = null;
  try {
    const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion/${champId}.json`, { next: { revalidate: 86400 } });
    if (ddRes.ok) {
      const ddData = await ddRes.json();
      champData = ddData.data[champId];
    }
  } catch (e) {
    console.warn('DataDragon fetch failed for', champId);
  }

  // 2. Supabase Data
  const { data: tierData } = await supabase
    .from('champion_stats')
    .select('*')
    .eq('champion_name_en', champId);

  let { data: detailsData } = await supabase
    .from('wr_champion_details')
    .select('*')
    .eq('champion_id', champId)
    .single();

  // 3. Fallback Initial Values
  const matchedStats = (fallbackStats as any[]).filter(
    (s) => s.champion_name_en.toLowerCase() === champId.toLowerCase()
  );

  if (!champData && (tierData && tierData.length > 0 || matchedStats.length > 0)) {
    const fallbackName = tierData?.[0]?.champion_name || (matchedStats.length > 0 ? (locale === 'ja' ? matchedStats[0].champion_name : matchedStats[0].champion_name_en) : champId);
    let specificLore = '';
    if (champId.toLowerCase() === 'norra') {
      specificLore = langCode === 'ja_JP' 
        ? "ヨードルの魔女であるノラは、マジカルキャット「ユーミ」のかつてのご主人です。彼女は「境界の書」の最後のページと繋がる世界に行こうとした際、はるか遠くの奇妙な世界に飛ばされ、失踪してしまいました。現在は領域の果てで出会った少し変わった新しい友人たちの助けを借りながら、愛猫のユーミが待つ家へ帰るための正しいポータルを探す壮大な旅を続けています。"
        : "Norra is a yordle enchantress and the former master of the magical cat Yuumi. While attempting to travel to the world connected by the final page of the Book of Thresholds, she was accidentally transported to a strange, distant realm. Now, with the help of new, peculiar friends she met at the edge of the realm, she is on an epic journey to find the right portal back home to her beloved cat.";
    }

    champData = {
      id: champId,
      name: fallbackName,
      title: champId === 'Norra' ? 'Wild Rift Exclusive' : 'Champion',
      lore: specificLore,
      tags: [tierData?.[0]?.role || matchedStats?.[0]?.role || 'Mage'],
      info: { attack: 5, defense: 5, magic: 5, difficulty: 5 },
      champion_name_en: champId
    };
  } else if (champData) {
    champData.champion_name_en = champId;
  }

  // 4. Parse Localized Skills
  if (detailsData && detailsData.skills) {
    let targetSkillsArray = [];
    let variables = {};

    if (Array.isArray(detailsData.skills)) {
      targetSkillsArray = detailsData.skills;
    } else {
      const langKey = langCode.split('_')[0];
      targetSkillsArray = detailsData.skills[langKey] || detailsData.skills['en'] || detailsData.skills['ja'] || [];
      variables = detailsData.skills.variables || {};
    }

    const parsedSkills = await Promise.all(targetSkillsArray.map(async (skill: any) => {
      const withVars = parseVariables(skill.description, variables);
      const withDict = await parseLocalizedText(withVars, langCode);
      return {
        ...skill,
        description: withDict
      };
    }));
    detailsData.skills = parsedSkills;
  }

  // 5. Counters from static JSON
  let staticCounters = null;
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'counters.json');
    const fileData = await fs.readFile(filePath, 'utf-8');
    const counterData = JSON.parse(fileData);
    const counterKey = Object.keys(counterData).find(
      key => key.toLowerCase() === champId.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === champId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    );
    if (counterKey) staticCounters = counterData[counterKey];
  } catch (e) {
    console.warn('Counters fetch failed locally', e);
  }

  // Fallback to local skills json if needed
  if (!detailsData || !detailsData.skills || (Array.isArray(detailsData.skills) && detailsData.skills.length === 0)) {
    try {
      const jsonFileName = locale === 'ja' ? 'ja' : 
                           locale === 'ko' ? 'ko' : 
                           locale === 'vi' ? 'vi' : 
                           locale === 'zh-TW' ? 'zh-TW' : 'en';
      
      const filePath = path.join(process.cwd(), 'public', 'data', 'skills', `${jsonFileName}.json`);
      const fileData = await fs.readFile(filePath, 'utf-8');
      const skillsData = JSON.parse(fileData);
      const skillKey = Object.keys(skillsData).find(
        key => key.toLowerCase() === champId.toLowerCase() || 
               key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === champId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() ||
               champId.toLowerCase().includes(key.toLowerCase()) || 
               key.toLowerCase().includes(champId.toLowerCase())
      );
      if (skillKey) {
        if (!detailsData) detailsData = { champion_id: champId };
        detailsData.skills = skillsData[skillKey];
      }
    } catch (e) {
      console.warn('Failed to load localized skills json', e);
    }
  }

  const finalStats = (tierData && tierData.length > 0) ? tierData : matchedStats;
  const championCombos = (combosData as Record<string, any>)[champId] || [];
  const championGuide = (guidesData as Record<string, any>)[champId] || null;

  return (
    <ChampionDetailClient 
      id={champId} 
      champion={champData} 
      stats={finalStats} 
      wrDetails={detailsData} 
      staticCounters={staticCounters} 
      fallbackStats={fallbackStats}
      combos={championCombos}
      guide={championGuide}
    />
  );
}
