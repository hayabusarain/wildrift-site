'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, Sparkles, X, Info, ArrowUpDown, Flame, Shield, Crosshair, Lightbulb, Zap, Hexagon } from 'lucide-react';
import runesData from '@/data/runes.json';

interface Rune {
 id: string;
 nameJa: string;
 nameEn: string;
 category: string;
 tree: string;
 image: string;
 descriptionJa: string;
 descriptionEn: string;
}

export default function RunesPage() {
 const locale = useLocale();
 const [runes] = useState<Rune[]>(runesData as Rune[]);
 const [searchQuery, setSearchQuery] = useState('');
 const [selectedRune, setSelectedRune] = useState<Rune | null>(null);
 const [activeTab, setActiveTab] = useState<'all' | 'keystones' | 'domination' | 'precision' | 'resolve' | 'inspiration'>('all');
 const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

 // Helper to resolve tree details (colors, translations)
 const getTreeDetails = (tree: string) => {
 switch (tree.toLowerCase()) {
 case 'domination':
 return {
 nameJa: '覇道',
 nameEn: 'Domination',
 color: 'rose',
 bg: 'bg-rose-500/10',
 border: 'border-rose-500/20',
 text: 'text-rose-400',
 badge: 'bg-rose-500/20 border-rose-500/30 text-rose-200',
 hoverBorder: 'group-hover:border-rose-500/40',
 glow: 'from-rose-500/0 to-rose-500/5',
 icon: <Flame size={14} className="text-rose-400" />
 };
 case 'precision':
 return {
 nameJa: '栄華',
 nameEn: 'Precision',
 color: 'amber',
 bg: 'bg-amber-500/10',
 border: 'border-amber-500/20',
 text: 'text-amber-400',
 badge: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
 hoverBorder: 'group-hover:border-amber-500/40',
 glow: 'from-amber-500/0 to-amber-500/5',
 icon: <Crosshair size={14} className="text-amber-400" />
 };
 case 'resolve':
 return {
 nameJa: '不滅',
 nameEn: 'Resolve',
 color: 'emerald',
 bg: 'bg-emerald-500/10',
 border: 'border-emerald-500/20',
 text: 'text-emerald-400',
 badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
 hoverBorder: 'group-hover:border-emerald-500/40',
 glow: 'from-emerald-500/0 to-emerald-500/5',
 icon: <Shield size={14} className="text-emerald-400" />
 };
 case 'inspiration':
 return {
 nameJa: '天啓',
 nameEn: 'Inspiration',
 color: 'cyan',
 bg: 'bg-cyan-500/10',
 border: 'border-cyan-500/20',
 text: 'text-cyan-400',
 badge: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200',
 hoverBorder: 'group-hover:border-cyan-500/40',
 glow: 'from-cyan-500/0 to-cyan-500/5',
 icon: <Lightbulb size={14} className="text-cyan-400" />
 };
 case 'sorcery':
 return {
 nameJa: '魔道',
 nameEn: 'Sorcery',
 color: 'indigo',
 bg: 'bg-indigo-500/10',
 border: 'border-indigo-500/20',
 text: 'text-indigo-400',
 badge: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200',
 hoverBorder: 'group-hover:border-indigo-500/40',
 glow: 'from-indigo-500/0 to-indigo-500/5',
 icon: <Zap size={14} className="text-indigo-400" />
 };
 default:
 return {
 nameJa: '一般',
 nameEn: 'General',
 color: 'slate',
 bg: 'bg-slate-500/10',
 border: 'border-slate-500/20',
 text: 'text-slate-400',
 badge: 'bg-slate-500/20 border-slate-500/30 text-slate-200',
 hoverBorder: 'group-hover:border-slate-500/40',
 glow: 'from-slate-500/0 to-slate-500/5',
 icon: <Hexagon size={14} className="text-slate-400" />
 };
 }
 };

 // Filter and sort runes
 const processedRunes = useMemo(() => {
 let result = runes.filter(rune => {
 // Tab Category Filtering
 if (activeTab === 'keystones' && rune.category !== 'Keystone') return false;
 if (activeTab === 'domination' && rune.tree !== 'Domination') return false;
 if (activeTab === 'precision' && rune.tree !== 'Precision') return false;
 if (activeTab === 'resolve' && rune.tree !== 'Resolve') return false;
 if (activeTab === 'inspiration' && rune.tree !== 'Inspiration') return false;

 // Text Query Filtering
 const cleanStr = (s: string) => s.replace(/[\s\u3000]+/g, '').toLowerCase();
 const query = cleanStr(searchQuery);
 
 const matchesSearch = cleanStr(rune.nameJa).includes(query) || 
 cleanStr(rune.nameEn).includes(query) ||
 rune.id.includes(query) ||
 cleanStr(rune.descriptionJa).includes(query) ||
 cleanStr(rune.descriptionEn).includes(query);
 
 return matchesSearch;
 });

 // Sort by name alphabetically
 result.sort((a, b) => {
 const nameA = locale === 'ja' ? a.nameJa : a.nameEn;
 const nameB = locale === 'ja' ? b.nameJa : b.nameEn;
 return sortOrder === 'asc'
 ? nameA.localeCompare(nameB, locale === 'ja' ? 'ja' : 'en')
 : nameB.localeCompare(nameA, locale === 'ja' ? 'ja' : 'en');
 });

 return result;
 }, [searchQuery, activeTab, sortOrder, runes, locale]);

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
 {locale === 'ja' ? 'ルーン一覧' : 'Runes'}
 </h1>
 <p className="text-slate-400 text-sm font-semibold leading-relaxed max-w-2xl">
 {locale === 'ja'
 ? 'ワイルドリフトに登場するすべてのキーストーン、マイナールーンの効果詳細、仕様を網羅したデータベースです。'
 : 'Detailed search database for all Keystones and Minor Runes in Wild Rift, matching official stats and scales.'}
 </p>
 </div>
 </div>

 {/* Toolbar */}
 <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col gap-5">
 
 {/* Category Tabs */}
 <div className="flex flex-wrap gap-2 border-b border-slate-800/80 pb-4">
 {[
 { id: 'all', labelJa: 'すべて', labelEn: 'All' },
 { id: 'keystones', labelJa: 'キーストーン', labelEn: 'Keystones' },
 { id: 'domination', labelJa: '覇道', labelEn: 'Domination' },
 { id: 'precision', labelJa: '栄華', labelEn: 'Precision' },
 { id: 'resolve', labelJa: '不滅', labelEn: 'Resolve' },
 { id: 'inspiration', labelJa: '天啓', labelEn: 'Inspiration' }
 ].map(tab => (
 <button
 key={tab.id}
 onClick={() => setActiveTab(tab.id as any)}
 className={`
 px-4 py-2 rounded-2xl text-xs font-black select-none transition-all duration-200 border
 ${activeTab === tab.id
 ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-950/30'
 : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
 }
 `}
 >
 {locale === 'ja' ? tab.labelJa : tab.labelEn}
 </button>
 ))}
 </div>

 <div className="flex flex-col items-stretch justify-between gap-4">
 
 {/* Search Input */}
 <div className="relative flex-1 max-w-md">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
 <input 
 type="text"
 placeholder={locale === 'ja' ? 'ルーン名や効果で検索...' : 'Search runes or effects...'}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 font-bold placeholder-slate-500 text-sm transition-all"
 />
 </div>

 {/* Sorting controls */}
 <div className="flex items-center gap-4">
 <button
 onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
 className="px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 rounded-2xl text-xs font-black text-slate-300 hover:text-white flex items-center gap-1.5 transition-all select-none"
 title={sortOrder === 'desc' ? (locale === 'ja' ? '降順（ん → あ）' : 'Descending') : (locale === 'ja' ? '昇順（あ → ん）' : 'Ascending')}
 >
 <ArrowUpDown size={14} className={`text-indigo-400 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
 <span>
 {sortOrder === 'desc'
 ? (locale === 'ja' ? 'ん → あ' : 'Z → A')
 : (locale === 'ja' ? 'あ → ん' : 'A → Z')}
 </span>
 </button>
 </div>

 </div>

 </div>

 {/* Runes Grid */}
 <div className="grid grid-cols-1 gap-4">
 {processedRunes.map(rune => {
 const tree = getTreeDetails(rune.tree);
 return (
 <button
 key={rune.id}
 onClick={() => setSelectedRune(rune)}
 className={`
 group bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col items-stretch text-left 
 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 relative overflow-hidden
 ${tree.hoverBorder}
 `}
 >
 {/* Dynamic Glow Background */}
 <div className={`absolute inset-0 bg-gradient-to-tr ${tree.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

 <div className="flex items-center gap-4 mb-4 z-10">
 <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
 <img 
 src={rune.image}
 alt={locale === 'ja' ? rune.nameJa : rune.nameEn}
 className="w-full h-full object-contain p-1"
 onError={(e) => {
 // Fallback to placeholder if icon missing
 (e.target as HTMLImageElement).src = '/images/runes/electrocute.png';
 }}
 />
 </div>
 <div className="flex-1 min-w-0">
 <h3 className={`font-black text-slate-100 text-base truncate group-hover:${tree.text} transition-colors`}>
 {locale === 'ja' ? rune.nameJa : rune.nameEn}
 </h3>
 <div className="flex items-center gap-1.5 mt-1">
 <span className={`text-[10px] font-black border rounded-md px-1.5 py-0.5 flex items-center gap-1 shrink-0 ${tree.badge}`}>
 {tree.icon}
 {locale === 'ja' ? tree.nameJa : tree.nameEn}
 </span>
 {rune.category === 'Keystone' && (
 <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md px-1.5 py-0.5 shrink-0">
 Keystone
 </span>
 )}
 </div>
 </div>
 </div>

 {/* Description Preview */}
 <div className="text-xs text-slate-400 font-semibold leading-relaxed flex-1 line-clamp-3 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/30">
 {locale === 'ja' ? rune.descriptionJa : rune.descriptionEn}
 </div>

 </button>
 );
 })}
 </div>

 {/* Modal Details Drawer */}
 {selectedRune && (() => {
 const tree = getTreeDetails(selectedRune.tree);
 return (
 <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
 <div className="bg-slate-900 rounded-[2.5rem] w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-800 animate-scale-up">
 
 {/* Modal Header */}
 <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
 <div className="flex flex-col items-start gap-4">
 <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950 shrink-0">
 <img 
 src={selectedRune.image}
 alt={locale === 'ja' ? selectedRune.nameJa : selectedRune.nameEn}
 className="w-full h-full object-contain p-1"
 onError={(e) => {
 (e.target as HTMLImageElement).src = '/images/runes/electrocute.png';
 }}
 />
 </div>
 <div>
 <h2 className="text-2xl font-black text-slate-100">
 {locale === 'ja' ? selectedRune.nameJa : selectedRune.nameEn}
 </h2>
 <div className="flex items-center gap-1.5 mt-2">
 <span className={`text-[10px] font-black border rounded-md px-2 py-0.5 flex items-center gap-1 shrink-0 ${tree.badge}`}>
 {tree.icon}
 {locale === 'ja' ? tree.nameJa : tree.nameEn}
 </span>
 {selectedRune.category === 'Keystone' && (
 <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md px-2 py-0.5 shrink-0">
 Keystone
 </span>
 )}
 </div>
 </div>
 </div>
 <button 
 onClick={() => setSelectedRune(null)}
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
 <Info size={14} className={tree.text} />
 {locale === 'ja' ? '効果詳細' : 'Rune Effects'}
 </h4>
 <div className="bg-slate-950 border border-slate-850 p-5 rounded-3xl leading-relaxed text-sm font-semibold text-slate-200 whitespace-pre-line shadow-inner">
 {locale === 'ja' ? selectedRune.descriptionJa : selectedRune.descriptionEn}
 </div>
 </div>

 </div>

 {/* Modal Footer */}
 <div className="p-6 border-t border-slate-800/80 bg-slate-900/30 flex justify-end">
 <button
 onClick={() => setSelectedRune(null)}
 className="px-5 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-2xl text-xs font-black transition-all shadow-md"
 >
 {locale === 'ja' ? '閉じる' : 'Close'}
 </button>
 </div>

 </div>
 </div>
 );
 })()}

 </div>
 );
}
