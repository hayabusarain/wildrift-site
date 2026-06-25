const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
let dataStr = fs.readFileSync(dataPath, 'utf8');

const data = JSON.parse(dataStr);
const jaKeys = ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'ngTitle', 'ngText'];
const jaArrayKeys = ['strengths', 'weaknesses'];

function replaceSkills(text) {
  if (!text) return text;
  let t = text;
  
  // Replace standalone Q, W, E, R followed by ascii parenthesis too.
  t = t.replace(/(^|[^a-zA-Z])Q(?=\(|の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$11スキル');
  t = t.replace(/(^|[^a-zA-Z])W(?=\(|の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$12スキル');
  t = t.replace(/(^|[^a-zA-Z])E(?=\(|の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$13スキル');
  t = t.replace(/(^|[^a-zA-Z])R(?=\(|の|を|に|で|が|は|と|や|（|「|、|。|！|？|\s|$)/g, '$1アルティメット');
  
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
console.log('Fixed remaining QWER references with parenthesis!');
