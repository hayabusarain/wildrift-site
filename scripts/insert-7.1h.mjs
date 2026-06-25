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
    description: "【魂の束縛】\n魂の出現範囲：12 → 15\n\n【死の宣告】\nクールダウン：17/15/13/11秒 → 18/15/12/9秒\nダメージ：80/130/180/230 + 魔力の50% → 100/160/220/280 + 魔力の80%\n\n【嘆きの魂灯】\nクールダウン：22/20/18/16秒 → 21/19/17/15秒\nシールド：65/115/165/215 → 50/90/130/170\n\n【絶望の鎖】\n強化攻撃の追加ダメージ：80%/100%/120%/140% → 80%/120%/160%/200%\n発動効果のダメージ：65/105/145/185 + 魔力の40% → 75/115/155/195 + 魔力の60%",
    description_en: "[Damnation]\nSoul drop range: 12 → 15\n\n[Death Sentence]\nCooldown: 17/15/13/11s → 18/15/12/9s\nDamage: 80/130/180/230 + 50% AP → 100/160/220/280 + 80% AP\n\n[Dark Passage]\nCooldown: 22/20/18/16s → 21/19/17/15s\nShield: 65/115/165/215 → 50/90/130/170\n\n[Flay]\nEmpowered attack bonus damage: 80%/100%/120%/140% → 80%/120%/160%/200%\nActive damage: 65/105/145/185 + 40% AP → 75/115/155/195 + 60% AP",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ヌヌ＆ウィルンプ",
    champion_name_en: "Nunu",
    change_type: "nerf",
    description: "【丸かじり】\n増加体力に応じたダメージ反映率：6% → 5%\n増加体力に応じた体力自動回復率：12% → 10%\n\n【雪玉連射】\n雪玉：10/14/18/22 → 8/12/16/20",
    description_en: "[Consume]\nBonus HP damage ratio: 6% → 5%\nBonus HP healing ratio: 12% → 10%\n\n[Snowball Barrage]\nSnowball damage: 10/14/18/22 → 8/12/16/20",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "セラフィーン",
    champion_name_en: "Seraphine",
    change_type: "buff",
    description: "【サラウンドサウンド】\n体力回復率：5% → 6%\n\n【アンコール】\nチャーム効果時間：1/1.25/1.5秒 → 1.25/1.5/1.75秒",
    description_en: "[Surround Sound]\nMissing HP healing ratio: 5% → 6%\n\n[Encore]\nCharm duration: 1/1.25/1.5s → 1.25/1.5/1.75s",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "スカーナー",
    champion_name_en: "Skarner",
    change_type: "buff",
    description: "【基本ステータス】\nレベルアップごとの攻撃力増加量：3.5 → 4\nレベルアップごとの体力増加量：120 → 128\n体力自動回復：6 → 9\n\n【砕けし大地 / 大地の怒り】\n3回目の通常攻撃 / 投げの最大体力割合ダメージ：9% → 10%\nスロウ効果：40% → 45%\n\n【激震の砦】\nスロウ効果：20% → 25%",
    description_en: "[Base Stats]\nAD growth: 3.5 → 4\nHP growth: 120 → 128\nHP regen: 6 → 9\n\n[Shattered Earth / Upheaval]\n3rd attack / boulder max HP damage: 9% → 10%\nSlow: 40% → 45%\n\n[Ixtal's Impact]\nSlow: 20% → 25%",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ノーチラス",
    champion_name_en: "Nautilus",
    change_type: "nerf",
    description: "【大海の激憤】\nジャングルモンスターへのダメージ率：200% → 125%\nシールドへの最大体力反映率：13%/14%/15%/16% → 9%/10%/11%/12%\n\n【粉砕水】\nジャングルモンスターへのダメージ率：175% → 125%",
    description_en: "[Titan's Wrath]\nMonster damage ratio: 200% → 125%\nMax HP shield ratio: 13%/14%/15%/16% → 9%/10%/11%/12%\n\n[Riptide]\nMonster damage ratio: 175% → 125%",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ナー",
    champion_name_en: "Gnar",
    change_type: "buff",
    description: "【ぷんすこ】\n変身中の獲得ステータス\n体力：100～850 → 100～900\n物理防御：4～55 → 5～60\n魔法防御：4～65 → 5～70\n\n【ハイパー】\n最大体力に応じたダメージ：6%/8%/10%/12% → 7%/9%/11%/13%",
    description_en: "[Mega Gnar]\nBonus stats while transformed\nHealth: 100~850 → 100~900\nArmor: 4~55 → 5~60\nMagic Resist: 4~65 → 5~70\n\n[Hyper]\nMax HP damage: 6%/8%/10%/12% → 7%/9%/11%/13%",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "タリヤ",
    champion_name_en: "Taliyah",
    change_type: "nerf",
    description: "【基本ステータス】\n移動速度：355 → 350\n\n【ロックサーフィン】\n移動速度：10%/15%/25%/40% → 5%/10%/20%/35%\n\n【スレッドボレー】\n「加工された地面」のクールダウン短縮：50% → 30%",
    description_en: "[Base Stats]\nMovement speed: 355 → 350\n\n[Rock Surfing]\nMovement speed: 10%/15%/25%/40% → 5%/10%/20%/35%\n\n[Threaded Volley]\nWorked Ground cooldown reduction: 50% → 30%",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ソナ",
    champion_name_en: "Sona",
    change_type: "buff",
    description: "【パーセヴァランス】\n回復量：25/40/55/70 → 45/60/75/90\n\n【セレリティ】\n自身に付与される基本移動速度：10/11/12/13% → 15/16/17/18%",
    description_en: "[Aria of Perseverance]\nHealing: 25/40/55/70 → 45/60/75/90\n\n[Song of Celerity]\nSelf bonus movement speed: 10/11/12/13% → 15/16/17/18%",
    is_champion: true
  },
  {
    version: "7.1h",
    champion_name: "ケミパンク チェーンソード",
    champion_name_en: "ChempunkChainsword",
    change_type: "buff",
    description: "【基本ステータス】\n基本体力：250 → 400",
    description_en: "[Base Stats]\nBase Health: 250 → 400",
    is_champion: false
  },
  {
    version: "7.1h",
    champion_name: "バグ修正",
    champion_name_en: "Bugfixes",
    change_type: "adjust",
    description: "「クイックシルバー エンチャント」でスレッシュのスキル（1）とナミのスキル（1）による行動妨害効果を解除できなかった不具合を修正しました。",
    description_en: "Fixed an issue where Quicksilver Enchant couldn't cleanse crowd control from Thresh S1 and Nami S1.",
    is_champion: false
  },
  {
    version: "7.1h",
    champion_name: "ハウリングアビス",
    champion_name_en: "ARAM",
    change_type: "adjust",
    description: "通常の降参投票を開始できる時間が、9分経過後から7分経過後に前倒しされました。早期降参に変更はありません。\n通常の降参投票が可決されるには、70%以上の賛成票が必要になりました。",
    description_en: "Normal surrender voting time moved from 9 mins to 7 mins. Required yes votes changed to 70%.",
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
