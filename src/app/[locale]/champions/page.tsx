'use client';

import { Link } from "@/i18n/routing";
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Users, Target, Shield, Zap, Crosshair, HeartPulse, Sparkles, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
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

interface ChampionStat {
  champion_name_en: string;
  tier: string;
  win_rate: number;
  role: string;
}

export default function ChampionsPage() {
  const t = useTranslations("Champions");
  const r = useTranslations("Role");
  const locale = useLocale();

  const initialTierData = useMemo(() => {
    return (fallbackStats as any[]).reduce((acc, curr) => {
      const champName = curr.champion_name_en;
      if (!acc[champName]) acc[champName] = [];
      acc[champName].push({
        champion_name_en: curr.champion_name_en,
        tier: curr.tier,
        win_rate: curr.win_rate,
        role: curr.role
      });
      return acc;
    }, {} as Record<string, ChampionStat[]>);
  }, []);

  const initialChampions = useMemo(() => {
    const list: ChampionData[] = [];
    const seen = new Set<string>();
    
    for (const stat of fallbackStats as any[]) {
      if (!seen.has(stat.champion_name_en)) {
        seen.add(stat.champion_name_en);
        
        let tags = ['Mage'];
        if (stat.role === 'TOP') tags = ['Fighter', 'Tank'];
        else if (stat.role === 'JUNGLE') tags = ['Fighter', 'Assassin'];
        else if (stat.role === 'MID') tags = ['Mage', 'Assassin'];
        else if (stat.role === 'ADC') tags = ['Marksman'];
        else if (stat.role === 'SUPPORT') tags = ['Support', 'Tank'];
        
        list.push({
          id: stat.champion_name_en,
          key: stat.champion_name_en,
          name: locale === 'ja' ? stat.champion_name : stat.champion_name_en,
          title: 'Wild Rift Champion',
          blurb: '',
          tags: tags,
          info: { attack: 5, defense: 5, magic: 5, difficulty: 5 }
        });
      }
    }
    
    if (!seen.has('Norra')) {
      list.push({
        id: 'Norra', key: 'Norra', name: locale === 'ja' ? 'ノラ' : 'Norra',
        title: 'Wild Rift Exclusive', blurb: 'Wild Rift専用のチャンピオンです。', tags: ['Mage', 'Support'], info: { attack: 2, defense: 3, magic: 8, difficulty: 5 }
      });
    }
    if (!seen.has('Skarner')) {
      list.push({
        id: 'Skarner', key: 'Skarner', name: locale === 'ja' ? 'スカーナー' : 'Skarner',
        title: '原始の守護者', blurb: '', tags: ['Fighter', 'Tank'], info: { attack: 7, defense: 8, magic: 5, difficulty: 5 }
      });
    }
    if (!seen.has('Zoe')) {
      list.push({
        id: 'Zoe', key: 'Zoe', name: locale === 'ja' ? 'ゾーイ' : 'Zoe',
        title: '星の神髄', blurb: '', tags: ['Mage', 'Assassin'], info: { attack: 1, defense: 7, magic: 8, difficulty: 8 }
      });
    }
    
    return list;
  }, [locale]);

  const [champions, setChampions] = useState<ChampionData[]>(initialChampions);
  const [tierData, setTierData] = useState<Record<string, ChampionStat[]>>(initialTierData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const langCode = locale === 'ja' ? 'ja_JP' : 'en_US';
        const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion.json`);
        const ddData = await ddRes.json();
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
        
        const { data } = await supabase.from('champion_stats').select('*');
        if (data) {
          const grouped = data.reduce((acc, curr) => {
            if (!acc[curr.champion_name_en]) acc[curr.champion_name_en] = [];
            acc[curr.champion_name_en].push(curr);
            return acc;
          }, {} as Record<string, any[]>);
          
          setTierData(grouped);
          
          Object.keys(grouped).forEach(champId => {
            if (!existingIds.has(champId)) {
              const nameJa = grouped[champId][0]?.champion_name || champId;
              champsArray.push({
                id: champId,
                key: champId,
                name: langCode === 'ja_JP' ? nameJa : champId,
                title: 'Wild Rift Exclusive',
                blurb: 'Wild Rift専用のチャンピオンです。',
                tags: [grouped[champId][0]?.role || 'Mage'],
                info: { attack: 5, defense: 5, magic: 5, difficulty: 5 }
              } as ChampionData);
            }
          });

          const filteredChampsArray = champsArray.filter(champ => !!grouped[champ.id] || ['Norra', 'Heimerdinger', 'Skarner', 'Zoe'].includes(champ.id));
          setChampions(filteredChampsArray);
        } else {
          setChampions(champsArray);
        }
      } catch (err) {
        console.error('Failed to fetch champions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [locale]);

  const roles = [
    { id: 'All', label: 'All', icon: <Users size={16} /> },
    { id: 'Fighter', label: 'Fighter', icon: <Target size={16} /> },
    { id: 'Tank', label: 'Tank', icon: <Shield size={16} /> },
    { id: 'Mage', label: 'Mage', icon: <Sparkles size={16} /> },
    { id: 'Assassin', label: 'Assassin', icon: <Zap size={16} /> },
    { id: 'Marksman', label: 'Marksman', icon: <Crosshair size={16} /> },
    { id: 'Support', label: 'Support', icon: <HeartPulse size={16} /> },
  ];

  const filteredChampions = useMemo(() => {
    const result = champions.filter(champ => {
      const statsEntry = Object.entries(tierData).find(([key]) => key.toLowerCase() === champ.id.toLowerCase());
      const stats = statsEntry ? statsEntry[1] : [];
      
      if (stats.length === 0 && !['Norra', 'Heimerdinger', 'Skarner', 'Zoe'].includes(champ.id)) return false;

      const cleanStr = (s: string) => s.replace(/[\s\u3000・]+/g, '').toLowerCase();
      const query = cleanStr(searchQuery);
      const matchesSearch = cleanStr(champ.name).includes(query) || 
                            cleanStr(champ.title).includes(query) ||
                            cleanStr(champ.id).includes(query) ||
                            (champ.id === 'Norra' && cleanStr('ノラ').includes(query));
      const matchesFilter = activeFilter === 'All' || champ.tags.includes(activeFilter);
      return matchesSearch && matchesFilter;
    }).sort((a, b) => a.name.localeCompare(b.name));
    
    return result;
  }, [champions, searchQuery, activeFilter, tierData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 w-full max-w-md mx-auto">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 pt-8 pb-4 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-700 shadow-inner">
            <Users size={20} />
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-transparent rounded-2xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 placeholder-slate-400 font-bold text-sm transition-all"
          />
        </div>
      </div>

      {/* Role Filters - Horizontal Carousel */}
      <div className="pt-4 pb-2 bg-slate-50">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveFilter(role.id)}
              className={`flex items-center gap-2 flex-shrink-0 py-2.5 px-4 rounded-2xl font-bold text-sm transition-all snap-center ${
                activeFilter === role.id
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 scale-[0.98] active:scale-95'
              }`}
            >
              {role.icon}
              <span>{role.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Champions Grid */}
      <div className="px-4 mt-4 grid grid-cols-3 sm:grid-cols-4 gap-x-3 gap-y-5">
        {filteredChampions.map(champion => {
          return (
            <Link 
              key={champion.id} 
              href={`/champions/${champion.id}`} 
              className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
            >
              <div className="relative w-[76px] h-[76px] sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200">
                <img 
                  src={champion.id === 'Norra' ? `/images/champions/Norra.avif` : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champion.id}.png`}
                  alt={champion.name}
                  className="w-full h-full object-cover scale-[1.05]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/images/champions/${champion.id}.avif`;
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-800 text-center w-full truncate px-1 leading-tight">
                {champion.name}
              </span>
            </Link>
          );
        })}

        {filteredChampions.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-200 mt-4 shadow-sm">
            <Users className="mx-auto h-10 w-10 text-slate-300 mb-3" />
            <h3 className="text-base font-black text-slate-800">見つかりませんでした</h3>
            <p className="text-xs font-bold text-slate-400 mt-1">検索条件に一致するチャンピオンがいません。</p>
          </div>
        )}
      </div>
    </div>
  );
}
