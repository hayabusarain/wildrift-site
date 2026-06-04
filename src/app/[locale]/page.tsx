'use client';

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Trophy, Users, Sparkles, Package, Hexagon, ArrowRight, TrendingUp, History, Calculator, Bell, BookOpen, ShoppingBag } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import itemsData from '@/data/physical_items_final.json';
import fallbackPatches from '@/data/patches.json';

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

  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [featuredChampions, setFeaturedChampions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchBuffedData() {
      // Helper function to sort patch versions numerically and suffix-sensitively
      const compareVersions = (a: string, b: string): number => {
        const regex = /^(\d+)\.(\d+)([a-z])?$/i;
        const matchA = a.match(regex);
        const matchB = b.match(regex);

        if (!matchA && !matchB) return a.localeCompare(b);
        if (!matchA) return -1;
        if (!matchB) return 1;

        const majorA = parseInt(matchA[1], 10);
        const minorA = parseInt(matchA[2], 10);
        const suffixA = matchA[3] || '';

        const majorB = parseInt(matchB[1], 10);
        const minorB = parseInt(matchB[2], 10);
        const suffixB = matchB[3] || '';

        if (majorA !== majorB) return majorA - majorB;
        if (minorA !== minorB) return minorA - minorB;
        return suffixA.localeCompare(suffixB);
      };

      // Helper to check if two patches represent the same change
      const isDuplicatePatch = (a: any, b: any): boolean => {
        if ((a.version || '').toLowerCase().trim() !== (b.version || '').toLowerCase().trim()) return false;
        if ((a.change_type || '').toLowerCase().trim() !== (b.change_type || '').toLowerCase().trim()) return false;
        
        const normAJa = (a.champion_name || '').toLowerCase().replace(/[\s・_-]/g, '');
        const normAEn = (a.champion_name_en || '').toLowerCase().replace(/[\s・_-]/g, '');
        
        const normBJa = (b.champion_name || '').toLowerCase().replace(/[\s・_-]/g, '');
        const normBEn = (b.champion_name_en || '').toLowerCase().replace(/[\s・_-]/g, '');

        const matchJa = normAJa && normBJa && normAJa === normBJa;
        const matchEn = normAEn && normBEn && normAEn === normBEn;
        
        return matchJa || matchEn;
      };

      let patchesList: any[] = [];
      try {
        const { data, error } = await supabase
          .from('patches')
          .select('*')
          .eq('change_type', 'buff');

        const fallbackFiltered = fallbackPatches.filter(
          (p: any) => p.change_type === 'buff'
        );

        if (!error && data && data.length > 0) {
          const merged = [...data];
          fallbackFiltered.forEach((p: any) => {
            const isDup = merged.some(existing => isDuplicatePatch(existing, p));
            if (!isDup) {
              merged.push(p);
            }
          });
          patchesList = merged;
        } else {
          patchesList = fallbackFiltered;
        }
      } catch (e) {
        patchesList = fallbackPatches.filter(
          (p: any) => p.change_type === 'buff'
        );
      }

      const normalize = (name: string) => name.toLowerCase().replace(/[\s・_]/g, '');

      // 1. Process Items
      const itemPatches = patchesList.filter(p => !p.is_champion);
      const matchedItemPatches = itemPatches.filter((patch: any) => {
        const normPatchJa = normalize(patch.champion_name || '');
        const normPatchEn = normalize(patch.champion_name_en || '');
        return itemsData.some((item: any) => {
          const normItemJa = normalize(item.nameJa || '');
          const normItemEn = normalize(item.nameEn || '');
          return (normPatchJa && normItemJa && normItemJa === normPatchJa) ||
                 (normPatchEn && normItemEn && normItemEn === normPatchEn);
        });
      });

      if (matchedItemPatches.length > 0) {
        const itemVersions = Array.from(new Set(matchedItemPatches.map((p: any) => p.version)))
          .sort((a: any, b: any) => compareVersions(b, a));
        
        const latestItemVersion = itemVersions[0];
        const latestItemPatches = matchedItemPatches.filter((p: any) => p.version === latestItemVersion);

        const seenItemIds = new Set();
        const itemsMap = latestItemPatches.map((patch: any) => {
          const normPatchJa = normalize(patch.champion_name || '');
          const normPatchEn = normalize(patch.champion_name_en || '');
          const foundItem = itemsData.find((item: any) => {
            const normItemJa = normalize(item.nameJa || '');
            const normItemEn = normalize(item.nameEn || '');
            return (normPatchJa && normItemJa && normItemJa === normPatchJa) ||
                   (normPatchEn && normItemEn && normItemEn === normPatchEn);
          });
          if (foundItem) {
            if (seenItemIds.has(foundItem.id)) return null;
            seenItemIds.add(foundItem.id);
            return {
              ...foundItem,
              patchDescription: locale === 'ja' ? patch.description : patch.description_en,
              patchVersion: patch.version,
              isBuffed: true
            };
          }
          return null;
        }).filter(Boolean);
        setFeaturedItems(itemsMap);
      } else {
        setFeaturedItems([]);
      }

      // 2. Process Champions
      const champPatches = patchesList.filter(p => p.is_champion);
      if (champPatches.length > 0) {
        const champVersions = Array.from(new Set(champPatches.map((p: any) => p.version)))
          .sort((a: any, b: any) => compareVersions(b, a));
        
        const latestChampVersion = champVersions[0];
        const latestChampPatches = champPatches.filter((p: any) => p.version === latestChampVersion);

        const seenChampNames = new Set();
        const champsMap = latestChampPatches.map((patch: any) => {
          const nameKey = (patch.champion_name_en || patch.champion_name || '').toLowerCase().trim();
          if (seenChampNames.has(nameKey)) return null;
          seenChampNames.add(nameKey);
          return {
            champion_name: locale === 'ja' ? patch.champion_name : (patch.champion_name_en || patch.champion_name),
            champion_name_en: patch.champion_name_en,
            patchDescription: locale === 'ja' ? patch.description : patch.description_en,
            patchVersion: patch.version,
            isBuffed: true
          };
        }).filter(Boolean);
        setFeaturedChampions(champsMap);
      } else {
        setFeaturedChampions([]);
      }
    }

    fetchBuffedData();
  }, [locale]);

  const getItemSearchString = (item: any) => {
    let str = (item.stats || []).join(' ').toLowerCase();
    if (item.passives && Array.isArray(item.passives)) {
      item.passives.forEach((p: any) => {
        if (p.name) str += ' ' + p.name.toLowerCase();
        if (p.description) str += ' ' + p.description.toLowerCase();
      });
    }
    return str;
  };

  const getItemGlowClass = (item: any) => {
    if (item.isBuffed) {
      return 'from-emerald-500/10 via-slate-900 to-slate-900 hover:border-emerald-500/35 group-hover:shadow-emerald-500/5';
    }
    const searchStr = getItemSearchString(item);
    if (searchStr.includes('攻撃力') || searchStr.includes('ad')) return 'from-rose-500/10 via-slate-900 to-slate-900 hover:border-rose-500/30 group-hover:shadow-rose-500/5';
    if (searchStr.includes('魔力') || searchStr.includes('ap')) return 'from-purple-500/10 via-slate-900 to-slate-900 hover:border-purple-500/30 group-hover:shadow-purple-500/5';
    if (searchStr.includes('物理防御') || searchStr.includes('魔法防御') || searchStr.includes('防御') || searchStr.includes('mr') || searchStr.includes('armor')) return 'from-emerald-500/10 via-slate-900 to-slate-900 hover:border-emerald-500/30 group-hover:shadow-emerald-500/5';
    return 'from-indigo-500/10 via-slate-900 to-slate-900 hover:border-indigo-500/30 group-hover:shadow-indigo-500/5';
  };

  const getIconGlowColor = (item: any) => {
    if (item.isBuffed) {
      return 'bg-emerald-500/20';
    }
    const searchStr = getItemSearchString(item);
    if (searchStr.includes('攻撃力') || searchStr.includes('ad')) return 'bg-rose-500/20';
    if (searchStr.includes('魔力') || searchStr.includes('ap')) return 'bg-purple-500/20';
    if (searchStr.includes('物理防御') || searchStr.includes('魔法防御') || searchStr.includes('防御') || searchStr.includes('mr') || searchStr.includes('armor')) return 'bg-emerald-500/20';
    return 'bg-indigo-500/20';
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
          <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-none w-[130px] aspect-[308/560] md:w-auto bg-slate-100 animate-pulse rounded-2xl md:rounded-3xl border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-transparent md:grid md:grid-cols-5 md:gap-4 md:overflow-visible md:pb-0">
            {metaPicks.map((pick, idx) => (
              <Link 
                href={`/champions/${pick.champion_name_en}`} 
                key={idx}
                className="group relative flex-none w-[130px] aspect-[308/560] snap-start md:w-auto md:flex-initial rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border-2 border-transparent hover:border-indigo-400 flex flex-col justify-end"
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
                
                <div className="relative z-10 p-3 md:p-4">
                  <div className="flex items-center justify-between mb-1.5 md:mb-2 gap-1">
                    <span className={`text-[8px] md:text-[10px] font-bold text-white px-1.5 md:px-2 py-0.5 rounded-full truncate ${getRoleColor(pick.role)}`}>
                      {pick.role}
                    </span>
                    <span className="text-[9px] md:text-xs font-black text-amber-400 bg-amber-900/80 px-1.5 md:px-2 py-0.5 rounded-md border border-amber-500/50 shrink-0">
                      Tier {pick.tier}
                    </span>
                  </div>
                  <h3 className="text-sm md:text-lg font-black text-white group-hover:text-indigo-300 transition-colors truncate">
                    {pick.champion_name}
                  </h3>
                  <p className="text-[10px] md:text-xs text-slate-300 font-medium">{t('winRate')}: <span className="text-emerald-400 font-bold">{pick.win_rate}%</span></p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Champions Showcase Section (Carousel) */}
      {featuredChampions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Users className="text-emerald-500" size={28} />
                {locale === 'ja' 
                  ? `最新パッチ ${featuredChampions[0]?.patchVersion || ''} のバフ対象チャンピオン` 
                  : `Buffed Champions in Patch ${featuredChampions[0]?.patchVersion || ''}`}
              </h2>
              <p className="text-slate-500 font-medium mt-1 mb-1">
                {locale === 'ja' ? '直近のアップデートでスキルやステータスが上方修正（バフ）されたチャンピオン' : 'Champions who received buffs in the recent update'}
              </p>
            </div>
            <Link href="/champions" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 text-sm bg-indigo-50 px-4 py-2 rounded-full transition-colors">
              {locale === 'ja' ? 'すべてのチャンピオンを見る' : 'View All Champions'} <ArrowRight size={14} />
            </Link>
          </div>

          {/* Horizontal scrollable carousel */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth scrollbar-thin scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400 scrollbar-track-transparent">
            {featuredChampions.map((champ: any, idx) => {
              return (
                <Link
                  key={idx}
                  href={`/champions/${champ.champion_name_en}`}
                  className="group relative flex-none w-[200px] sm:w-[240px] snap-start bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-center text-center hover:scale-[1.03] hover:shadow-xl hover:border-transparent bg-gradient-to-b from-emerald-500/10 via-slate-900 to-slate-900 hover:border-emerald-500/35 transition-all duration-300 overflow-hidden"
                >
                  {/* BUFF Badge */}
                  <span className="absolute top-2 right-2 text-[9px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-md px-1.5 py-0.5 z-20 animate-pulse">
                    BUFF
                  </span>

                  {/* Glow behind icon */}
                  <div className="absolute top-4 w-16 h-16 rounded-full blur-xl opacity-60 pointer-events-none transition-all group-hover:scale-125 bg-emerald-500/20" />

                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-950 border border-slate-800 shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <img
                      src={
                        champ.champion_name_en === 'Norra'
                          ? '/images/champions/Norra.avif'
                          : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champ.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '') || ''}.png`
                      }
                      alt={champ.champion_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent && !parent.querySelector('.fallback-icon')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-inner';
                          fallback.innerText = champ.champion_name?.substring(0, 1) || '?';
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-1 relative z-10 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-black text-slate-100 text-sm line-clamp-1 group-hover:text-white transition-colors">
                        {champ.champion_name}
                      </h3>
                    </div>
                    
                    <div className="text-[10px] text-emerald-400 font-medium line-clamp-2 mt-2 leading-relaxed">
                      {champ.patchDescription}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Featured Items Showcase Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <ShoppingBag className="text-emerald-500" size={28} />
              {locale === 'ja' 
                ? `最新パッチ ${featuredItems.find(f => f.isBuffed)?.patchVersion || ''} のバフ対象アイテム` 
                : `Buffed Items in Patch ${featuredItems.find(f => f.isBuffed)?.patchVersion || ''}`}
            </h2>
            <p className="text-slate-500 font-medium mt-1 mb-1">
              {locale === 'ja' ? '直近のアップデートで能力値や効果が上方修正（バフ）された注目の装備' : 'Key items that received buffs in the recent update'}
            </p>
          </div>
          <Link href="/items" className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 text-sm bg-indigo-50 px-4 py-2 rounded-full transition-colors">
            {locale === 'ja' ? 'すべてのアイテムを見る' : 'View All Items'} <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredItems.map((item: any, idx) => {
            const glowClass = getItemGlowClass(item);
            const iconGlow = getIconGlowColor(item);
            return (
              <Link
                key={idx}
                href="/items"
                className={`group relative bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-center text-center hover:scale-[1.05] hover:shadow-xl hover:border-transparent bg-gradient-to-b ${glowClass} transition-all duration-300 overflow-hidden`}
              >
                {/* BUFF Badge */}
                {item.isBuffed && (
                  <span className="absolute top-2 right-2 text-[9px] font-black text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 rounded-md px-1.5 py-0.5 z-20 animate-pulse">
                    BUFF
                  </span>
                )}

                {/* Glow behind icon */}
                <div className={`absolute top-4 w-16 h-16 rounded-full blur-xl opacity-60 pointer-events-none transition-all group-hover:scale-125 ${iconGlow}`} />

                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner mb-4 group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <img
                    src={
                      item.image === 'default_item.png'
                        ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                        : item.image.startsWith('/')
                        ? item.image
                        : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image}`
                    }
                    alt={item.nameJa}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                    }}
                  />
                </div>

                <div className="space-y-1 relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-slate-100 text-sm line-clamp-1 group-hover:text-white transition-colors">
                      {item.nameJa}
                    </h3>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md px-1.5 py-0.5 mt-1 inline-block">
                      {item.gold} G
                    </span>
                  </div>
                  
                  {/* Primary stat preview or patch description */}
                  <div className="text-[10px] text-slate-400 font-semibold line-clamp-2 mt-2 leading-relaxed">
                    {item.patchDescription ? (
                      <span className="text-emerald-400 font-medium">
                        {item.patchDescription}
                      </span>
                    ) : (
                      item.stats[0] || (item.passives[0] ? item.passives[0].name : '効果のみ')
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Link href="/champions" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{t('qaChampionsTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaChampionsDesc')}</p>
          </div>
        </Link>

        <Link href="/items" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <ShoppingBag size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{t('qaItemsTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaItemsDesc')}</p>
          </div>
        </Link>

        <Link href="/spells" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{t('qaSpellsTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaSpellsDesc')}</p>
          </div>
        </Link>

        <Link href="/runes" className="group bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col gap-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
            <Hexagon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{t('qaRunesTitle')}</h3>
            <p className="text-xs text-slate-500">{t('qaRunesDesc')}</p>
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
