'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, Plus, User, Clock, Trash2 } from 'lucide-react';
import { BuildSubmitModal } from './BuildSubmitModal';

interface BuildData {
  id: string;
  champion_id: string;
  title: string;
  author_name: string;
  description: string;
  items: string[];
  spells: string[];
  runes: {
    keystone?: string;
    subRunes?: string[];
  };
  upvotes: number;
  created_at: string;
}

interface BuildListProps {
  championId: string;
  allItems: any[];
  allRunes: any[];
  allSpells: any[];
}

export function BuildList({ championId, allItems, allRunes, allSpells }: BuildListProps) {
  const [builds, setBuilds] = useState<BuildData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localVotes, setLocalVotes] = useState<Record<string, boolean>>({});

  const getItemImageUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('/') ? url : `https://ddragon.leagueoflegends.com/cdn/14.8.1/img/item/${url}`;
  };

  useEffect(() => {
    const stored = localStorage.getItem('build_votes');
    if (stored) {
      try { setLocalVotes(JSON.parse(stored)); } catch(e) {}
    }
    fetchBuilds();
  }, [championId]);

  const fetchBuilds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/builds?championId=${championId}`);
      if (res.ok) {
        const { data } = await res.json();
        setBuilds(data || []);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleVote = async (buildId: string) => {
    const isUpvoted = localVotes[buildId];
    const action = isUpvoted ? 'remove' : 'add';

    setBuilds(prev => prev.map(b => {
      if (b.id === buildId) {
        return { ...b, upvotes: isUpvoted ? Math.max(0, b.upvotes - 1) : b.upvotes + 1 };
      }
      return b;
    }));

    const newVotes = { ...localVotes };
    if (action === 'add') {
      newVotes[buildId] = true;
    } else {
      delete newVotes[buildId];
    }
    setLocalVotes(newVotes);
    localStorage.setItem('build_votes', JSON.stringify(newVotes));

    try {
      await fetch('/api/builds/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildId, action })
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (buildId: string) => {
    const password = prompt('削除用パスワードを入力してください:');
    if (!password) return;

    try {
      const res = await fetch('/api/builds', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: buildId, delete_password: password })
      });

      if (res.ok) {
        alert('削除しました。');
        fetchBuilds();
      } else {
        const errorData = await res.json();
        alert(errorData.error || '削除に失敗しました。パスワードが間違っている可能性があります。');
      }
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました。');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800">みんなのビルド</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={18} />
          投稿する
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-slate-400">
          <div className="animate-pulse">Loading builds...</div>
        </div>
      ) : builds.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-12 text-center">
          <div className="text-slate-400 mb-2 font-medium">まだ投稿されたビルドがありません</div>
          <p className="text-sm text-slate-500">最初のビルドを投稿して、おすすめ構成をシェアしましょう！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {builds.map(build => (
            <div key={build.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-1">{build.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1"><User size={14} /> {build.author_name}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(build.created_at).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleVote(build.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black transition-all ${localVotes[build.id] ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                  >
                    <ThumbsUp size={16} className={localVotes[build.id] ? 'fill-indigo-700' : ''} />
                    {build.upvotes}
                  </button>
                  <button
                    onClick={() => handleDelete(build.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-xl border border-transparent hover:border-rose-100"
                    title="この投稿を削除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="p-5 bg-slate-50 flex flex-col lg:flex-row gap-6">
                {/* Items */}
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Items</h4>
                  <div className="flex flex-wrap gap-2">
                    {build.items?.map((itemId, idx) => {
                      const item = allItems.find(i => i.id === itemId);
                      return item ? (
                        <div key={idx} className="relative group">
                          <img src={getItemImageUrl(item.image)} alt={item.nameJa} className="w-12 h-12 rounded-xl border border-slate-200 shadow-sm" />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                            {item.nameJa}
                          </div>
                        </div>
                      ) : null;
                    })}
                    {(!build.items || build.items.length === 0) && <span className="text-sm text-slate-400">指定なし</span>}
                  </div>
                </div>

                {/* Spells & Runes */}
                <div className="flex-1">
                  <div className="flex flex-col gap-6">
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Spells</h4>
                      <div className="flex items-center gap-2">
                        {build.spells?.map((spellId, idx) => {
                          const spell = allSpells.find(s => s.id === spellId);
                          return spell ? (
                            <div key={idx} className="relative group">
                              <img src={spell.image} alt={spell.nameJa} className="w-10 h-10 rounded-lg shadow-sm" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                                {spell.nameJa}
                              </div>
                            </div>
                          ) : null;
                        })}
                        {(!build.spells || build.spells.length === 0) && <span className="text-sm text-slate-400">指定なし</span>}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Runes</h4>
                      <div className="flex items-center gap-3">
                        {build.runes?.keystone && (() => {
                          const rune = allRunes.find(r => r.id === build.runes.keystone);
                          return rune ? (
                            <div className="relative group">
                              <img src={rune.image} alt={rune.nameJa} className="w-14 h-14 rounded-full bg-slate-800 border-2 border-indigo-400 shadow-sm" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                                {rune.nameJa}
                              </div>
                            </div>
                          ) : null;
                        })()}
                        
                        {build.runes?.subRunes && build.runes.subRunes.length > 0 && (
                          <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-full border border-slate-200">
                            {build.runes.subRunes.slice(0, 3).map((runeId, idx) => {
                              const rune = allRunes.find(r => r.id === runeId);
                              return rune ? (
                                <div key={idx} className="relative group">
                                  <img src={rune.image} alt={rune.nameJa} className="w-8 h-8 rounded-full bg-slate-800 shadow-sm" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                                    {rune.nameJa}
                                  </div>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}

                        {build.runes?.subRunes && build.runes.subRunes.length > 3 && (
                          <>
                            <div className="w-1 h-1 rounded-full bg-slate-300 mx-1"></div>
                            <div className="flex gap-2 bg-slate-200/50 p-1.5 rounded-full border border-slate-200">
                              {build.runes.subRunes.slice(3).map((runeId, idx) => {
                                const rune = allRunes.find(r => r.id === runeId);
                                return rune ? (
                                  <div key={idx} className="relative group">
                                    <img src={rune.image} alt={rune.nameJa} className="w-8 h-8 rounded-full bg-slate-800 shadow-sm" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 font-bold">
                                      {rune.nameJa}
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {build.description && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">解説</h4>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{build.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <BuildSubmitModal 
          championId={championId}
          allItems={allItems}
          allRunes={allRunes}
          allSpells={allSpells}
          onClose={() => setIsModalOpen(false)}
          onSubmitSuccess={fetchBuilds}
        />
      )}
    </div>
  );
}
