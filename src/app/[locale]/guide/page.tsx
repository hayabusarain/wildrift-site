import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BookOpen, Shield, Sword, Target, Sparkles, AlertCircle, Compass, HelpCircle, Layers, Zap, Settings, TrendingUp } from 'lucide-react';

export default function GuidePage() {
  const t = useTranslations('Guide');
  const locale = useLocale();

  // Role group definitions for recommendations
  const roles = [
    { id: 'solo', name: locale === 'ja' ? '🛡️ Solo (トップ)' : '🛡️ Solo (Top)' },
    { id: 'jungle', name: locale === 'ja' ? '🌲 Jungle (ジャングル)' : '🌲 Jungle' },
    { id: 'mid', name: locale === 'ja' ? '🔥 Mid (ミッド)' : '🔥 Mid' },
    { id: 'duo', name: locale === 'ja' ? '🏹 Duo (ADC)' : '🏹 Duo (ADC)' },
    { id: 'support', name: locale === 'ja' ? '💖 Support (サポート)' : '💖 Support' }
  ];

  const recommendedChampions = [
    // Solo
    { role: 'solo', champId: 'Garen', name: locale === 'ja' ? 'ガレン' : 'Garen', desc: locale === 'ja' ? '非常に高い耐久力とシンプルな操作性。非戦闘時の自動回復力が高く、レーニングで力尽きにくい。' : 'An extremely durable warrior with an easy kit. Excellent out-of-combat health regeneration.' },
    { role: 'solo', champId: 'Malphite', name: locale === 'ja' ? 'マルファイト' : 'Malphite', desc: locale === 'ja' ? '物理防御（アーマー）が高く、敵集団に一気に飛び込んで吹き飛ばす強力なウルトで集団戦を決定づけます。' : 'Sturdy tank who excels against physical damage. Features a massive area-of-effect knockup ultimate.' },
    { role: 'solo', champId: 'Nasus', name: locale === 'ja' ? 'ナサス' : 'Nasus', desc: locale === 'ja' ? 'ミニオンにトドメを刺す（ラストヒット）ことでスキル攻撃力を無限に強化できる、レイトゲーム特化型タンク。' : 'Gets stronger by securing minion last hits. Slowly scales into an unkillable juggernaut.' },
    // Jungle
    { role: 'jungle', champId: 'MasterYi', name: locale === 'ja' ? 'マスター・イー' : 'Master Yi', desc: locale === 'ja' ? '通常攻撃で敵を切り刻むアタッカー。中立モンスターの討伐速度が非常に早く、終盤に無類の強さを発揮します。' : 'A basic-attack focused skirmisher with rapid jungle clearing and massive late-game scaling potential.' },
    { role: 'jungle', champId: 'Amumu', name: locale === 'ja' ? 'アムム' : 'Amumu', desc: locale === 'ja' ? '周囲の敵全員を包帯で拘束しスタンさせる強力なウルトを持つタンク。集団戦のきっかけ（イニシエート）を学べます。' : 'A tanky jungler with a huge area-of-effect crowd control ultimate, perfect for initiating teamfights.' },
    { role: 'jungle', champId: 'XinZhao', name: locale === 'ja' ? 'シン・ジャオ' : 'Xin Zhao', desc: locale === 'ja' ? '序盤の小競り合いが非常に強く、シンプルな突進突き上げコンボで手軽に敵レーンを急襲（ギャンク）できます。' : 'Has very strong early-game pressure and a straightforward gap-closer/knock-up combo for ganks.' },
    // Mid
    { role: 'mid', champId: 'Annie', name: locale === 'ja' ? 'アニー' : 'Annie', desc: locale === 'ja' ? '火の魔法使い。数回スキルを当てるだけで次の魔法にスタン（気絶）が付与され、巨大なクマで敵を圧倒します。' : 'Fire mage who summons a giant bear (Tibbers). Features a simple stun charge bar for easy lockdown combos.' },
    { role: 'mid', champId: 'Ahri', name: locale === 'ja' ? 'アーリ' : 'Ahri', desc: locale === 'ja' ? '高い機動力とヒット＆アウェイを得意とする九尾の狐。敵を引き寄せて無防備にする「チャーム」が超強力。' : 'A highly mobile, ranged mage who excels at dashing. Her charm ability is perfect for catching enemies out of position.' },
    { role: 'mid', champId: 'Vex', name: locale === 'ja' ? 'ヴェックス' : 'Vex', desc: locale === 'ja' ? '敵の移動（ダッシュ）スキルを妨害することに長けたメイジ。長距離から仕掛けて敵を「恐怖」状態に陥れます。' : 'Anti-mobility mage who punishes champions that dash. Failsafes her lane with range and AoE fear controls.' },
    // Duo
    { role: 'duo', champId: 'Ashe', name: locale === 'ja' ? 'アッシュ' : 'Ashe', desc: locale === 'ja' ? '通常攻撃で常にスロウを付与し、敵を逃がしません。マップのどこからでも敵をスタンさせる魔法の矢を放てます。' : 'Utility-based marksman who slows targets with basic attacks. Fires a massive cross-map stun arrow.' },
    { role: 'duo', champId: 'MissFortune', name: locale === 'ja' ? 'ミス・フォーチュン' : 'Miss Fortune', desc: locale === 'ja' ? '後方から弾幕を浴びせ、広範囲の敵に大ダメージを与えるウルトが超強力。操作もシンプルで使いやすい。' : 'Deals devastating damage safely from the backline with an immense cone-shaped bullet barrage ultimate.' },
    { role: 'duo', champId: 'Tristana', name: locale === 'ja' ? 'トリスターナ' : 'Tristana', desc: locale === 'ja' ? 'タワーの破壊速度がずば抜けて早く、大ジャンプやノックバックで敵の急襲から自力で離脱・回避できます。' : 'Excellent at shredding turrets. Equipped with a long-range jump to escape danger and reposition.' },
    // Support
    { role: 'support', champId: 'Soraka', name: locale === 'ja' ? 'ソラカ' : 'Soraka', desc: locale === 'ja' ? '自分の体力を分け与えて味方を直接大回復するヒーラー。ピンチの味方全員をどこからでも即時回復するウルトが優秀。' : 'Dedicated healer who sacrifices her own health to heal allies. Features a map-wide instant team heal ultimate.' },
    { role: 'support', champId: 'Yuumi', name: locale === 'ja' ? 'ユーミ' : 'Yuumi', desc: locale === 'ja' ? '味方キャラクターに直接付着して移動を任せ、自分は回復やスピード増加、敵の拘束などのサポートに専念できます。' : 'Magical cat that attaches directly to allies. Moves automatically with them while supplying heals and shields.' },
    { role: 'support', champId: 'Blitzcrank', name: locale === 'ja' ? 'ブリッツクランク' : 'Blitzcrank', desc: locale === 'ja' ? 'ロケットグラブ（フック）で遠くの敵を自軍側に引き寄せ、一撃で味方全員と袋叩きにするわかりやすい強さを持ちます。' : 'Pulls vulnerable enemies close with a rocket claw, instantly securing picks and turning the tide of skirmishes.' }
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
            {t('title')}
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed">
            {t('subtitle')}
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
                <a href="#beginner" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Compass size={16} /> {t('tabBeginner')}
                </a>
              </li>
              <li>
                <a href="#intermediate" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Layers size={16} /> {t('tabIntermediate')}
                </a>
              </li>
              <li>
                <a href="#advanced" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <TrendingUp size={16} /> {t('tabAdvanced')}
                </a>
              </li>
              <li>
                <a href="#settings" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <Settings size={16} /> {t('tabSettings')}
                </a>
              </li>
              <li className="pt-2 mt-2 border-t border-slate-100">
                <a href="#champions" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                  <HelpCircle size={16} /> {t('recomTitle')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12 w-full max-w-4xl">
          
          {/* Section 1: Beginner */}
          <section id="beginner" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Beginner</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-4">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Compass className="text-green-600" size={26} />
                {t('beginnerIntroTitle')}
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">{t('beginnerIntroDesc')}</p>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Shield className="text-green-600" size={26} />
                {t('beginnerMapTitle')}
              </h2>
              <p className="text-slate-600 leading-relaxed font-medium">{t('beginnerMapDesc')}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'beginnerLaneSoloTitle', descKey: 'beginnerLaneSoloDesc', icon: '🛡️', color: 'border-l-orange-500' },
                  { key: 'beginnerLaneJungleTitle', descKey: 'beginnerLaneJungleDesc', icon: '🌲', color: 'border-l-emerald-500' },
                  { key: 'beginnerLaneMidTitle', descKey: 'beginnerLaneMidDesc', icon: '🔥', color: 'border-l-amber-500' },
                  { key: 'beginnerLaneDuoTitle', descKey: 'beginnerLaneDuoDesc', icon: '🏹', color: 'border-l-indigo-500' },
                  { key: 'beginnerLaneSupportTitle', descKey: 'beginnerLaneSupportDesc', icon: '💖', color: 'border-l-rose-500' }
                ].map(lane => (
                  <div key={lane.key} className={`flex gap-3 p-4 rounded-2xl border-l-4 border bg-slate-50 border-slate-200 ${lane.color}`}>
                    <span className="text-xl select-none">{lane.icon}</span>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-slate-800 text-sm">{t(lane.key)}</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{t(lane.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
                <Target className="text-green-600" size={26} />
                {t('beginnerFlowTitle')}
              </h2>
              <div className="space-y-4">
                {[
                  { titleKey: 'beginnerFlowLaningTitle', descKey: 'beginnerFlowLaningDesc', tag: '0-8 min', tagColor: 'bg-slate-100 text-slate-600' },
                  { titleKey: 'beginnerFlowMidTitle', descKey: 'beginnerFlowMidDesc', tag: '8-16 min', tagColor: 'bg-indigo-50 text-indigo-600' },
                  { titleKey: 'beginnerFlowLateTitle', descKey: 'beginnerFlowLateDesc', tag: '16+ min', tagColor: 'bg-purple-50 text-purple-600' }
                ].map(flow => (
                  <div key={flow.titleKey} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-extrabold text-slate-800 text-sm">{t(flow.titleKey)}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-200 ${flow.tagColor}`}>
                        {flow.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{t(flow.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 2: Intermediate */}
          <section id="intermediate" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Intermediate</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 border-t-4 border-t-amber-400">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
                  <Layers className="text-amber-500" size={26} />
                  {t('intermediateTitle')}
                </h2>
                <p className="text-slate-500 font-bold leading-relaxed">{t('intermediateDesc')}</p>
              </div>

              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <h4 className="font-extrabold text-slate-800 text-base md:text-lg flex items-center gap-2 mb-2">
                    💰 {t('intermediatePassiveGoldTitle')}
                  </h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{t('intermediatePassiveGoldDesc')}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-extrabold text-slate-800 text-base md:text-lg flex items-center gap-2 mb-2">
                    🗺️ {t('intermediateMapSizeTitle')}
                  </h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{t('intermediateMapSizeDesc')}</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 mb-2">
                    👟 {t('intermediateItemsTitle')}
                  </h4>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed">{t('intermediateItemsDesc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Advanced */}
          <section id="advanced" className="scroll-mt-24 space-y-6">
            <div className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-black uppercase tracking-widest mb-2">Advanced Macro</div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 border-t-4 border-t-red-500">
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
                  <TrendingUp className="text-red-500" size={26} />
                  {t('advancedTitle')}
                </h2>
                <p className="text-slate-500 font-bold leading-relaxed">{t('advancedDesc')}</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">1</div>
                    <h4 className="font-extrabold text-slate-800 text-base md:text-lg group-hover:text-red-600 transition-colors">
                      {t('advancedPriorityTitle')}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed pl-11">{t('advancedPriorityDesc')}</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">2</div>
                    <h4 className="font-extrabold text-slate-800 text-base md:text-lg group-hover:text-red-600 transition-colors">
                      {t('advancedCrashRecallTitle')}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed pl-11">{t('advancedCrashRecallDesc')}</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-200 transition-colors group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black">3</div>
                    <h4 className="font-extrabold text-slate-800 text-base md:text-lg group-hover:text-red-600 transition-colors">
                      {t('advancedThreeWaveTitle')}
                    </h4>
                  </div>
                  <p className="text-sm text-slate-600 font-bold leading-relaxed pl-11">{t('advancedThreeWaveDesc')}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Settings */}
          <section id="settings" className="scroll-mt-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-3">
                  <Settings className="text-slate-600" size={26} />
                  {t('settingsTitle')}
                </h2>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">
                  {t('settingsDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-800 border-b border-slate-200 pb-2">{t('iosTitle')}</h3>
                  <ul className="space-y-3 text-sm text-slate-600 font-bold leading-relaxed list-none">
                    <li>{t('iosFps')}</li>
                    <li>{t('iosGraphics')}</li>
                    <li>{t('iosFocus')}</li>
                  </ul>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                  <h3 className="text-lg font-black text-slate-800 border-b border-slate-200 pb-2">{t('androidTitle')}</h3>
                  <ul className="space-y-3 text-sm text-slate-600 font-bold leading-relaxed list-none">
                    <li>{t('androidFps')}</li>
                    <li>{t('androidBoost')}</li>
                    <li>{t('androidGraphics')}</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="space-y-2 mb-4">
                  <h3 className="text-xl font-black text-slate-800">{t('inGameTitle')}</h3>
                  <p className="text-slate-500 text-sm font-bold leading-relaxed">{t('inGameDesc')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'inGameCameraTitle', desc: 'inGameCameraDesc' },
                    { title: 'inGameTargetTitle', desc: 'inGameTargetDesc' },
                    { title: 'inGameDashTitle', desc: 'inGameDashDesc' },
                    { title: 'inGameChatTitle', desc: 'inGameChatDesc' }
                  ].map(item => (
                    <div key={item.title} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-sm">{t(item.title)}</h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{t(item.desc)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Recommended Champions */}
          <section id="champions" className="scroll-mt-24 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <HelpCircle className="text-indigo-600" size={26} />
                  {t('recomTitle')}
                </h2>
                <p className="text-slate-500 text-sm font-bold leading-relaxed">
                  {t('recomDesc')}
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
