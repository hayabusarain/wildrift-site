'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Sword, Shield, Zap, Target, Star, Edit3, Save, X, Loader2, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';
import { PatchTable } from '@/components/patches/PatchTable';
import { CounterPickVoting } from '@/components/champions/CounterPickVoting';
import { formatSkillDescription } from '@/utils/localization';

export interface ChampionDetailClientProps {
  id: string;
  champion: any;
  stats: any[];
  wrDetails: any;
  staticCounters: any;
  fallbackStats: any[];
  combos?: any[];
  guide?: any;
}

export default function ChampionDetailClient({
  id,
  champion: initialChampion,
  stats,
  wrDetails: initialWrDetails,
  staticCounters,
  fallbackStats,
  combos = [],
  guide,
}: ChampionDetailClientProps) {
  const locale = useLocale();
  const t = useTranslations("ChampionDetail");

  const [champion, setChampion] = useState<any>(initialChampion);
  const [wrDetails, setWrDetails] = useState<any>(initialWrDetails);

  // Update state if props change
  useEffect(() => {
    setChampion(initialChampion);
    setWrDetails(initialWrDetails);
  }, [initialChampion, initialWrDetails]);

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
          password: '',
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

  if (!champion) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Champion not found</h1>
        <Link href="/champions" className="text-indigo-600 hover:underline mt-4 inline-block">← Back to Roster</Link>
      </div>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'TOP': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'JUNGLE': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'MID': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ADC': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'SUPPORT': return 'bg-teal-100 text-teal-700 border-teal-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
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

  // サーバー側でパース済みの場合はそのまま表示
  // もし置換が必要ならサーバー側で処理しておく
  const renderDescriptionWithIcons = (htmlContent: string) => {
    if (!htmlContent) return { __html: '' };

    // 1. Keyword based coloring
    let replaced = formatSkillDescription(htmlContent);
    
    // 改行コードを <br /> に変換
    replaced = replaced.replace(/\n/g, '<br />');
    
    // 2. Icon placeholders
    replaced = replaced.replace(/\[ICON_AD\]/g, '<span class="inline-flex items-center justify-center bg-orange-100 text-orange-600 border border-orange-300 rounded px-1 mx-0.5 text-[10px] font-black" title="物理攻撃力 (AD)">⚔️AD</span>');
    replaced = replaced.replace(/\[ICON_AP\]/g, '<span class="inline-flex items-center justify-center bg-purple-100 text-purple-600 border border-purple-300 rounded px-1 mx-0.5 text-[10px] font-black" title="魔力 (AP)">✨AP</span>');
    replaced = replaced.replace(/\[ICON_HP\]/g, '<span class="inline-flex items-center justify-center bg-green-100 text-green-700 border border-green-300 rounded px-1 mx-0.5 text-[10px] font-black" title="体力 (HP)">❤️HP</span>');
    replaced = replaced.replace(/\[ICON_AR\]/g, '<span class="inline-flex items-center justify-center bg-yellow-100 text-yellow-700 border border-yellow-300 rounded px-1 mx-0.5 text-[10px] font-black" title="物理防御 (Armor)">🛡️AR</span>');
    replaced = replaced.replace(/\[ICON_MR\]/g, '<span class="inline-flex items-center justify-center bg-blue-100 text-blue-700 border border-blue-300 rounded px-1 mx-0.5 text-[10px] font-black" title="魔法防御 (MR)">🌀MR</span>');
    replaced = replaced.replace(/\[ICON_MS\]/g, '<span class="inline-flex items-center justify-center bg-teal-100 text-teal-700 border border-teal-300 rounded px-1 mx-0.5 text-[10px] font-black" title="移動速度 (MS)">👟MS</span>');
    replaced = replaced.replace(/\[ICON_AS\]/g, '<span class="inline-flex items-center justify-center bg-red-100 text-red-700 border border-red-300 rounded px-1 mx-0.5 text-[10px] font-black" title="攻撃速度 (AS)">🗡️AS</span>');

    return { __html: replaced };
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
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
          {champion.tags.map((tag: string) => {
            let translatedTag = tag;
            if (tag.toLowerCase() === 'fighter') translatedTag = t('role_fighter') || tag;
            if (tag.toLowerCase() === 'mage') translatedTag = t('role_mage') || tag;
            if (tag.toLowerCase() === 'assassin') translatedTag = t('role_assassin') || tag;
            if (tag.toLowerCase() === 'marksman') translatedTag = t('role_marksman') || tag;
            if (tag.toLowerCase() === 'tank') translatedTag = t('role_tank') || tag;
            if (tag.toLowerCase() === 'support') translatedTag = t('role_support') || tag;

            return (
              <span key={tag} className={`px-3 py-1 text-[11px] font-bold rounded-full border ${getRoleColor(tag)}`}>
                {translatedTag}
              </span>
            );
          })}
        </div>
      </div>

      <div className="px-4 space-y-4 mt-4">
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

        {guide && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <ThumbsUp size={16} className="text-emerald-500" />
                {locale === 'ja' ? '強み (Strengths)' : 'Strengths'}
              </h3>
              <ul className="space-y-2">
                {(locale === 'en' && guide.strengthsEn ? guide.strengthsEn : guide.strengths).map((point: string, idx: number) => (
                  <li key={`str-${idx}`} className="flex gap-2 items-start text-sm text-slate-700 font-bold leading-relaxed bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                    <span className="text-emerald-500 font-black shrink-0 mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <ThumbsDown size={16} className="text-rose-500" />
                {locale === 'ja' ? '弱点 (Weaknesses)' : 'Weaknesses'}
              </h3>
              <ul className="space-y-2">
                {(locale === 'en' && guide.weaknessesEn ? guide.weaknessesEn : guide.weaknesses).map((point: string, idx: number) => (
                  <li key={`weak-${idx}`} className="flex gap-2 items-start text-sm text-slate-700 font-bold leading-relaxed bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">
                    <span className="text-rose-500 font-black shrink-0 mt-0.5">×</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-500 mb-3 flex items-center gap-2 uppercase tracking-wider">
                <BookOpen size={16} className="text-indigo-500" />
                {locale === 'ja' ? '基本の立ち回り' : 'Playstyle'}
              </h3>
              <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100">
                <p className="text-sm text-slate-700 font-bold leading-loose whitespace-pre-wrap">
                  {locale === 'en' && guide.playstyleEn ? guide.playstyleEn : guide.playstyle}
                </p>
              </div>
            </div>
          </div>
        )}

        {combos && combos.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-sm font-black text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Zap size={16} className="text-amber-500" />
              {locale === 'ja' ? '基本コンボ' : 'Basic Combos'}
            </h3>
            <div className="space-y-4">
              {combos.map((combo, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-3">
                  <div>
                    <h4 className="text-base font-black text-slate-900 mb-1">
                      {locale === 'en' && combo.nameEn ? combo.nameEn : combo.name}
                    </h4>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed">
                      {locale === 'en' && combo.descriptionEn ? combo.descriptionEn : combo.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {combo.sequence.split('->').map((step: string, stepIdx: number, arr: string[]) => {
                      const trimmed = step.trim();
                      const isAttack = trimmed.toLowerCase() === 'aa' || trimmed === '通常攻撃';
                      const isSpell = trimmed === 'フラッシュ' || trimmed.toLowerCase() === 'flash';
                      
                      let badgeClass = "bg-indigo-100 text-indigo-700 border-indigo-200";
                      if (isAttack) badgeClass = "bg-amber-100 text-amber-700 border-amber-200";
                      else if (isSpell) badgeClass = "bg-rose-100 text-rose-700 border-rose-200";
                      
                      return (
                        <div key={stepIdx} className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-xs font-black rounded border shadow-sm ${badgeClass}`}>
                            {trimmed}
                          </span>
                          {stepIdx < arr.length - 1 && (
                            <span className="text-slate-300 font-black">▶</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-sm font-black text-slate-500 mb-3 uppercase tracking-wider">{t('lore')}</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {champion.lore}
          </p>
        </div>

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
