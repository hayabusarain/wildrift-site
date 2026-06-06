'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, Sparkles, X, Info, ArrowUpDown, Flame, Shield, Crosshair, Lightbulb, Zap, Hexagon, LayoutGrid, List } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  const getTreeDetails = (tree: string) => {
    switch (tree.toLowerCase()) {
      case 'domination':
        return {
          nameJa: '覇道',
          nameEn: 'Domination',
          badge: 'bg-rose-500/20 border-rose-500/30 text-rose-200',
          icon: <Flame size={12} className="text-rose-400" />
        };
      case 'precision':
        return {
          nameJa: '栄華',
          nameEn: 'Precision',
          badge: 'bg-amber-500/20 border-amber-500/30 text-amber-200',
          icon: <Crosshair size={12} className="text-amber-400" />
        };
      case 'resolve':
        return {
          nameJa: '不滅',
          nameEn: 'Resolve',
          badge: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-200',
          icon: <Shield size={12} className="text-emerald-400" />
        };
      case 'inspiration':
        return {
          nameJa: '天啓',
          nameEn: 'Inspiration',
          badge: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-200',
          icon: <Lightbulb size={12} className="text-cyan-400" />
        };
      case 'sorcery':
        return {
          nameJa: '魔道',
          nameEn: 'Sorcery',
          badge: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-200',
          icon: <Zap size={12} className="text-indigo-400" />
        };
      default:
        return {
          nameJa: '一般',
          nameEn: 'General',
          badge: 'bg-slate-500/20 border-slate-500/30 text-slate-200',
          icon: <Hexagon size={12} className="text-slate-400" />
        };
    }
  };

  const processedRunes = useMemo(() => {
    let result = runes.filter(rune => {
      if (activeTab === 'keystones' && rune.category !== 'Keystone') return false;
      if (activeTab === 'domination' && rune.tree !== 'Domination') return false;
      if (activeTab === 'precision' && rune.tree !== 'Precision') return false;
      if (activeTab === 'resolve' && rune.tree !== 'Resolve') return false;
      if (activeTab === 'inspiration' && rune.tree !== 'Inspiration') return false;

      const cleanStr = (s: string) => s.replace(/[\s\u3000]+/g, '').toLowerCase();
      const query = cleanStr(searchQuery);
      
      return cleanStr(rune.nameJa).includes(query) || 
             cleanStr(rune.nameEn).includes(query) ||
             rune.id.includes(query) ||
             cleanStr(rune.descriptionJa).includes(query) ||
             cleanStr(rune.descriptionEn).includes(query);
    });

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
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1">
          {locale === 'ja' ? 'ルーン一覧' : 'Runes List'}
        </h1>
        <p className="text-slate-500 text-xs font-bold leading-relaxed">
          {locale === 'ja'
            ? 'キーストーンとマイナールーンの効果詳細'
            : 'Detailed search for Keystones and Minor Runes'}
        </p>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          
          {/* Swipeable Category Tabs */}
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 -mx-4 px-4 scroll-smooth">
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
                  snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold select-none transition-all border shrink-0
                  ${activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50'
                  }
                `}
              >
                {locale === 'ja' ? tab.labelJa : tab.labelEn}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder={locale === 'ja' ? 'ルーン名や効果で検索...' : 'Search runes...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-400 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all shadow-inner"
              />
            </div>

            {/* Sorting controls */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 active:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all select-none whitespace-nowrap shadow-sm"
            >
              <ArrowUpDown size={14} className={`text-indigo-600 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              <span>
                {sortOrder === 'desc'
                  ? (locale === 'ja' ? '降順 (ん → あ)' : 'Z → A')
                  : (locale === 'ja' ? '昇順 (あ → ん)' : 'A → Z')}
              </span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setViewMode('compact')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                viewMode === 'compact'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid size={14} />
              {locale === 'ja' ? 'シンプル' : 'Compact'}
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                viewMode === 'detailed'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <List size={14} />
              {locale === 'ja' ? '詳細' : 'Detailed'}
            </button>
          </div>
        </div>

        {/* Runes Grid */}
        <div className={`grid gap-3 ${viewMode === 'compact' ? 'grid-cols-4' : 'grid-cols-1'}`}>
          {processedRunes.map(rune => {
            const tree = getTreeDetails(rune.tree);
            // Translate badges to light mode
            const getLightBadge = (t: string) => {
              if (t === 'Domination') return 'bg-rose-50 border-rose-200 text-rose-700';
              if (t === 'Precision') return 'bg-amber-50 border-amber-200 text-amber-700';
              if (t === 'Resolve') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
              if (t === 'Inspiration') return 'bg-cyan-50 border-cyan-200 text-cyan-700';
              if (t === 'Sorcery') return 'bg-indigo-50 border-indigo-200 text-indigo-700';
              return 'bg-slate-100 border-slate-200 text-slate-700';
            };
            const getLightIconColor = (t: string) => {
              if (t === 'Domination') return 'text-rose-500';
              if (t === 'Precision') return 'text-amber-500';
              if (t === 'Resolve') return 'text-emerald-500';
              if (t === 'Inspiration') return 'text-cyan-500';
              if (t === 'Sorcery') return 'text-indigo-500';
              return 'text-slate-500';
            };

            const lightBadge = getLightBadge(rune.tree);
            const iconColor = getLightIconColor(rune.tree);

            if (viewMode === 'compact') {
              return (
                <button
                  key={rune.id}
                  onClick={() => setSelectedRune(rune)}
                  className="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner shrink-0 mb-1.5 p-1.5">
                    <img 
                      src={rune.image}
                      alt={locale === 'ja' ? rune.nameJa : rune.nameEn}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/runes/electrocute.png';
                      }}
                    />
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-[10px] leading-tight w-full truncate px-0.5">
                    {locale === 'ja' ? rune.nameJa : rune.nameEn}
                  </h3>
                </button>
              );
            }

            return (
              <button
                key={rune.id}
                onClick={() => setSelectedRune(rune)}
                className="group bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-stretch text-left active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-4 mb-3 z-10">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-inner shrink-0 p-1.5">
                    <img 
                      src={rune.image}
                      alt={locale === 'ja' ? rune.nameJa : rune.nameEn}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/runes/electrocute.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-base truncate">
                      {locale === 'ja' ? rune.nameJa : rune.nameEn}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <span className={`text-[10px] font-black border rounded px-1.5 py-0.5 flex items-center gap-1 shrink-0 ${lightBadge}`}>
                        <div className={iconColor}>{tree.icon}</div>
                        {locale === 'ja' ? tree.nameJa : tree.nameEn}
                      </span>
                      {rune.category === 'Keystone' && (
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 rounded px-2 py-0.5 shrink-0 shadow-sm">
                          Keystone
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium leading-relaxed flex-1 line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {locale === 'ja' ? rune.descriptionJa : rune.descriptionEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Details Drawer */}
      {selectedRune && (() => {
        const tree = getTreeDetails(selectedRune.tree);
        const getLightBadge = (t: string) => {
          if (t === 'Domination') return 'bg-rose-50 border-rose-200 text-rose-700';
          if (t === 'Precision') return 'bg-amber-50 border-amber-200 text-amber-700';
          if (t === 'Resolve') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
          if (t === 'Inspiration') return 'bg-cyan-50 border-cyan-200 text-cyan-700';
          if (t === 'Sorcery') return 'bg-indigo-50 border-indigo-200 text-indigo-700';
          return 'bg-slate-100 border-slate-200 text-slate-700';
        };
        const getLightIconColor = (t: string) => {
          if (t === 'Domination') return 'text-rose-500';
          if (t === 'Precision') return 'text-amber-500';
          if (t === 'Resolve') return 'text-emerald-500';
          if (t === 'Inspiration') return 'text-cyan-500';
          if (t === 'Sorcery') return 'text-indigo-500';
          return 'text-slate-500';
        };

        const lightBadge = getLightBadge(selectedRune.tree);
        const iconColor = getLightIconColor(selectedRune.tree);

        return (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-0 pb-0 transition-opacity">
            <div className="bg-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300">
              
              <div className="w-full flex justify-center py-4 cursor-pointer" onClick={() => setSelectedRune(null)}>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between px-6 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0 p-2">
                    <img 
                      src={selectedRune.image}
                      alt={locale === 'ja' ? selectedRune.nameJa : selectedRune.nameEn}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/runes/electrocute.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <h2 className="text-xl font-black text-slate-900 leading-tight truncate">
                      {locale === 'ja' ? selectedRune.nameJa : selectedRune.nameEn}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs font-black border rounded-lg px-2 py-0.5 flex items-center gap-1.5 shrink-0 ${lightBadge}`}>
                        <div className={iconColor}>{tree.icon}</div>
                        {locale === 'ja' ? tree.nameJa : tree.nameEn}
                      </span>
                      {selectedRune.category === 'Keystone' && (
                        <span className="text-xs font-black text-amber-700 bg-amber-100 border border-amber-200 rounded-lg px-2 py-0.5 shrink-0 shadow-sm">
                          Keystone
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedRune(null)}
                  className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full shrink-0 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pb-8 bg-slate-50">
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Info size={14} />
                    {locale === 'ja' ? '効果詳細' : 'Rune Effects'}
                  </h4>
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl text-sm leading-loose font-medium text-slate-700 whitespace-pre-line shadow-sm">
                    {locale === 'ja' ? selectedRune.descriptionJa : selectedRune.descriptionEn}
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
