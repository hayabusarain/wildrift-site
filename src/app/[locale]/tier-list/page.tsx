'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Trophy, Swords, ShieldBan, Target } from 'lucide-react';
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

// 環境変数はフロントエンドからアクセスするため NEXT_PUBLIC_ を使用
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

        // DataDragonから現在の言語のチャンピオン名を取得
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
          // DataDragonのキーはIdと異なる場合がある（例: Wukong -> MonkeyKing）ので、厳密にはchampion_name_enとマッチングする
          // 基本はそのまま、見つからなければFallback
          const ddKey = Object.keys(ddragonData).find(
            k => k.toLowerCase() === stat.champion_name_en.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          );
          
          return {
            ...stat,
            // 公式翻訳名があれば上書き、なければ元のDBの日本語名
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
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
        {t('error')}: {error}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-slate-200">
        <Trophy className="mx-auto h-12 w-12 text-slate-300 mb-3" />
        <h3 className="text-lg font-medium text-slate-900">{t('noData')}</h3>
        <p className="mt-2 text-sm text-slate-500">
          {t('noDataDesc')}
        </p>
      </div>
    );
  }

  // Filter by active tab and group by Tier
  const filteredStats = stats.filter(c => (c.role || 'TOP') === activeTab);
  const tiers = ['S', 'A', 'B', 'C'];
  const groupedStats = tiers.map(tier => ({
    tier,
    champions: filteredStats.filter(c => c.tier === tier)
  })).filter(g => g.champions.length > 0);

  // Tierに応じたスタイリング
  const getTierStyle = (tier: string) => {
    switch (tier) {
      case 'S': return 'bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border-yellow-500 shadow-yellow-200/50';
      case 'A': return 'bg-gradient-to-r from-rose-200 to-red-400 text-rose-900 border-red-500 shadow-red-200/50';
      case 'B': return 'bg-gradient-to-r from-blue-200 to-indigo-400 text-blue-900 border-indigo-500 shadow-indigo-200/50';
      case 'C': return 'bg-gradient-to-r from-slate-200 to-gray-400 text-slate-800 border-gray-500 shadow-gray-200/50';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">
          {t('title')}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-2">
          {t('subtitle')}
        </p>
        <p className="text-xs font-bold text-slate-400">
          {h('metaUpdated')}
        </p>
      </div>

      {/* Role Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => setActiveTab(role.id)}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeTab === role.id
                ? 'bg-indigo-600 text-white shadow-md transform scale-[1.02]'
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {groupedStats.map(({ tier, champions }) => (
          <div key={tier} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className={`px-6 py-3 border-b-2 flex items-center gap-4 ${getTierStyle(tier)}`}>
              <span className="text-4xl font-black italic tracking-wider drop-shadow-sm">{tier}</span>
              <span className="font-bold opacity-90">{t('tier', { count: champions.length })}</span>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {champions.map((champion) => (
                <Link 
                  key={champion.id} 
                  href={`/champions/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}`}
                  className="group relative bg-slate-50 hover:bg-white p-4 rounded-xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-200 block"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500 overflow-hidden ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform">
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}.png`}
                        alt={champion.champion_name_en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `/images/champions/${champion.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}.avif`;
                          (e.target as HTMLImageElement).onerror = (e2: any) => {
                            const el = e2.target as HTMLImageElement;
                            el.style.display = 'none';
                            const parent = el.parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xl shadow-inner';
                              fallback.innerText = champion.champion_name.substring(0, 1);
                              parent.appendChild(fallback);
                            }
                          };
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{champion.champion_name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{champion.champion_name_en}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                    <div className="text-center">
                      <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
                        <Swords size={12} /> {t('winRate')}
                      </div>
                      <div className={`font-black ${champion.win_rate >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {champion.win_rate}%
                      </div>
                    </div>
                    <div className="text-center border-l border-r border-slate-100">
                      <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
                        <Target size={12} /> {t('pickRate')}
                      </div>
                      <div className="font-bold text-slate-700">
                        {champion.pick_rate}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1">
                        <ShieldBan size={12} /> {t('banRate')}
                      </div>
                      <div className="font-bold text-slate-700">
                        {champion.ban_rate}%
                      </div>
                    </div>
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
