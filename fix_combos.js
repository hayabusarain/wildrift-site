const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/combos.json');
const dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const dictionary = {
  'パッシブ': 'Passive',
  'スタン': 'Stun',
  'フラッシュ': 'Flash',
  '1段目': '1st',
  '2段目': '2nd',
  '3段目': '3rd',
  '4段目': '4th',
  '段目': ' cast',
  'チャージ': 'Charge',
  'キャノン': 'Cannon',
  'ハンマー': 'Hammer',
  '1発目': '1st hit',
  'ロケット': 'Rocket',
  'ミニガン': 'Minigun',
  'ステップ': 'Step',
  '強化': 'Empowered ',
  'スマイト': 'Smite',
  'ゾーニャの砂時計': 'Stasis',
  'ゾーニャ': 'Stasis',
  'ステイシス': 'Stasis',
  '自分': 'Self',
  '敵': 'Enemy',
  '味方': 'Ally',
  'ヒト': 'Human',
  'クーガー': 'Cougar',
  '乗馬解除': 'Dismount',
  '飛びつき中に': 'during dash',
  '再発動': 'Recast',
  '長押し': 'Hold',
  '密着': 'Melee range',
  'ウルト': 'Ult',
  'アルティメット': 'Ult',
  'スキル': 'Skill',
  '1スキル': 'Skill 1',
  '2スキル': 'Skill 2',
  '3スキル': 'Skill 3',
  '4スキル': 'Ultimate'
};

function translateEn(text) {
  if (!text) return text;
  let t = text;
  
  // For descriptionEn, we replace 1スキル -> Skill 1, etc.
  t = t.replace(/1スキル/g, 'Skill 1');
  t = t.replace(/2スキル/g, 'Skill 2');
  t = t.replace(/3スキル/g, 'Skill 3');
  t = t.replace(/4スキル/g, 'Ultimate');
  t = t.replace(/アルティメット/g, 'Ultimate');
  t = t.replace(/ウルト/g, 'Ultimate');
  t = t.replace(/フラッシュ/g, 'Flash');
  t = t.replace(/通常攻撃/g, 'AA');
  
  return t;
}

function translateSeq(text) {
  if (!text) return text;
  let t = text;
  
  // Replace based on dictionary
  for (const [ja, en] of Object.entries(dictionary)) {
    t = t.split(ja).join(en);
  }
  
  return t;
}

for (const [champ, combos] of Object.entries(data)) {
  for (const combo of combos) {
    if (combo.descriptionEn) {
      combo.descriptionEn = translateEn(combo.descriptionEn);
    }
    
    // Create sequenceEn based on sequence
    if (combo.sequence) {
      combo.sequenceEn = translateSeq(combo.sequence);
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed combos.json (translated Japanese strings in descriptionEn and generated sequenceEn)!');
