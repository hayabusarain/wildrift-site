import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BookOpen, Shield, Sword, Target, Sparkles, AlertCircle, Compass, HelpCircle } from 'lucide-react';

export default function GuidePage() {
  const t = useTranslations('Guide');
  const locale = useLocale();

  // Role group definitions
  const roles = [
    { id: 'solo', name: locale === 'ja' ? '🛡️ Solo (トップ)' : '🛡️ Solo (Top)' },
    { id: 'jungle', name: locale === 'ja' ? '🌲 Jungle (ジャングル)' : '🌲 Jungle' },
    { id: 'mid', name: locale === 'ja' ? '🔥 Mid (ミッド)' : '🔥 Mid' },
    { id: 'duo', name: locale === 'ja' ? '🏹 Duo (ADC)' : '🏹 Duo (ADC)' },
    { id: 'support', name: locale === 'ja' ? '💖 Support (サポート)' : '💖 Support' }
  ];

  // 3 Beginner champion recommendations per role (15 total)
  const recommendedChampions = [
    // Solo
    {
      role: 'solo',
      champId: 'Garen',
      name: locale === 'ja' ? 'ガレン' : 'Garen',
      desc: locale === 'ja' 
        ? '非常に高い耐久力とシンプルな操作性。非戦闘時の自動回復力が高く、レーニングで力尽きにくい。' 
        : 'An extremely durable warrior with an easy kit. Excellent out-of-combat health regeneration.',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      role: 'solo',
      champId: 'Malphite',
      name: locale === 'ja' ? 'マルファイト' : 'Malphite',
      desc: locale === 'ja' 
        ? '物理防御（アーマー）が高く、敵集団に一気に飛び込んで吹き飛ばす強力なウルトで集団戦を決定づけます。' 
        : 'Sturdy tank who excels against physical damage. Features a massive area-of-effect knockup ultimate.',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    {
      role: 'solo',
      champId: 'Nasus',
      name: locale === 'ja' ? 'ナサス' : 'Nasus',
      desc: locale === 'ja' 
        ? 'ミニオンにトドメを刺す（ラストヒット）ことでスキル攻撃力を無限に強化できる、レイトゲーム特化型タンク。' 
        : 'Gets stronger by securing minion last hits. Slowly scales into an unkillable juggernaut.',
      badgeColor: 'bg-orange-100 text-orange-700 border-orange-200'
    },
    // Jungle
    {
      role: 'jungle',
      champId: 'MasterYi',
      name: locale === 'ja' ? 'マスター・イー' : 'Master Yi',
      desc: locale === 'ja' 
        ? '通常攻撃で敵を切り刻むアタッカー。中立モンスターの討伐速度が非常に早く、終盤に無類の強さを発揮します。' 
        : 'A basic-attack focused skirmisher with rapid jungle clearing and massive late-game scaling potential.',
      roleName: locale === 'ja' ? 'ジャングル' : 'Jungle',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      role: 'jungle',
      champId: 'Amumu',
      name: locale === 'ja' ? 'アムム' : 'Amumu',
      desc: locale === 'ja' 
        ? '周囲の敵全員を包帯で拘束しスタンさせる強力なウルトを持つタンク。集団戦のきっかけ（イニシエート）を学べます。' 
        : 'A tanky jungler with a huge area-of-effect crowd control ultimate, perfect for initiating teamfights.',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      role: 'jungle',
      champId: 'XinZhao',
      name: locale === 'ja' ? 'シン・ジャオ' : 'Xin Zhao',
      desc: locale === 'ja' 
        ? '序盤の小競り合いが非常に強く、シンプルな突進突き上げコンボで手軽に敵レーンを急襲（ギャンク）できます。' 
        : 'Has very strong early-game pressure and a straightforward gap-closer/knock-up combo for ganks.',
      badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    // Mid
    {
      role: 'mid',
      champId: 'Annie',
      name: locale === 'ja' ? 'アニー' : 'Annie',
      desc: locale === 'ja' 
        ? '火の魔法使い。数回スキルを当てるだけで次の魔法にスタン（気絶）が付与され、巨大なクマで敵を圧倒します。' 
        : 'Fire mage who summons a giant bear (Tibbers). Features a simple stun charge bar for easy lockdown combos.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      role: 'mid',
      champId: 'Ahri',
      name: locale === 'ja' ? 'アーリ' : 'Ahri',
      desc: locale === 'ja' 
        ? '高い機動力とヒット＆アウェイを得意とする九尾の狐。敵を引き寄せて無防備にする「チャーム」が超強力。' 
        : 'A highly mobile, ranged mage who excels at dashing. Her charm ability is perfect for catching enemies out of position.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    {
      role: 'mid',
      champId: 'Vex',
      name: locale === 'ja' ? 'ヴェックス' : 'Vex',
      desc: locale === 'ja' 
        ? '敵の移動（ダッシュ）スキルを妨害することに長けたメイジ。長距離から仕掛けて敵を「恐怖」状態に陥れます。' 
        : 'Anti-mobility mage who punishes champions that dash. Failsafes her lane with range and AoE fear controls.',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-200'
    },
    // Duo
    {
      role: 'duo',
      champId: 'Ashe',
      name: locale === 'ja' ? 'アッシュ' : 'Ashe',
      desc: locale === 'ja' 
        ? '通常攻撃で常にスロウを付与し、敵を逃がしません。マップのどこからでも敵をスタンさせる魔法の矢を放てます。' 
        : 'Utility-based marksman who slows targets with basic attacks. Fires a massive cross-map stun arrow.',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      role: 'duo',
      champId: 'MissFortune',
      name: locale === 'ja' ? 'ミス・フォーチュン' : 'Miss Fortune',
      desc: locale === 'ja' 
        ? '後方から弾幕を浴びせ、広範囲の敵に大ダメージを与えるウルトが超強力。操作もシンプルで使いやすい。' 
        : 'Deals devastating damage safely from the backline with an immense cone-shaped bullet barrage ultimate.',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      role: 'duo',
      champId: 'Tristana',
      name: locale === 'ja' ? 'トリスターナ' : 'Tristana',
      desc: locale === 'ja' 
        ? 'タワーの破壊速度がずば抜けて早く、大ジャンプやノックバックで敵の急襲から自力で離脱・回避できます。' 
        : 'Excellent at shredding turrets. Equipped with a long-range jump to escape danger and reposition.',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    // Support
    {
      role: 'support',
      champId: 'Soraka',
      name: locale === 'ja' ? 'ソラカ' : 'Soraka',
      desc: locale === 'ja' 
        ? '自分の体力を分け与えて味方を直接大回復するヒーラー。ピンチの味方全員をどこからでも即時回復するウルトが優秀。' 
        : 'Dedicated healer who sacrifices her own health to heal allies. Features a map-wide instant team heal ultimate.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    {
      role: 'support',
      champId: 'Yuumi',
      name: locale === 'ja' ? 'ユーミ' : 'Yuumi',
      desc: locale === 'ja' 
        ? '味方キャラクターに直接付着して移動を任せ、自分は回復やスピード増加、敵の拘束などのサポートに専念できます。' 
        : 'Magical cat that attaches directly to allies. Moves automatically with them while supplying heals and shields.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    {
      role: 'support',
      champId: 'Blitzcrank',
      name: locale === 'ja' ? 'ブリッツクランク' : 'Blitzcrank',
      desc: locale === 'ja' 
        ? 'ロケットグラブ（フック）で遠くの敵を自軍側に引き寄せ、一撃で味方全員と袋叩きにするわかりやすい強さを持ちます。' 
        : 'Pulls vulnerable enemies close with a rocket claw, instantly securing picks and turning the tide of skirmishes.',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-200'
    }
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 py-6 pb-20">
      
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 rounded-full text-xs font-black uppercase tracking-widest shadow-inner">
            <Sparkles size={14} className="animate-pulse" />
            Beginner friendly
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300">
            {t('title')}
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </div>

      {/* Grid Layout for Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Lanes & Techs) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Intro */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-4 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
              <Compass className="text-indigo-600" size={26} />
              {t('introTitle')}
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t('introDesc')}
            </p>
          </section>

          {/* Section 2: Map & Lanes */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
              <Shield className="text-indigo-600" size={26} />
              {t('mapTitle')}
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              {t('mapDesc')}
            </p>
            
            <div className="space-y-4">
              {[
                { key: 'laneSoloTitle', descKey: 'laneSoloDesc', icon: '🛡️', color: 'border-l-orange-500 bg-orange-50/30' },
                { key: 'laneJungleTitle', descKey: 'laneJungleDesc', icon: '🌲', color: 'border-l-emerald-500 bg-emerald-50/30' },
                { key: 'laneMidTitle', descKey: 'laneMidDesc', icon: '🔥', color: 'border-l-amber-500 bg-amber-50/30' },
                { key: 'laneDuoTitle', descKey: 'laneDuoDesc', icon: '🏹', color: 'border-l-indigo-500 bg-indigo-50/30' },
                { key: 'laneSupportTitle', descKey: 'laneSupportDesc', icon: '💖', color: 'border-l-rose-500 bg-rose-50/30' }
              ].map(lane => (
                <div key={lane.key} className={`flex gap-4 p-4 rounded-2xl border-l-4 border ${lane.color} border-slate-200 transition-all hover:translate-x-1 duration-200`}>
                  <span className="text-2xl select-none">{lane.icon}</span>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-base">{t(lane.key)}</h4>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{t(lane.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Essential Techniques */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 pb-3 border-b border-slate-100">
              <Sword className="text-indigo-600" size={26} />
              {t('techTitle')}
            </h2>
            
            <div className="relative border-l border-indigo-100 ml-4 pl-6 space-y-8">
              {[
                { titleKey: 'techLastHitTitle', descKey: 'techLastHitDesc', num: '1' },
                { titleKey: 'techVisionTitle', descKey: 'techVisionDesc', num: '2' },
                { titleKey: 'techMapTitle', descKey: 'techMapDesc', num: '3' }
              ].map(tech => (
                <div key={tech.titleKey} className="relative space-y-2">
                  <div className="absolute -left-[35px] top-0.5 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-md border border-white">
                    {tech.num}
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-base">{t(tech.titleKey)}</h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">{t(tech.descKey)}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar Column (Flow & Recommendation) */}
        <div className="space-y-8">
          
          {/* Section 4: Game Flow */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6 hover:shadow-md transition-shadow duration-300">
            <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Target className="text-indigo-600" size={22} />
              {t('flowTitle')}
            </h2>
            
            <div className="space-y-4">
              {[
                { titleKey: 'flowLaningTitle', descKey: 'flowLaningDesc', tag: '0-8 min', tagColor: 'bg-slate-100 text-slate-600' },
                { titleKey: 'flowMidTitle', descKey: 'flowMidDesc', tag: '8-16 min', tagColor: 'bg-indigo-50 text-indigo-600' },
                { titleKey: 'flowLateTitle', descKey: 'flowLateDesc', tag: '16+ min', tagColor: 'bg-purple-50 text-purple-600' }
              ].map(flow => (
                <div key={flow.titleKey} className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-800 text-sm">{t(flow.titleKey)}</h4>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-slate-200 ${flow.tagColor}`}>
                      {flow.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">{t(flow.descKey)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tips Info Alert */}
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
            <div className="flex gap-3 relative z-10">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm">{locale === 'ja' ? '初心者のアドバイス' : 'Pro Tip'}</h4>
                <p className="text-xs font-bold text-indigo-100 leading-relaxed">
                  {locale === 'ja' 
                    ? '味方のチャットが荒れている場合は、設定から「チャット非表示（ミュート）」にすることをおすすめします。自分のプレイに集中することが上達の近道です。' 
                    : 'If team chat gets toxic, do not hesitate to mute it in settings. Staying focused on your own gameplay is the key to improving.'}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Recommended Settings Section (OS-wise) */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-6 hover:shadow-md transition-shadow duration-300">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Compass className="text-indigo-600" size={26} />
            {t('settingsTitle')}
          </h2>
          <p className="text-slate-500 text-sm font-bold leading-relaxed pl-9">
            {t('settingsDesc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
          {/* iOS Card */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-indigo-200 transition-colors">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
              {t('iosTitle')}
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 font-bold leading-relaxed list-none">
              <li>{t('iosFps')}</li>
              <li>{t('iosGraphics')}</li>
              <li>{t('iosFocus')}</li>
            </ul>
          </div>

          {/* Android Card */}
          <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-indigo-200 transition-colors">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
              {t('androidTitle')}
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 font-bold leading-relaxed list-none">
              <li>{t('androidFps')}</li>
              <li>{t('androidBoost')}</li>
              <li>{t('androidGraphics')}</li>
            </ul>
          </div>
        </div>

        {/* In-Game Settings Section */}
        <div className="border-t border-slate-100 pt-6 mt-6">
          <div className="space-y-2 mb-4">
            <h3 className="text-xl font-black text-slate-800">
              {t('inGameTitle')}
            </h3>
            <p className="text-slate-500 text-sm font-bold leading-relaxed">
              {t('inGameDesc')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-2 hover:border-indigo-200 transition-colors">
              <h4 className="font-extrabold text-slate-800 text-base">{t('inGameCameraTitle')}</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">{t('inGameCameraDesc')}</p>
            </div>
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-2 hover:border-indigo-200 transition-colors">
              <h4 className="font-extrabold text-slate-800 text-base">{t('inGameTargetTitle')}</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">{t('inGameTargetDesc')}</p>
            </div>
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-2 hover:border-indigo-200 transition-colors">
              <h4 className="font-extrabold text-slate-800 text-base">{t('inGameDashTitle')}</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">{t('inGameDashDesc')}</p>
            </div>
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-6 space-y-2 hover:border-indigo-200 transition-colors">
              <h4 className="font-extrabold text-slate-800 text-base">{t('inGameChatTitle')}</h4>
              <p className="text-sm text-slate-500 font-bold leading-relaxed">{t('inGameChatDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Champions Row */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <HelpCircle className="text-indigo-600" size={26} />
            {t('recomTitle')}
          </h2>
          <p className="text-slate-500 text-sm font-bold leading-relaxed pl-9">
            {t('recomDesc')}
          </p>
        </div>
        
        {/* Champions grouped by Role */}
        <div className="space-y-10">
          {roles.map(role => {
            const champsInRole = recommendedChampions.filter(c => c.role === role.id);
            return (
              <div key={role.id} className="space-y-4">
                <h3 className="text-base font-black text-indigo-900 border-l-4 border-indigo-500 pl-3">
                  {role.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {champsInRole.map(champ => (
                    <Link 
                      key={champ.champId}
                      href={`/champions/${champ.champId}`}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-3 hover:scale-[1.03] hover:shadow-md hover:border-indigo-300 transition-all duration-300 group block"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-indigo-500 group-hover:border-indigo-600 shadow-inner transition-colors">
                        <img 
                          src={`https://ddragon.leagueoflegends.com/cdn/16.10.1/img/champion/${champ.champId}.png`}
                          alt={champ.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h4 className="font-black text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                        {champ.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed flex-1">
                        {champ.desc}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
