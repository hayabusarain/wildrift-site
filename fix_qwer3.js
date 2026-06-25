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
  
  // Replace standalone Q, W, E, R not adjacent to other english letters
  t = t.replace(/(^|[^a-zA-Z])Q(?=[^a-zA-Z]|$)/g, '$11スキル');
  t = t.replace(/(^|[^a-zA-Z])W(?=[^a-zA-Z]|$)/g, '$12スキル');
  t = t.replace(/(^|[^a-zA-Z])E(?=[^a-zA-Z]|$)/g, '$13スキル');
  t = t.replace(/(^|[^a-zA-Z])R(?=[^a-zA-Z]|$)/g, '$1アルティメット');
  
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
console.log('Fixed ALL standalone QWER references in Japanese fields!');
