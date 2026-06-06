'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChampionStat {
  id: number;
  champion_name: string;
  champion_name_en: string;
  win_rate: number;
  pick_rate: number;
  ban_rate: number;
  tier: string;
  role: string;
  updated_at: string;
}

export default function TierListPage() {
  const locale = useLocale();
  const t = useTranslations("TierList");
  const r = useTranslations("Role");
  const h = useTranslations("Home");
  const [stats, setStats] = useState<ChampionStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('TOP');

  const getRoleName = (role: string) => {
    switch(role) {
      case 'TOP': return r('top');
      case 'JUNGLE': return r('jungle');
      case 'MID': return r('mid');
      case 'ADC': return r('adc');
      case 'SUPPORT': return r('support');
      default: return role;
    }
  };

  const roles = [
    { id: 'TOP', label: getRoleName('TOP') },
    { id: 'JUNGLE', label: getRoleName('JUNGLE') },
    { id: 'MID', label: getRoleName('MID') },
    { id: 'ADC', label: getRoleName('ADC') },
    { id: 'SUPPORT', label: getRoleName('SUPPORT') }
  ];

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from('champion_stats')
          .select('*')
          .order('win_rate', { ascending: false });

        if (error) throw error;

        let langCode = 'en_US';
        switch (locale) {
          case 'ja': langCode = 'ja_JP'; break;
          case 'ko': langCode = 'ko_KR'; break;
          case 'vi': langCode = 'vn_VN'; break;
          case 'zh-TW': langCode = 'zh_TW'; break;
          default: langCode = 'en_US'; break;
        }

        let ddragonData: any = {};
        try {
          const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion.json`);
          if (ddRes.ok) {
            const json = await ddRes.json();
            ddragonData = json.data;
          }
        } catch (e) {
          console.warn('Failed to fetch DataDragon localized names');
        }

        const localizedStats = data?.map(stat => {
          const ddKey = Object.keys(ddragonData).find(
            k => k.toLowerCase() === stat.champion_name_en.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          );
          
          return {
            ...stat,
            champion_name: ddKey ? ddragonData[ddKey].name : stat.champion_name
          };
        }) || [];

        setStats(localizedStats);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full max-w-md mx-auto bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-slate-50 min-h-screen">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen p-4">
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-100">
          <Trophy className="mx-auto h-12 w-12 text-slate-200 mb-3" />
          <h3 className="text-lg font-black text-slate-800">{t('noData')}</h3>
          <p className="mt-2 text-xs font-bold text-slate-400">
            {t('noDataDesc')}
          </p>
        </div>
      </div>
    );
  }

  const filteredStats = stats.filter(c => (c.role || 'TOP') === activeTab);
  const tiers = ['S', 'A', 'B', 'C'];
  const groupedStats = tiers.map(tier => ({
    tier,
    champions: filteredStats.filter(c => c.tier === tier)
  })).filter(g => g.champions.length > 0);

  const getTierBadgeStyle = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'A': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'B': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'C': return 'bg-slate-200 text-slate-600 border-slate-300';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const getWinRateColor = (wr: number) => {
    if (wr >= 52) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (wr >= 50) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-50 min-h-screen pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 pt-8 pb-4 px-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('title')}</h1>
            <p className="text-xs font-bold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
          <div className="bg-amber-100 p-2.5 rounded-2xl text-amber-600 shadow-inner">
            <Trophy size={20} />
          </div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
          {h('metaUpdated')}
        </p>
      </div>

      {/* Role Tabs - Horizontal Carousel */}
      <div className="pt-4 pb-2 bg-slate-50">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`flex-shrink-0 py-2.5 px-5 rounded-2xl font-bold text-sm transition-all snap-center ${
                activeTab === role.id
                  ? 'bg-slate-900 text-white shadow-md scale-100'
                  : 'bg-white text-slate-600 border border-slate-200 scale-[0.98] active:scale-95'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tier Sections - Vertical Stacking */}
      <div className="px-4 mt-4 space-y-8">
        {groupedStats.map(({ tier, champions }) => (
          <div key={tier} className="flex flex-col gap-3">
            {/* Tier Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-lg border ${getTierBadgeStyle(tier)}`}>
                  {tier}
                </div>
                <h2 className="text-base font-black text-slate-800">Tier {tier}</h2>
              </div>
              <span className="text-[10px] font-black text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded-lg uppercase tracking-wider">
                {t('tier', { count: champions.length })}
              </span>
            </div>

            {/* Horizontal Swipeable Carousel for Champions */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-2 -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {champions.map((champion) => (
                <Link 
                  key={champion.id} 
                  href={`/champions/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}`}
                  className="flex flex-col bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex-shrink-0 w-[116px] snap-center active:scale-95 transition-transform"
                >
                  <div className="w-16 h-16 mx-auto bg-slate-100 rounded-[1.25rem] overflow-hidden mb-3 relative shadow-inner">
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}.png`}
                      alt={champion.champion_name_en}
                      className="w-full h-full object-cover scale-[1.05]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `/images/champions/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}.avif`;
                      }}
                    />
                  </div>
                  <h3 className="text-xs font-black text-slate-800 text-center truncate w-full mb-2">{champion.champion_name}</h3>
                  <div className={`rounded-xl py-1.5 px-2 flex items-center justify-between mt-auto border ${getWinRateColor(champion.win_rate)}`}>
                    <span className="text-[9px] font-black opacity-60">WR</span>
                    <span className="text-xs font-black">{champion.win_rate.toFixed(1)}%</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
