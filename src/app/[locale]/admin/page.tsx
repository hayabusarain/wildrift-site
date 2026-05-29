'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldAlert, Database, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const t = useTranslations('Admin');
  
  const [password, setPassword] = useState('');
  const [version, setVersion] = useState('');
  const [patchText, setPatchText] = useState('');
  const [statsText, setStatsText] = useState('');
  const [loadingPatch, setLoadingPatch] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handlePatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPatch(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/parse-patch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version, rawText: patchText, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage(`✅ 成功: バージョン ${data.version} が保存されました。`);
        setVersion('');
        setPatchText('');
      } else {
        setMessage(`❌ エラー: ${data.error || 'パッチノートの解析に失敗しました。'}`);
      }
    } catch (err: any) {
      setMessage(`❌ エラー: ${err.message}`);
    } finally {
      setLoadingPatch(false);
    }
  };

  const handleStatsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingStats(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/parse-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: statsText, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'パース失敗');

      setMessage(`✅ 成功: ${data.count}体のチャンピオン統計データを更新しました！`);
      setStatsText('');
    } catch (err: any) {
      setMessage(`❌ エラー: ${err.message}`);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10 px-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
          <p className="text-slate-500 text-sm">Manual Patch Notes Sync & AI Stats Parsing</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-lg text-sm font-medium bg-slate-100 text-slate-800 border border-slate-200">
          {message}
        </div>
      )}

      <div className="space-y-1.5 mb-6">
        <label className="block text-sm font-bold text-slate-700">Admin Password</label>
        <input 
          type="password" 
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password..."
          className="w-full max-w-sm px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* パッチノート更新フォーム */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-slate-800">
            <Database size={20} className="text-blue-500" />
            パッチノートの手動更新
          </h2>
          <form onSubmit={handlePatchSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">バージョン (例: 5.1a)</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">パッチノート本文 (コピペ)</label>
              <textarea
                value={patchText}
                onChange={(e) => setPatchText(e.target.value)}
                className="w-full h-[324px] p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="ここに公式サイトのテキストを貼り付け..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingPatch}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loadingPatch ? 'AIが解析中... (数十秒かかります)' : '📝 パッチを解析してDBに保存'}
            </button>
          </form>
        </div>

        {/* チャンピオン統計更新フォーム */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
              <Database size={20} className="text-indigo-500" />
              統計データ・Tier表の更新
            </h2>
            <a href={`/ja/admin/skills`} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
              スキル文章の管理・翻訳 →
            </a>
          </div>
          <form onSubmit={handleStatsSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-4">
                外部サイト（中国の勝率サイトなど）の表データを、そのまま全選択してコピー＆ペーストしてください。<br/>
                AIが勝率・ピック率を自動で抽出し、Tierを再評価します。
              </p>
              <label className="block text-sm font-medium text-slate-700 mb-1">統計データ表 (コピペ)</label>
              <textarea
                value={statsText}
                onChange={(e) => setStatsText(e.target.value)}
                className="w-full h-[324px] p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
                placeholder="勝率 ピック率 バン率などが並んだ表のテキストを貼り付け..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loadingStats}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loadingStats ? 'AIが全チャンピオンを解析中...' : '📊 統計を解析してTier表を更新'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
