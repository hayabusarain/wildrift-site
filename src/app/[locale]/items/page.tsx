'use client';

import { useEffect, useState, useMemo } from 'react';
import { Search, Package, Shield, Sword, Zap, Heart, Wind, Coins } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Link } from "@/i18n/routing";

interface ItemData {
  id: string;
  name: string;
  description: string;
  plaintext: string;
  gold: {
    base: number;
    total: number;
    purchasable: boolean;
  };
  tags: string[];
  image: {
    full: string;
  };
}

export default function ItemsPage() {
  const locale = useLocale();
  const [items, setItems] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    async function fetchItems() {
      try {
        const langCode = locale === 'ja' ? 'ja_JP' : 'en_US';
        const res = await fetch(`https://ddragon.leagueoflegends.com/cdn/14.8.1/data/${langCode}/item.json`);
        const data = await res.json();
        
        // Convert object to array and filter out non-purchasable or hidden items
        let itemsArray = Object.keys(data.data).map(key => ({
          id: key,
          ...data.data[key]
        })) as ItemData[];
        
        // Filter out items that are not purchasable in store or belong to specific modes
        itemsArray = itemsArray.filter(item => 
          item.gold.purchasable && 
          item.name && 
          item.gold.total > 0 && 
          !item.name.includes('Exclusive') &&
          !item.name.includes('Placeholder')
        );
        
        // Sort by total gold (expensive items first)
        itemsArray.sort((a, b) => b.gold.total - a.gold.total);
        
        setItems(itemsArray);
      } catch (err) {
        console.error('Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [locale]);

  const filters = [
    { id: 'All', label: 'すべて', icon: <Package size={16} /> },
    { id: 'Damage', label: '物理攻撃', icon: <Sword size={16} /> },
    { id: 'SpellDamage', label: '魔力', icon: <Zap size={16} /> },
    { id: 'Health', label: '体力', icon: <Heart size={16} /> },
    { id: 'Armor', label: '防御力', icon: <Shield size={16} /> },
    { id: 'Boots', label: 'ブーツ', icon: <Wind size={16} /> },
  ];

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.plaintext.toLowerCase().includes(searchQuery.toLowerCase());
                            
      let matchesFilter = true;
      if (activeFilter !== 'All') {
        matchesFilter = item.tags.includes(activeFilter);
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilter]);

  // Description cleanup (removes excess HTML tags from DD data)
  const cleanDescription = (html: string) => {
    let clean = html.replace(/<br>/g, '\n');
    clean = clean.replace(/<stats>/g, '<div class="text-emerald-400 font-bold mb-2">');
    clean = clean.replace(/<\/stats>/g, '</div>');
    clean = clean.replace(/<mainText>/g, '<div class="text-slate-200 text-sm leading-relaxed">');
    clean = clean.replace(/<\/mainText>/g, '</div>');
    clean = clean.replace(/<active>/g, '<span class="text-indigo-400 font-bold">発動効果: </span>');
    clean = clean.replace(/<passive>/g, '<span class="text-rose-400 font-bold">自動効果: </span>');
    clean = clean.replace(/<attention>/g, '<span class="text-orange-400 font-bold">');
    clean = clean.replace(/<\/attention>/g, '</span>');
    clean = clean.replace(/<font color='(.*?)'>/g, '<span>');
    clean = clean.replace(/<\/font>/g, '</span>');
    return { __html: clean };
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
            <Package size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Items</h1>
            <p className="text-slate-500 font-medium">アイテム図鑑 (PC版データ準拠)</p>
          </div>
        </div>

        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all"
            placeholder="アイテム名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Role Filters */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center justify-center gap-2 flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeFilter === filter.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {filter.icon}
            <span className="hidden sm:inline">{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className="group relative flex flex-col items-center cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm group-hover:border-indigo-500 transition-colors bg-slate-100">
              <img 
                src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image.full}`} 
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.png';
                }}
              />
            </div>
            
            <div className="mt-2 text-center w-full">
              <p className="text-xs font-bold text-slate-700 truncate px-1">{item.name}</p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Coins size={10} className="text-amber-500" />
                <span className="text-[10px] font-bold text-amber-600">{item.gold.total}</span>
              </div>
            </div>
            
            {/* Tooltip / Popover (Hover) */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-4 bg-slate-900 rounded-xl shadow-2xl border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4 className="text-sm font-bold text-white">{item.name}</h4>
                <div className="flex items-center gap-1 bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-400">
                  <Coins size={12} />
                  <span className="text-xs font-bold">{item.gold.total}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic leading-tight">{item.plaintext}</p>
              <div className="text-xs mt-2 border-t border-slate-700 pt-2" dangerouslySetInnerHTML={cleanDescription(item.description)} />
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <Package className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">見つかりませんでした</h3>
          <p className="text-slate-500">検索条件に一致するアイテムがいません。</p>
        </div>
      )}
    </div>
  );
}
