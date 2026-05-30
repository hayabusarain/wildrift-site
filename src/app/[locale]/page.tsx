'use client';

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Trophy, Users, Sparkles, Package, Hexagon, ArrowRight, TrendingUp, History, Calculator, Bell, BookOpen } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface MetaPick {
  role: string;
  champion_name_en: string;
  champion_name: string;
  win_rate: number;
  tier: string;
}

export default function Home() {
  const locale = useLocale();
  const t = useTranslations("Home");
  const r = useTranslations("Role");
  const [metaPicks, setMetaPicks] = useState<MetaPick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetaPicks() {
      try {
        const { data, error } = await supabase.from('champion_stats').select('*');
        if (error) throw error;
        
        if (data) {
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

          const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
          const picks: MetaPick[] = [];
          
          roles.forEach(role => {
            const champsInRole = data.filter(d => d.role === role);
            if (champsInRole.length > 0) {
              // 勝率順にソートして一番上を取得
              champsInRole.sort((a, b) => b.win_rate - a.win_rate);
              
              const champEn = champsInRole[0].champion_name_en;
              const ddKey = Object.keys(ddragonData).find(
                k => k.toLowerCase() === champEn.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
              );
              const localizedName = ddKey ? ddragonData[ddKey].name : champsInRole[0].champion_name;

              picks.push({
                role: role,
                champion_name_en: champEn,
                champion_name: localizedName,
                win_rate: champsInRole[0].win_rate,
                tier: champsInRole[0].tier,
              });
            }
          });
          
          setMetaPicks(picks);
        }
      } catch (err) {
        console.error("Failed to fetch meta picks:", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMetaPicks();
  }, []);

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TOP': return 'bg-orange-500';
      case 'JUNGLE': return 'bg-emerald-500';
      case 'MID': return 'bg-blue-500';
      case 'ADC': return 'bg-rose-500';
      case 'SUPPORT': return 'bg-teal-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 scale-105 group-hover:scale-100"
          style={{ backgroundImage: "url('https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/80 to-transparent" />
        
        <div className="relative z-10 p-10 md:p-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Sparkles size={14} />
            <span>{t('heroBadge')}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight whitespace-pre-line">
            {t('heroTitle')}
          </h1>
          
          <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium">
            {t('heroDesc')}
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 mt-6">
            <Link 
              href="/guide" 
              className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all transform hover:-translate-y-0.5 duration-200"
            >
              <BookOpen size={18} />
              <span>{locale === 'ja' ? '初心者ガイドを見る' : "Read Beginner's Guide"}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Notice / Announcement Section */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-amber-800 flex items-center gap-2 mb-3">
          <Bell className="text-amber-600" size={20} />
          {t('noticeTitle')}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-amber-900/80 font-medium ml-1">
          <li>{t('noticeItemsAndRunes')}</li>
          <li>
            {t('noticeContact')} 
            <Link href="/contact" className="text-amber-700 underline font-bold ml-2 hover:text-amber-900">
              {t('contactUs')}
            </Link>
          </li>
        </ul>
      </div>

      {/* Top Meta Picks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <TrendingUp className="text-rose-500" size={28} />
              {t('metaTitle')}
            </h2>
            <p className="text-slate-500 font-medium mt-1 mb-1">{t('metaDesc')}</p>
            <p className="text-xs text-slate-400 font-bold">{t('metaUpdated')}</p>
          </div>
          <Link href="/tier-list" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 text-sm bg-indigo-50 px-4 py-2 rounded-full transition-colors">
            {t('viewAllTier')} <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-3xl border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {metaPicks.map((pick, idx) => (
              <Link 
                href={`/champions/${pick.champion_name_en}`} 
                key={idx}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-indigo-400 flex flex-col justify-end"
                style={{ minHeight: '320px' }}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-top transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: pick.champion_name_en === 'Norra'
                      ? `url('/images/champions/Norra.avif')`
                      : `url('https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${pick.champion_name_en}_0.jpg')`
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90" />
                
                <div className="relative z-10 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${getRoleColor(pick.role)}`}>
                      {pick.role}
                    </span>
                    <span className="text-xs font-black text-amber-400 bg-amber-900/80 px-2 py-0.5 rounded-md border border-amber-500/50">
                      Tier {pick.tier}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors truncate">
                    {pick.champion_name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">{t('winRate')}: <span className="text-emerald-400 font-bold">{pick.win_rate}%</span></p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/champions" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{t('qaChampionsTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaChampionsDesc')}</p>
          </div>
        </Link>
        
        <Link href="/tier-list" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-rose-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-rose-600 transition-colors">{t('qaTierTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaTierDesc')}</p>
          </div>
        </Link>

        <Link href="/patches" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-sky-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <History size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-sky-600 transition-colors">{t('qaPatchTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaPatchDesc')}</p>
          </div>
        </Link>

        <Link href="/calculator" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-transform">
            <Calculator size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-emerald-600 transition-colors">{t('qaCalcTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaCalcDesc')}</p>
          </div>
        </Link>

        <Link href="/guide" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-violet-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-violet-600 transition-colors">{t('qaGuideTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaGuideDesc')}</p>
          </div>
        </Link>
      </div>

    </div>
  );
}
