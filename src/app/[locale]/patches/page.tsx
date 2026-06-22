import { Metadata } from 'next';
import { History } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { supabase } from '@/lib/supabase';
import { PatchTable } from '@/components/patches/PatchTable';
import { getDDragonIconMap } from '@/utils/ddragon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PatchTable' });
  
  return {
    title: t('title') || 'Patch Notes',
    description: t('subtitle') || 'Wild Rift Patch Notes & AI Meta Predictions',
  };
}

export default async function PatchesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'PatchTable' });

  let patches = null;
  let patchMetas = null;

  try {


    const { data: patchesData, error: patchesError } = await supabase
      .from('patches')
      .select('*')
      .order('version', { ascending: false })
      .order('created_at', { ascending: true });

    if (!patchesError && patchesData) {
      patches = patchesData;
    }

    const { data: metaData, error: metaError } = await supabase
      .from('patch_meta')
      .select('*');

    if (!metaError && metaData) {
      patchMetas = metaData;
    }
  } catch (e) {
    console.error('Failed to fetch patches server-side', e);
  }

  const iconMap = await getDDragonIconMap();

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen pb-24 font-sans text-slate-800">
      <div className="bg-white pt-8 pb-4 px-4 shadow-sm border-b border-slate-200 sticky top-0 z-20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <History className="text-indigo-600" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 leading-none mb-1">
            Patch Notes
          </h1>
          <p className="text-slate-500 text-[10px] font-bold leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        <PatchTable 
          initialServerPatches={patches || undefined} 
          initialServerMetas={patchMetas || undefined} 
          initialIconMap={iconMap}
        />
      </div>
    </div>
  );
}
