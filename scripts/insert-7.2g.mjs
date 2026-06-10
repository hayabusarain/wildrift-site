import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const patches = [
  {
    version: "7.2g",
    champion_name: "スカーナー",
    champion_name_en: "Skarner",
    change_type: "new",
    description: "リワークされたスカーナーがワイルドリフトに登場。高い耐久力とCCを持ち、ジャングルでの活躍が期待されます。",
    description_en: "Skarner arrives in Wild Rift after his rework, bringing high durability and CC to the jungle.",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "オーロラ",
    champion_name_en: "Aurora",
    change_type: "nerf",
    description: "スキル1「折れ重なる魔法」の基本ダメージと魔力反映率が低下。",
    description_en: "Skill 1 base damage and AP ratio decreased.",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "ゾーイ",
    champion_name_en: "Zoe",
    change_type: "buff",
    description: "スキル1「パドルスター！」の基本ダメージが増加。スキル3「スリープバブル」の基本魔力ダメージと確定ダメージが増加。",
    description_en: "Skill 1 base damage increased. Skill 3 base magic and true damage increased.",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "ダイアナ",
    champion_name_en: "Diana",
    change_type: "buff",
    description: "固有スキル「繊月の刃」のモンスターに対するダメージが75%から100%に増加。",
    description_en: "Passive damage modifier against monsters increased from 75% to 100%.",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "ハイマーディンガー",
    champion_name_en: "Heimerdinger",
    change_type: "buff",
    description: "砲台の物理防御、体力の魔力反映率、レーザービームの魔力反映率が増加。近接チャンピオンから受ける追加ダメージが減少。",
    description_en: "Turret armor, health AP ratio, and laser AP ratio increased. Bonus damage taken from melee champions decreased.",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "インフィニティ エッジ",
    champion_name_en: "InfinityEdge",
    change_type: "buff",
    description: "攻撃力が増加（+60 → +65）。",
    description_en: "Attack Damage increased (+60 -> +65).",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "ブラック クリーバー",
    champion_name_en: "BlackCleaver",
    change_type: "buff",
    description: "物理防御低下の最大スタック数が4から5に増加（最大低下率30%）。増加移動速度発動の必要スタック数も5に増加。",
    description_en: "Armor reduction max stacks increased to 5 (30% total reduction). Movement speed activation stacks also increased.",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "打ちこわし",
    champion_name_en: "Demolish",
    change_type: "adjust",
    description: "タワーへのダメージが低下したが、クールダウンが短縮（35秒 → 30秒）。",
    description_en: "Damage to turrets decreased, but cooldown reduced from 35s to 30s.",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "チル・スマイト",
    champion_name_en: "ChillingSmite",
    change_type: "nerf",
    description: "チャンピオンに対する確定ダメージが全レベルで40に低下。",
    description_en: "True damage against champions reduced to a flat 40 at all levels.",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "レッドブランブルバック",
    champion_name_en: "RedBrambleback",
    change_type: "nerf",
    description: "「焦炎の王冠」のチャンピオンに対する毎秒炎上ダメージが低下。",
    description_en: "Red buff burn damage per second against champions decreased.",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "ラララランダムミッド",
    champion_name_en: "ARAM",
    change_type: "new",
    description: "「金床スペシャリスト」や「ヒットコンボ」などの新たなオーグメントが追加。",
    description_en: "New augments added including Anvil Specialist and Hit Combo.",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "バグ修正",
    champion_name_en: "Bugfixes",
    change_type: "adjust",
    description: "ナヴォリクイックブレードの説明文誤り修正、ハルブレイカーのバフ持続不具合修正。",
    description_en: "Fixed Navori Quickblades tooltip and Hullbreaker minion buff persistence bug.",
    is_champion: false
  }
];

const meta = {
  version: "7.2g",
  prediction_ja: "スカーナーの登場によりジャングルやトップでのCC・エンゲージ能力が高いピックが増加するでしょう。また、ゾーイやダイアナ、ハイマーディンガーといったメイジ・アサシン系のチャンピオンが強化されたことで、ミッドやジャングルでの影響力が高まります。アイテムではインフィニティエッジの強化によりクリティカル系マークスマンの後半のキャリー力が増し、ブラッククリーバーの強化によって物理ファイターのタンク溶かし能力が向上しました。ルーンとシステムの調整（打ちこわしや赤バフの弱体化）により、序盤のバーストやタワーへの過剰なプレッシャーが緩和され、より長めの集団戦や継続的なプレイが求められるメタにシフトする見込みです。",
  prediction_en: "The introduction of Skarner brings heavy CC and engage to the jungle and top lane. Buffs to Zoe, Diana, and Heimerdinger will elevate their presence in the mid lane and jungle. For items, the Infinity Edge buff strengthens critical strike marksmen in the late game, while the Black Cleaver buff improves AD fighters' tank-shredding capabilities. System adjustments, including nerfs to Demolish and Red Buff's burn damage, will reduce early burst and excessive tower pressure, shifting the meta towards more extended teamfights and sustained play."
};

async function insertData() {
  // Delete existing data for 7.2g
  await supabase.from('patches').delete().eq('version', '7.2g');
  await supabase.from('patch_meta').delete().eq('version', '7.2g');

  // Insert new patches
  const { data: pData, error: pError } = await supabase.from('patches').insert(patches);
  if (pError) {
    console.error('Error inserting patches:', pError);
  } else {
    console.log('Patches inserted successfully.');
  }

  // Insert new meta
  const { data: mData, error: mError } = await supabase.from('patch_meta').insert(meta);
  if (mError) {
    console.error('Error inserting patch_meta:', mError);
  } else {
    console.log('Patch meta inserted successfully.');
  }
}

insertData();
