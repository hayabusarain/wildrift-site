'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Sword, Shield, Zap, Target, Star, Edit3, Save, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { parseLocalizedText, parseVariables, formatSkillDescription } from '@/utils/localization';
import { PatchTable } from '@/components/patches/PatchTable';
import { CounterPickVoting } from '@/components/champions/CounterPickVoting';

import fallbackStats from '@/data/champion_stats.json';
import skillsJa from '../../../../../public/data/skills/ja.json';
import skillsEn from '../../../../../public/data/skills/en.json';

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
  
  const champId = Array.isArray(id) ? id[0] : id;

  const { initialChampion, initialStats, initialWrDetails } = useMemo(() => {
    if (!champId) {
      return { initialChampion: null, initialStats: [], initialWrDetails: null };
    }

    const matchedStats = (fallbackStats as any[]).filter(
      (s) => s.champion_name_en.toLowerCase() === champId.toLowerCase()
    );

    let fallbackName = champId;
    let fallbackRole = 'Mage';
    if (matchedStats.length > 0) {
      fallbackName = locale === 'ja' ? matchedStats[0].champion_name : matchedStats[0].champion_name_en;
      fallbackRole = matchedStats[0].role;
    } else if (champId.toLowerCase() === 'norra') {
      fallbackName = locale === 'ja' ? 'ノラ' : 'Norra';
      fallbackRole = 'Support';
    }

    let specificLore = locale === 'ja' 
      ? "ヨードルの魔女であるノラは、マジカルキャット「ユーミ」のかつてのご主人です。彼女は「境界の書」の最後のページと繋がる世界に行こうとした際、はるか遠くの奇妙な世界に飛ばされ、失踪してしまいました。現在は領域の果てで出会った少し変わった新しい友人たちの助けを借りながら、愛猫のユーミが待つ家へ帰るための正しいポータルを探す壮大な旅を続けています。"
      : "Norra is a yordle enchantress and the former master of the magical cat Yuumi. While attempting to travel to the world connected by the final page of the Book of Thresholds, she was accidentally transported to a strange, distant realm. Now, with the help of new, peculiar friends she met at the edge of the realm, she is on an epic journey to find the right portal back home to her beloved cat.";

    if (champId.toLowerCase() === 'norra') {
      specificLore = locale === 'ja' 
        ? "ヨードルの魔女であるノラは、マジカルキャット「ユーミ」のかつてのご主人です。彼女は「境界の書」の最後のページと繋がる世界に行こうとした際、はるか遠くの奇妙な世界に飛ばされ、失踪してしまいました。現在は領域の果てで出会った少し変わった新しい友人たちの助けを借りながら、愛猫のユーミが待つ家へ帰るための正しいポータルを探す壮大な旅を続けています。"
        : "Norra is a yordle enchantress and the former master of the magical cat Yuumi. While attempting to travel to the world connected by the final page of the Book of Thresholds, she was accidentally transported to a strange, distant realm. Now, with the help of new, peculiar friends she met at the edge of the realm, she is on an epic journey to find the right portal back home to her beloved cat.";
    } else if (champId.toLowerCase() === 'garen') {
      specificLore = locale === 'ja'
        ? "気高き戦士ガレンは、デマーシアの軍隊「不屈の先鋒」を率いる模範的指揮官である。"
        : "Garen is a noble warrior who leads the Dauntless Vanguard.";
    }

    const champDetail: ChampionDetailData = {
      id: champId,
      name: fallbackName,
      title: champId === 'Norra' ? 'Wild Rift Exclusive' : 'The Might of Demacia',
      lore: specificLore,
      tags: [fallbackRole],
      info: { attack: 5, defense: 5, magic: 5, difficulty: 5 },
      champion_name_en: champId
    };

    const skillsSource = locale === 'ja' ? skillsJa : skillsEn;
    const skillKey = Object.keys(skillsSource).find(
      key => key.toLowerCase() === champId.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === champId.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    );
    const initialSkills = skillKey ? (skillsSource as any)[skillKey] : null;
    const wrDet = initialSkills ? {
      champion_id: champId,
      skills: initialSkills
    } : null;

    return {
      initialChampion: champDetail,
      initialStats: matchedStats,
      initialWrDetails: wrDet
    };
  }, [champId, locale]);
  
  const [champion, setChampion] = useState<ChampionDetailData | null>(initialChampion);
  const [stats, setStats] = useState<any[]>(initialStats);
  const [wrDetails, setWrDetails] = useState<any>(initialWrDetails);
  const [staticCounters, setStaticCounters] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // インライン編集用のステート
  const [isDevelopment, setIsDevelopment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSkills, setEditingSkills] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState<Record<number, boolean>>({ 0: true, 1: false, 2: false, 3: false, 4: false });

  const toggleSkill = (idx: number) => {
    setExpandedSkills(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

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
      setChampion(initialChampion);
      setStats(initialStats);
      setWrDetails(initialWrDetails);
      setLoading(false);
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
        
        // Fetch static counters data
        try {
          const counterRes = await fetch('/data/counters.json?t=' + Date.now());
          if (counterRes.ok) {
            const counterData = await counterRes.json();
            const counterKey = Object.keys(counterData).find(
              key => key.toLowerCase() === id.toLowerCase() || key.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
            );
            if (counterKey) {
              setStaticCounters(counterData[counterKey]);
            }
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
    <div className="pb-24 bg-slate-50 min-h-screen">
      {/* Header Profile Section */}
      <div className="bg-white px-4 pt-6 pb-8 border-b border-slate-200 flex flex-col items-center text-center relative shadow-sm">
        <Link href="/champions" className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full active:scale-95 transition-transform">
          <ArrowLeft size={20} />
        </Link>
        <div className="relative mt-2">
          <img 
            src={id === 'Norra' ? `/images/champions/Norra.avif` : `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${id}.png`}
            alt={champion.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-slate-100 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `/images/champions/${id}.avif`;
              (e.target as HTMLImageElement).onerror = null;
            }}
          />
        </div>
        <h2 className="text-sm font-bold text-slate-500 mt-4 mb-1">{champion.title}</h2>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{champion.name}</h1>
        
        <div className="flex flex-wrap justify-center gap-2">
          {champion.tags.map(tag => {
            let translatedTag = tag;
            if (tag === 'Fighter') translatedTag = t('role_fighter') || tag;
            if (tag === 'Mage') translatedTag = t('role_mage') || tag;
            if (tag === 'Assassin') translatedTag = t('role_assassin') || tag;
            if (tag === 'Marksman') translatedTag = t('role_marksman') || tag;
            if (tag === 'Tank') translatedTag = t('role_tank') || tag;
            if (tag === 'Support') translatedTag = t('role_support') || tag;

            return (
              <span key={tag} className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getRoleColor(tag.toUpperCase())}`}>
                {translatedTag}
              </span>
            );
          })}
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
        {/* Current Meta Stats */}
        {stats.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Target size={16} className="text-indigo-500" />
              {t('latestMetaStats')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, idx) => (
                <div key={stat.id ? `${stat.id}-${idx}` : `${stat.role}-${idx}`} className="flex flex-col items-center bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border mb-2 ${getRoleColor(stat.role)}`}>
                    {stat.role}
                  </span>
                  <div className="text-xl font-black text-slate-800 leading-none mb-1">{stat.tier}</div>
                  <div className={`text-sm font-bold ${stat.win_rate >= 50 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {stat.win_rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Skills Section */}
        {wrDetails?.skills && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-slate-500 flex items-center gap-2 uppercase tracking-wider">
                <Sword size={16} className="text-indigo-500" />
                {t('skills')}
              </h3>
              {isDevelopment && locale === 'ja' && (
                <div className="flex items-center">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={toggleEditMode} disabled={isSaving} className="p-2 text-slate-400 bg-slate-100 rounded-full">
                        <X size={14} />
                      </button>
                      <button onClick={handleSaveSkills} disabled={isSaving} className="p-2 text-white bg-indigo-600 rounded-full">
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      </button>
                    </div>
                  ) : (
                    <button onClick={toggleEditMode} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                      編集
                    </button>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {(isEditing ? editingSkills : wrDetails.skills).map((skill: any, idx: number) => {
                const isExpanded = expandedSkills[idx] || isEditing;
                
                return (
                  <div key={idx} className="flex flex-col bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden transition-all">
                    <div 
                      className={`flex gap-3 p-4 cursor-pointer hover:bg-slate-100 transition-colors items-center ${isExpanded ? 'border-b border-slate-100' : ''}`}
                      onClick={() => !isEditing && toggleSkill(idx)}
                    >
                      <img 
                        src={skill.icon || `/images/champions/${id}.avif`} 
                        alt={skill.name} 
                        className={`w-12 h-12 flex-shrink-0 ${skill.id === 'P' ? 'rounded-full' : 'rounded-xl'} border border-slate-200 shadow-sm bg-white object-cover`}
                        onError={(e) => { (e.target as HTMLImageElement).src = `/images/champions/${id}.avif`; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded">
                            {getSkillLabel(skill.id)}
                          </span>
                          {isEditing ? (
                            <input type="text" value={skill.name} onChange={(e) => handleSkillChange(idx, 'name', e.target.value)} className="text-base font-bold text-slate-800 border-b border-indigo-400 focus:outline-none w-full" onClick={(e) => e.stopPropagation()} />
                          ) : (
                            <h4 className="text-base font-bold text-slate-900 truncate">{skill.name}</h4>
                          )}
                        </div>
                        {skill.cooldown_text && (
                          <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                            ⏳ {translateCooldownText(skill.cooldown_text, locale)}
                          </div>
                        )}
                      </div>
                      {!isEditing && (
                        <div className="text-slate-400 p-2">
                          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      )}
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 flex flex-col gap-3 bg-white">
                        {isEditing ? (
                          <textarea value={skill.description} onChange={(e) => handleSkillChange(idx, 'description', e.target.value)} className="w-full text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-indigo-300 focus:outline-none min-h-[100px]" />
                        ) : (
                          <div className="text-sm text-slate-600 leading-relaxed font-medium space-y-2" dangerouslySetInnerHTML={renderDescriptionWithIcons(skill.description)} />
                        )}

                        {skill.table && (
                          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-100 bg-slate-50">
                            <table className="w-full text-xs text-left min-w-max">
                              <thead className="text-slate-400 font-bold border-b border-slate-200">
                                <tr>
                                  <th className="px-3 py-2 font-bold">{locale === 'ja' ? '詳細' : 'Details'}</th>
                                  {skill.table.headers.map((h: string, i: number) => (
                                    <th key={i} className="px-3 py-2 text-center text-slate-500 font-bold">{h}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {skill.table.rows.map((row: any, rIdx: number) => (
                                  <tr key={rIdx}>
                                    <td className="px-3 py-2 font-bold text-slate-600 bg-white border-r border-slate-100">
                                      {translateTableLabel(row.label, locale)}
                                    </td>
                                    {row.values.map((v: string, vIdx: number) => (
                                      <td key={vIdx} className="px-3 py-2 text-center font-bold text-slate-700 bg-white">
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
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Counters Voting Section */}
        <CounterPickVoting 
          championId={champion.champion_name_en || id} 
          staticCounters={staticCounters} 
          allChampions={fallbackStats}
          dict={{
            title: t('counters') || '相性（カウンター）',
            suggest: locale === 'en' ? 'Suggest Counter' : 'カウンターを提案',
            searchPlaceholder: locale === 'en' ? 'Search champion...' : 'チャンピオン名で検索...',
            notFound: locale === 'en' ? 'Not found' : '見つかりませんでした',
            alreadyExists: locale === 'en' ? 'Already exists in the list!' : '既にリストに存在します！',
            noData: locale === 'en' ? 'No counters suggested yet. Be the first!' : 'カウンター情報がまだありません。提案してください！',
            cancelInstruction: locale === 'en' ? 'Please click your current vote again to cancel it before voting differently.' : '現在の投票をもう一度クリックして取り消してから、新しく投票してください。'
          }}
        />

        {/* Community Builds Link */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              {t('buildsTitle')}
            </h3>
            <p className="text-xs text-slate-400 font-bold">{t('buildsDesc')}</p>
          </div>
          <Link 
            href={`/champions/${id}/builds`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex-shrink-0"
          >
            {t('viewBuilds')}
          </Link>
        </div>

        {/* Lore */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-black text-slate-500 mb-3 uppercase tracking-wider">{t('lore')}</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {champion.lore}
          </p>
        </div>

        {/* Patch History Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <span className="text-indigo-500 text-lg">#</span>
              {t('PatchHistory') || 'Patch History'}
            </h3>
          </div>
          <div className="p-4">
            <PatchTable championId={champion.champion_name_en!} />
          </div>
        </div>
      </div>
    </div>
  );
}
