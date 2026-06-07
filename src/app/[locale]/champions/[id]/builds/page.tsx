import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import championStats from '@/data/champion_stats.json';
import { BuildList } from '@/components/builds/BuildList';
import { ChampionImage } from '@/components/champions/ChampionImage';
import allRunes from '@/data/runes.json';
import allItems from '@/data/physical_items_final.json';
import allSpells from '@/data/summoner_spells.json';

export default async function ChampionBuildsPage({ params }: { params: Promise<{ locale: string; id: string }> | { locale: string; id: string } }) {
  // Await params to support Next.js 15
  const resolvedParams = await params;
  const { locale, id } = resolvedParams;
  const t = await getTranslations('Builds');
  
  if (!id) {
    notFound();
  }
  
  const champion = championStats.find((c: any) => 
    c.champion_name_en?.toLowerCase() === id.toLowerCase() || 
    c.champion_name?.toLowerCase() === id.toLowerCase() ||
    c.id?.toLowerCase() === id.toLowerCase()
  );
  
  if (!champion) {
    notFound();
  }

  const championId = champion.champion_name_en || id;
  const championName = locale === 'ja' 
    ? (champion.champion_name || champion.champion_name_en || id)
    : (champion.champion_name_en || champion.champion_name || id);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href={`/champions/${id}`} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-2">
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">{t('backToChampion', { name: championName })}</span>
          </Link>
          <div className="font-black text-slate-800 text-sm">
            {t('title')}
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 mt-4">
        <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <ChampionImage 
            championId={championId} 
            championName={championName} 
            id={id}
          />
          <div>
            <h1 className="text-2xl font-black text-slate-800">{championName}</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{championId}</p>
          </div>
        </div>

        <BuildList 
          championId={championId}
          allItems={allItems}
          allRunes={allRunes}
          allSpells={allSpells}
        />
      </div>
    </div>
  );
}
