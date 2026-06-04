'use client';
 
import { useState, useEffect, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Search, Trophy, ShoppingBag, X, SlidersHorizontal, ArrowUpDown, Sparkles, ShieldAlert, Award, Layers, HelpCircle, ChevronDown, ChevronUp, Info, LayoutGrid, List } from 'lucide-react';
import itemsData from '@/data/physical_items_final.json';
 
interface Passive {
  name: string;
  description: string;
}
 
interface Item {
  id: string;
  nameJa: string;
  nameEn: string;
  gold: number;
  image: string;
  isCompleted: boolean;
  stats: string[];
  passives: Passive[];
}
 
function getStatValue(item: Item, key: string, allItems?: Item[]): number {
  if (key === 'gold') return item.gold;
  
  // ロッド オブ エイジスは10スタック後の最大ステータスでソート順を評価する
  if (item.nameJa === 'ロッド オブ エイジス' || item.nameJa === 'ロッドオブエイジス') {
    if (key === 'hp') return 500;   // 基本250 + (スタック25 * 10)
    if (key === 'mana') return 400; // 基本300 + (スタック10 * 10)
    if (key === 'ap') return 120;   // 基本60 + (スタック6 * 10)
  }

  // メジャイ ソウルスティーラーは最大スタック（30スタック）後の最大ステータスでソート順を評価する
  if (item.nameJa === 'メジャイ ソウルスティーラー' || item.nameJa === 'メジャイソウルスティーラー') {
    if (key === 'ap') return 175;   // 基本25 + (スタック5 * 30)
    if (key === 'ms' || key === 'speed') return 10; // フィアー効果: 移動速度10%
  }

  // 進化後アイテムのステータスでソートするための解決処理
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
      if (evoItem) {
        item = evoItem;
      }
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

  // 1. statsから探す
  const stat = item.stats.find(s => s.includes(pattern) && !s.includes('貫通') && !s.includes('自動回復'));
  if (stat) {
    const match = stat.match(/[-+]?\d+(?:\.\d+)?/);
    if (match) {
      return parseFloat(match[0]);
    }
  }

  // 2. statsになければパッシブから探す（※攻撃力・魔力のみパッシブから検出し、それ以外は基本ステータスのみを対象とする）
  if ((key === 'ad' || key === 'ap') && item.passives && Array.isArray(item.passives)) {
    for (const p of item.passives) {
      const text = (p.name + ' ' + p.description).toLowerCase();
      
      // パターン1: 「攻撃力が25」「魔力が50」など、ステータス名の後に数値が来る場合。ただし後ろに%や％がある割合数値は除外。
      const regexStr1 = pattern + '(?:が|は|を|の|\\s)*?([-\\+]?\\d+(?:\\.\\d+)?)(?!\\s*[%％])';
      const regex1 = new RegExp(regexStr1, 'gi');
      let match1;
      while ((match1 = regex1.exec(text)) !== null) {
        const val = parseFloat(match1[1]);
        const matchedIndex = match1.index;
        const matchedStr = match1[0];
        const contextAfter = text.substring(matchedIndex + matchedStr.length, matchedIndex + matchedStr.length + 30);
        
        const isDebuff = contextAfter.includes('低下') || 
                         contextAfter.includes('減少') || 
                         contextAfter.includes('奪') || 
                         contextAfter.includes('失') ||
                         contextAfter.includes('スロウ');
        
        // 数値の直後に「秒」「回」「倍」「スタック」などの単位、または％記号があるかチェック
        const isNotStat = /^\s*(秒|回|倍|スタック|％|%|段階|ゴールド|g)/.test(contextAfter);
        const isPercent = /^\s*[%％]/.test(contextAfter);
        
        // ダメージやシールド、割合によるスケーリングなどを表すキーワードがあれば除外
        const isScaling = contextAfter.includes('ダメージ') || 
                          contextAfter.includes('物理') || 
                          contextAfter.includes('魔法') || 
                          contextAfter.includes('シールド') || 
                          contextAfter.includes('回復') ||
                          contextAfter.includes('にあたる') ||
                          contextAfter.includes('に等しい') ||
                          contextAfter.includes('の耐久値') ||
                          contextAfter.includes('のシールド');
        
        if (!isDebuff && !isNotStat && !isPercent && !isScaling) {
          return val;
        }
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
  const [filterCompleted, setFilterCompleted] = useState<'all' | 'core' | 'intermediate' | 'basic' | 'boots'>('core'); // デフォルトはコア（完成品）
  const [showHelp, setShowHelp] = useState(false); // データベース仕様説明の表示制御用ステート
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // デフォルトはグリッド（スマホはコンパクト2列、PCは4列）
 
  // ローカル環境・編集用のステート
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
        body: JSON.stringify({
          itemId: selectedItem.id,
          stats: editingStats,
          passives: editingPassives
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        // Update items state
        const updatedItems = items.map(item => {
          if (item.id === selectedItem.id) {
            return {
              ...item,
              stats: editingStats,
              passives: editingPassives
            };
          }
          return item;
        });
        setItems(updatedItems);
        
        // Update selectedItem state to reflect changes in modal
        setSelectedItem({
          ...selectedItem,
          stats: editingStats,
          passives: editingPassives
        });
        
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
    const enchantments = [
      'ステイシス', 'クイックシルバー', 'ヴェール', 'グローリー', 'ゲイルフォース', 
      'ゴアドリンカー', 'ストーンプレート', 'ストライドブレイカー', 'ドリームメーカー', 
      'プロトベルト', 'ロケット'
    ];
    return enchantments.includes(selectedItem.nameJa);
  }, [selectedItem]);

  // 進化後アイテムの自動検索
  const evolutionItem = useMemo(() => {
    if (!selectedItem) return null;
    if (selectedItem.nameJa === 'マナムネ') {
      return items.find(i => i.nameJa === 'ムラマナ');
    }
    if (selectedItem.nameJa === '冬の訪れ') {
      return items.find(i => i.nameJa === 'フィンブルウィンター');
    }
    if (selectedItem.nameJa === 'レリックシールド') {
      return items.find(i => i.nameJa === '霊峰の砦');
    }
    if (selectedItem.nameJa === '霊者の鎌') {
      return items.find(i => i.nameJa === '黒き霧の大鎌');
    }
    if (selectedItem.nameJa === 'アークエンジェル スタッフ' || selectedItem.nameJa === 'アークエンジェルスタッフ') {
      return items.find(i => i.nameJa === 'セラフ エンブレイス' || i.nameJa === 'セラフエンブレイス');
    }
    return null;
  }, [selectedItem, items]);

  // 進化前のベースアイテムの自動検索
  const baseItem = useMemo(() => {
    if (!selectedItem) return null;
    if (selectedItem.nameJa === 'ムラマナ') {
      return items.find(i => i.nameJa === 'マナムネ');
    }
    if (selectedItem.nameJa === 'フィンブルウィンター') {
      return items.find(i => i.nameJa === '冬の訪れ');
    }
    if (selectedItem.nameJa === '霊峰の砦') {
      return items.find(i => i.nameJa === 'レリックシールド');
    }
    if (selectedItem.nameJa === '黒き霧の大鎌') {
      return items.find(i => i.nameJa === '霊者の鎌');
    }
    if (selectedItem.nameJa === 'セラフ エンブレイス' || selectedItem.nameJa === 'セラフエンブレイス') {
      return items.find(i => i.nameJa === 'アークエンジェル スタッフ' || i.nameJa === 'アークエンジェルスタッフ');
    }
    return null;
  }, [selectedItem, items]);
 
  // ステータスの内容に応じた絵文字の取得
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
 
  // Filter and sort items
  const processedItems = useMemo(() => {
    let result = items.filter(item => {
      // 進化後アイテムは一覧から除外し、ベースアイテム詳細内で表示する
      if (
        item.nameJa === 'ムラマナ' || 
        item.nameJa === 'フィンブルウィンター' || 
        item.nameJa === '霊峰の砦' || 
        item.nameJa === '黒き霧の大鎌' ||
        item.nameJa === 'セラフ エンブレイス' ||
        item.nameJa === 'セラフエンブレイス'
      ) return false;

      // 表記揺れ（スペースの有無）対策として、半角・全角スペースをすべて取り除いて比較
      const cleanStr = (s: string) => s.replace(/[\s\u3000]+/g, '').toLowerCase();
      const query = cleanStr(searchQuery);
      const matchesSearch = cleanStr(item.nameJa).includes(query) || 
                            cleanStr(item.nameEn).includes(query) ||
                            item.id.includes(query);
      
      if (!matchesSearch) return false;
 
      // Filter by completion status
      const isBoot = (item: Item) => {
        const name = item.nameJa;
        const enchantments = [
          'ステイシス', 'クイックシルバー', 'ヴェール', 'グローリー', 'ゲイルフォース', 
          'ゴアドリンカー', 'ストーンプレート', 'ストライドブレイカー', 'ドリームメーカー', 
          'プロトベルト', 'ロケット'
        ];
        return name.includes('ブーツ') || 
               name.includes('スチールキャップ') || 
               enchantments.includes(name);
      };

      if (filterCompleted === 'boots') {
        if (!isBoot(item)) return false;
      } else {
        // Exclude boots from non-boot filters (except 'all')
        if (isBoot(item) && filterCompleted !== 'all') return false;

        const isOrnn = item.id.startsWith('7');
        if (filterCompleted === 'core') {
          if (item.gold < 2000 && !isOrnn) return false;
        } else if (filterCompleted === 'intermediate') {
          if (item.gold <= 500 || item.gold >= 2000 || isOrnn) return false;
        } else if (filterCompleted === 'basic') {
          if (item.gold > 500 || isOrnn) return false;
        }
      }
 
      // Filter by category (Search in both stats and passives to support items with passive AP/AD like Nashor/Guinsoo)
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
        if (activeTab === 'hp') {
          const hasPureHp = item.stats.some(s => (s.includes('体力') || s.toLowerCase().includes('hp') || s.toLowerCase().includes('health')) && !s.includes('自動回復'));
          if (!hasPureHp) return false;
        }
        if (activeTab === 'ar' && (!statsStr.includes('物理防御') || statsStr.includes('貫通')) && (!statsStr.includes('armor') || statsStr.includes('pen'))) return false;
        if (activeTab === 'mr' && (!statsStr.includes('魔法防御') || statsStr.includes('貫通')) && (!statsStr.includes('mr') || statsStr.includes('pen'))) return false;
        if (activeTab === 'haste' && !statsStr.includes('ヘイスト') && !statsStr.includes('haste')) return false;
        if (activeTab === 'mana') {
          const hasPureMana = item.stats.some(s => (s.includes('マナ') || s.toLowerCase().includes('mana')) && !s.includes('自動回復'));
          if (!hasPureMana) return false;
        }
      }
 
      return true;
    });
 
    // Sort items
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.nameJa.localeCompare(b.nameJa)
          : b.nameJa.localeCompare(a.nameJa);
      }
      
      const valA = getStatValue(a, sortBy, items);
      const valB = getStatValue(b, sortBy, items);
      
      if (valA === valB) {
        return b.gold - a.gold || a.nameJa.localeCompare(b.nameJa);
      }
      
      return sortOrder === 'desc'
        ? valB - valA
        : valA - valB;
    });
 
    return result;
  }, [searchQuery, activeTab, sortBy, sortOrder, filterCompleted, items]);

 
  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 py-6 pb-20 text-slate-100 bg-slate-950 min-h-screen">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">
            <ShoppingBag size={14} className="animate-pulse text-indigo-400" />
            Wild Rift Item Database
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            {locale === 'ja' ? 'アイテム一覧' : 'Items List'}
          </h1>

        </div>
      </div>

      {/* Database Specification Help Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
        >
          <div className="flex items-center gap-3 text-indigo-400">
            <HelpCircle size={20} />
            <span className="font-black text-sm md:text-base tracking-wide text-slate-200">
              {locale === 'ja' ? 'データベースの仕様とソート（並び替え）基準について' : 'Database Specifications & Sorting Criteria'}
            </span>
          </div>
          <div className="text-slate-400">
            {showHelp ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        {showHelp && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-850/60 text-slate-300 text-xs md:text-sm font-semibold space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50">
                <h4 className="font-black text-indigo-400 flex items-center gap-1.5 mb-2 text-sm">
                  <Info size={14} />
                  {locale === 'ja' ? 'ソート・絞り込みの基本仕様' : 'Sorting & Filters'}
                </h4>
                <p className="leading-relaxed text-slate-300">
                  {locale === 'ja' 
                    ? '各ステータス（攻撃力、魔力、攻撃速度、物理防御、魔法防御、クリティカル率など）のタブでアイテムを絞り込んだり、値の大きい順（または小さい順）に並び替えることができます。'
                    : 'Filter items by specific stats or sort them by value.'}
                </p>
              </div>

              <div className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50">
                <h4 className="font-black text-indigo-400 flex items-center gap-1.5 mb-2 text-sm">
                  <Sparkles size={14} />
                  {locale === 'ja' ? 'パッシブ効果によるステータス上昇の考慮' : 'Passive Stats Extraction'}
                </h4>
                <p className="leading-relaxed text-slate-300">
                  {locale === 'ja' 
                    ? '「グインソー レイジブレード」や「ナッシャートゥース」などのように、基本ステータスに数値が表記されず、パッシブ効果によって攻撃力（AD）や魔力（AP）が増加するアイテムについても、効果説明文から数値を自動検出してソート・フィルタに反映しています（※その他の項目はデバフや比率表記による誤検出防止のため基本ステータスのみから検出）。'
                    : 'Items that gain AD or AP through passive effects (e.g. Guinsoo\'s, Nashor\'s) are automatically parsed from passive texts and counted towards their sorting rank.'}
                </p>
              </div>

              <div className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50">
                <h4 className="font-black text-indigo-400 flex items-center gap-1.5 mb-2 text-sm">
                  <Layers size={14} />
                  {locale === 'ja' ? '進化アイテムのソート基準' : 'Evolving Items Evaluation'}
                </h4>
                <p className="leading-relaxed text-slate-300">
                  {locale === 'ja' 
                    ? '「マナムネ」「冬の訪れ」「アークエンジェル スタッフ」「レリックシールド」「霊者の鎌」などの進化アイテムは、ソート実行時に「進化後（ムラマナ、フィンブルウィンター、セラフ エンブレイス等）」の最大ステータス値を基準にして順序が決定されます。これにより、ビルド完成時の実際の価値に沿った並び替えが可能です。'
                    : 'Evolving items (Manamune, Winter\'s Approach, etc.) are evaluated using their fully upgraded forms (Muramana, Fimbulwinter, etc.) to reflect their late-game value when sorting.'}
                </p>
              </div>

              <div className="space-y-2 bg-slate-950/40 p-4 rounded-2xl border border-slate-850/50">
                <h4 className="font-black text-indigo-400 flex items-center gap-1.5 mb-2 text-sm">
                  <Trophy size={14} />
                  {locale === 'ja' ? 'スタック系アイテムのソート基準' : 'Stacking Items Evaluation'}
                </h4>
                <p className="leading-relaxed text-slate-300">
                  {locale === 'ja' 
                    ? '「ロッド オブ エイジス」（10スタック時：体力+250、マナ+100、魔力+60）や「メジャイ ソウルスティーラー」（30スタック時：魔力+150、移動速度+10%）は、それぞれ最大スタック時の合計最大ステータス（RoA: 体力500/マナ400/魔力120、メジャイ: 魔力175）を基準としてソート計算が行われます。'
                    : 'Stacking items are assessed using their peak stats (Rod of Ages at 10 stacks: 500 HP / 400 Mana / 120 AP; Mejai\'s at 30 stacks: 175 AP / 10% MS).'}
                </p>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text"
            placeholder={locale === 'ja' ? 'アイテム名で検索...' : 'Search items...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-200 font-bold placeholder-slate-500 text-sm transition-all"
          />
        </div>
 
        {/* Sorting and Filter State */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Completion filter tab */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setFilterCompleted('core')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterCompleted === 'core'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ja' ? 'コア' : 'Core'}
            </button>
            <button
              onClick={() => setFilterCompleted('intermediate')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterCompleted === 'intermediate'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ja' ? '中級' : 'Intermediate'}
            </button>
            <button
              onClick={() => setFilterCompleted('basic')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterCompleted === 'basic'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ja' ? '基本' : 'Basic'}
            </button>
            <button
              onClick={() => setFilterCompleted('boots')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterCompleted === 'boots'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ja' ? 'ブーツ' : 'Boots'}
            </button>
            <button
              onClick={() => setFilterCompleted('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                filterCompleted === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {locale === 'ja' ? 'すべて' : 'All'}
            </button>
          </div>
 
          {/* Sorting Key */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs font-extrabold text-slate-300">
            <ArrowUpDown size={14} className="text-slate-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none outline-none cursor-pointer focus:ring-0 text-slate-200"
            >
              <option value="gold" className="bg-slate-900">{locale === 'ja' ? 'ゴールド' : 'Gold'}</option>
              <option value="ad" className="bg-slate-900">{locale === 'ja' ? '攻撃力 (AD)' : 'Attack Damage'}</option>
              <option value="ap" className="bg-slate-900">{locale === 'ja' ? '魔力 (AP)' : 'Ability Power'}</option>
              <option value="as" className="bg-slate-900">{locale === 'ja' ? '攻撃速度 (AS)' : 'Attack Speed'}</option>
              <option value="crit" className="bg-slate-900">{locale === 'ja' ? 'クリティカル率' : 'Critical Rate'}</option>
              <option value="hp" className="bg-slate-900">{locale === 'ja' ? '体力 (HP)' : 'Health'}</option>
              <option value="ar" className="bg-slate-900">{locale === 'ja' ? '物理防御 (AR)' : 'Armor (AR)'}</option>
              <option value="mr" className="bg-slate-900">{locale === 'ja' ? '魔法防御 (MR)' : 'Magic Resist (MR)'}</option>
              <option value="haste" className="bg-slate-900">{locale === 'ja' ? 'スキルヘイスト' : 'Ability Haste'}</option>
              <option value="mana" className="bg-slate-900">{locale === 'ja' ? '最大マナ' : 'Max Mana'}</option>
              <option value="name" className="bg-slate-900">{locale === 'ja' ? '名前' : 'Name'}</option>
            </select>
          </div>

          {/* Sorting Direction */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2 bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/50 rounded-2xl text-xs font-black text-slate-300 hover:text-white flex items-center gap-1.5 transition-all select-none"
            title={sortOrder === 'desc' ? (locale === 'ja' ? '降順（大きい順）' : 'Descending') : (locale === 'ja' ? '昇順（小さい順）' : 'Ascending')}
          >
            <ArrowUpDown size={14} className={`text-indigo-400 transition-transform duration-300 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
            <span>
              {sortOrder === 'desc'
                ? (sortBy === 'name' ? (locale === 'ja' ? 'ん → あ' : 'Z → A') : (locale === 'ja' ? '高 → 低' : 'High → Low'))
                : (sortBy === 'name' ? (locale === 'ja' ? 'あ → ん' : 'A → Z') : (locale === 'ja' ? '低 → 高' : 'Low → High'))}
            </span>
          </button>

          {/* View Mode Switcher */}
          <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={locale === 'ja' ? 'グリッド表示' : 'Grid View'}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={locale === 'ja' ? 'リスト表示' : 'List View'}
            >
              <List size={16} />
            </button>
          </div>
 
        </div>
 
      </div>
 
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'all', label: locale === 'ja' ? 'すべての効果' : 'All Stats' },
          { id: 'ad', label: locale === 'ja' ? '攻撃力 (AD)' : 'Attack Damage' },
          { id: 'ap', label: locale === 'ja' ? '魔力 (AP)' : 'Ability Power' },
          { id: 'as', label: locale === 'ja' ? '攻撃速度 (AS)' : 'Attack Speed' },
          { id: 'crit', label: locale === 'ja' ? 'クリティカル率' : 'Critical Rate' },
          { id: 'pen', label: locale === 'ja' ? '物理防御貫通' : 'Armor Pen' },
          { id: 'mpen', label: locale === 'ja' ? '魔法防御貫通' : 'Magic Pen' },
          { id: 'hp', label: locale === 'ja' ? '体力 (HP)' : 'Health (HP)' },
          { id: 'ar', label: locale === 'ja' ? '物理防御 (AR)' : 'Armor (AR)' },
          { id: 'mr', label: locale === 'ja' ? '魔法防御 (MR)' : 'Magic Resist (MR)' },
          { id: 'haste', label: locale === 'ja' ? 'スキルヘイスト' : 'Ability Haste' },
          { id: 'mana', label: locale === 'ja' ? '最大マナ' : 'Max Mana' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl font-black text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
 
      {/* Items Grid */}
      {/* Items Container */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {processedItems.map(item => {
            const isOrnn = item.id.startsWith('7');
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                className="group bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col items-stretch text-left hover:scale-[1.03] hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 relative overflow-hidden"
              >
                {/* Highlight Ornn Upgrade */}
                {isOrnn && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/20 to-transparent pointer-events-none rounded-bl-full border-r border-t border-amber-500/20" />
                )}
   
                <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4 z-10">
                  <div className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <img 
                      src={
                        item.image === 'default_item.png'
                          ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                          : item.image.startsWith('/')
                          ? item.image
                          : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image}`
                      }
                      alt={item.nameJa}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-black text-slate-100 text-xs sm:text-base truncate group-hover:text-indigo-400 transition-colors">
                        {item.nameJa}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                      <span className="text-[9px] sm:text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-md px-1 sm:px-1.5 py-0.5">
                        {item.gold} G
                      </span>
                      {isOrnn && (
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-400 bg-amber-400/20 border border-amber-400/30 rounded-md px-1 py-0.5 flex items-center gap-0.5">
                          <Award size={9} />
                          <span className="hidden sm:inline">傑作</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
   
                {/* Stats overview */}
                <div className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-1 z-10">
                  {item.stats.length > 0 ? (
                    item.stats.slice(0, 3).map((stat, idx) => (
                      <div key={idx} className="text-[10px] sm:text-xs text-slate-300 font-bold flex items-center gap-1 sm:gap-1.5 bg-slate-950/40 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-slate-800/30">
                        <span>{getStatEmoji(stat)}</span>
                        <span className="truncate">{stat}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-[10px] sm:text-xs text-slate-500 italic font-semibold">効果のみ</div>
                  )}
                  {item.stats.length > 3 && (
                    <div className="text-[8px] sm:text-[10px] text-indigo-400 font-black pl-5 sm:pl-7">
                      他 {item.stats.length - 3} 件...
                    </div>
                  )}
                </div>
   
                {/* Passives count/preview */}
                {item.passives.length > 0 && (
                  <div className="border-t border-slate-800/60 pt-2 sm:pt-3 flex items-center justify-between text-[8px] sm:text-[10px] text-slate-400 font-bold z-10">
                    <span className="flex items-center gap-1">
                      <Layers size={10} className="text-indigo-400" />
                      パッシブ
                    </span>
                    <span className="bg-slate-950/60 px-1.5 py-0.5 rounded-full border border-slate-800/40">
                      {item.passives.length} 件
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {processedItems.map(item => {
            const isOrnn = item.id.startsWith('7');
            return (
              <button
                key={item.id}
                onClick={() => { setSelectedItem(item); setIsEditing(false); }}
                className="group bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center justify-between text-left hover:scale-[1.01] hover:shadow-lg hover:border-indigo-500/50 transition-all duration-200 relative overflow-hidden"
              >
                {/* Highlight Ornn Upgrade */}
                {isOrnn && (
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-500/15 to-transparent pointer-events-none rounded-bl-full border-r border-t border-amber-500/15" />
                )}
                
                <div className="flex items-center gap-3 sm:gap-4 z-10 min-w-0 flex-1">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                    <img 
                      src={
                        item.image === 'default_item.png'
                          ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                          : item.image.startsWith('/')
                          ? item.image
                          : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${item.image}`
                      }
                      alt={item.nameJa}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1 pr-2">
                    <h3 className="font-black text-slate-100 text-sm sm:text-base truncate group-hover:text-indigo-400 transition-colors">
                      {item.nameJa}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                      <span className="text-[9px] sm:text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded px-1 py-0.5">
                        {item.gold} G
                      </span>
                      {isOrnn && (
                        <span className="text-[8px] sm:text-[9px] font-black text-amber-400 bg-amber-400/20 border border-amber-400/30 rounded px-1 py-0.5 flex items-center gap-0.5">
                          <Award size={8} />
                          <span>傑作</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Stats overview (compact list) */}
                <div className="hidden md:flex items-center gap-2 z-10 mr-4 shrink-0">
                  {item.stats.slice(0, 2).map((stat, idx) => (
                    <div key={idx} className="text-xs text-slate-300 font-bold flex items-center gap-1 bg-slate-950/40 px-2 py-0.5 rounded-lg border border-slate-800/30">
                      <span>{getStatEmoji(stat)}</span>
                      <span className="truncate max-w-[100px]">{stat}</span>
                    </div>
                  ))}
                  {item.stats.length > 2 && (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      +{item.stats.length - 2}
                    </span>
                  )}
                </div>

                {/* Passives count */}
                {item.passives.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold z-10 shrink-0 border-l border-slate-800/60 pl-3">
                    <Layers size={11} className="text-indigo-400" />
                    <span className="hidden xs:inline">パッシブ</span>
                    <span className="bg-slate-950/60 px-1.5 py-0.5 rounded-full border border-slate-800/40 text-[9px]">
                      {item.passives.length}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal Drawer */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-slate-800 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-800 bg-slate-900/50">
              <div className="flex items-center gap-5">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
                  <img 
                    src={
                      selectedItem.image === 'default_item.png'
                        ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                        : selectedItem.image.startsWith('/')
                        ? selectedItem.image
                        : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${selectedItem.image}`
                    }
                    alt={selectedItem.nameJa}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-black text-slate-100">
                      {selectedItem.nameJa}
                    </h2>
                    {selectedItem.id.startsWith('7') && (
                      <span className="text-xs font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-md px-2 py-0.5 flex items-center gap-0.5">
                        <Award size={12} />
                        オーンの傑作アイテム
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-bold mt-1.5 flex items-center gap-3">
                    <span>
                      {locale === 'ja' ? '合成総コスト' : 'Total Cost'}:{' '}
                      <span className="text-amber-500 font-black">{selectedItem.gold} G</span>
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* 開発環境限定の編集ボタン */}
                {isDevelopment && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(false)}
                          disabled={isSaving}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-black text-slate-400 bg-slate-800 hover:bg-slate-750 hover:text-slate-200 rounded-xl transition-all"
                        >
                          キャンセル
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                          {isSaving ? '保存中...' : '保存'}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-xl transition-all"
                      >
                        編集する
                      </button>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => { setSelectedItem(null); setIsEditing(false); }}
                  className="p-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
 
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Back to Base Item Button */}
              {baseItem && (
                <button
                  onClick={() => {
                    setSelectedItem(baseItem);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 rounded-xl transition-all cursor-pointer"
                >
                  ← {baseItem.nameJa} (進化前) に戻る
                </button>
              )}

              {/* Boot Enchantment Info Banner */}
              {isBootEnchantment && (
                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-3xl p-5 space-y-2">
                  <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <SlidersHorizontal size={14} />
                    {locale === 'ja' ? 'アクティブ・エンチャント効果について' : 'About Active Enchantment'}
                  </h4>
                  <p className="text-slate-300 text-xs font-semibold leading-relaxed">
                    {locale === 'ja' 
                      ? `このアクティブ発動効果（エンチャント）は、すべての2段階目ブーツ（マーキュリー ブーツ、プレート スチールキャップ、アイオニア ブーツなど）に付与して合成することができます。実際のゲーム内での名称は、選択したベースブーツに応じて「アイオニア ${selectedItem.nameJa}」などのようになります。`
                      : `This active effect (enchantment) can be added to any Tier-2 boots (e.g., Mercury's Treads, Plated Steelcaps, Ionian Boots). The final in-game name will reflect the base boots, such as "Ionian ${selectedItem.nameEn || selectedItem.nameJa}".`}
                  </p>
                </div>
              )}

              {/* Stats Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span>{locale === 'ja' ? '付与ステータス' : 'Granted Stats'}</span>
                  {isEditing && (
                    <button
                      onClick={() => setEditingStats([...editingStats, ''])}
                      className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      + 追加
                    </button>
                  )}
                </h4>
                {isEditing ? (
                  <div className="space-y-2.5">
                    {editingStats.map((stat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={stat}
                          onChange={(e) => {
                            const updated = [...editingStats];
                            updated[idx] = e.target.value;
                            setEditingStats(updated);
                          }}
                          placeholder="+40 攻撃力 など"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-slate-200 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                        <button
                          onClick={() => setEditingStats(editingStats.filter((_, i) => i !== idx))}
                          className="p-2.5 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    {editingStats.length === 0 && (
                      <div className="text-slate-500 italic text-xs py-1">ステータスはありません。</div>
                    )}
                  </div>
                ) : selectedItem.stats.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedItem.stats.map((stat, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5 hover:border-indigo-500/20 transition-colors">
                        <span className="text-2xl">{getStatEmoji(stat)}</span>
                        <span className="font-extrabold text-slate-200 text-sm leading-relaxed">{stat}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-sm py-2">
                    {isBootEnchantment 
                      ? (locale === 'ja' 
                        ? 'ステータスは付与するベースのブーツ（2段階目）によって決定されます。' 
                        : 'Stats are determined by the base boots (Tier 2) to which this is applied.')
                      : (locale === 'ja' ? '基本付与ステータスはありません。' : 'No basic granted stats.')}
                  </div>
                )}
              </div>
 
              {/* Passives Section */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span>{locale === 'ja' ? 'パッシブ効果 ＆ 発動効果' : 'Unique Passives & Actives'}</span>
                  {isEditing && (
                    <button
                      onClick={() => setEditingPassives([...editingPassives, { name: '', description: '' }])}
                      className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      + 追加
                    </button>
                  )}
                </h4>
                {isEditing ? (
                  <div className="space-y-4">
                    {editingPassives.map((p, idx) => (
                      <div key={idx} className="border border-slate-850 rounded-3xl p-5 space-y-3 bg-slate-950/40">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={p.name}
                            placeholder="パッシブ名 (例: 蘇生)"
                            onChange={(e) => {
                              const updated = [...editingPassives];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setEditingPassives(updated);
                            }}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2 text-indigo-300 text-sm font-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                          />
                          <button
                            onClick={() => setEditingPassives(editingPassives.filter((_, i) => i !== idx))}
                            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <textarea
                          value={p.description}
                          placeholder="効果説明文..."
                          onChange={(e) => {
                            const updated = [...editingPassives];
                            updated[idx] = { ...updated[idx], description: e.target.value };
                            setEditingPassives(updated);
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 text-sm leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none transition-all min-h-[100px]"
                        />
                      </div>
                    ))}
                    {editingPassives.length === 0 && (
                      <div className="text-slate-500 italic text-xs py-1">特殊効果はありません。</div>
                    )}
                  </div>
                ) : selectedItem.passives.length > 0 ? (
                  <div className="space-y-4">
                    {selectedItem.passives.map((p, idx) => {
                      const isActive = p.name.includes('発動効果') || p.name.includes('アクティブ');
                      return (
                        <div 
                          key={idx} 
                          className={`relative border rounded-3xl p-5 md:p-6 space-y-2 bg-gradient-to-r transition-all duration-300 ${
                            isActive 
                              ? 'from-amber-950/20 to-slate-900 border-amber-500/20' 
                              : 'from-indigo-950/20 to-slate-900 border-indigo-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500' : 'bg-indigo-400'}`} />
                            <h5 className={`font-black text-base ${isActive ? 'text-amber-400' : 'text-indigo-300'}`}>
                              {p.name}
                            </h5>
                          </div>
                          <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap pl-4">
                            {p.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-sm py-2">特殊効果はありません。</div>
                )}
              </div>
 
              {/* Evolution Item Section */}
              {evolutionItem && (
                <div className="border-t border-slate-800 pt-6 mt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                      <Sparkles size={14} />
                    </div>
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest">
                      {selectedItem.nameJa === 'レリックシールド' || selectedItem.nameJa === '霊者の鎌'
                        ? (locale === 'ja' ? 'クエスト完了時の進化先' : 'Quest Completion Evolution')
                        : (locale === 'ja' ? 'マナ最大蓄積時の自動進化先' : 'Max Mana Evolution')}
                    </h4>
                  </div>
                  
                  <div className="bg-slate-950/60 border border-amber-500/20 rounded-3xl p-5 md:p-6 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-950">
                        <img 
                          src={
                            evolutionItem.image === 'default_item.png'
                              ? 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png'
                              : evolutionItem.image.startsWith('/')
                              ? evolutionItem.image
                              : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${evolutionItem.image}`
                          }
                          alt={evolutionItem.nameJa}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/1055.png';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h5 className="text-lg font-black text-amber-400">
                            {evolutionItem.nameJa}
                          </h5>
                          <button
                            onClick={() => {
                              setSelectedItem(evolutionItem);
                              setIsEditing(false);
                            }}
                            className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 px-2 py-0.5 rounded-lg transition-all cursor-pointer"
                          >
                            {locale === 'ja' ? '詳細を表示・編集する' : 'View & Edit Details'}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {selectedItem.nameJa === 'レリックシールド' || selectedItem.nameJa === '霊者の鎌'
                            ? (locale === 'ja' ? 'クエスト達成後に自動で変化' : 'Automatically upgrades upon quest completion')
                            : (locale === 'ja' ? 'マナ蓄積完了後に自動で変化' : 'Automatically upgrades from base item')}
                        </p>
                      </div>
                    </div>
 
                    {/* Evolved Stats */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">進化後のステータス</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {evolutionItem.stats.map((stat, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2">
                            <span className="text-sm">{getStatEmoji(stat)}</span>
                            <span className="font-bold text-slate-300 text-xs">{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
 
                    {/* Evolved Passives */}
                    <div className="space-y-3">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">進化後のパッシブ効果</div>
                      {evolutionItem.passives.map((p, idx) => (
                        <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-1">
                          <h6 className="font-black text-sm text-amber-500/90">{p.name}</h6>
                          <p className="text-xs text-slate-300 leading-relaxed">{p.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
 

 
            </div>
            
          </div>
        </div>
      )}
 
    </div>
  );
}

