'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminChampionEditor() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    runes: '',
    items: '',
    custom_skills: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from('wr_champion_details')
          .select('*')
          .eq('champion_id', id)
          .single();
          
        if (data) {
          setFormData({
            runes: typeof data.runes === 'object' ? JSON.stringify(data.runes, null, 2) : data.runes || '',
            items: typeof data.items === 'object' ? JSON.stringify(data.items, null, 2) : data.items || '',
            custom_skills: data.custom_skills || ''
          });
        }
      } catch (err) {
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      let parsedRunes = formData.runes;
      let parsedItems = formData.items;
      try { parsedRunes = JSON.parse(formData.runes); } catch (e) {}
      try { parsedItems = JSON.parse(formData.items); } catch (e) {}

      const { error } = await supabase
        .from('wr_champion_details')
        .upsert({
          champion_id: id,
          runes: parsedRunes,
          items: parsedItems,
          custom_skills: formData.custom_skills,
          updated_at: new Date().toISOString()
        }, { onConflict: 'champion_id' });

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving details:', err);
      alert('保存に失敗しました。');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link href="/admin/champions" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-800 mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" />
        管理画面一覧に戻る
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 p-8 flex items-center gap-6">
          <img 
            src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${id}.png`}
            alt={id}
            className="w-20 h-20 rounded-xl border-2 border-slate-700 shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-black text-white">{id}</h1>
            <p className="text-slate-400 font-medium">ワイリフ専用データ編集</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              おすすめルーン (Markdown / Text)
            </label>
            <textarea
              className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例:&#10;キーストーン: 征服者&#10;メイン: 凱旋 / 最後の慈悲&#10;サブ: 息継ぎ"
              value={formData.runes}
              onChange={e => setFormData({...formData, runes: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              ワイリフでの変更点・コンボなど (オプション)
            </label>
            <textarea
              className="w-full h-24 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="例: ワイリフではUltの仕様が〇〇に変更されています。"
              value={formData.custom_skills}
              onChange={e => setFormData({...formData, custom_skills: e.target.value})}
            />
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link href={`/champions/${id}`} target="_blank" className="text-sm font-bold text-indigo-600 hover:underline">
              実際の専用ページを確認する ↗
            </Link>
            
            <div className="flex items-center gap-4">
              {success && (
                <span className="flex items-center text-sm font-bold text-emerald-600">
                  <CheckCircle2 size={16} className="mr-1" /> 保存しました
                </span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                <Save size={18} className="mr-2" />
                {saving ? '保存中...' : 'データを保存'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
