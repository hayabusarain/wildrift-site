"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, Search, Filter } from "lucide-react";

type Patch = Database["public"]["Tables"]["patches"]["Row"];
type PatchMeta = {
  id: string;
  version: string;
  prediction_ja: string;
  prediction_en: string;
  created_at: string;
};

// dummyPatches removed

export function PatchTable({ championId }: { championId?: string }) {
  const t = useTranslations("PatchTable");
  const locale = useLocale();
  const [patches, setPatches] = useState<Patch[]>([]);
  const [patchMetas, setPatchMetas] = useState<PatchMeta[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "buff" | "nerf" | "adjust">("all");
  const [iconMap, setIconMap] = useState<Record<string, string>>({});

  // Derive unique versions from the loaded patches
  const uniqueVersions = Array.from(new Set(patches.map(p => p.version))).sort((a, b) => b.localeCompare(a));

  // Set default selected version when patches load
  useEffect(() => {
    if (patches.length > 0 && !selectedVersion) {
      setSelectedVersion(uniqueVersions[0]);
    }
  }, [patches, selectedVersion, uniqueVersions]);

  const fetchPatches = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      let query = supabase
        .from("patches")
        .select("*")
        .order("version", { ascending: false })
        .order("created_at", { ascending: true });

      if (championId) {
        query = query.eq('champion_name_en', championId);
      }

      const { data: patchesData, error: patchesError } = await query;

      if (patchesError) {
        console.error('Supabase Fetch Patches Error:', patchesError);
        throw patchesError;
      }

      const { data: metaData, error: metaError } = await supabase
        .from("patch_meta")
        .select("*");

      if (metaError) {
        console.error('Supabase Fetch Meta Error:', metaError);
      }

      if (patchesData && patchesData.length > 0) {
        setPatches(patchesData);
        setPatchMetas(metaData || []);
      } else {
        setPatches([]);
      }
    } catch (err: any) {
      console.error("Supabase fetch error:", err);
      setPatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatches();
  }, []);

  useEffect(() => {
    async function fetchIconsMap() {
      try {
        const map: Record<string, string> = {};
        
        // Fetch Items
        const resItems = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/item.json`);
        const dataItems = await resItems.json();
        for (const key of Object.keys(dataItems.data)) {
          const item = dataItems.data[key];
          const normalizedName = item.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          map[normalizedName] = `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image.full}`;
        }

        // Fetch Runes
        const resRunes = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.8.1/data/en_US/runesReforged.json`);
        const dataRunes = await resRunes.json();
        for (const tree of dataRunes) {
          for (const slot of tree.slots) {
            for (const rune of slot.runes) {
              const nameNormalized = rune.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
              const keyNormalized = rune.key.toLowerCase();
              const url = `https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`;
              map[nameNormalized] = url;
              map[keyNormalized] = url;
            }
          }
        }
        
        setIconMap(map);
      } catch (err) {
        console.error('Failed to fetch icon map:', err);
      }
    }
    fetchIconsMap();
  }, []);

  if (loading && patches.length === 0) {
    return <div className="p-4 text-center text-slate-500">{t("loading")}</div>;
  }

  const selectedPatchMeta = patchMetas.find(m => m.version === selectedVersion);

  const renderDescription = (text: string) => {
    if (!text) return null;
    return <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed space-y-1">{text}</div>;
  };

  // フィルタリングロジック
  const filteredPatches = patches.filter(p => {
    // 1. テキスト検索
    const query = searchQuery.toLowerCase();
    const matchText = !query || 
      (p.champion_name && p.champion_name.toLowerCase().includes(query)) || 
      (p.champion_name_en && p.champion_name_en.toLowerCase().includes(query)) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      (p.description_en && p.description_en.toLowerCase().includes(query));

    // 2. タイプフィルター
    const matchType = filterType === "all" || p.change_type === filterType;

    // 3. バージョンフィルター
    // 検索入力があるか、フィルターがall以外の場合は、全バージョンを串刺し検索する
    const isSearching = query.length > 0 || filterType !== "all";
    const matchVersion = isSearching || p.version === selectedVersion;

    return matchText && matchType && matchVersion;
  });

  return (
    <div className="space-y-6">

      {/* 検索・フィルター UI (チャンピオン指定時は非表示) */}
      {!championId && (
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm shadow-sm transition-all"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${filterType === 'all' ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'}`}
            >
              {t("filterAll")}
            </button>
            <button 
              onClick={() => setFilterType('buff')}
              className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${filterType === 'buff' ? 'bg-emerald-500 text-white border-emerald-500 shadow-md' : 'bg-white text-emerald-600 border-slate-200 hover:bg-emerald-50'}`}
            >
              {t("filterBuff")}
            </button>
            <button 
              onClick={() => setFilterType('nerf')}
              className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${filterType === 'nerf' ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-white text-rose-600 border-slate-200 hover:bg-rose-50'}`}
            >
              {t("filterNerf")}
            </button>
            <button 
              onClick={() => setFilterType('adjust')}
              className={`px-4 py-2 text-sm font-bold rounded-xl border transition-all ${filterType === 'adjust' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-amber-600 border-slate-200 hover:bg-amber-50'}`}
            >
              {t("filterAdjust")}
            </button>
          </div>
        </div>
        
        {/* 検索中（串刺しモード）のインジケーター */}
        {(searchQuery.length > 0 || filterType !== 'all') && (
          <div className="mt-3 text-sm font-medium text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg inline-flex">
            <Sparkles size={16} />
            {t("crossSearchActive")}
          </div>
        )}
      </div>
      )}

      {!championId && selectedPatchMeta && !searchQuery && filterType === 'all' && (
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6">
          <h3 className="font-bold text-indigo-900 mb-2">
            {locale === 'en' ? 'AI Meta Prediction' : 'AI メタ予想'}
          </h3>
          <p className="text-sm text-indigo-800 leading-relaxed">
            {locale === 'en' ? selectedPatchMeta.prediction_en : selectedPatchMeta.prediction_ja}
          </p>
        </div>
      )}

      {/* Error message removed */}
      
      <div className="overflow-x-auto">
        {!championId && uniqueVersions.length > 0 && searchQuery.length === 0 && filterType === 'all' && (
          <div className="mb-4">
            <label htmlFor="version-select" className="text-sm font-medium text-slate-600 mr-2">
              {t("displayVersion")}
            </label>
            <select
              id="version-select"
              value={selectedVersion || ""}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            >
              {uniqueVersions.map(v => (
                <option key={v} value={v}>Patch {v}</option>
              ))}
            </select>
          </div>
        )}

        {filteredPatches.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-medium">
            {t("noResults")}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-sm">
                <th className="p-3 border-b border-slate-200 font-semibold w-16"></th>
                <th className="p-3 border-b border-slate-200 font-semibold">{t("version")}</th>
                <th className="p-3 border-b border-slate-200 font-semibold">{t("champion")}</th>
                <th className="p-3 border-b border-slate-200 font-semibold">{t("type")}</th>
                <th className="p-3 border-b border-slate-200 font-semibold">{t("description")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatches.map((patch) => (
                <tr 
                  key={patch.id} 
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="p-3 align-top">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center border border-slate-300">
                      {(patch as any).is_champion !== false ? (
                        <img 
                          src={patch.champion_name_en === 'Norra' ? '/images/ノラ.avif' : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${patch.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '') || ''}.png`}
                          alt={patch.champion_name_en || patch.champion_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-sm shadow-inner';
                              fallback.innerText = patch.champion_name?.substring(0, 1) || '?';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : iconMap[patch.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || ''] ? (
                        <img 
                          src={iconMap[patch.champion_name_en?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || '']}
                          alt={patch.champion_name_en || patch.champion_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const fallback = document.createElement('div');
                              fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 font-black text-sm shadow-inner';
                              fallback.innerText = '⚔️';
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-lg">⚔️</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm font-black text-indigo-900 align-top pt-5 whitespace-nowrap">{patch.version}</td>
                  <td className="p-3 text-sm font-bold text-slate-800 align-top pt-5">
                    {locale === 'en' ? (patch.champion_name_en || patch.champion_name) : patch.champion_name}
                  </td>
                  <td className="p-3 text-sm align-top pt-5 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        patch.change_type === "buff"
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                          : patch.change_type === "nerf"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : patch.change_type === "adjust"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : patch.change_type === "new"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {patch.change_type.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    {renderDescription(locale === 'en' ? (patch.description_en || patch.description) : patch.description)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
