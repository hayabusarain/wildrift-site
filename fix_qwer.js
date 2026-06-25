const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
let dataStr = fs.readFileSync(dataPath, 'utf8');

// We want to replace standalone Q, W, E, R in Japanese contexts.
// Examples to replace:
// "Qスキル" -> "1スキル"
// "W（2スキ）" -> "2スキル"
// "E（3スキ）" -> "3スキル"
// "R" -> "アルティメット"

// First, handle explicit "Q（1スキ）", "W（2スキ）" etc.
dataStr = dataStr.replace(/Q\s*（[^）]*1スキ[^）]*）/g, '1スキル');
dataStr = dataStr.replace(/W\s*（[^）]*2スキ[^）]*）/g, '2スキル');
dataStr = dataStr.replace(/E\s*（[^）]*3スキ[^）]*）/g, '3スキル');
dataStr = dataStr.replace(/R\s*（[^）]*4スキ[^）]*）/g, 'アルティメット');
dataStr = dataStr.replace(/R\s*（[^）]*ウルト[^）]*）/g, 'アルティメット');

// Handle "Qスキル"
dataStr = dataStr.replace(/Qスキル/g, '1スキル');
dataStr = dataStr.replace(/Wスキル/g, '2スキル');
dataStr = dataStr.replace(/Eスキル/g, '3スキル');
dataStr = dataStr.replace(/Rスキル/g, 'アルティメット');

// Now we need to be careful not to replace English 'Q', 'W', 'E', 'R' inside English texts, or in words like "AoE", "CC".
// We will parse the JSON and only replace in Japanese fields.

const data = JSON.parse(dataStr);
const jaKeys = ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'ngTitle', 'ngText'];
const jaArrayKeys = ['strengths', 'weaknesses'];

function replaceSkills(text) {
  if (!text) return text;
  let t = text;
  
  // Replace standalone Q, W, E, R followed by Japanese characters or spaces/parens.
  // Example: Qの -> 1スキルの, Qを -> 1スキルを, Q（ -> 1スキル（, Qで -> 1スキルで
  t = t.replace(/(^|[^a-zA-Z])Q(?=の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$11スキル');
  t = t.replace(/(^|[^a-zA-Z])W(?=の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$12スキル');
  t = t.replace(/(^|[^a-zA-Z])E(?=の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$13スキル');
  t = t.replace(/(^|[^a-zA-Z])R(?=の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$1アルティメット');

  // Do a second pass for things like "Q/E" -> "1スキル/3スキル"
  t = t.replace(/(^|[^a-zA-Z])Q(?=\/)/g, '$11スキル');
  t = t.replace(/(^|[^a-zA-Z])W(?=\/)/g, '$12スキル');
  t = t.replace(/(^|[^a-zA-Z])E(?=\/)/g, '$13スキル');
  t = t.replace(/(^|[^a-zA-Z])R(?=\/)/g, '$1アルティメット');
  
  // Sometimes they use 1スキ, 2スキ, 3スキ instead of 1スキル. It's okay.
  return t;
}

for (const [champ, guide] of Object.entries(data)) {
  for (const key of jaKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      guide[key] = replaceSkills(guide[key]);
    }
  }
  for (const key of jaArrayKeys) {
    if (Array.isArray(guide[key])) {
      guide[key] = guide[key].map(text => replaceSkills(text));
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Replaced Q/W/E/R references with 1/2/3/アルティメット!');
