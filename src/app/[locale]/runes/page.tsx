'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useLocale } from 'next-intl';

interface RuneData {
  id: number;
  key: string;
  icon: string;
  name: string;
  shortDesc: string;
  longDesc: string;
  treeId: number;
  treeName: string;
  treeIcon: string;
  isKeystone: boolean;
}

interface RuneTree {
  id: number;
  key: string;
  icon: string;
  name: string;
  slots: {
    runes: any[];
  }[];
}

export default function RunesPage() {
  const locale = useLocale();
  const [runes, setRunes] = useState<RuneData[]>([]);
  const [trees, setTrees] = useState<{id: number, name: string, icon: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<number | 'All'>('All');

  useEffect(() => {
    async function fetchRunes() {
      try {
        const langCode = locale === 'ja' ? 'ja_JP' : 'en_US';
        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.8.1/data/${langCode}/runesReforged.json`);
        const data: RuneTree[] = await res.json();
        
        const extractedTrees: {id: number, name: string, icon: string}[] = [];
        const extractedRunes: RuneData[] = [];
        
        data.forEach(tree => {
          extractedTrees.push({ id: tree.id, name: tree.name, icon: tree.icon });
          
          tree.slots.forEach((slot, slotIndex) => {
            slot.runes.forEach(rune => {
              extractedRunes.push({
                id: rune.id,
                key: rune.key,
                icon: rune.icon,
                name: rune.name,
                shortDesc: rune.shortDesc,
                longDesc: rune.longDesc,
                treeId: tree.id,
                treeName: tree.name,
                treeIcon: tree.icon,
                isKeystone: slotIndex === 0 // 最初のスロットがキーストーン
              });
            });
          });
        });
        
        setTrees(extractedTrees);
        setRunes(extractedRunes);
      } catch (err) {
        console.error('Failed to fetch runes:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchRunes();
  }, [locale]);

  const filteredRunes = useMemo(() => {
    return runes.filter(rune => {
      const matchesSearch = rune.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            rune.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
                            
      let matchesFilter = true;
      if (activeFilter !== 'All') {
        matchesFilter = rune.treeId === activeFilter;
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [runes, searchQuery, activeFilter]);
  
  // キーストーンとサブルーンに分ける
  const keystones = filteredRunes.filter(r => r.isKeystone);
  const subRunes = filteredRunes.filter(r => !r.isKeystone);

  // Remove HTML tags for clean display
  const cleanDescription = (html: string) => {
    let clean = html.replace(/<[^>]*>?/gm, '');
    return clean;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner">
            <Sparkles size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Runes</h1>
            <p className="text-slate-500 font-medium">ルーン図鑑 (PC版データ準拠)</p>
          </div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
            placeholder="ルーン名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tree Filters */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setActiveFilter('All')}
          className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 ${
            activeFilter === 'All'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
          }`}
        >
          <span>すべて</span>
        </button>
        {trees.map(tree => (
          <button
            key={tree.id}
            onClick={() => setActiveFilter(tree.id)}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeFilter === tree.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <img src={`https://ddragon.leagueoflegends.com/cdn/img/${tree.icon}`} alt={tree.name} className="w-5 h-5 object-contain opacity-80" />
            <span className="hidden sm:inline">{tree.name}</span>
          </button>
        ))}
      </div>

      {/* Keystones */}
      {keystones.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block"></span>
            キーストーン (Main Runes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keystones.map(rune => (
              <div key={rune.id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
                <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-indigo-200 shadow-md flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                  <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} alt={rune.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.treeIcon}`} alt={rune.treeName} className="w-3 h-3 opacity-60" />
                    <h3 className="font-bold text-slate-800">{rune.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{cleanDescription(rune.longDesc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Runes */}
      {subRunes.length > 0 && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-slate-400 rounded-full inline-block"></span>
            サブルーン (Sub Runes)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {subRunes.map(rune => (
              <div key={rune.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden p-1 flex-shrink-0">
                  <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} alt={rune.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <img src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.treeIcon}`} alt={rune.treeName} className="w-3 h-3 opacity-50" />
                    <h3 className="text-sm font-bold text-slate-700 truncate">{rune.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{cleanDescription(rune.longDesc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {filteredRunes.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Sparkles className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">見つかりませんでした</h3>
          <p className="text-slate-500">検索条件に一致するルーンがいません。</p>
        </div>
      )}
    </div>
  );
}
