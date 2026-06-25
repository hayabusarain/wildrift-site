'use client';

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Trophy, Users, Sparkles, Package, Hexagon, ArrowRight, TrendingUp, History, Calculator, Bell, BookOpen, ShoppingBag, FileText, Zap } from "lucide-react";

interface MetaPick {
  role: string;
  champion_name_en: string;
  champion_name: string;
  win_rate: number;
  tier: string;
}

interface HomeClientProps {
  metaPicks: MetaPick[];
  featuredItems: any[];
  featuredChampions: any[];
}

export default function HomeClient({ metaPicks, featuredItems, featuredChampions }: HomeClientProps) {
  const locale = useLocale();
  const t = useTranslations("Home");
  const r = useTranslations("Role");

  return (
    <div className="pb-8 bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="relative mb-8 rounded-b-[2.5rem] overflow-hidden bg-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-b border-slate-100/50">
        {/* Background Image & Effects */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-multiply"
          style={{ backgroundImage: "url('/images/hero-light.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10 px-4 pt-10 pb-12 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              DATABASE ACTIVE
            </span>
          </div>
          
          <h1 className="text-[28px] md:text-4xl font-black tracking-tight text-slate-800 leading-[1.2] mb-1">
            Wild Rift
            <br />
            <span className="text-blue-600 text-[32px] md:text-[40px]">攻略データベース</span>
          </h1>
          
        </div>
      </div>

      {/* Notice / Announcement Section */}
      <div className="mx-4 mt-2 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Bell size={14} strokeWidth={2.5} />
            </div>
            <h2 className="text-sm font-bold text-blue-900 tracking-tight">
              {t('noticeTitle')}
            </h2>
          </div>
          <p className="text-xs text-blue-800/80 font-medium leading-relaxed mt-1">
            {t('noticeUpdate')}
          </p>
        </div>
      </div>

      {/* Top Meta Picks Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between px-4 mb-3">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
            {t('metaTitle')}
          </h2>
          <Link href="/tier-list" className="text-xs font-bold text-blue-600 active:text-blue-800 transition-colors">
            {locale === 'ja' ? 'すべて見る' : 'See all'}
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 pb-4">
          {metaPicks.map((pick, idx) => (
            <Link 
              href={`/champions/${pick.champion_name_en}`} 
              key={idx}
              className="rounded-[1.25rem] bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col"
            >
              <div className="aspect-square bg-slate-100 relative">
                <img 
                  src={pick.champion_name_en === 'Norra' ? '/images/champions/Norra.avif' : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${pick.champion_name_en.replace(/[^a-zA-Z0-9]/g, '')}.png`}
                  alt={pick.champion_name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/champions/default.png';
                  }}
                />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-md text-[9px] font-bold text-slate-700 shadow-sm">
                  {pick.role}
                </div>
              </div>
              <div className="p-2.5 flex-1 flex flex-col justify-between">
                <h3 className="text-[11px] font-bold text-slate-800 leading-tight truncate">
                  {pick.champion_name}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    T{pick.tier}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    {pick.win_rate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Champions Showcase Section (Carousel) */}
      {featuredChampions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                {locale === 'ja' ? '最新パッチ バフ対象' : 'Recent Buffs'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Patch {featuredChampions[0]?.patchVersion || ''}</p>
            </div>
            <Link href="/champions" className="text-xs font-bold text-blue-600 active:text-blue-800 transition-colors">
              {locale === 'ja' ? 'すべて見る' : 'See all'}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            {featuredChampions.map((champ: any, idx) => (
              <Link
                key={idx}
                href={`/champions/${champ.champion_name_en}`}
                className="bg-white rounded-[1.25rem] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col gap-2 relative"
              >
                <div className="absolute top-2 right-2 flex items-center justify-center">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 shrink-0">
                  <img
                    src={champ.champion_name_en === 'Norra' ? '/images/champions/Norra.avif' : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champ.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '') || ''}.png`}
                    alt={champ.champion_name}
                    className="w-full h-full object-cover scale-110"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-xs truncate">
                    {champ.champion_name}
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-medium line-clamp-2 mt-1 leading-snug">
                    {champ.patchDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Access Grid */}
      <div className="px-4">
        <h2 className="text-[17px] font-bold text-slate-900 tracking-tight mb-3">
          {locale === 'ja' ? 'ショートカット' : 'Quick Access'}
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/champions" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaChampionsTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaChampionsDesc')}</p>
            </div>
          </Link>

          <Link href="/items" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <ShoppingBag size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaItemsTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaItemsDesc')}</p>
            </div>
          </Link>

          <Link href="/spells" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0">
              <Zap size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaSpellsTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaSpellsDesc')}</p>
            </div>
          </Link>

          <Link href="/runes" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Hexagon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaRunesTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaRunesDesc')}</p>
            </div>
          </Link>

          <Link href="/patches" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <FileText size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaPatchTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaPatchDesc')}</p>
            </div>
          </Link>

          <Link href="/calculator" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Calculator size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaCalcTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaCalcDesc')}</p>
            </div>
          </Link>

          <Link href="/guide" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaGuideTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaGuideDesc')}</p>
            </div>
          </Link>
          
          <Link href="/encyclopedia" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{locale === 'ja' ? 'ワイリフ大辞典' : 'Encyclopedia'}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{locale === 'ja' ? '詳細なゲームの仕様やマクロ戦術を学ぶ' : 'Learn detailed game mechanics & macro'}</p>
            </div>
          </Link>
          
          <Link href="/tier-list" className="bg-white p-3.5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Trophy size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">{t('qaTierTitle')}</h3>
              <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{t('qaTierDesc')}</p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  );
}
