'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { Search, Trophy, ShoppingBag, X, SlidersHorizontal, ArrowUpDown, Sparkles, Award, Layers, HelpCircle, ChevronDown, ChevronUp, Info, LayoutGrid, List } from 'lucide-react';
import itemsData from '@/data/physical_items_final.json';

interface Passive {
  name: string;
  description: string;
  nameEn?: string;
  descriptionEn?: string;
}

interface Item {
  id: string;
  nameJa: string;
  nameEn: string;
  gold: number;
  image: string;
  isCompleted: boolean;
  stats: string[];
  statsEn?: string[];
  passives: Passive[];
}

function getStatValue(item: Item, key: string, allItems?: Item[]): number {
  if (key === 'gold') return item.gold;

  if (item.nameJa === 'ロッド オブ エイジス' || item.nameJa === 'ロッドオブエイジス') {
    if (key === 'hp') return 500;
    if (key === 'mana') return 400;
    if (key === 'ap') return 120;
  }

  if (item.nameJa === 'メジャイ ソウルスティーラー' || item.nameJa === 'メジャイソウルスティーラー') {
    if (key === 'ap') return 175;
    if (key === 'ms' || key === 'speed') return 10;
  }

  if (allItems && key !== 'gold' && key !== 'name') {
    let evoName = '';
    if (item.nameJa === 'マナムネ') evoName = 'ムラマナ';
    else if (item.nameJa === '冬の訪れ') evoName = 'フィンブルウィンター';
    else if (item.nameJa === 'レリックシールド') evoName = '霊峰の砦';
    else if (item.nameJa === '霊者の鎌') evoName = '黒き霧の大鎌';
    else if (item.nameJa === 'アークエンジェル スタッフ' || item.nameJa === 'アークエンジェルスタッフ') {
      evoName = 'セラフ エンブレイス';
    }
    
    if (evoName) {
      const evoItem = allItems.find(i => i.nameJa === evoName || (evoName === 'セラフ エンブレイス' && i.nameJa === 'セラフエンブレイス'));
      if (evoItem) item = evoItem;
    }
  }

  let pattern = '';
  if (key === 'ad') pattern = '攻撃力';
  else if (key === 'ap') pattern = '魔力';
  else if (key === 'as') pattern = '攻撃速度';
  else if (key === 'crit') pattern = 'クリティカル率';
  else if (key === 'hp') pattern = '体力';
  else if (key === 'ar') pattern = '物理防御';
  else if (key === 'mr') pattern = '魔法防御';
  else if (key === 'haste') pattern = 'ヘイスト';
  else if (key === 'mana') pattern = 'マナ';

  if (!pattern) return 0;

  const stat = item.stats.find(s => s.includes(pattern) && !s.includes('貫通') && !s.includes('自動回復'));
  if (stat) {
    const match = stat.match(/[-+]?\d+(?:\.\d+)?/);
    if (match) return parseFloat(match[0]);
  }

  if ((key === 'ad' || key === 'ap') && item.passives && Array.isArray(item.passives)) {
    for (const p of item.passives) {
      const text = (p.name + ' ' + p.description).toLowerCase();
      const regexStr1 = pattern + '(?:が|は|を|の|\\s)*?([-\\+]?\\d+(?:\\.\\d+)?)(?!\\s*[%％])';
      const regex1 = new RegExp(regexStr1, 'gi');
      let match1;
      while ((match1 = regex1.exec(text)) !== null) {
        const val = parseFloat(match1[1]);
        const matchedIndex = match1.index;
        const matchedStr = match1[0];
        const contextAfter = text.substring(matchedIndex + matchedStr.length, matchedIndex + matchedStr.length + 30);
        
        const isDebuff = contextAfter.includes('低下') || contextAfter.includes('減少') || contextAfter.includes('奪') || contextAfter.includes('失') || contextAfter.includes('スロウ');
        const isNotStat = /^\s*(秒|回|倍|スタック|％|%|段階|ゴールド|g)/.test(contextAfter);
        const isPercent = /^\s*[%％]/.test(contextAfter);
        const isScaling = contextAfter.includes('ダメージ') || contextAfter.includes('物理') || contextAfter.includes('魔法') || contextAfter.includes('シールド') || contextAfter.includes('回復') || contextAfter.includes('にあたる') || contextAfter.includes('に等しい') || contextAfter.includes('の耐久値') || contextAfter.includes('のシールド');
        
        if (!isDebuff && !isNotStat && !isPercent && !isScaling) return val;
      }
    }
  }
  return 0;
}

export default function ItemsPage() {
  const locale = useLocale();
  const [items, setItems] = useState<Item[]>(itemsData as Item[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'ad' | 'ap' | 'as' | 'crit' | 'pen' | 'mpen' | 'hp' | 'ar' | 'mr' | 'haste' | 'mana'>('all');
  const [sortBy, setSortBy] = useState<'gold' | 'ad' | 'ap' | 'as' | 'crit' | 'hp' | 'ar' | 'mr' | 'haste' | 'mana' | 'name'>('gold');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'core' | 'intermediate' | 'basic' | 'boots'>('core');
  const [showHelp, setShowHelp] = useState(false);
  const [viewMode, setViewMode] = useState<'compact' | 'detailed'>('compact');
  
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStats, setEditingStats] = useState<string[]>([]);
  const [editingPassives, setEditingPassives] = useState<Passive[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.'));
    setIsDevelopment(isLocal);
  }, []);

  const startEditing = () => {
    if (selectedItem) {
      setEditingStats([...selectedItem.stats]);
      setEditingPassives(selectedItem.passives.map(p => ({ ...p })));
      setIsEditing(true);
    }
  };

  const handleSave = async () => {
    if (!selectedItem) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: selectedItem.id, stats: editingStats, passives: editingPassives })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const updatedItems = items.map(item => item.id === selectedItem.id ? { ...item, stats: editingStats, passives: editingPassives } : item);
        setItems(updatedItems);
        setSelectedItem({ ...selectedItem, stats: editingStats, passives: editingPassives });
        setIsEditing(false);
        alert('保存完了しました！');
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (err: any) {
      alert(`通信エラー: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const isBootEnchantment = useMemo(() => {
    if (!selectedItem) return false;
    const enchantments = ['ステイシス', 'クイックシルバー', 'ヴェール', 'グローリー', 'ゲイルフォース', 'ゴアドリンカー', 'ストーンプレート', 'ストライドブレイカー', 'ドリームメーカー', 'プロトベルト', 'ロケット'];
    return enchantments.includes(selectedItem.nameJa);
  }, [selectedItem]);

  const evolutionItem = useMemo(() => {
    if (!selectedItem) return null;
    if (selectedItem.nameJa === 'マナムネ') return items.find(i => i.nameJa === 'ムラマナ');
    if (selectedItem.nameJa === '冬の訪れ') return items.find(i => i.nameJa === 'フィンブルウィンター');
    if (selectedItem.nameJa === 'レリックシールド') return items.find(i => i.nameJa === '霊峰の砦');
    if (selectedItem.nameJa === '霊者の鎌') return items.find(i => i.nameJa === '黒き霧の大鎌');
    if (selectedItem.nameJa === 'アークエンジェル スタッフ' || selectedItem.nameJa === 'アークエンジェルスタッフ') return items.find(i => i.nameJa === 'セラフ エンブレイス' || i.nameJa === 'セラフエンブレイス');
    return null;
  }, [selectedItem, items]);

  const baseItem = useMemo(() => {
    if (!selectedItem) return null;
    if (selectedItem.nameJa === 'ムラマナ') return items.find(i => i.nameJa === 'マナムネ');
    if (selectedItem.nameJa === 'フィンブルウィンター') return items.find(i => i.nameJa === '冬の訪れ');
    if (selectedItem.nameJa === '霊峰の砦') return items.find(i => i.nameJa === 'レリックシールド');
    if (selectedItem.nameJa === '黒き霧の大鎌') return items.find(i => i.nameJa === '霊者の鎌');
    if (selectedItem.nameJa === 'セラフ エンブレイス' || selectedItem.nameJa === 'セラフエンブレイス') return items.find(i => i.nameJa === 'アークエンジェル スタッフ' || i.nameJa === 'アークエンジェルスタッフ');
    return null;
  }, [selectedItem, items]);

  const getStatEmoji = (statText: string) => {
    const text = statText.toLowerCase();
    if (text.includes('攻撃力') || text.includes('ad')) return '⚔️';
    if (text.includes('体力') || text.includes('hp')) return '❤️';
    if (text.includes('攻撃速度') || text.includes('速度') || text.includes('speed')) return '⚡';
    if (text.includes('クリティカル') || text.includes('crit')) return '✨';
    if (text.includes('貫通') || text.includes('脅威') || text.includes('pen') || text.includes('lethality')) return '🎯';
    if (text.includes('ヘイスト') || text.includes('haste') || text.includes('⏳')) return '⏳';
    if (text.includes('物理防御') || text.includes('防御') || text.includes('armor')) return '🛡️';
    if (text.includes('魔法防御') || text.includes('mr')) return '🔮';
    if (text.includes('スティール') || text.includes('吸血') || text.includes('vamp')) return '🩸';
    if (text.includes('移動') || text.includes('ms')) return '👟';
    if (text.includes('マナ') || text.includes('mana')) return '💧';
    if (text.includes('魔力') || text.includes('ap')) return '🌟';
    return '🔸';
  };

  const processedItems = useMemo(() => {
    let result = items.filter(item => {
      if (['ムラマナ', 'フィンブルウィンター', '霊峰の砦', '黒き霧の大鎌', 'セラフ エンブレイス', 'セラフエンブレイス'].includes(item.nameJa)) return false;

      const cleanStr = (s: string) => s.replace(/[\s\u3000]+/g, '').toLowerCase();
      const query = cleanStr(searchQuery);
      if (!(cleanStr(item.nameJa).includes(query) || cleanStr(item.nameEn).includes(query) || item.id.includes(query))) return false;
      
      const isBoot = (item: Item) => {
        const name = item.nameJa;
        const enchantments = ['ステイシス', 'クイックシルバー', 'ヴェール', 'グローリー', 'ゲイルフォース', 'ゴアドリンカー', 'ストーンプレート', 'ストライドブレイカー', 'ドリームメーカー', 'プロトベルト', 'ロケット'];
        return name.includes('ブーツ') || name.includes('スチールキャップ') || enchantments.includes(name);
      };

      if (filterCompleted === 'boots') {
        if (!isBoot(item)) return false;
      } else {
        if (isBoot(item) && filterCompleted !== 'all') return false;
        const isOrnn = item.id.startsWith('7');
        if (filterCompleted === 'core' && item.gold < 2000 && !isOrnn) return false;
        else if (filterCompleted === 'intermediate' && (item.gold <= 500 || item.gold >= 2000 || isOrnn)) return false;
        else if (filterCompleted === 'basic' && (item.gold > 500 || isOrnn)) return false;
      }
      
      if (activeTab !== 'all') {
        const statsStr = item.stats.join(' ').toLowerCase();
        const passivesStr = item.passives.map(p => (p.name + ' ' + p.description)).join(' ').toLowerCase();
        const combined = statsStr + ' ' + passivesStr;
        
        if (activeTab === 'ad' && !combined.includes('攻撃力') && !combined.includes('ad')) return false;
        if (activeTab === 'ap' && !combined.includes('魔力') && !combined.includes('ap')) return false;
        if (activeTab === 'as' && !statsStr.includes('攻撃速度') && !statsStr.includes('speed')) return false;
        if (activeTab === 'crit' && !statsStr.includes('クリティカル率') && !statsStr.includes('crit')) return false;
        if (activeTab === 'pen' && !combined.includes('物理防御貫通') && !combined.includes('armorpen')) return false;
        if (activeTab === 'mpen' && !combined.includes('魔法防御貫通') && !combined.includes('magicpen')) return false;
        if (activeTab === 'hp' && !item.stats.some(s => (s.includes('体力') || s.toLowerCase().includes('hp') || s.toLowerCase().includes('health')) && !s.includes('自動回復'))) return false;
        if (activeTab === 'ar' && (!statsStr.includes('物理防御') || statsStr.includes('貫通')) && (!statsStr.includes('armor') || statsStr.includes('pen'))) return false;
        if (activeTab === 'mr' && (!statsStr.includes('魔法防御') || statsStr.includes('貫通')) && (!statsStr.includes('mr') || statsStr.includes('pen'))) return false;
        if (activeTab === 'haste' && !statsStr.includes('ヘイスト') && !statsStr.includes('haste')) return false;
        if (activeTab === 'mana' && !item.stats.some(s => (s.includes('マナ') || s.toLowerCase().includes('mana')) && !s.includes('自動回復'))) return false;
      }
      return true;
    });
    
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' ? a.nameJa.localeCompare(b.nameJa) : b.nameJa.localeCompare(a.nameJa);
      }
      const valA = getStatValue(a, sortBy, items);
      const valB = getStatValue(b, sortBy, items);
      if (valA === valB) return b.gold - a.gold || a.nameJa.localeCompare(b.nameJa);
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
    return result;
  }, [searchQuery, activeTab, sortBy, sortOrder, filterCompleted, items]);

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          {locale === 'ja' ? 'アイテム一覧' : 'Items List'}
        </h1>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Help Panel Toggle */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full px-4 py-3 flex items-center justify-between text-left active:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 text-indigo-500">
              <HelpCircle size={16} />
              <span className="font-bold text-xs text-slate-700">
                {locale === 'ja' ? 'データベース仕様とソートについて' : 'Database & Sorting Info'}
              </span>
            </div>
            <div className="text-slate-400">
              {showHelp ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {showHelp && (
            <div className="px-4 pb-4 pt-2 border-t border-slate-100 text-slate-600 text-[11px] space-y-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="font-black text-indigo-600 flex items-center gap-1 mb-1.5"><Sparkles size={12}/>パッシブ効果によるステータス上昇の考慮</h4>
                <p className="leading-relaxed">グインソーやナッシャートゥース等、パッシブ効果で増加するAD/APも自動検出してソートに反映されます。</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="font-black text-indigo-600 flex items-center gap-1 mb-1.5"><Layers size={12}/>進化アイテムのソート基準</h4>
                <p className="leading-relaxed">マナムネ等の進化アイテムは、進化後（ムラマナ等）の最大ステータス値を基準にソートされます。</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <h4 className="font-black text-indigo-600 flex items-center gap-1 mb-1.5"><Trophy size={12}/>スタック系アイテムのソート基準</h4>
                <p className="leading-relaxed">ロッドオブエイジス等は最大スタック時の合計最大ステータスを基準とします。</p>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4">
          
          {/* Search Input */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder={locale === 'ja' ? 'アイテム名で検索...' : 'Search items...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-xl focus:border-slate-300 focus:bg-white outline-none text-slate-800 font-bold placeholder-slate-400 text-sm transition-all"
            />
          </div>

          {/* Completion Carousel */}
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 -mx-4 px-4 scroll-smooth">
            {[
              { id: 'core', label: locale === 'ja' ? 'コア' : 'Core' },
              { id: 'intermediate', label: locale === 'ja' ? '中級' : 'Mid' },
              { id: 'basic', label: locale === 'ja' ? '基本' : 'Basic' },
              { id: 'boots', label: locale === 'ja' ? 'ブーツ' : 'Boots' },
              { id: 'all', label: locale === 'ja' ? 'すべて' : 'All' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterCompleted(tab.id as any)}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  filterCompleted === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Stats Carousel */}
          <div className="flex overflow-x-auto snap-x hide-scrollbar gap-2 pb-1 -mx-4 px-4 scroll-smooth">
            {[
              { id: 'all', label: locale === 'ja' ? 'すべての効果' : 'All Stats' },
              { id: 'ad', label: locale === 'ja' ? '攻撃力 (AD)' : 'AD' },
              { id: 'ap', label: locale === 'ja' ? '魔力 (AP)' : 'AP' },
              { id: 'as', label: locale === 'ja' ? '攻撃速度 (AS)' : 'AS' },
              { id: 'crit', label: locale === 'ja' ? 'クリティカル' : 'Crit' },
              { id: 'pen', label: locale === 'ja' ? '物理貫通' : 'ArPen' },
              { id: 'mpen', label: locale === 'ja' ? '魔法貫通' : 'MaPen' },
              { id: 'hp', label: locale === 'ja' ? '体力 (HP)' : 'HP' },
              { id: 'ar', label: locale === 'ja' ? '物理防御 (AR)' : 'Armor' },
              { id: 'mr', label: locale === 'ja' ? '魔法防御 (MR)' : 'MR' },
              { id: 'haste', label: locale === 'ja' ? 'ヘイスト' : 'Haste' },
              { id: 'mana', label: locale === 'ja' ? 'マナ' : 'Mana' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`snap-start whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 active:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sorting controls */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 w-full flex-1">
              <ArrowUpDown size={16} className="text-slate-400 shrink-0" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none outline-none focus:ring-0 text-slate-800 font-bold w-full text-sm"
              >
                <option value="gold">ゴールド順</option>
                <option value="ad">攻撃力順</option>
                <option value="ap">魔力順</option>
                <option value="as">攻撃速度順</option>
                <option value="crit">クリティカル率順</option>
                <option value="hp">体力順</option>
                <option value="ar">物理防御順</option>
                <option value="mr">魔法防御順</option>
                <option value="haste">スキルヘイスト順</option>
                <option value="mana">マナ順</option>
                <option value="name">名前順</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 active:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all select-none whitespace-nowrap"
            >
              <ArrowUpDown size={14} className={`text-indigo-600 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              <span>
                {sortOrder === 'desc' ? '降順 (高い・大きい)' : '昇順 (低い・小さい)'}
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

        {/* Items Grid */}
        <div className={`grid gap-3 ${viewMode === 'compact' ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {processedItems.map(item => {
            const isOrnn = item.id.startsWith('7');
            
            if (viewMode === 'compact') {
              return (
                <button
                  key={item.id}
                  onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                  className="group bg-white border border-slate-200 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center active:scale-[0.98] transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  {isOrnn && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none rounded-bl-full border-l border-b border-amber-500/20" />
                  )}
                  
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0 mb-1.5">
                    <img 
                      src={
                        item.image === 'default_item.png'
                          ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                          : item.image.startsWith('/')
                          ? item.image
                          : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image}`
                      }
                      alt={locale === 'ja' ? item.nameJa : item.nameEn}
                      className="w-full h-full object-cover scale-110"
                      onError={(e) => { e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'; }}
                    />
                  </div>
                  
                  <h3 className="font-bold text-slate-900 text-[10px] leading-tight w-full truncate px-0.5">
                    {locale === 'ja' ? item.nameJa : item.nameEn}
                  </h3>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                className="group bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col items-stretch text-left active:scale-95 transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md"
              >
                {isOrnn && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none rounded-bl-full border-l border-b border-amber-500/20" />
                )}
                
                <div className="flex items-center gap-3 mb-3 z-10">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner shrink-0">
                    <img 
                      src={
                        item.image === 'default_item.png'
                          ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                          : item.image.startsWith('/')
                          ? item.image
                          : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image}`
                      }
                      alt={locale === 'ja' ? item.nameJa : item.nameEn}
                      className="w-full h-full object-cover scale-110"
                      onError={(e) => { e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-slate-900 text-xs truncate leading-tight">
                      {locale === 'ja' ? item.nameJa : item.nameEn}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 leading-none">
                        {item.gold}G
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1.5 z-10">
                  {item.stats.length > 0 ? (
                    (locale === 'en' && item.statsEn && item.statsEn.length > 0 ? item.statsEn : item.stats).slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="text-[10px] text-slate-600 font-bold flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                        <span>{getStatEmoji(stat)}</span>
                        <span className="truncate">{stat}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      {locale === 'ja' ? '特殊効果のみ' : 'Passive Only'}
                    </div>
                  )}
                  {item.stats.length > 3 && (
                    <div className="text-[9px] text-indigo-500 font-bold pl-1 pt-0.5">
                      {locale === 'ja' ? `+ 他 ${item.stats.length - 3} 件のステータス` : `+ ${item.stats.length - 3} More Stats`}
                    </div>
                  )}
                </div>
                
                {item.passives.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold z-10">
                    <span className="flex items-center gap-1">
                      <Layers size={12} className="text-indigo-500" />
                      {locale === 'ja' ? '特殊効果' : 'Passive'}
                    </span>
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-black">
                      {item.passives.length}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end justify-center z-50 p-0 pb-0 transition-opacity">
          <div className="bg-white w-full max-w-md h-[85vh] rounded-t-3xl shadow-2xl flex flex-col relative animate-in slide-in-from-bottom duration-300">
            
            <div className="w-full flex justify-center py-4 cursor-pointer" onClick={() => { setSelectedItem(null); setIsEditing(false); }}>
              <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="flex items-start justify-between px-6 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 shrink-0">
                  <img 
                    src={
                      selectedItem.image === 'default_item.png'
                        ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                        : selectedItem.image.startsWith('/')
                        ? selectedItem.image
                        : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${selectedItem.image}`
                    }
                    alt={selectedItem.nameJa}
                    className="w-full h-full object-cover scale-110"
                    onError={(e) => { e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'; }}
                  />
                </div>
                <div className="min-w-0 flex-1 pr-2">
                  <h2 className="text-lg font-black text-slate-900 leading-tight mb-1">
                    {selectedItem.nameJa}
                  </h2>
                  {selectedItem.id.startsWith('7') && (
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 border border-amber-200 rounded inline-flex px-2 py-0.5 items-center gap-1 mb-1">
                      <Award size={12} />
                      傑作アイテム
                    </span>
                  )}
                  <p className="text-xs text-slate-500 font-bold">
                    コスト: <span className="text-amber-600 font-black">{selectedItem.gold} G</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <button 
                  onClick={() => { setSelectedItem(null); setIsEditing(false); }}
                  className="p-2 text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                {isDevelopment && (
                  <button
                    onClick={isEditing ? handleSave : startEditing}
                    disabled={isSaving}
                    className={`text-[10px] font-black px-3 py-1.5 rounded-lg border transition-colors ${isEditing ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                  >
                    {isSaving ? '...' : isEditing ? '保存' : '編集'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 pb-12 space-y-8 bg-slate-50">
              
              {baseItem && (
                <button
                  onClick={() => { setSelectedItem(baseItem); setIsEditing(false); }}
                  className="w-full flex justify-center items-center gap-2 px-4 py-3 text-sm font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-xl active:bg-indigo-100 transition-colors"
                >
                  ← {baseItem.nameJa} (進化前) に戻る
                </button>
              )}

              {isBootEnchantment && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black text-indigo-700 flex items-center gap-1.5">
                    <SlidersHorizontal size={14} /> エンチャント効果
                  </h4>
                  <p className="text-xs text-indigo-900/80 font-bold leading-relaxed">
                    すべての2段階目ブーツに付与して合成可能です。
                  </p>
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>付与ステータス</span>
                  {isEditing && <button onClick={() => setEditingStats([...editingStats, ''])} className="text-indigo-600 font-bold">+ 追加</button>}
                </h4>
                {isEditing ? (
                  <div className="space-y-2">
                    {editingStats.map((stat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={stat} onChange={(e) => { const u=[...editingStats]; u[idx]=e.target.value; setEditingStats(u); }} className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <button onClick={() => setEditingStats(editingStats.filter((_, i) => i !== idx))} className="p-2 text-rose-500 bg-rose-50 rounded-lg"><X size={16}/></button>
                      </div>
                    ))}
                  </div>
                ) : selectedItem.stats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(locale === 'en' && selectedItem.statsEn && selectedItem.statsEn.length > 0 ? selectedItem.statsEn : selectedItem.stats).map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 flex items-center gap-3">
                        <span className="text-lg">{getStatEmoji(stat)}</span>
                        <span className="font-bold text-slate-700 text-sm">{stat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-sm py-2">{locale === 'ja' ? 'ステータスはありません。' : 'No stats.'}</div>
                )}
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex justify-between items-center">
                  <span>特殊効果 (パッシブ / アクティブ)</span>
                  {isEditing && <button onClick={() => setEditingPassives([...editingPassives, {name:'',description:''}])} className="text-indigo-600 font-bold">+ 追加</button>}
                </h4>
                {isEditing ? (
                  <div className="space-y-4">
                    {editingPassives.map((p, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50">
                        <div className="flex gap-2">
                          <input type="text" value={p.name} onChange={(e) => { const u=[...editingPassives]; u[idx]={...u[idx],name:e.target.value}; setEditingPassives(u); }} className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold outline-none focus:ring-2 focus:ring-indigo-500" placeholder="効果名" />
                          <button onClick={() => setEditingPassives(editingPassives.filter((_, i) => i !== idx))} className="p-2 text-rose-500 bg-rose-50 rounded-lg"><X size={16}/></button>
                        </div>
                        <textarea value={p.description} onChange={(e) => { const u=[...editingPassives]; u[idx]={...u[idx],description:e.target.value}; setEditingPassives(u); }} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 min-h-[80px] outline-none focus:ring-2 focus:ring-indigo-500" placeholder="説明" />
                      </div>
                    ))}
                  </div>
                ) : selectedItem.passives.length > 0 ? (
                  <div className="space-y-4">
                    {selectedItem.passives.map((p, idx) => {
                      const isActive = p.name.includes('発動効果') || p.name.includes('アクティブ');
                      const pName = locale === 'en' && p.nameEn ? p.nameEn : p.name;
                      const pDesc = locale === 'en' && p.descriptionEn ? p.descriptionEn : p.description;
                      
                      return (
                        <div key={idx} className={`border rounded-xl p-4 space-y-2 ${isActive ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-indigo-500'}`} />
                            <h5 className={`font-black text-sm ${isActive ? 'text-amber-800' : 'text-indigo-900'}`}>{pName}</h5>
                          </div>
                          <p className="text-sm text-slate-600 font-medium leading-relaxed whitespace-pre-wrap pl-4">{pDesc}</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-sm py-2">{locale === 'ja' ? '特殊効果はありません。' : 'No passives.'}</div>
                )}
              </div>

              {evolutionItem && (
                <div className="pt-4 space-y-3">
                  <h4 className="text-xs font-black text-amber-600 uppercase flex items-center gap-1.5 tracking-wider">
                    <Sparkles size={14} /> 自動進化先
                  </h4>
                  <button 
                    onClick={() => { setSelectedItem(evolutionItem); setIsEditing(false); }} 
                    className="w-full bg-white border border-amber-200 rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform text-left shadow-sm hover:shadow-md"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-300 shadow-inner bg-slate-50 shrink-0">
                      <img src={evolutionItem.image.startsWith('/') ? evolutionItem.image : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${evolutionItem.image}`} alt={evolutionItem.nameJa} className="w-full h-full object-cover scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-base font-black text-amber-700 mb-1">{evolutionItem.nameJa}</h5>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">詳細を表示</span>
                    </div>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
