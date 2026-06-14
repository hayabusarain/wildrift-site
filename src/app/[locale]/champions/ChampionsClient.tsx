'use client';

import { Link } from "@/i18n/routing";
import { useState, useMemo, useEffect } from 'react';
import { Search, Users, Target, Shield, Zap, Crosshair, HeartPulse, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

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

interface ChampionsClientProps {
  initialChampions: ChampionData[];
  tierData: Record<string, ChampionStat[]>;
}

export default function ChampionsClient({ initialChampions, tierData }: ChampionsClientProps) {
  const t = useTranslations("Champions");
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Restore filter and search state from sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = sessionStorage.getItem('champions_activeFilter');
      const savedSearch = sessionStorage.getItem('champions_searchQuery');
      if (savedFilter) setActiveFilter(savedFilter);
      if (savedSearch) setSearchQuery(savedSearch);
    }
  }, []);

  const handleFilterChange = (roleId: string) => {
    setActiveFilter(roleId);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('champions_activeFilter', roleId);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('champions_searchQuery', query);
    }
  };

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
    const result = initialChampions.filter(champ => {
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
  }, [initialChampions, searchQuery, activeFilter, tierData]);

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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-transparent rounded-2xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 placeholder-slate-400 font-bold text-sm transition-all"
          />
        </div>
      </div>

      {/* Role Filters */}
      <div className="pt-4 pb-2 bg-slate-50">
        <div className="flex flex-wrap justify-center gap-2 px-4">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => handleFilterChange(role.id)}
              className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs transition-all ${
                activeFilter === role.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 active:scale-95'
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
