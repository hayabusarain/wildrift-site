import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BookOpen, Shield, Sword, Target, Sparkles, AlertCircle, Compass, HelpCircle, Layers, Zap, Settings, TrendingUp, Brain, Flame, Target as TargetIcon } from 'lucide-react';
import massiveGuide from '@/../public/data/massive_guide.json';

export default function GuidePage() {
  const t = useTranslations('Guide');
  const locale = useLocale();
  const isJa = locale === 'ja';

  // Role group definitions for recommendations
  const roles = [
    { id: 'solo', name: isJa ? '🛡️ Solo (トップ)' : '🛡️ Solo (Top)' },
    { id: 'jungle', name: isJa ? '🌲 Jungle (ジャングル)' : '🌲 Jungle' },
    { id: 'mid', name: isJa ? '🔥 Mid (ミッド)' : '🔥 Mid' },
    { id: 'duo', name: isJa ? '🏹 Duo (ADC)' : '🏹 Duo (ADC)' },
    { id: 'support', name: isJa ? '💖 Support (サポート)' : '💖 Support' }
  ];

  const recommendedChampions = [
    // Solo
    { role: 'solo', champId: 'Garen', name: isJa ? 'ガレン' : 'Garen', desc: isJa ? '非常に高い耐久力とシンプルな操作性。非戦闘時の自動回復力が高く、レーニングで力尽きにくい。' : 'An extremely durable warrior with an easy kit. Excellent out-of-combat health regeneration.' },
    { role: 'solo', champId: 'Malphite', name: isJa ? 'マルファイト' : 'Malphite', desc: isJa ? '物理防御（アーマー）が高く、敵集団に一気に飛び込んで吹き飛ばす強力なウルトで集団戦を決定づけます。' : 'Sturdy tank who excels against physical damage. Features a massive area-of-effect knockup ultimate.' },
    { role: 'solo', champId: 'Nasus', name: isJa ? 'ナサス' : 'Nasus', desc: isJa ? 'ミニオンにトドメを刺す（ラストヒット）ことでスキル攻撃力を無限に強化できる、レイトゲーム特化型タンク。' : 'Gets stronger by securing minion last hits. Slowly scales into an unkillable juggernaut.' },
    // Jungle
    { role: 'jungle', champId: 'MasterYi', name: isJa ? 'マスター・イー' : 'Master Yi', desc: isJa ? '通常攻撃で敵を切り刻むアタッカー。中立モンスターの討伐速度が非常に早く、終盤に無類の強さを発揮します。' : 'A basic-attack focused skirmisher with rapid jungle clearing and massive late-game scaling potential.' },
    { role: 'jungle', champId: 'Amumu', name: isJa ? 'アムム' : 'Amumu', desc: isJa ? '周囲の敵全員を包帯で拘束しスタンさせる強力なウルトを持つタンク。集団戦のきっかけ（イニシエート）を学べます。' : 'A tanky jungler with a huge area-of-effect crowd control ultimate, perfect for initiating teamfights.' },
    { role: 'jungle', champId: 'XinZhao', name: isJa ? 'シン・ジャオ' : 'Xin Zhao', desc: isJa ? '序盤の小競り合いが非常に強く、シンプルな突進突き上げコンボで手軽に敵レーンを急襲（ギャンク）できます。' : 'Has very strong early-game pressure and a straightforward gap-closer/knock-up combo for ganks.' },
    // Mid
    { role: 'mid', champId: 'Annie', name: isJa ? 'アニー' : 'Annie', desc: isJa ? '火の魔法使い。数回スキルを当てるだけで次の魔法にスタン（気絶）が付与され、巨大なクマで敵を圧倒します。' : 'Fire mage who summons a giant bear (Tibbers). Features a simple stun charge bar for easy lockdown combos.' },
    { role: 'mid', champId: 'Ahri', name: isJa ? 'アーリ' : 'Ahri', desc: isJa ? '高い機動力とヒット＆アウェイを得意とする九尾の狐。敵を引き寄せて無防備にする「チャーム」が超強力。' : 'A highly mobile, ranged mage who excels at dashing. Her charm ability is perfect for catching enemies out of position.' },
    { role: 'mid', champId: 'Vex', name: isJa ? 'ヴェックス' : 'Vex', desc: isJa ? '敵の移動（ダッシュ）スキルを妨害することに長けたメイジ。長距離から仕掛けて敵を「恐怖」状態に陥れます。' : 'Anti-mobility mage who punishes champions that dash. Failsafes her lane with range and AoE fear controls.' },
    // Duo
    { role: 'duo', champId: 'Ashe', name: isJa ? 'アッシュ' : 'Ashe', desc: isJa ? '通常攻撃で常にスロウを付与し、敵を逃がしません。マップのどこからでも敵をスタンさせる魔法の矢を放てます。' : 'Utility-based marksman who slows targets with basic attacks. Fires a massive cross-map stun arrow.' },
    { role: 'duo', champId: 'MissFortune', name: isJa ? 'ミス・フォーチュン' : 'Miss Fortune', desc: isJa ? '後方から弾幕を浴びせ、広範囲の敵に大ダメージを与えるウルトが超強力。操作もシンプルで使いやすい。' : 'Deals devastating damage safely from the backline with an immense cone-shaped bullet barrage ultimate.' },
    { role: 'duo', champId: 'Tristana', name: isJa ? 'トリスターナ' : 'Tristana', desc: isJa ? 'タワーの破壊速度がずば抜けて早く、大ジャンプやノックバックで敵の急襲から自力で離脱・回避できます。' : 'Excellent at shredding turrets. Equipped with a long-range jump to escape danger and reposition.' },
    // Support
    { role: 'support', champId: 'Soraka', name: isJa ? 'ソラカ' : 'Soraka', desc: isJa ? '自分の体力を分け与えて味方を直接大回復するヒーラー。ピンチの味方全員をどこからでも即時回復するウルトが優秀。' : 'Dedicated healer who sacrifices her own health to heal allies. Features a map-wide instant team heal ultimate.' },
    { role: 'support', champId: 'Yuumi', name: isJa ? 'ユーミ' : 'Yuumi', desc: isJa ? '味方キャラクターに直接付着して移動を任せ、自分は回復やスピード増加、敵の拘束などのサポートに専念できます。' : 'Magical cat that attaches directly to allies. Moves automatically with them while supplying heals and shields.' },
    { role: 'support', champId: 'Blitzcrank', name: isJa ? 'ブリッツクランク' : 'Blitzcrank', desc: isJa ? 'ロケットグラブ（フック）で遠くの敵を自軍側に引き寄せ、一撃で味方全員と袋叩きにするわかりやすい強さを持ちます。' : 'Pulls vulnerable enemies close with a rocket claw, instantly securing picks and turning the tide of skirmishes.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
      
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-500/20 mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">
            <Sparkles size={14} className="animate-pulse" />
            Complete Guide
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            {isJa ? '初心者完全ガイド' : 'Beginner Complete Guide'}
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed">
            {isJa ? '脱初心者から上級者への道のり。MOBAの基礎知識から勝率を劇的に上げるマクロ・メンタル術まで完全網羅。' : 'From beginner to advanced. A comprehensive manual covering MOBA basics, macro strategies, and winner mentality.'}
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sticky Sidebar (Table of Contents) */}
        <div className="hidden lg:block w-64 shrink-0 sticky top-24">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-black text-slate-800 mb-4 pb-2 border-b border-slate-100 uppercase tracking-wider text-xs">
              Contents
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="#glossary" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <BookOpen size={16} /> {isJa ? 'MOBA用語大辞典' : 'MOBA Glossary'}
                </a>
              </li>
              <li>
                <a href="#lanes" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Compass size={16} /> {isJa ? 'レーン別完全マニュアル' : 'Lane Manual'}
                </a>
              </li>
              <li>
                <a href="#macro" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Brain size={16} /> {isJa ? 'マクロとミクロ' : 'Macro & Micro'}
                </a>
              </li>
              <li>
                <a href="#objectives" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <TargetIcon size={16} /> {isJa ? 'エピックオブジェクト' : 'Epic Objectives'}
                </a>
              </li>
              <li>
                <a href="#mental" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Flame size={16} /> {isJa ? '勝てない時の5箇条' : '5 Rules for Winning'}
                </a>
              </li>
              <li className="pt-2 mt-2 border-t border-slate-100">
                <a href="#champions" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <HelpCircle size={16} /> {isJa ? 'おすすめチャンピオン' : 'Recommended Champs'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12 w-full max-w-4xl">
          
          {/* Section 1: Glossary */}
          <section id="glossary" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Knowledge Base</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <BookOpen className="text-blue-600" size={26} />
                {isJa ? 'MOBA用語・スラング大辞典' : 'MOBA Glossary & Slang'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {massiveGuide.glossary.map((item, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors">
                    <h4 className="font-extrabold text-blue-800 text-sm mb-2">{item.term}</h4>
                    <p className="text-xs text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                      {isJa ? item.descJa : item.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Lanes Manual */}
          <section id="lanes" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Strategy</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Compass className="text-green-600" size={26} />
                {isJa ? 'レーン別完全マニュアル' : 'Complete Lane Manuals'}
              </h2>
              <div className="space-y-6">
                {massiveGuide.lanes.map((lane, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border-l-4 border-l-green-500 border border-slate-200">
                    <h4 className="font-extrabold text-slate-800 text-lg mb-3">
                      {isJa ? lane.nameJa : lane.nameEn}
                    </h4>
                    <p className="text-sm text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                      {isJa ? lane.guideJa : lane.guideEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 3: Macro & Micro */}
          <section id="macro" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Game Sense</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Brain className="text-purple-600" size={26} />
                {isJa ? massiveGuide.macroMicro.titleJa : massiveGuide.macroMicro.titleEn}
              </h2>
              <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-2xl">
                <p className="text-sm text-slate-700 font-bold leading-relaxed whitespace-pre-line">
                  {isJa ? massiveGuide.macroMicro.contentJa : massiveGuide.macroMicro.contentEn}
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Objectives */}
          <section id="objectives" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Win Conditions</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <TargetIcon className="text-amber-500" size={26} />
                {isJa ? 'エピックオブジェクトの深掘り' : 'Epic Objectives Deep Dive'}
              </h2>
              <div className="space-y-6">
                {massiveGuide.objectives.map((obj, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors">
                    <h4 className="font-extrabold text-amber-800 text-lg mb-3">
                      {isJa ? obj.nameJa : obj.nameEn}
                    </h4>
                    <p className="text-sm text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                      {isJa ? obj.descJa : obj.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 5: Mental & Improvement */}
          <section id="mental" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Mindset</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Flame className="text-red-600" size={26} />
                {isJa ? '勝てない時に見直すべき5つのポイント' : '5 Rules to Break a Losing Streak'}
              </h2>
              <div className="space-y-6">
                {massiveGuide.mental.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-red-50/30 border-l-4 border-l-red-500 border border-slate-200">
                    <h4 className="font-extrabold text-slate-800 text-lg mb-3">
                      {isJa ? item.titleJa : item.titleEn}
                    </h4>
                    <p className="text-sm text-slate-600 font-bold leading-relaxed whitespace-pre-line">
                      {isJa ? item.descJa : item.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6: Recommended Champions */}
          <section id="champions" className="scroll-mt-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <HelpCircle className="text-indigo-600" size={26} />
                  {isJa ? '初心者おすすめチャンピオン' : 'Recommended Beginner Champions'}
                </h2>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">
                  {isJa ? '各ロールで扱いやすく、基本を学びやすいチャンピオンを厳選しました。' : 'Handpicked champions for each role that are easy to play and great for learning the fundamentals.'}
                </p>
              </div>
              
              <div className="space-y-10">
                {roles.map(role => {
                  const champsInRole = recommendedChampions.filter(c => c.role === role.id);
                  return (
                    <div key={role.id} className="space-y-4">
                      <h3 className="text-base font-black text-indigo-900 border-l-4 border-indigo-500 pl-3">
                        {role.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {champsInRole.map(champ => (
                          <Link 
                            key={champ.champId}
                            href={`/champions/${champ.champId}`}
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 hover:scale-[1.03] hover:shadow-md hover:border-indigo-300 transition-all duration-300 group block"
                          >
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-indigo-500 group-hover:border-indigo-600 shadow-inner transition-colors">
                              <img 
                                src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champ.champId}.png`}
                                alt={champ.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <h4 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                              {champ.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-bold leading-relaxed flex-1">
                              {champ.desc}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
