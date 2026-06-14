import { createClient } from '@supabase/supabase-js';
import HomeClient from './HomeClient';
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

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // -- Fetch Meta Picks --
  let metaPicks: MetaPick[] = [];
  try {
    const { data, error } = await supabase.from('champion_stats').select('*');
    if (!error && data) {
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
        const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion.json`, { next: { revalidate: 3600 } });
        if (ddRes.ok) {
          const json = await ddRes.json();
          ddragonData = json.data;
        }
      } catch (e) {
        console.warn('Failed to fetch DataDragon localized names');
      }

      const roles = ['TOP', 'JUNGLE', 'MID', 'ADC', 'SUPPORT'];
      roles.forEach(role => {
        const champsInRole = data.filter(d => d.role === role);
        if (champsInRole.length > 0) {
          champsInRole.sort((a, b) => b.win_rate - a.win_rate);
          const champEn = champsInRole[0].champion_name_en;
          const ddKey = Object.keys(ddragonData).find(
            k => k.toLowerCase() === champEn.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
          );
          const localizedName = ddKey ? ddragonData[ddKey].name : champsInRole[0].champion_name;

          metaPicks.push({
            role: role,
            champion_name_en: champEn,
            champion_name: localizedName,
            win_rate: champsInRole[0].win_rate,
            tier: champsInRole[0].tier,
          });
        }
      });
    }
  } catch (err) {
    console.error("Failed to fetch meta picks:", err);
  }

  // -- Fetch Patches Data (Buffs) --
  let featuredItems: any[] = [];
  let featuredChampions: any[] = [];
  try {
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

    const isDuplicatePatch = (a: any, b: any): boolean => {
      if ((a.version || '').toLowerCase().trim() !== (b.version || '').toLowerCase().trim()) return false;
      if ((a.change_type || '').toLowerCase().trim() !== (b.change_type || '').toLowerCase().trim()) return false;
      
      const normAJa = (a.champion_name || '').toLowerCase().replace(/[\s・_-]/g, '');
      const normAEn = (a.champion_name_en || '').toLowerCase().replace(/[\s・_-]/g, '');
      
      const normBJa = (b.champion_name || '').toLowerCase().replace(/[\s・_-]/g, '');
      const normBEn = (b.champion_name_en || '').toLowerCase().replace(/[\s・_-]/g, '');

      return (normAJa && normBJa && normAJa === normBJa) || (normAEn && normBEn && normAEn === normBEn);
    };

    let patchesList: any[] = [];
    const { data, error } = await supabase.from('patches').select('*').eq('change_type', 'buff');
    const fallbackFiltered = fallbackPatches.filter((p: any) => p.change_type === 'buff');

    if (!error && data && data.length > 0) {
      const merged = [...data];
      fallbackFiltered.forEach((p: any) => {
        if (!merged.some(existing => isDuplicatePatch(existing, p))) {
          merged.push(p);
        }
      });
      patchesList = merged;
    } else {
      patchesList = fallbackFiltered;
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
      featuredItems = latestItemPatches.map((patch: any) => {
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
    }

    // 2. Process Champions
    const champPatches = patchesList.filter(p => p.is_champion);
    if (champPatches.length > 0) {
      const champVersions = Array.from(new Set(champPatches.map((p: any) => p.version)))
        .sort((a: any, b: any) => compareVersions(b, a));
      
      const latestChampVersion = champVersions[0];
      const latestChampPatches = champPatches.filter((p: any) => p.version === latestChampVersion);

      const seenChampNames = new Set();
      featuredChampions = latestChampPatches.map((patch: any) => {
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
    }

  } catch (e) {
    console.error("Failed to process patches:", e);
  }

  return (
    <HomeClient 
      metaPicks={metaPicks} 
      featuredItems={featuredItems} 
      featuredChampions={featuredChampions} 
    />
  );
}
