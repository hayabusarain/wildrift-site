'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, Sparkles, Clock, X, Info, ArrowUpDown } from 'lucide-react';
import spellsData from '@/data/summoner_spells.json';

interface SummonerSpell {
  id: string;
  nameJa: string;
  nameEn: string;
  cooldown: number;
  image: string;
  descriptionJa: string;
  descriptionEn: string;
}

export default function SpellsPage() {
  const locale = useLocale();
  const [spells] = useState<SummonerSpell[]>(spellsData as SummonerSpell[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpell, setSelectedSpell] = useState<SummonerSpell | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'cooldown'>('cooldown');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort spells
  const processedSpells = useMemo(() => {
    let result = spells.filter(spell => {
      const cleanStr = (s: string) => s.replace(/[\s\u3000]+/g, '').toLowerCase();
      const query = cleanStr(searchQuery);
      
      return cleanStr(spell.nameJa).includes(query) || 
             cleanStr(spell.nameEn).includes(query) ||
             spell.id.includes(query) ||
             cleanStr(spell.descriptionJa).includes(query) ||
             cleanStr(spell.descriptionEn).includes(query);
    });

    result.sort((a, b) => {
      if (sortBy === 'name') {
        const nameA = locale === 'ja' ? a.nameJa : a.nameEn;
        const nameB = locale === 'ja' ? b.nameJa : b.nameEn;
        return sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      } else {
        return sortOrder === 'desc'
          ? b.cooldown - a.cooldown
          : a.cooldown - b.cooldown;
      }
    });

    return result;
  }, [searchQuery, sortBy, sortOrder, spells, locale]);

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">
          {locale === 'ja' ? 'サモナースペル' : 'Summoner Spells'}
        </h1>
        <p className="text-slate-500 text-xs font-bold leading-relaxed">
          {locale === 'ja'
            ? 'すべてのサモナースペルの詳細効果とクールダウン'
            : 'Detailed search for all Summoner Spells'}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={locale === 'ja' ? '検索...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all shadow-inner"
            />
          </div>

          {/* Sorting controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 w-full shadow-sm">
              <ArrowUpDown size={14} className="text-indigo-600 shrink-0" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none outline-none focus:ring-0 text-slate-700 font-bold w-full text-xs"
              >
                <option value="cooldown" className="bg-slate-50">{locale === 'ja' ? 'クールダウン順' : 'Sort by Cooldown'}</option>
                <option value="name" className="bg-slate-50">{locale === 'ja' ? '名前順' : 'Sort by Name'}</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 active:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all select-none whitespace-nowrap shadow-sm"
            >
              <ArrowUpDown size={14} className={`text-indigo-600 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              <span>
                {sortOrder === 'desc'
                  ? (sortBy === 'name' ? (locale === 'ja' ? '降順 (ん → あ)' : 'Z → A') : (locale === 'ja' ? '降順 (長 → 短)' : 'Long → Short'))
                  : (sortBy === 'name' ? (locale === 'ja' ? '昇順 (あ → ん)' : 'A → Z') : (locale === 'ja' ? '昇順 (短 → 長)' : 'Short → Long'))}
              </span>
            </button>
          </div>
        </div>

        {/* Spells Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {processedSpells.map(spell => (
            <button
              key={spell.id}
              onClick={() => setSelectedSpell(spell)}
              className="group bg-white border border-slate-200 rounded-2xl p-3 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 mb-2">
                <img 
                  src={spell.image}
                  alt={locale === 'ja' ? spell.nameJa : spell.nameEn}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-bold text-slate-900 text-[11px] leading-tight w-full truncate px-1">
                {locale === 'ja' ? spell.nameJa : spell.nameEn}
              </h3>
            </button>
          ))}
        </div>
      </div>

      {/* Modal Details Drawer */}
      {selectedSpell && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-0 pb-0 transition-opacity">
          <div 
            className="bg-white w-full max-w-md h-[80vh] rounded-t-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300"
          >
            {/* Handle for swiping down (visual only) */}
            <div className="w-full flex justify-center py-4 cursor-pointer" onClick={() => setSelectedSpell(null)}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between px-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img 
                    src={selectedSpell.image}
                    alt={locale === 'ja' ? selectedSpell.nameJa : selectedSpell.nameEn}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h2 className="text-xl font-black text-slate-900 leading-tight truncate">
                    {locale === 'ja' ? selectedSpell.nameJa : selectedSpell.nameEn}
                  </h2>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 shadow-sm">
                    <Clock size={12} />
                    <span className="text-xs font-black">{selectedSpell.cooldown}s</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSpell(null)}
                className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full shrink-0 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pb-8 bg-slate-50">
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Info size={14} />
                  {locale === 'ja' ? '効果詳細' : 'Spell Effects'}
                </h4>
                <div className="bg-white border border-slate-200 p-5 rounded-2xl text-sm leading-loose font-medium text-slate-700 whitespace-pre-line shadow-sm">
                  {locale === 'ja' ? selectedSpell.descriptionJa : selectedSpell.descriptionEn}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
