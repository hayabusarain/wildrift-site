'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Sword, Shield, Zap, Target, Star, Edit3, Save, X, Loader2 } from 'lucide-react';
import { parseLocalizedText, parseVariables, formatSkillDescription } from '@/utils/localization';
import { PatchTable } from '@/components/patches/PatchTable';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ChampionDetailData {
  id: string;
  name: string;
  title: string;
  lore: string;
  tags: string[];
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  champion_name_en?: string;
}

export default function ChampionDetailsPage() {
  const { id } = useParams() as { id: string };
  const locale = useLocale();
  const t = useTranslations("ChampionDetail");
  const r = useTranslations("Role");
  
  const [champion, setChampion] = useState<ChampionDetailData | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [wrDetails, setWrDetails] = useState<any>(null);
  const [counters, setCounters] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // インライン編集用のステート
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkills, setEditingSkills] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' || 
       window.location.hostname.startsWith('192.168.'));
    setIsDevelopment(isLocal);
  }, []);

  const toggleEditMode = () => {
    if (!isEditing && wrDetails?.skills) {
      setEditingSkills(JSON.parse(JSON.stringify(wrDetails.skills)));
    }
    setIsEditing(!isEditing);
  };

  const handleSkillChange = (index: number, field: string, value: string) => {
    const updated = [...editingSkills];
    updated[index][field] = value;
    setEditingSkills(updated);
  };

  const handleSaveSkills = async () => {
    if (!confirm('変更を保存し、他の言語にも自動翻訳を適用しますか？\n（処理には10〜20秒ほどかかります）')) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: '', // ローカル開発環境ではAPI側でスキップされる
          championId: id,
          updatedSkills: editingSkills
        })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        setWrDetails({...wrDetails, skills: editingSkills});
        setIsEditing(false);
        alert(data.message || '保存と自動翻訳が完了しました！');
      } else {
        alert(`エラー: ${data.error}`);
      }
    } catch (err: any) {
      alert(`通信エラー: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let langCode = 'en_US';
        switch (locale) {
          case 'ja': langCode = 'ja_JP'; break;
          case 'ko': langCode = 'ko_KR'; break;
          case 'vi': langCode = 'vn_VN'; break;
          case 'zh-TW': langCode = 'zh_TW'; break;
          default: langCode = 'en_US'; break;
        }
        
        let champData = null;
        try {
          const ddRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/16.10.1/data/${langCode}/champion/${id}.json`);
          if (ddRes.ok) {
            const ddData = await ddRes.json();
            champData = ddData.data[id];
          }
        } catch (e) {
          console.warn('DataDragon fetch failed for', id);
        }
        
        // 2. Fetch Tier list data
        const { data: tierData } = await supabase
          .from('champion_stats')
          .select('*')
          .eq('champion_name_en', id);
          
        // 3. Fetch WR specific details
        const { data: detailsData } = await supabase
          .from('wr_champion_details')
          .select('*')
          .eq('champion_id', id)
          .single();

        // 4. Parse localized dictionary IDs and variables in skills
        if (detailsData && detailsData.skills) {
          let targetSkillsArray = [];
          let variables = {};

          // 新しい多言語フォーマット（オブジェクト）か、古いフォーマット（配列）かを判定
          if (Array.isArray(detailsData.skills)) {
            // 旧フォーマット (日本語のみ)
            targetSkillsArray = detailsData.skills;
          } else {
            // 新フォーマット { ja: [], en: [], variables: {} }
            const langKey = langCode.split('_')[0]; // 'ja' or 'en'
            targetSkillsArray = detailsData.skills[langKey] || detailsData.skills['en'] || detailsData.skills['ja'] || [];
            variables = detailsData.skills.variables || {};
          }

          const parsedSkills = await Promise.all(targetSkillsArray.map(async (skill: any) => {
            // 1. 変数の置換 ({var} -> 100)
            const withVars = parseVariables(skill.description, variables);
            // 2. 辞書の置換 ([item_123] -> B.F. Sword)
            const withDict = await parseLocalizedText(withVars, langCode);
            return {
              ...skill,
              description: withDict
            };
          }));
          detailsData.skills = parsedSkills;
        }

        // If not found in DataDragon but we have tier data, mock the champion data
        if (!champData && tierData && tierData.length > 0) {
          const nameFallback = tierData[0].champion_name || id;
          
          let specificLore = t('exclusiveDesc');
          if (id === 'Norra') {
            specificLore = langCode === 'ja_JP' 
              ? "ヨードルの魔女であるノラは、マジカルキャット「ユーミ」のかつてのご主人です。彼女は「境界の書」の最後のページと繋がる世界に行こうとした際、はるか遠くの奇妙な世界に飛ばされ、失踪してしまいました。現在は領域の果てで出会った少し変わった新しい友人たちの助けを借りながら、愛猫のユーミが待つ家へ帰るための正しいポータルを探す壮大な旅を続けています。"
              : "Norra is a yordle enchantress and the former master of the magical cat Yuumi. While attempting to travel to the world connected by the final page of the Book of Thresholds, she was accidentally transported to a strange, distant realm. Now, with the help of new, peculiar friends she met at the edge of the realm, she is on an epic journey to find the right portal back home to her beloved cat.";
          }

          champData = {
            id: id,
            name: langCode === 'ja_JP' ? nameFallback : id,
            title: t('exclusive'),
            lore: specificLore,
            tags: [tierData[0].role || 'Mage'],
            info: { attack: 5, defense: 5, magic: 5, difficulty: 5 },
            champion_name_en: id
          };
        } else if (champData) {
            champData.champion_name_en = id;
        }

        setChampion(champData);
        if (tierData) setStats(tierData);
        if (detailsData) setWrDetails(detailsData);
        
        // Fetch counters data
        try {
          const counterRes = await fetch('/data/counters.json?t=' + Date.now());
          if (counterRes.ok) {
            const counterData = await counterRes.json();
            // 大文字小文字の違いを吸収してキーを探す
            const counterKey = Object.keys(counterData).find(
              key => key.toLowerCase() === id.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            );
            console.log('Counter Data Key Found:', counterKey);
            if (counterKey) {
              setCounters(counterData[counterKey]);
            } else {
              console.warn('No counter data found for champion ID:', id);
            }
          } else {
            console.warn('Failed to load counters.json. Status:', counterRes.status);
          }
        } catch (e) {
          console.warn('Counters fetch failed for', id, e);
        }
        
        try {
          // ロケールに応じて読み込むJSONファイルを切り替える
          const jsonFileName = locale === 'ja' ? 'ja' : 
                               locale === 'ko' ? 'ko' : 
                               locale === 'vi' ? 'vi' : 
                               locale === 'zh-TW' ? 'zh-TW' : 'en';
          
          const skillsRes = await fetch(`/data/skills/${jsonFileName}.json?t=${Date.now()}`);
          if (skillsRes.ok) {
            const skillsData = await skillsRes.json();
            const skillKey = Object.keys(skillsData).find(
              key => key.toLowerCase() === id.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            );
            if (skillKey) {
              setWrDetails((prev: any) => ({
                ...prev,
                skills: skillsData[skillKey]
              }));
            }
          }
        } catch (e) {
          console.warn('Failed to load localized skills json', e);
        }
        
      } catch (err) {
        console.error('Failed to fetch champion details:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id, locale]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!champion) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Champion not found</h1>
        <Link href="/champions" className="text-indigo-600 hover:underline mt-4 inline-block">← Back to Roster</Link>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'TOP': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'JUNGLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MID': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ADC': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'SUPPORT': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderProgressBar = (value: number, colorClass: string) => {
    return (
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${(value / 10) * 100}%` }}></div>
      </div>
    );
  };

  const getSkillLabel = (id: string) => {
    switch (id) {
      case 'P': return 'Passive';
      case 'Q': return 'Skill 1';
      case 'W': return 'Skill 2';
      case 'E': return 'Skill 3';
      case 'R': return 'Ult';
      default: return id;
    }
  };

  const translateSkillTag = (rawTag: string, locale: string) => {
    if (locale !== 'en') return rawTag;
    const tag = rawTag.replace(/[\[\]]/g, '').trim();
    const map: Record<string, string> = {
      '物理': 'Physical',
      '魔法': 'Magic',
      '確定': 'True',
      'バフ': 'Buff',
      'パフ': 'Buff',
      'ハフ': 'Buff',
      'ナーフ': 'Nerf',
      '機動性': 'Mobility',
      '自動効果': 'Passive',
      'パッシブ': 'Passive',
      'アクティブ': 'Active',
      '行動妨害': 'CC',
      '妨害': 'CC',
      'デバフ': 'Debuff',
      'スロウ': 'Slow',
      'ブロック': 'Block',
      '回復': 'Heal',
      'シールド': 'Shield',
      '防御': 'Defense',
      '防御力': 'Defense',
      '範囲ダメージ': 'AoE',
      'バースト': 'Burst',
      'ダッシュ': 'Dash',
      'バリア': 'Barrier',
      'デス耐性': 'Death Resist',
    };
    return map[tag] || tag;
  };

  const translateTableLabel = (label: string, locale: string) => {
    if (locale !== 'en') return label;
    const map: Record<string, string> = {
      'クールダウン': 'Cooldown',
      '基本ダメージ': 'Base Damage',
      '追加ダメージ': 'Bonus Damage',
      '攻撃力': 'AD',
      '魔力': 'AP',
      '体力': 'Health',
      '最大体力': 'Max Health',
      'マナ': 'Mana',
      'マナコスト': 'Mana Cost',
      '防御力': 'Armor',
      '物理防御': 'Armor',
      '魔法防御': 'Magic Resist',
      'ダメージ': 'Damage',
      '最小ダメージ': 'Min Damage',
      '最大ダメージ': 'Max Damage',
      '爆発ダメージ': 'Explosion Damage',
      '移動速度': 'Move Speed',
      '射程': 'Range',
      '射程距離': 'Range',
      '範囲': 'Range',
      '持続時間': 'Duration',
      '効果時間': 'Duration',
      'チャージ時間': 'Charge Time',
      'シールド': 'Shield',
      '回復量': 'Heal Amount',
      '回復': 'Heal',
      'ダメージ反映率': 'Damage Ratio',
      '増加攻撃力': 'Bonus AD',
      'コスト': 'Cost',
      'クローンのダメージ': 'Clone Damage',
      '攻撃速度': 'Attack Speed',
      'ダメージ軽減': 'Damage Reduction',
      'クールダウン短縮': 'Cooldown Reduction',
      '物理防御貫通': 'Armor Pen',
    };
    // 汎用的な置換 (含む場合)
    let translated = map[label];
    if (!translated) {
      translated = label
        .replace('対象の最大体力', 'Target Max HP')
        .replace('対象の現在体力', 'Target Current HP')
        .replace('対象の減少体力', 'Target Missing HP')
        .replace('体力割合ダメージ', 'HP% Damage')
        .replace('ダメージ軽減率', 'Damage Reduction %')
        .replace('%ダメージ', '% Damage')
        .replace('1段目ダメージ', '1st Hit Damage')
        .replace('2段目ダメージ', '2nd Hit Damage');
    }
    return translated || label;
  };

  const translateCooldownText = (text: string, locale: string) => {
    if (locale !== 'en' || !text) return text;
    return text.replace('秒', 's');
  };

  const renderDescriptionWithIcons = (htmlContent: string) => {
    if (!htmlContent) return { __html: '' };

    // 1. Keyword based coloring
    let replaced = formatSkillDescription(htmlContent);
    
    // 改行コードを <br /> に変換
    replaced = replaced.replace(/\n/g, '<br />');
    
    // 2. Icon placeholders
    replaced = replaced.replace(/\[ICON_AD\]/g, '<span class="inline-flex items-center justify-center bg-orange-100 text-orange-600 border border-orange-300 rounded px-1 mx-0.5 text-[10px] font-black" title="物理攻撃力 (AD)">⚔️AD</span>');
    replaced = replaced.replace(/\[ICON_AP\]/g, '<span class="inline-flex items-center justify-center bg-purple-100 text-purple-600 border border-purple-300 rounded px-1 mx-0.5 text-[10px] font-black" title="魔力 (AP)">🪄AP</span>');
    replaced = replaced.replace(/\[ICON_HP\]/g, '<span class="inline-flex items-center justify-center bg-emerald-100 text-emerald-600 border border-emerald-300 rounded px-1 mx-0.5 text-[10px] font-black" title="体力 (HP)">❤️HP</span>');
    replaced = replaced.replace(/\[ICON_HASTE\]/g, '<span class="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 border border-yellow-300 rounded px-1 mx-0.5 text-[10px] font-black" title="スキルヘイスト">⌛ヘイスト</span>');
    replaced = replaced.replace(/\[ICON_CRIT\]/g, '<span class="inline-flex items-center justify-center bg-red-100 text-red-600 border border-red-300 rounded px-1 mx-0.5 text-[10px] font-black" title="クリティカル率">💥Crit</span>');
    replaced = replaced.replace(/\[ICON_AR\]/g, '<span class="inline-flex items-center justify-center bg-amber-100 text-amber-700 border border-amber-300 rounded px-1 mx-0.5 text-[10px] font-black" title="物理防御 (AR)">🛡️AR</span>');
    replaced = replaced.replace(/\[ICON_MR\]/g, '<span class="inline-flex items-center justify-center bg-blue-100 text-blue-700 border border-blue-300 rounded px-1 mx-0.5 text-[10px] font-black" title="魔法防御 (MR)">🛡️MR</span>');
    replaced = replaced.replace(/\[ICON_LEVEL\]/g, '<span class="inline-flex items-center justify-center bg-slate-200 text-slate-700 border border-slate-300 rounded px-1 mx-0.5 text-[10px] font-black" title="レベルで変動">📈Lv</span>');
    
    return { __html: replaced };
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <Link href="/champions" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 mb-6 group transition-colors">
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        {t('back')}
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-8 border border-slate-200">
        <div className="absolute inset-0 bg-slate-900">
          <img 
            src={id === 'Norra' ? `/images/champions/Norra.avif` : `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${id}_0.jpg`}
            alt={champion.name}
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/images/champions/${id}.avif`;
              (e.target as HTMLImageElement).onerror = null;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-end">
          <img 
            src={id === 'Norra' ? `/images/champions/Norra.avif` : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${id}.png`}
            alt={champion.name}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-800 shadow-2xl bg-slate-900 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/images/champions/${id}.avif`;
              (e.target as HTMLImageElement).onerror = null;
            }}
          />
          <div className="flex-1 text-center md:text-left text-white">
            <h2 className="text-xl md:text-2xl text-indigo-300 font-bold italic drop-shadow">{champion.title}</h2>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg mb-4">{champion.name}</h1>
            <div className="flex gap-2">
                  {champion.tags.map(tag => {
                    let translatedTag = tag;
                    if (tag === 'Fighter') translatedTag = t('role_fighter') || tag;
                    if (tag === 'Mage') translatedTag = t('role_mage') || tag;
                    if (tag === 'Assassin') translatedTag = t('role_assassin') || tag;
                    if (tag === 'Marksman') translatedTag = t('role_marksman') || tag;
                    if (tag === 'Tank') translatedTag = t('role_tank') || tag;
                    if (tag === 'Support') translatedTag = t('role_support') || tag;

                    return (
                      <span key={tag} className="px-4 py-1.5 bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 rounded-full text-xs font-bold tracking-wider uppercase">
                        {translatedTag}
                      </span>
                    );
                  })}
                </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Current Meta Stats */}
          {stats.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-xl font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="text-indigo-500" />
                {t('latestMetaStats')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stats.map(stat => (
                  <div key={stat.role} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-inner">
                    <span className={`text-sm font-black px-3 py-1 rounded-md border ${getRoleColor(stat.role)}`}>
                      {stat.role}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t('tierWinRate')}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-slate-800">{stat.tier}</span>
                        <span className={`text-lg font-black ${stat.win_rate >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {stat.win_rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {wrDetails?.skills && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <Sword className="text-indigo-500" />
                  {t('skills')}
                </h3>
                
                {/* 開発環境限定：編集モードトグル */}
                {isDevelopment && locale === 'ja' && (
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={toggleEditMode}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X size={16} /> キャンセル
                        </button>
                        <button 
                          onClick={handleSaveSkills}
                          disabled={isSaving}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                          {isSaving ? '保存中...' : '保存して自動翻訳'}
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={toggleEditMode}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <Edit3 size={16} /> スキルを編集する
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-10">
                {(isEditing ? editingSkills : wrDetails.skills).map((skill: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-4 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={
                            skill.icon || 
                            (id === 'Norra' 
                              ? `/images/${encodeURIComponent(skill.name.replace('帰郷のそレッド', '故郷のスレッド').replace('バルーザ', 'パルーザ'))}.avif` 
                              : `/images/champions/${id}.avif`)
                          } 
                          alt={skill.name} 
                          className={`w-14 h-14 ${skill.id === 'P' ? 'rounded-full' : 'rounded-xl'} border-2 border-slate-200 shadow-sm bg-slate-100 object-cover`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `/images/champions/${id}.avif`; // Fallback
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-slate-800 text-white text-xs font-bold rounded">
                            {getSkillLabel(skill.id)}
                          </span>
                          
                          {isEditing ? (
                            <input 
                              type="text" 
                              value={skill.name} 
                              onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                              className="text-lg font-extrabold text-slate-800 border-b-2 border-indigo-400 focus:outline-none focus:border-indigo-600 bg-indigo-50/50 px-1 w-full max-w-xs"
                            />
                          ) : (
                            <h4 className="text-lg font-extrabold text-slate-800">{skill.name}</h4>
                          )}
                          
                          {/* Tags */}
                          {skill.tags && (
                            <div className="flex gap-1 ml-2">
                              {skill.tags.map((tag: string, tIdx: number) => (
                                <span key={tIdx} className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                                  {translateSkillTag(tag, locale)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Cooldown Text */}
                        {skill.cooldown_text && (
                          <div className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1">
                            <span className="inline-block w-3 h-3 bg-slate-200 rounded-full flex items-center justify-center">⏳</span>
                            {translateCooldownText(skill.cooldown_text, locale)}
                          </div>
                        )}
                        
                        {isEditing ? (
                          <textarea 
                            value={skill.description} 
                            onChange={(e) => handleSkillChange(idx, 'description', e.target.value)}
                            className="w-full min-h-[120px] text-sm text-slate-700 leading-relaxed font-medium bg-white p-4 rounded-xl border-2 border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100 resize-y"
                          />
                        ) : (
                          <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-100" dangerouslySetInnerHTML={renderDescriptionWithIcons(skill.description)} />
                        )}
                      </div>
                    </div>

                    {/* Level Progression Table */}
                    {skill.table && (
                      <div className="mt-2 ml-[72px] overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-800 text-slate-100 uppercase font-black text-xs">
                            <tr>
                              <th className="px-4 py-2 border-r border-slate-700">{t('growthData')}</th>
                              {skill.table.headers.map((h: string, i: number) => (
                                <th key={i} className="px-4 py-2 text-center text-indigo-300">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-100">
                            {skill.table.rows.map((row: any, rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                <td className="px-4 py-2 font-bold text-slate-700 border-r border-slate-100 bg-slate-50/50">
                                  {translateTableLabel(row.label, locale)}
                                </td>
                                {row.values.map((v: string, vIdx: number) => (
                                  <td key={vIdx} className="px-4 py-2 text-center font-bold text-slate-600">
                                    {v}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lore */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-xl font-extrabold text-slate-800 mb-4">{t('lore')}</h3>
            <p className="text-slate-600 leading-relaxed font-medium">
              {champion.lore}
            </p>
          </div>

          {/* Patch History Section */}
          <div className="mt-16 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
              <span className="text-indigo-600 text-3xl">#</span>
              {t('PatchHistory') || 'Patch History'}
            </h2>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <PatchTable championId={champion.champion_name_en!} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
