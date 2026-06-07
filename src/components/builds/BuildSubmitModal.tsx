'use client';

import { useState } from 'react';
import { X, Save, Plus, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
interface BuildSubmitModalProps {
  championId: string;
  allItems: any[];
  allRunes: any[];
  allSpells: any[];
  onClose: () => void;
  onSubmitSuccess: () => void;
}

export function BuildSubmitModal({ championId, allItems, allRunes, allSpells, onClose, onSubmitSuccess }: BuildSubmitModalProps) {
  const t = useTranslations('Builds');
  const locale = useLocale();
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSpells, setSelectedSpells] = useState<string[]>([]);
  const [selectedKeystone, setSelectedKeystone] = useState<string>('');
  const [mainTreeId, setMainTreeId] = useState<number>(0);
  const [subTreeId, setSubTreeId] = useState<number>(1);
  const [mainRunes, setMainRunes] = useState<string[]>([]);
  const [subRune, setSubRune] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'items' | 'runes'>('info');

  // ルーンの排他グループ（同じ配列内のルーンは同時選択不可、選択時に上書きされる）
  const EXCLUSIVE_RUNE_GROUPS = [
    // 覇道 (Domination)
    ['cheap_shot', 'sudden_impact', 'empowered_attack'],
    ['chain_assault', 'tyrant', 'hubris'],
    ['eyeball_collector', 'ingenious_hunter', 'relentless_hunter', 'zombie_ward'],
    // 栄華 (Precision)
    ['brutal', 'triumph', 'battle_zeal'],
    ['coup_de_grace', 'cut_down', 'last_stand'],
    ['legend_alacrity', 'legend_bloodline', 'legend_tenacity'],
    // 不滅 (Resolve)
    ['font_of_life', 'courage_of_the_colossus', 'nullifying_orb', 'demolish'],
    ['bone_plating', 'second_wind', 'perseverance'],
    ['overgrowth', 'revitalize', 'unshakeable'],
    // 魔道/天啓 (Inspiration / Sorcery)
    ['axiom_arcanist', 'manaflow_band', 'botanist', 'hextech_flashtraption'],
    ['transcendence', 'celerity', 'absolute_focus'],
    ['scorch', 'nimbus_cloak', 'gathering_storm', 'ixtali_seedjar']
  ];

  const getItemImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('/') ? url : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${url}`;
  };

  const excludedItems = ['マナムネ', 'アークエンジェル スタッフ', '冬の訪れ', 'レリックシールド', '霊者の鎌'];
  const filteredItems = allItems.filter(i => i.image && !excludedItems.includes(i.nameJa));

  const keystones = allRunes.filter(r => r.category === 'Keystone');
  const subRunes = allRunes.filter(r => r.category !== 'Keystone');

  const handleItemToggle = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    } else {
      if (selectedItems.length >= 6) {
        alert(t('maxItems'));
        return;
      }
      setSelectedItems(prev => [...prev, itemId]);
    }
  };

  const TREES = [
    { id: 0, title: '覇道 (Domination)', rows: EXCLUSIVE_RUNE_GROUPS.slice(0, 3) },
    { id: 1, title: '栄華 (Precision)', rows: EXCLUSIVE_RUNE_GROUPS.slice(3, 6) },
    { id: 2, title: '不滅 (Resolve)', rows: EXCLUSIVE_RUNE_GROUPS.slice(6, 9) },
    { id: 3, title: '天啓 (Inspiration)', rows: EXCLUSIVE_RUNE_GROUPS.slice(9, 12) },
  ];

  const handleMainTreeChange = (id: number) => {
    setMainTreeId(id);
    setMainRunes([]);
    if (subTreeId === id) {
      const nextSubTree = [0, 1, 2, 3].find(t => t !== id)!;
      setSubTreeId(nextSubTree);
      setSubRune(null);
    }
  };

  const handleSubTreeChange = (id: number) => {
    setSubTreeId(id);
    setSubRune(null);
  };

  const handleMainRuneToggle = (runeId: string) => {
    if (mainRunes.includes(runeId)) {
      setMainRunes(prev => prev.filter(id => id !== runeId));
      return;
    }
    
    const group = EXCLUSIVE_RUNE_GROUPS.find(g => g.includes(runeId));
    let nextRunes = [...mainRunes];
    
    if (group) {
      const existingInGroup = nextRunes.find(id => group.includes(id));
      if (existingInGroup) {
        nextRunes = nextRunes.filter(id => id !== existingInGroup);
      }
    }
    
    if (nextRunes.length >= 3 && !group?.some(id => mainRunes.includes(id))) {
      alert(t('maxMainRunes'));
      return;
    }
    
    setMainRunes([...nextRunes, runeId]);
  };

  const handleSubRuneToggle = (runeId: string) => {
    if (subRune === runeId) {
      setSubRune(null);
    } else {
      setSubRune(runeId);
    }
  };

  const handleSpellToggle = (spellId: string) => {
    if (selectedSpells.includes(spellId)) {
      setSelectedSpells(prev => prev.filter(id => id !== spellId));
    } else {
      if (selectedSpells.length >= 2) {
        alert(t('maxSpells'));
        return;
      }
      setSelectedSpells(prev => [...prev, spellId]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert(t('requireTitle'));
      return;
    }
    if (!deletePassword.trim()) {
      alert(t('requirePassword'));
      return;
    }
    if (!selectedKeystone) {
      alert(t('requireKeystone'));
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          championId,
          title,
          author_name: authorName,
          description,
          items: selectedItems,
          spells: selectedSpells,
          runes: {
            keystone: selectedKeystone,
            subRunes: [...mainRunes, subRune].filter(Boolean) as string[]
          },
          delete_password: deletePassword
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit');
      
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert(t('errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="font-black text-slate-800">{t('modalTitle')}</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="flex border-b border-slate-100 bg-white">
          <button onClick={() => setActiveTab('info')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('tabInfo')}</button>
          <button onClick={() => setActiveTab('items')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'items' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('tabItems')} ({selectedItems.length}/6)</button>
          <button onClick={() => setActiveTab('runes')} className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'runes' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t('tabRunes')}</button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formTitle')} <span className="text-rose-500">*</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder={t('formTitlePlaceholder')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formAuthor')}</label>
                <input type="text" value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder={t('formAuthorPlaceholder')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formDesc')}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('formDescPlaceholder')} className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">{t('formPassword')} <span className="text-rose-500">*</span></label>
                <input type="text" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder={t('formPasswordPlaceholder')} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all" />
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div>
              <div className="flex gap-2 flex-wrap mb-4 bg-slate-100 p-3 rounded-xl min-h-[64px]">
                {selectedItems.length === 0 && <span className="text-slate-400 text-sm font-bold p-2">{t('selectItems')}</span>}
                {selectedItems.map(id => {
                  const item = allItems.find(i => i.id === id);
                  return item ? (
                    <div key={id} className="relative cursor-pointer" onClick={() => handleItemToggle(id)}>
                      <img src={getItemImageUrl(item.image)} alt={locale === 'ja' ? item.nameJa : (item.nameEn || item.nameJa)} className="w-10 h-10 rounded-lg border border-indigo-400" />
                      <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5"><X size={10} /></div>
                    </div>
                  ) : null;
                })}
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                {filteredItems.map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => handleItemToggle(item.id)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedItems.includes(item.id) ? 'border-indigo-500 opacity-50' : 'border-transparent hover:border-indigo-200'}`}
                    title={locale === 'ja' ? item.nameJa : (item.nameEn || item.nameJa)}
                  >
                    <img src={getItemImageUrl(item.image)} alt={locale === 'ja' ? item.nameJa : (item.nameEn || item.nameJa)} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'runes' && (
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{t('summonerSpells')}</span>
                  <span className="text-xs text-slate-400">({selectedSpells.length}/2)</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {allSpells.map(spell => (
                    <button 
                      key={spell.id} 
                      onClick={() => handleSpellToggle(spell.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${selectedSpells.includes(spell.id) ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-100'}`}
                      title={locale === 'ja' ? spell.nameJa : (spell.nameEn || spell.nameJa)}
                    >
                      <img src={spell.image} alt={locale === 'ja' ? spell.nameJa : (spell.nameEn || spell.nameJa)} className="w-10 h-10 rounded-lg shadow-sm" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{locale === 'ja' ? spell.nameJa : (spell.nameEn || spell.nameJa)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-200"></div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{t('keystone')}</span>
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {keystones.map(rune => (
                    <button 
                      key={rune.id} 
                      onClick={() => setSelectedKeystone(rune.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 ${selectedKeystone === rune.id ? 'border-indigo-500 bg-indigo-50' : 'border-transparent hover:bg-slate-100'}`}
                      title={locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)}
                    >
                      <img src={rune.image} alt={locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)} className="w-10 h-10 rounded-full bg-slate-800" />
                      <span className="text-[10px] font-bold text-center leading-tight truncate w-full">{locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{t('mainRunes')}</span>
                  <span className="text-xs text-slate-400">({mainRunes.length}/3)</span>
                </h4>
                <div className="flex gap-2 mb-3">
                  {TREES.map(t => (
                    <button key={t.id} onClick={() => handleMainTreeChange(t.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${mainTreeId === t.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {t.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="space-y-2">
                    {TREES[mainTreeId].rows.map((row, rowIdx) => {
                      const isRowActive = row.some(id => mainRunes.includes(id));
                      return (
                        <div key={rowIdx} className="flex flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-xl">
                          {row.map(runeId => {
                            const rune = subRunes.find(r => r.id === runeId);
                            if (!rune) return null;
                            const isSelected = mainRunes.includes(rune.id);
                            return (
                              <button 
                                key={rune.id} 
                                onClick={() => handleMainRuneToggle(rune.id)}
                                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 flex-1 min-w-[64px] max-w-[80px] ${
                                  isSelected 
                                    ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                                    : isRowActive 
                                      ? 'border-transparent hover:bg-slate-200 grayscale opacity-40 hover:grayscale-0 hover:opacity-100' 
                                      : 'border-transparent hover:bg-slate-200 bg-white'
                                }`}
                                title={locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)}
                              >
                                <img src={rune.image} alt={locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)} className={`w-8 h-8 rounded-full ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 bg-slate-800' : 'bg-slate-800'}`} />
                                <span className={`text-[9px] font-bold text-center leading-tight truncate w-full ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>
                                  {locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md">{t('subRunes')}</span>
                  <span className="text-xs text-slate-400">({subRune ? 1 : 0}/1)</span>
                </h4>
                <div className="flex gap-2 mb-3">
                  {TREES.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => handleSubTreeChange(t.id)} 
                      disabled={mainTreeId === t.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 ${subTreeId === t.id ? 'bg-indigo-600 text-white' : mainTreeId === t.id ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                      {t.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="space-y-2">
                    {TREES[subTreeId].rows.map((row, rowIdx) => {
                      return (
                        <div key={rowIdx} className="flex flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-xl">
                          {row.map(runeId => {
                            const rune = subRunes.find(r => r.id === runeId);
                            if (!rune) return null;
                            const isSelected = subRune === rune.id;
                            return (
                              <button 
                                key={rune.id} 
                                onClick={() => handleSubRuneToggle(rune.id)}
                                className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all hover:scale-105 flex-1 min-w-[64px] max-w-[80px] ${
                                  isSelected 
                                    ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                                    : 'border-transparent hover:bg-slate-200 bg-white'
                                }`}
                                title={locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)}
                              >
                                <img src={rune.image} alt={locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)} className={`w-8 h-8 rounded-full ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-1 bg-slate-800' : 'bg-slate-800'}`} />
                                <span className={`text-[9px] font-bold text-center leading-tight truncate w-full ${isSelected ? 'text-indigo-900' : 'text-slate-500'}`}>
                                  {locale === 'ja' ? rune.nameJa : (rune.nameEn || rune.nameJa)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">
            {t('cancel')}
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? t('submitting') : t('submitAction')}
          </button>
        </div>
      </div>
    </div>
  );
}
