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
    description: "スカーナーは日本時間6月12日9時01分にリリースされます。",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "オーロラ",
    champion_name_en: "Aurora",
    change_type: "nerf",
    description: "折れ重なる魔法\n最初の発動時のダメージ：40/70/100/130 + 魔力の32% → 35/65/95/125 + 魔力の30%\n再発動時のダメージ：40/70/100/130 + 魔力の32% → 35/65/95/125 + 魔力の30%",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "ゾーイ",
    champion_name_en: "Zoe",
    change_type: "buff",
    description: "パドルスター！\n基本ダメージ：30/65/100/135 → 45/80/115/150\n\nスリープバブル\n基本魔力ダメージ：30/80/130/180 → 40/90/140/190\n基本確定ダメージ：30/80/130/180 → 40/90/140/190",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "ダイアナ",
    champion_name_en: "Diana",
    change_type: "buff",
    description: "繊月の刃\nジャングルモンスターに対するダメージ：75% → 100%",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "ハイマーディンガー",
    champion_name_en: "Heimerdinger",
    change_type: "buff",
    description: "H-28G革新砲\n砲台の物理防御：10～80（レベルに応じて） → 20～90（レベルに応じて）\n砲台の体力の魔力反映率：3%～45%（レベルに応じて） → 8%～50%（レベルに応じて）\n砲台のレーザービームの魔力反映率：45% → 55%\n砲台が近接チャンピオンから受ける追加ダメージ：50% → 40%\n\nアップグレード！！！\n「H-28Q超絶砲」が近接チャンピオンから受ける追加ダメージ：50% → 40%",
    is_champion: true
  },
  {
    version: "7.2g",
    champion_name: "インフィニティ エッジ",
    champion_name_en: "Infinity Edge",
    change_type: "buff",
    description: "基本ステータス\n攻撃力：+60 → +65",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "ブラック クリーバー",
    champion_name_en: "Black Cleaver",
    change_type: "buff",
    description: "切断\n物理防御低下の最大スタック数：4 → 5 （最大物理防御低下率：24% → 30%）\n追跡\n増加移動速度が発動する「切断」のスタック数：4 → 5",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "打ちこわし",
    champion_name_en: "Demolish",
    change_type: "adjust",
    description: "ダメージ：200 + 最大体力の30% → 100 + 最大体力の22%\nクールダウン：35秒 → 30秒",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "チル・スマイト",
    champion_name_en: "Chilling Smite",
    change_type: "adjust",
    description: "チャンピオンへの確定ダメージ：38～183.6（レベルに応じて） → 全レベルで40",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "レッドブランブルバック",
    champion_name_en: "Red Brambleback",
    change_type: "adjust",
    description: "残火の赤紋章\nチャンピオンに対する毎秒炎上ダメージ：6～34（レベルに応じて） → 5～15（レベルに応じて、数値上昇はレベル6から）\nチャンピオン以外に対する毎秒炎上ダメージ：3～17（レベルに応じて） → 5～15（レベルに応じて、数値上昇はレベル6から）",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "ラララランダムミッド",
    champion_name_en: "ARAM",
    change_type: "new",
    description: "金床スペシャリスト\n装鋼の刃\nワンインチ\nブラッドブレード\n至高\n隠し玉\nナッシャー\n黄金の心\nディヴァイン シールド\n大急ぎ\n体力ブースター\n強化版「体力ブースター」\n傷口に塩\n強化版「傷口に塩」\n今回のアップデート後には、期間限定のイースターエッグが登場します！保管場所やスタートラインなど。詳細はゲーム内のオーグメントアーカイブをご覧ください。",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "バグ修正",
    champion_name_en: "Bugfixes",
    change_type: "adjust",
    description: "アイテム「ナヴォリ クイックブレード」の説明文の誤りを修正しました。\nアイテム「ハルブレイカー」の所有者が倒された後も、周囲のミニオンのバフが持続していた不具合を修正しました。",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "メカトロックス エクスクイジットエディション",
    champion_name_en: "Mecha Aatrox Exquisite Edition",
    change_type: "new",
    description: "日本時間6月6日9時01分にリリース",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "植物の保護者サイオン",
    champion_name_en: "Protector Sion",
    change_type: "new",
    description: "日本時間6月13日9時01分にリリース",
    is_champion: false
  },
  {
    version: "7.2g",
    champion_name: "灰の復讐者サミーラ",
    champion_name_en: "Ashen Avenger Samira",
    change_type: "new",
    description: "日本時間6月13日9時01分にリリース",
    is_champion: false
  }
];

async function insertData() {
  await supabase.from('patches').delete().eq('version', '7.2g');
  console.log('Deleted existing 7.2g patches.');

  const baseTime = new Date().getTime();
  
  for (let i = 0; i < patches.length; i++) {
    const patch = patches[i];
    const time = new Date(baseTime + i * 1000).toISOString();
    
    const row = {
      ...patch,
      description_en: patch.description, 
      created_at: time
    };

    const { error } = await supabase.from('patches').insert(row);
    if (error) {
      console.error(`Error inserting ${patch.champion_name}:`, error);
    } else {
      console.log(`Inserted ${patch.champion_name} successfully.`);
    }
  }
  
  console.log('All patches inserted sequentially.');
}

insertData();
