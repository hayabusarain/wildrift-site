'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

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

interface TierListClientProps {
  initialStats: ChampionStat[];
  error?: string | null;
}

export default function TierListClient({ initialStats, error }: TierListClientProps) {
  const locale = useLocale();
  const t = useTranslations("TierList");
  const r = useTranslations("Role");
  const h = useTranslations("Home");
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

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 bg-slate-50 min-h-screen">
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm">
          {t('error')}: {error}
        </div>
      </div>
    );
  }

  if (!initialStats || initialStats.length === 0) {
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

  const filteredStats = initialStats.filter(c => (c.role || 'TOP') === activeTab);
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

      <div className="pt-4 pb-2 bg-slate-50">
        <div className="flex flex-wrap justify-center gap-2 px-4">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`py-1.5 px-4 rounded-xl font-bold text-xs transition-all ${
                activeTab === role.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 active:scale-95'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 space-y-8">
        {groupedStats.map(({ tier, champions }) => (
          <div key={tier} className="flex flex-col gap-3">
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

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pb-2">
              {champions.map((champion) => (
                <Link 
                  key={champion.id} 
                  href={`/champions/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}`}
                  className="flex flex-col bg-white rounded-2xl p-2.5 shadow-sm border border-slate-100 active:scale-95 transition-transform"
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
