const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
const dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const jaKeys = ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'ngTitle', 'ngText'];
const jaArrayKeys = ['strengths', 'weaknesses'];

const pcTerms = [
  'ピンクワード', 'ピンワ', 
  'ミシック', 
  'Lv6', 'レベル6', 'Lv11', 'レベル11', 'Lv16', 'レベル16', 
  'テレポート', 'TP',
  'インヒビター復活' // Inhibitors don't respawn in WR
];

let found = [];

for (const [champ, guide] of Object.entries(data)) {
  for (const key of jaKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      for (const term of pcTerms) {
        if (guide[key].includes(term)) {
          found.push(`${champ} [${key}]: contains ${term} -> ${guide[key]}`);
        }
      }
    }
  }
  for (const key of jaArrayKeys) {
    if (Array.isArray(guide[key])) {
      for (const text of guide[key]) {
        for (const term of pcTerms) {
          if (text.includes(term)) {
            found.push(`${champ} [${key}]: contains ${term} -> ${text}`);
          }
        }
      }
    }
  }
}

if (found.length > 0) {
  console.log(`Found ${found.length} suspicious PC terms:`);
  console.log(found.slice(0, 10).join('\n')); // Show up to 10
} else {
  console.log('No suspicious PC terms found!');
}
