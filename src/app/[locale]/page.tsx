'use client';

import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Trophy, Users, Sparkles, Package, Hexagon, ArrowRight, TrendingUp, History, Calculator, Bell, BookOpen, ShoppingBag, FileText, Zap } from "lucide-react";
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
    <div className="pb-8 bg-slate-50 min-h-screen">
      
      {/* Notice / Announcement Section */}
      <div className="mx-4 mt-6 mb-6">
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
            {t('noticeItemsAndRunes')}
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

        {loading ? (
          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex-none w-[110px] aspect-[4/5] bg-slate-200 animate-pulse rounded-[1.25rem]"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {metaPicks.map((pick, idx) => (
              <Link 
                href={`/champions/${pick.champion_name_en}`} 
                key={idx}
                className="flex-none w-[110px] snap-center rounded-[1.25rem] bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col"
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
        )}
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

          <div className="flex gap-3 px-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {featuredChampions.map((champ: any, idx) => (
              <Link
                key={idx}
                href={`/champions/${champ.champion_name_en}`}
                className="flex-none w-[140px] snap-center bg-white rounded-[1.25rem] p-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-slate-100 active:scale-95 transition-transform flex flex-col gap-2 relative"
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
