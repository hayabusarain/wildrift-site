import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: "7.1g",
    champion_name: "スカーナー",
    champion_name_en: "Skarner",
    change_type: "new",
    description: "新登場\n原始の守護者、スカーナー\n古代の巨大生物種ブラカーンであるスカーナーは、イシュタルの支配層“ユン・タル”初代メンバーのひとりとして崇拝されている。\n高い耐久力とCCを持ち、ジャングルでの活躍が期待されます。",
    description_en: "New Release\nSkarner, the Primordial Sovereign\nArrives in Wild Rift after his rework, bringing high durability and CC to the jungle.",
    is_champion: true
  },
  {
    version: "7.1g",
    champion_name: "オーロラ",
    champion_name_en: "Aurora",
    change_type: "nerf",
    description: "【折れ重なる魔法】\n最初の発動時のダメージ：40/70/100/130 + 魔力の32% → 35/65/95/125 + 魔力の30%\n再発動時のダメージ：40/70/100/130 + 魔力の32% → 35/65/95/125 + 魔力の30%",
    description_en: "[Twofold Hex]\nFirst cast damage: 40/70/100/130 + 32% AP → 35/65/95/125 + 30% AP\nRecast damage: 40/70/100/130 + 32% AP → 35/65/95/125 + 30% AP",
    is_champion: true
  },
  {
    version: "7.1g",
    champion_name: "ゾーイ",
    champion_name_en: "Zoe",
    change_type: "buff",
    description: "【パドルスター！】\n基本ダメージ：30/65/100/135 → 45/80/115/150\n\n【スリープバブル】\n基本魔力ダメージ：30/80/130/180 → 40/90/140/190\n基本確定ダメージ：30/80/130/180 → 40/90/140/190",
    description_en: "[Paddle Star!]\nBase damage: 30/65/100/135 → 45/80/115/150\n\n[Sleepy Trouble Bubble]\nBase magic damage: 30/80/130/180 → 40/90/140/190\nBase true damage: 30/80/130/180 → 40/90/140/190",
    is_champion: true
  },
  {
    version: "7.1g",
    champion_name: "ダイアナ",
    champion_name_en: "Diana",
    change_type: "buff",
    description: "【繊月の刃】\nジャングルモンスターに対するダメージ：75% → 100%",
    description_en: "[Moonsilver Blade]\nDamage against jungle monsters: 75% → 100%",
    is_champion: true
  },
  {
    version: "7.1g",
    champion_name: "ハイマーディンガー",
    champion_name_en: "Heimerdinger",
    change_type: "buff",
    description: "【H-28G革新砲】\n砲台の物理防御：10～80（レベルに応じて） → 20～90\n砲台の体力の魔力反映率：3%～45% → 8%～50%\n砲台のレーザービームの魔力反映率：45% → 55%\n砲台が近接チャンピオンから受ける追加ダメージ：50% → 40%\n\n【アップグレード！！！】\n「H-28Q超絶砲」が近接チャンピオンから受ける追加ダメージ：50% → 40%",
    description_en: "[H-28G Evolution Turret]\nTurret Armor: 10~80 → 20~90\nTurret Health AP ratio: 3%~45% → 8%~50%\nTurret Laser AP ratio: 45% → 55%\nBonus damage taken from melee champions: 50% → 40%\n\n[UPGRADE!!!]\nH-28Q Apex Turret bonus damage taken from melee champions: 50% → 40%",
    is_champion: true
  },
  {
    version: "7.1g",
    champion_name: "インフィニティ エッジ",
    champion_name_en: "InfinityEdge",
    change_type: "buff",
    description: "【基本ステータス】\n攻撃力：+60 → +65",
    description_en: "[Base Stats]\nAttack Damage: +60 → +65",
    is_champion: false
  },
  {
    version: "7.1g",
    champion_name: "ブラック クリーバー",
    champion_name_en: "BlackCleaver",
    change_type: "buff",
    description: "【切断】\n物理防御低下の最大スタック数：4 → 5 （最大低下率：24% → 30%）\n\n【追跡】\n増加移動速度が発動する「切断」のスタック数：4 → 5",
    description_en: "[Sunder]\nArmor reduction max stacks: 4 → 5 (Max reduction: 24% → 30%)\n\n[Rage]\nSunder stacks required for bonus movement speed: 4 → 5",
    is_champion: false
  },
  {
    version: "7.1g",
    champion_name: "打ちこわし",
    champion_name_en: "Demolish",
    change_type: "adjust",
    description: "ダメージ：200 + 最大体力の30% → 100 + 最大体力の22%\nクールダウン：35秒 → 30秒",
    description_en: "Damage: 200 + 30% max HP → 100 + 22% max HP\nCooldown: 35s → 30s",
    is_champion: false
  },
  {
    version: "7.1g",
    champion_name: "チル・スマイト",
    champion_name_en: "ChillingSmite",
    change_type: "nerf",
    description: "チャンピオンへの確定ダメージ：38～183.6（レベルに応じて） → 全レベルで40",
    description_en: "True damage to champions: 38~183.6 (based on level) → 40 at all levels",
    is_champion: false
  },
  {
    version: "7.1g",
    champion_name: "レッドブランブルバック",
    champion_name_en: "RedBrambleback",
    change_type: "nerf",
    description: "【残火の赤紋章】\nチャンピオンに対する毎秒炎上ダメージ：6～34（レベルに応じて） → 5～15（レベルに応じて、数値上昇はレベル6から）\nチャンピオン以外に対する毎秒炎上ダメージ：3～17（レベルに応じて） → 5～15（レベルに応じて、数値上昇はレベル6から）",
    description_en: "[Crest of Cinders]\nBurn damage per second to champions: 6~34 → 5~15\nBurn damage per second to non-champions: 3~17 → 5~15",
    is_champion: false
  },
  {
    version: "7.1g",
    champion_name: "バグ修正",
    champion_name_en: "Bugfixes",
    change_type: "adjust",
    description: "アイテム「ナヴォリ クイックブレード」の説明文の誤りを修正。\nアイテム「ハルブレイカー」の所有者が倒された後も、周囲のミニオンのバフが持続していた不具合を修正。",
    description_en: "Fixed Navori Quickblades tooltip error. Fixed Hullbreaker minion buff persisting after owner's death.",
    is_champion: false
  },
  {
    version: "7.1g",
    champion_name: "ラララランダムミッド",
    champion_name_en: "ARAM",
    change_type: "adjust",
    description: "「金床スペシャリスト」や「ヒットコンボ」など、新たなオーグメントが多数追加されました。",
    description_en: "New augments added including Anvil Specialist and Hit Combo.",
    is_champion: false
  }
];

const meta = {
  version: "7.1g",
  prediction_ja: "スカーナーの登場によりジャングルやトップでのCC・エンゲージ能力が高いピックが増加するでしょう。また、ゾーイやダイアナ、ハイマーディンガーといったメイジ・アサシン系のチャンピオンが強化されたことで、ミッドやジャングルでの影響力が高まります。アイテムではインフィニティエッジの強化によりクリティカル系マークスマンの後半のキャリー力が増し、ブラッククリーバーの強化によって物理ファイターのタンク溶かし能力が向上しました。ルーンとシステムの調整（打ちこわしや赤バフの弱体化）により、序盤のバーストやタワーへの過剰なプレッシャーが緩和され、より長めの集団戦や継続的なプレイが求められるメタにシフトする見込みです。",
  prediction_en: "The introduction of Skarner brings heavy CC and engage to the jungle and top lane. Buffs to Zoe, Diana, and Heimerdinger will elevate their presence in the mid lane and jungle. For items, the Infinity Edge buff strengthens critical strike marksmen in the late game, while the Black Cleaver buff improves AD fighters' tank-shredding capabilities. System adjustments, including nerfs to Demolish and Red Buff's burn damage, will reduce early burst and excessive tower pressure, shifting the meta towards more extended teamfights and sustained play."
};

async function insertData() {
  await supabase.from('patches').delete().eq('version', '7.1g');
  await supabase.from('patch_meta').delete().eq('version', '7.1g');

  // Insert in order with incrementing timestamps
  let baseTime = new Date('2026-06-10T00:00:00Z').getTime();
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
