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
 // Normalization to ignore half-width/full-width spaces
 const cleanStr = (s: string) => s.replace(/[\s\u3000]+/g, '').toLowerCase();
 const query = cleanStr(searchQuery);
 
 const matchesSearch = cleanStr(spell.nameJa).includes(query) || 
 cleanStr(spell.nameEn).includes(query) ||
 spell.id.includes(query) ||
 cleanStr(spell.descriptionJa).includes(query) ||
 cleanStr(spell.descriptionEn).includes(query);
 
 return matchesSearch;
 });

 // Sort spells
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
 <div className="space-y-8 max-w-full mx-auto px-4 py-6 pb-20 text-slate-100 bg-slate-950 min-h-screen">
 
 {/* Header Banner */}
 <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 shadow-2xl border border-indigo-500/20">
 <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
 <div className="relative z-10 space-y-4">
 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-black uppercase tracking-widest shadow-inner animate-pulse">
 <Sparkles size={14} className="text-indigo-400" />
 {locale === 'ja' ? 'ワイルドリフト データベース' : 'Wild Rift Database'}
 </div>
 <h1 className="text-3xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
 {locale === 'ja' ? 'サモナースペル一覧' : 'Summoner Spells'}
 </h1>
 <p className="text-slate-400 text-sm font-semibold leading-relaxed max-w-2xl">
 {locale === 'ja'
 ? 'ワイルドリフトに登場するすべてのサモナースペルの詳細効果、クールダウン、仕様を網羅したデータベースです。'
 : 'Detailed search database for all Summoner Spells in Wild Rift, including exact cooldowns and map mechanics.'}
 </p>
 </div>
 </div>

 {/* Toolbar */}
 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col items-stretch justify-between gap-4">
 
 {/* Search Input */}
 <div className="relative flex-1 max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
 <input 
 type="text"
 placeholder={locale === 'ja' ? 'スペル名や効果で検索...' : 'Search spells or effects...'}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 font-bold placeholder-slate-500 text-sm transition-all"
 />
 </div>

 {/* Sorting controls */}
 <div className="flex flex-wrap items-center gap-4">
 
 <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs font-extrabold text-slate-300">
 <ArrowUpDown size={14} className="text-slate-500" />
 <select 
 value={sortBy}
 onChange={(e) => setSortBy(e.target.value as any)}
 className="bg-transparent border-none outline-none cursor-pointer focus:ring-0 text-slate-200 font-bold"
 >
 <option value="cooldown" className="bg-slate-900">{locale === 'ja' ? 'クールダウン' : 'Cooldown'}</option>
 <option value="name" className="bg-slate-900">{locale === 'ja' ? '名前' : 'Name'}</option>
 </select>
 </div>

 <button
 onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
 className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 rounded-2xl text-xs font-black text-slate-300 hover:text-white flex items-center gap-1.5 transition-all select-none"
 title={sortOrder === 'desc' ? (locale === 'ja' ? '降順（長い順）' : 'Descending') : (locale === 'ja' ? '昇順（短い順）' : 'Ascending')}
 >
 <ArrowUpDown size={14} className={`text-indigo-400 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
 <span>
 {sortOrder === 'desc'
 ? (sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '長 → 短' : 'Long → Short'))
 : (sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '短 → 長' : 'Short → Long'))}
 </span>
 </button>

 </div>

 </div>

 {/* Spells Grid */}
 <div className="grid grid-cols-1 gap-4">
 {processedSpells.map(spell => (
 <button
 key={spell.id}
 onClick={() => setSelectedSpell(spell)}
 className="group bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-stretch text-left hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
 >
 <div className="flex items-center gap-4 mb-4 z-10">
 <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
 <img 
 src={spell.image}
 alt={locale === 'ja' ? spell.nameJa : spell.nameEn}
 className="w-full h-full object-cover"
 />
 </div>
 <div className="flex-1 min-w-0">
 <h3 className="font-black text-slate-100 text-base truncate group-hover:text-indigo-400 transition-colors">
 {locale === 'ja' ? spell.nameJa : spell.nameEn}
 </h3>
 <div className="flex items-center gap-1.5 mt-1">
 <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md px-1.5 py-0.5 flex items-center gap-1">
 <Clock size={10} />
 {spell.cooldown}s
 </span>
 </div>
 </div>
 </div>

 {/* Description Preview */}
 <div className="text-xs text-slate-400 font-semibold leading-relaxed flex-1 line-clamp-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/30">
 {locale === 'ja' ? spell.descriptionJa : spell.descriptionEn}
 </div>

 </button>
 ))}
 </div>

 {/* Modal Details Drawer */}
 {selectedSpell && (
 <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
 <div className="bg-slate-900 rounded-[2.5rem] w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-800 animate-scale-up">
 
 {/* Modal Header */}
 <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
 <div className="flex flex-col items-start gap-4">
 <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
 <img 
 src={selectedSpell.image}
 alt={locale === 'ja' ? selectedSpell.nameJa : selectedSpell.nameEn}
 className="w-full h-full object-cover"
 />
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-100">
 {locale === 'ja' ? selectedSpell.nameJa : selectedSpell.nameEn}
 </h2>
 <p className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-1.5">
 <Clock size={12} className="text-amber-500" />
 <span>
 {locale === 'ja' ? 'クールダウン' : 'Cooldown'}:{' '}
 <span className="text-amber-500 font-black">{selectedSpell.cooldown} {locale === 'ja' ? '秒' : 'seconds'}</span>
 </span>
 </p>
 </div>
 </div>
 <button 
 onClick={() => setSelectedSpell(null)}
 className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all"
 aria-label="Close details"
 >
 <X size={20} />
 </button>
 </div>

 {/* Modal Content */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 
 {/* Detailed description block */}
 <div className="space-y-3">
 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
 <Info size={14} className="text-indigo-400" />
 {locale === 'ja' ? '効果詳細' : 'Spell Effects'}
 </h4>
 <div className="bg-slate-950 border border-slate-850 p-5 rounded-3xl leading-relaxed text-sm font-semibold text-slate-200 whitespace-pre-line shadow-inner">
 {locale === 'ja' ? selectedSpell.descriptionJa : selectedSpell.descriptionEn}
 </div>
 </div>

 </div>

 {/* Modal Footer */}
 <div className="p-6 border-t border-slate-800/80 bg-slate-900/30 flex justify-end">
 <button
 onClick={() => setSelectedSpell(null)}
 className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-2xl text-xs font-black transition-all shadow-md"
 >
 {locale === 'ja' ? '閉じる' : 'Close'}
 </button>
 </div>

 </div>
 </div>
 )}

 </div>
 );
}
