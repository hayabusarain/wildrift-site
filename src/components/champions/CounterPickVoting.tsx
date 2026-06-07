'use client';

import { useState, useEffect } from 'react';
import { ThumbsDown, Plus, X, Search, ChevronUp, ChevronDown } from 'lucide-react';

interface CounterData {
  champion_name_en: string;
  upvotes: number;
  downvotes: number;
  isStatic?: boolean;
}

interface CounterPickVotingProps {
  championId: string;
  staticCounters?: any;
  allChampions: any[];
  dict: {
    title: string;
    suggest: string;
    searchPlaceholder: string;
    notFound: string;
    alreadyExists: string;
    noData: string;
    cancelInstruction: string;
  };
}

export function CounterPickVoting({ championId, staticCounters, allChampions, dict }: CounterPickVotingProps) {
  const [counters, setCounters] = useState<CounterData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [localVotes, setLocalVotes] = useState<Record<string, 'up'|'down'>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('counter_votes');
    if (stored) {
      try { setLocalVotes(JSON.parse(stored)); } catch(e){}
    }
    
    fetchData();
  }, [championId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/counters?championId=${championId}`);
      if (res.ok) {
        const { data } = await res.json();
        
        const mergedMap = new Map<string, CounterData>();
        
        if (staticCounters?.weak_against) {
          staticCounters.weak_against.forEach((c: any) => {
            mergedMap.set(c.champion_name_en, {
              champion_name_en: c.champion_name_en,
              upvotes: 0,
              downvotes: 0,
              isStatic: true
            });
          });
        }
        
        if (data) {
          data.forEach((d: any) => {
            if (mergedMap.has(d.counter_champion_id)) {
              const existing = mergedMap.get(d.counter_champion_id)!;
              existing.upvotes += d.upvotes || 0;
              existing.downvotes += d.downvotes || 0;
            } else {
              mergedMap.set(d.counter_champion_id, {
                champion_name_en: d.counter_champion_id,
                upvotes: d.upvotes || 0,
                downvotes: d.downvotes || 0
              });
            }
          });
        }
        
        const finalArray = Array.from(mergedMap.values()).filter(c => {
          const score = c.upvotes - c.downvotes;
          return c.isStatic ? score >= 0 : score > 0;
        });

        finalArray.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        setCounters(finalArray);
      }
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleVote = async (counterChampionId: string, type: 'up'|'down') => {
    const voteKey = `${championId}_${counterChampionId}`;
    const currentVote = localVotes[voteKey];
    
    let action: 'add' | 'remove' = 'add';
    let targetType = type;

    if (currentVote === type) {
      action = 'remove';
    } else if (currentVote) {
      alert(dict.cancelInstruction);
      return;
    }
    
    setCounters(prev => prev.map(c => {
      if (c.champion_name_en === counterChampionId) {
        return {
          ...c,
          upvotes: targetType === 'up' ? (action === 'add' ? c.upvotes + 1 : Math.max(0, c.upvotes - 1)) : c.upvotes,
          downvotes: targetType === 'down' ? (action === 'add' ? c.downvotes + 1 : Math.max(0, c.downvotes - 1)) : c.downvotes
        };
      }
      return c;
    }));

    const newVotes = { ...localVotes };
    if (action === 'add') {
      newVotes[voteKey] = targetType;
    } else {
      delete newVotes[voteKey];
    }
    setLocalVotes(newVotes);
    localStorage.setItem('counter_votes', JSON.stringify(newVotes));

    try {
      await fetch('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          championId,
          counterChampionId,
          voteType: targetType,
          action
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSuggest = async (counterChampionId: string) => {
    setIsModalOpen(false);
    
    const existingIndex = counters.findIndex(c => c.champion_name_en === counterChampionId);
    if (existingIndex !== -1) {
      const c = counters[existingIndex];
      const score = c.upvotes - c.downvotes;
      const isVisible = c.isStatic ? score >= 0 : score > 0;
      
      if (isVisible) {
        alert(dict.alreadyExists);
        return;
      } else {
        const voteKey = `${championId}_${counterChampionId}`;
        const currentVote = localVotes[voteKey];
        if (currentVote) {
          alert(dict.cancelInstruction);
          return;
        }

        setCounters(prev => {
          const arr = [...prev];
          arr[existingIndex] = { ...arr[existingIndex], upvotes: arr[existingIndex].upvotes + 1 };
          return arr.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        });

        const newVotes = { ...localVotes, [voteKey]: 'up' as const };
        setLocalVotes(newVotes);
        localStorage.setItem('counter_votes', JSON.stringify(newVotes));

        try {
          await fetch('/api/counters', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              championId,
              counterChampionId,
              voteType: 'up',
              action: 'add'
            })
          });
        } catch(e) {
          console.error(e);
        }
        return;
      }
    }
    
    const voteKey = `${championId}_${counterChampionId}`;
    const newVotes = { ...localVotes, [voteKey]: 'up' as const };
    setLocalVotes(newVotes);
    localStorage.setItem('counter_votes', JSON.stringify(newVotes));

    setCounters(prev => [...prev, {
      champion_name_en: counterChampionId,
      upvotes: 1,
      downvotes: 0,
      isStatic: false
    }].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)));

    try {
      await fetch('/api/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          championId,
          counterChampionId,
          voteType: 'up',
          action: 'add'
        })
      });
    } catch(e) {
      console.error(e);
    }
  };

  const filteredChampions = Array.from(new Map(allChampions.filter(c => 
    c.champion_name_en.toLowerCase() !== championId.toLowerCase() &&
    (c.champion_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.champion_name_en?.toLowerCase().includes(searchQuery.toLowerCase()))
  ).map(c => [c.champion_name_en, c])).values());

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-5 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
          <ThumbsDown size={16} className="text-rose-500" />
          {dict.title}
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
        >
          <Plus size={14} /> {dict.suggest}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-6 text-slate-400"><div className="animate-pulse">Loading...</div></div>
      ) : counters.filter(c => {
          const score = c.upvotes - c.downvotes;
          return c.isStatic ? score >= 0 : score > 0;
        }).slice(0, 5).length === 0 ? (
        <div className="text-center py-6 text-slate-400 text-sm font-medium">
          {dict.noData}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {counters.filter(c => {
            const score = c.upvotes - c.downvotes;
            return c.isStatic ? score >= 0 : score > 0;
          }).slice(0, 5).map(c => {
            const voteKey = `${championId}_${c.champion_name_en}`;
            const userVote = localVotes[voteKey];

            return (
              <div key={c.champion_name_en} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img 
                    src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${c.champion_name_en}.png`}
                    alt={c.champion_name_en}
                    className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = `/images/champions/${c.champion_name_en}.avif`; }}
                  />
                  <span className="text-sm font-black text-slate-800">{c.champion_name_en}</span>
                </div>
                
                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button 
                    onClick={() => handleVote(c.champion_name_en, 'up')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${userVote === 'up' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
                  >
                    <ChevronUp size={16} strokeWidth={userVote === 'up' ? 3 : 2} /> {c.upvotes}
                  </button>
                  <div className="w-px h-4 bg-slate-200"></div>
                  <button 
                    onClick={() => handleVote(c.champion_name_en, 'down')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors ${userVote === 'down' ? 'bg-rose-100 text-rose-700' : 'text-slate-400 hover:bg-slate-50 hover:text-rose-600'}`}
                  >
                    <ChevronDown size={16} strokeWidth={userVote === 'down' ? 3 : 2} /> {c.downvotes}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h4 className="font-black text-slate-800">{dict.suggest}</h4>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-4 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder={dict.searchPlaceholder}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 rounded-xl py-2.5 pl-9 pr-4 text-sm font-medium transition-all outline-none"
                />
              </div>
            </div>
            <div className="overflow-y-auto p-2 flex-1">
              {filteredChampions.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm">{dict.notFound}</div>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {filteredChampions.map(c => (
                    <button 
                      key={c.champion_name_en}
                      onClick={() => handleSuggest(c.champion_name_en)}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left w-full"
                    >
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${c.champion_name_en}.png`}
                        alt={c.champion_name_en}
                        className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = `/images/champions/${c.champion_name_en}.avif`; }}
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{c.champion_name || c.champion_name_en}</div>
                        <div className="text-[10px] font-bold text-slate-400">{c.role}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
