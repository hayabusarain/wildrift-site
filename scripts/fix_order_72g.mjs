import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const orderList = [
  "スカーナー",
  "オーロラ",
  "ゾーイ",
  "ダイアナ",
  "ハイマーディンガー",
  "インフィニティ エッジ",
  "ブラック クリーバー",
  "打ちこわし",
  "チル・スマイト",
  "レッドブランブルバック",
  "ラララランダムミッド",
  "バグ修正"
];

async function fixOrder() {
  const { data, error } = await supabase.from('patches').select('*').eq('version', '7.2g');
  if (error) {
    console.error('Error fetching patches:', error);
    return;
  }

  // Set base time
  let baseTime = new Date().getTime();

  for (let i = 0; i < orderList.length; i++) {
    const targetName = orderList[i];
    const patch = data.find(p => p.champion_name === targetName);
    
    if (patch) {
      // Create sequential timestamps (add i seconds)
      const newTime = new Date(baseTime + i * 1000).toISOString();
      const { error: updateError } = await supabase
        .from('patches')
        .update({ created_at: newTime })
        .eq('id', patch.id);
        
      if (updateError) {
        console.error(`Error updating ${targetName}:`, updateError);
      } else {
        console.log(`Updated ${targetName} to ${newTime}`);
      }
    } else {
      console.log(`Could not find patch for ${targetName}`);
    }
  }
}

fixOrder();
