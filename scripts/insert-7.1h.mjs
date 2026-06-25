import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: "7.1h",
    champion_name: "スレッシュ",
    champion_name_en: "Thresh",
    change_type: "buff",
    description: "【魂の束縛】魂の出現範囲が拡大(12→15)\n【死の宣告】クールダウン短縮、基礎ダメージと魔力反映率が増加\n【嘆きの魂灯】クールダウン短縮、シールド量は低下\n【絶望の鎖】強化攻撃と発動効果のダメージが増加",
    description_en: "Soul Sweep range increased. Death Sentence cooldown reduced, damage and AP ratio increased. Dark Passage cooldown reduced, shield amount decreased. Flay empowered attack and active damage increased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ヌヌ＆ウィルンプ",
    champion_name_en: "Nunu",
    change_type: "nerf",
    description: "【丸かじり】増加体力に応じたダメージ反映率と体力自動回復率が低下\n【雪玉連射】雪玉のダメージが低下",
    description_en: "Consume bonus HP damage and healing ratios decreased. Snowball Barrage damage decreased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "セラフィーン",
    champion_name_en: "Seraphine",
    change_type: "buff",
    description: "【サラウンドサウンド】体力回復率が増加\n【アンコール】チャーム効果時間が延長",
    description_en: "Surround Sound healing increased. Encore charm duration increased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "スカーナー",
    champion_name_en: "Skarner",
    change_type: "buff",
    description: "【基本ステータス】レベルアップごとの攻撃力・体力増加量、体力自動回復が上昇\n【砕けし大地 / 大地の怒り】最大体力割合ダメージとスロウ効果が増加\n【激震の砦】スロウ効果が増加",
    description_en: "Base AD growth, HP growth, and HP regen increased. Shattered Earth / Upheaval max HP damage and slow increased. Ixtal's Impact slow increased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ノーチラス",
    champion_name_en: "Nautilus",
    change_type: "nerf",
    description: "【大海の激憤】ジャングルモンスターへのダメージ率とシールドへの最大体力反映率が低下\n【粉砕水】ジャングルモンスターへのダメージ率が低下",
    description_en: "Titan's Wrath monster damage ratio and max HP shield ratio decreased. Riptide monster damage ratio decreased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ナー",
    champion_name_en: "Gnar",
    change_type: "buff",
    description: "【ぷんすこ】変身中の体力、物理防御、魔法防御が増加\n【ハイパー】最大体力に応じたダメージが増加",
    description_en: "Mega Gnar bonus HP, Armor, and MR increased. Hyper max HP damage increased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "タリヤ",
    champion_name_en: "Taliyah",
    change_type: "nerf",
    description: "【基本ステータス】移動速度が低下\n【ロックサーフィン】移動速度が低下\n【スレッドボレー】「加工された地面」のクールダウン短縮率が低下",
    description_en: "Base movement speed decreased. Rock Surfing movement speed decreased. Threaded Volley Worked Ground cooldown reduction decreased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ソナ",
    champion_name_en: "Sona",
    change_type: "buff",
    description: "【パーセヴァランス】回復量が増加\n【セレリティ】自身に付与される基本移動速度が増加",
    description_en: "Aria of Perseverance healing increased. Song of Celerity self movement speed increased.",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ケミパンク チェーンソード",
    champion_name_en: "ChempunkChainsword",
    change_type: "buff",
    description: "【基本ステータス】基本体力が250から400に増加",
    description_en: "Base health increased from 250 to 400.",
    is_champion: false
  },
  {
    version: "7.1h",
    champion_name: "バグ修正",
    champion_name_en: "Bugfixes",
    change_type: "adjust",
    description: "「クイックシルバー エンチャント」でスレッシュ(1)とナミ(1)のCCを解除できなかった不具合を修正。",
    description_en: "Fixed an issue where Quicksilver Enchant couldn't cleanse CC from Thresh S1 and Nami S1.",
    is_champion: false
  },
  {
    version: "7.1h",
    champion_name: "ハウリングアビス",
    champion_name_en: "ARAM",
    change_type: "adjust",
    description: "通常の降参投票の開始可能時間が9分から7分に前倒し。可決に必要な賛成票が70%以上に変更。",
    description_en: "Normal surrender time moved from 9 mins to 7 mins. Required votes changed to 70%.",
    is_champion: false
  }
];

const meta = {
  version: "7.1h",
  prediction_ja: "7.1パッチの最終調整となる7.1hでは、ジャングルのパワーバランスが変動します。これまで圧倒的だったノーチラスとヌヌが弱体化された一方、スカーナーが大幅なバフを受け、メタに浮上する可能性があります。サポートではスレッシュ、セラフィーン、ソナといったエンチャンターとキャッチ系サポートが強化され、レーン戦でのプレッシャーと集団戦でのサステインが向上しました。トップレーンではナーのメガ状態が硬くなり影響力が増加します。",
  prediction_en: "In the final balance patch 7.1h, the jungle power dynamic shifts. Dominant picks like Nautilus and Nunu received nerfs, while Skarner got significant buffs that might push him into the meta. In the support role, Thresh, Seraphine, and Sona are buffed, enhancing both catch potential and teamfight sustain. In the top lane, Mega Gnar's durability buffs will increase his overall impact."
};

async function insertData() {
  await supabase.from('patches').delete().eq('version', '7.1h');
  await supabase.from('patch_meta').delete().eq('version', '7.1h');

  // Insert in order with incrementing timestamps
  let baseTime = new Date('2026-06-24T00:00:00Z').getTime();
  const patchesWithTime = patches.map((p, i) => {
    return {
      ...p,
      created_at: new Date(baseTime + i * 1000).toISOString()
    };
  });

  const { data: pData, error: pError } = await supabase.from('patches').insert(patchesWithTime);
  if (pError) {
    console.error('Error inserting patches:', pError);
  } else {
    console.log('Patches inserted successfully.');
  }

  const { data: mData, error: mError } = await supabase.from('patch_meta').insert(meta);
  if (mError) {
    console.error('Error inserting patch_meta:', mError);
  } else {
    console.log('Patch meta inserted successfully.');
  }
}

insertData();
