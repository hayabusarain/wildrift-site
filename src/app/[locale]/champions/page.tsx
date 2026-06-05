'use client';

import { Link } from "@/i18n/routing";
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Users, Star, Target, Shield, Zap, Crosshair, HeartPulse, Sparkles, ArrowRight } from 'lucide-react';
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
    
    // Ensure Norra is present
    if (!seen.has('Norra')) {
      list.push({
        id: 'Norra',
        key: 'Norra',
        name: locale === 'ja' ? 'ノラ' : 'Norra',
        title: 'Wild Rift Exclusive',
        blurb: 'Wild Rift専用のチャンピオンです。',
        tags: ['Mage', 'Support'],
        info: { attack: 2, defense: 3, magic: 8, difficulty: 5 }
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
        // Fetch from DataDragon dynamically based on locale
        const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion.json`);
        const ddData = await ddRes.json();
        const champsArray = Object.values(ddData.data) as ChampionData[];
        
        // 強制的にNorraを追加（確実なハードコード）
        const hasNorra = champsArray.some(c => c.id === 'Norra');
        if (!hasNorra) {
          champsArray.push({
            id: 'Norra',
            key: 'Norra',
            name: langCode === 'ja_JP' ? 'ノラ' : 'Norra',
            title: 'Wild Rift Exclusive',
            blurb: 'Wild Rift専用のチャンピオンです。',
            tags: ['Mage', 'Support'],
            info: { attack: 2, defense: 3, magic: 8, difficulty: 5 }
          });
        }
        
        // Fetch from Supabase for Tier integration
        const existingIds = new Set(champsArray.map(c => c.id));
        
        // Fetch tier data to know which champs exist in WR
        const { data } = await supabase.from('champion_stats').select('*');
        if (data) {
          const grouped = data.reduce((acc, curr) => {
            if (!acc[curr.champion_name_en]) acc[curr.champion_name_en] = [];
            acc[curr.champion_name_en].push(curr);
            return acc;
          }, {} as Record<string, any[]>);
          
          setTierData(grouped);
          
          // Add missing champions (e.g. Norra)
          Object.keys(grouped).forEach(champId => {
            if (!existingIds.has(champId)) {
              console.log('Adding missing champion:', champId);
              // ティアデータに含まれる日本語名を取得（先頭のレコードを使用）
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

          // ワイリフ未実装キャラの除外（groupedにキーがあるか判定）
          const filteredChampsArray = champsArray.filter(champ => !!grouped[champ.id] || champ.id === 'Norra' || champ.id === 'Heimerdinger');
          setChampions(filteredChampsArray);
        } else {
          setChampions(champsArray);
        }

        console.log('Final champsArray length:', champions.length);
      } catch (err) {
        console.error('Failed to fetch champions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
      // データベース（ティア表）に存在しないチャンピオンは表示しない
      // 大文字小文字の違いを吸収
      const statsEntry = Object.entries(tierData).find(([key]) => key.toLowerCase() === champ.id.toLowerCase());
      const stats = statsEntry ? statsEntry[1] : [];
      
      // 確実な安全装置：Norraはデータが無くても強制的に表示リストに入れる
      if (stats.length === 0 && champ.id !== 'Norra') return false;

      // 表記揺れ（スペースや中黒「・」の有無）対策として、これらをすべて取り除いて比較
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

  const renderStars = (difficulty: number) => {
    // Difficulty is 1-10. Let's map to 1-3 stars.
    let stars = 1;
    if (difficulty > 3) stars = 2;
    if (difficulty > 7) stars = 3;
    
    return (
      <div className="flex text-amber-400">
        {[...Array(3)].map((_, i) => (
          <Star key={i} size={14} className={i < stars ? "fill-amber-400" : "text-slate-200"} />
        ))}
      </div>
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TOP': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'JUNGLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MID': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ADC': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'SUPPORT': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24 px-4 pt-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              {t('title')}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-slate-700 placeholder-slate-400 font-medium text-base"
          />
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex overflow-x-auto pb-2 -mx-4 px-4 gap-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => setActiveFilter(role.id)}
            className={`flex items-center justify-center gap-2 flex-shrink-0 py-2.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 snap-center ${
              activeFilter === role.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 active:bg-slate-50'
            }`}
          >
            {role.icon}
            <span>{role.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {filteredChampions.map(champion => {
          return (
            <Link 
              key={champion.id} 
              href={`/champions/${champion.id}`} 
              className="flex flex-col items-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-transform"
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2 rounded-[1rem] overflow-hidden shadow-inner bg-slate-100">
                <img 
                  src={champion.id === 'Norra' ? `/images/champions/Norra.avif` : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champion.id}.png`}
                  alt={champion.name}
                  className="w-full h-full object-cover scale-[1.02]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `/images/champions/${champion.id}.avif`;
                    (e.target as HTMLImageElement).onerror = null;
                  }}
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 text-center tracking-tight leading-tight w-full truncate">
                {champion.name}
              </h3>
            </Link>
          );
        })}
      </div>
      
      {filteredChampions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm mt-4">
          <Users className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">見つかりませんでした</h3>
          <p className="text-sm text-slate-500 mt-1">検索条件に一致するチャンピオンがいません。</p>
        </div>
      )}
    </div>
  );
}
