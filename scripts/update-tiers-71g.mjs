import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://cmlhfnaftwvcnlreuplp.supabase.co';
const supabaseKey = 'sb_secret_8NAixlgSKGvQFDOj4hrfyg_0QAEHSpj';
const supabase = createClient(supabaseUrl, supabaseKey);

const content = fs.readFileSync('C:/Users/81901/Desktop/ワイリフサイト/scripts/update-all-tiers.mjs', 'utf8');
const match = content.match(/const championMap = ({[\s\S]*?});/);
let mapStr = match[1];

const championMap = eval('(' + mapStr + ')');

championMap['上古领主'] = { en: "Skarner", ja: "スカーナー" };
championMap['暮光星灵'] = { en: "Zoe", ja: "ゾーイ" };

function getTier(wr) {
  if (wr >= 52) return 'S';
  if (wr >= 50.5) return 'A';
  if (wr >= 49.5) return 'B';
  return 'C';
}

function processData(roleKey, roleDbName) {
  const text = fs.readFileSync(`C:/Users/81901/.gemini/antigravity/brain/937fde67-7537-4dfa-98ce-6b3dfe32b516/scratch/${roleKey}.txt`, 'utf8');
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const records = [];
  
  for (let i = 0; i < lines.length; i++) {
    if (/^\d+$/.test(lines[i])) {
      const cnName = lines[i+1];
      const wrStr = lines[i+2];
      const prStr = lines[i+3];
      const brStr = lines[i+4];
      
      const wr = parseFloat(wrStr.replace('%', ''));
      const pr = parseFloat(prStr.replace('%', ''));
      const br = parseFloat(brStr.replace('%', ''));
      
      const mapInfo = championMap[cnName] || { en: "Unknown", ja: cnName };
      
      records.push({
        champion_name: mapInfo.ja,
        champion_name_en: mapInfo.en,
        win_rate: wr,
        pick_rate: pr,
        ban_rate: br,
        tier: getTier(wr),
        role: roleDbName
      });
    }
  }
  return records;
}

async function run() {
  const topRecords = processData('top', 'TOP');
  const jungleRecords = processData('jng', 'JUNGLE');
  const midRecords = processData('mid', 'MID');
  const adcRecords = processData('adc', 'ADC');
  const supRecords = processData('sup', 'SUPPORT');
  
  const allRecords = [...topRecords, ...jungleRecords, ...midRecords, ...adcRecords, ...supRecords];

  console.log('Deleting old champion_stats...');
  await supabase.from('champion_stats').delete().neq('id', -1);

  console.log('Inserting new stats...');
  const { error } = await supabase.from('champion_stats').insert(allRecords);
  
  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log(`Successfully updated ${allRecords.length} tier lists records!`);
  }
}

run();
