import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { ExternalLink, Link2, Handshake } from 'lucide-react';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Links' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function LinksPage() {
  const t = useTranslations('Links');

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Link2 className="text-indigo-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800">{t('title')}</h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Official Links */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <ExternalLink className="text-blue-500" size={20} />
            {t('official')}
          </h2>
          <div className="space-y-3">
            <a 
              href="https://wildrift.leagueoflegends.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-bold text-slate-800">League of Legends: Wild Rift</div>
              <div className="text-xs text-slate-500 mt-1">Riot Games 公式サイト</div>
            </a>
            <a 
              href="https://lolm.qq.com/v2/index.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-colors"
            >
              <div className="font-bold text-slate-800">英雄联盟手游 (中国公式サイト)</div>
              <div className="text-xs text-slate-500 mt-1">最新のAPIデータや勝率情報が確認できる本家サイト</div>
            </a>
          </div>
        </div>

        {/* Useful Sites */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <Link2 className="text-emerald-500" size={20} />
            {t('useful')}
          </h2>
          <div className="space-y-3">
            {/* ここに追加のリンクを入れられます */}
            <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm font-semibold text-slate-400">
              準備中
            </div>
          </div>
        </div>
      </div>

      {/* Mutual Links */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-md text-white relative overflow-hidden">
        <Handshake className="absolute -right-6 -bottom-6 w-48 h-48 text-white opacity-10 rotate-12 pointer-events-none" />
        <h2 className="text-xl font-black mb-3 relative z-10 flex items-center gap-2">
          {t('mutual')}
        </h2>
        <p className="text-sm font-medium text-indigo-50 leading-relaxed mb-6 relative z-10 max-w-2xl">
          {t('mutualDesc')}
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl text-sm font-bold shadow-sm hover:scale-105 transition-transform relative z-10"
        >
          {t('contact')}
        </Link>
      </div>
    </div>
  );
}
