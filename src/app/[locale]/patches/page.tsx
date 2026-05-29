'use client';

import { Search, History, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PatchTable } from '@/components/patches/PatchTable';
import { useState } from 'react';

export default function PatchesPage() {
  const t = useTranslations('PatchTable');

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shadow-inner">
            <History size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Patch Notes</h1>
            <p className="text-slate-500 font-medium">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* PatchTable component now handles searching and filtering internally */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <PatchTable />
      </div>

    </div>
  );
}
