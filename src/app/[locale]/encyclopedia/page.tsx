import { useTranslations, useLocale } from 'next-intl';
import { BookOpen, Compass, Brain, Target as TargetIcon, ArrowRight } from 'lucide-react';
import encyclopedia from '@/../public/data/encyclopedia.json';

export default function EncyclopediaPage() {
  const locale = useLocale();
  const isJa = locale === 'ja';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white rounded-3xl p-8 md:p-12 shadow-2xl mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-500/20 border border-slate-400/30 text-slate-200 rounded-full text-xs font-black uppercase tracking-widest">
            <BookOpen size={14} />
            Advanced Data
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            {isJa ? 'ワイリフ大辞典' : 'Wild Rift Encyclopedia'}
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed">
            {isJa ? '精神論なし。純粋なゲームの仕様、マクロ戦術、ミクロのメカニクスのみをまとめた完全テクニカル・データベース。' : 'No fluff. A purely technical database of game mechanics, macro tactics, and micro strategies.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              Contents
            </h3>
            <ul className="space-y-3">
              {[
                { id: 'glossary', icon: BookOpen, text: isJa ? '用語大辞典' : 'Glossary' },
                { id: 'lanes', icon: Compass, text: isJa ? 'ウェーブ管理' : 'Wave Mgmt' },
                { id: 'tactics', icon: Brain, text: isJa ? 'マクロ戦術' : 'Macro Tactics' },
                { id: 'objectives', icon: TargetIcon, text: isJa ? 'オブジェクト' : 'Objectives' }
              ].map(item => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">
                    <item.icon size={16} /> {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12 w-full max-w-4xl">
          
          {/* Section 1: Glossary */}
          <section id="glossary" className="scroll-mt-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <BookOpen className="text-slate-600" size={26} />
                {isJa ? '用語大辞典' : 'MOBA Glossary'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {encyclopedia.glossary.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-black text-slate-800 text-sm mb-2">{isJa ? (item.termJa || item.term) : item.term}</h4>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {isJa ? item.descJa : item.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Lanes Mechanics */}
          <section id="lanes" className="scroll-mt-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Compass className="text-slate-600" size={26} />
                {isJa ? 'ウェーブ管理とレーンメカニクス' : 'Wave Management & Lane Mechanics'}
              </h2>
              <div className="space-y-6">
                {encyclopedia.lanes.map((mech: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-black text-slate-800 text-lg mb-3">
                      {isJa ? mech.nameJa : mech.nameEn}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-black uppercase text-slate-500 block mb-1">Execution</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {isJa ? mech.howToJa : mech.howToEn}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-black uppercase text-slate-500 block mb-1">Purpose</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {isJa ? mech.purposeJa : mech.purposeEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Tactics */}
          <section id="tactics" className="scroll-mt-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Brain className="text-slate-600" size={26} />
                {isJa ? 'マクロ戦術と陣形' : 'Macro Tactics & Formations'}
              </h2>
              <div className="space-y-6">
                {encyclopedia.tactics.map((tactic: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-black text-slate-800 text-lg mb-3">
                      {isJa ? tactic.nameJa : tactic.nameEn}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-black uppercase text-slate-500 block mb-1">Execution</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {isJa ? tactic.executionJa : tactic.executionEn}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-black uppercase text-slate-500 block mb-1">Win Condition</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {isJa ? tactic.winConditionJa : tactic.winConditionEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4: Objectives */}
          <section id="objectives" className="scroll-mt-24 space-y-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <TargetIcon className="text-slate-600" size={26} />
                {isJa ? 'オブジェクトの仕様とタイマー' : 'Objective Mechanics & Timers'}
              </h2>
              <div className="space-y-6">
                {encyclopedia.objectives.map((obj: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-black text-slate-800 text-lg mb-3">
                      {isJa ? obj.nameJa : obj.nameEn}
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-black uppercase text-slate-500 block mb-1">Stats / Buffs</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {isJa ? obj.statsJa : obj.statsEn}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100">
                        <span className="text-xs font-black uppercase text-slate-500 block mb-1">Strategy</span>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {isJa ? obj.strategyJa : obj.strategyEn}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
