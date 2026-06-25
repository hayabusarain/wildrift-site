const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
const dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const jaKeys = ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'ngTitle', 'ngText'];
const jaArrayKeys = ['strengths', 'weaknesses'];

let found = [];
// This regex looks for Q,W,E,R that are not part of an English word
const regex = /(^|[^a-zA-Z])[QWER]([^a-zA-Z]|$)/;

for (const [champ, guide] of Object.entries(data)) {
  for (const key of jaKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      if (regex.test(guide[key])) {
        found.push(`${champ} [${key}]: ${guide[key].match(regex)[0]}`);
      }
    }
  }
  for (const key of jaArrayKeys) {
    if (Array.isArray(guide[key])) {
      for (const text of guide[key]) {
        if (regex.test(text)) {
          found.push(`${champ} [${key}]: ${text.match(regex)[0]}`);
        }
      }
    }
  }
}

if (found.length > 0) {
  console.log(`Found ${found.length} remaining standalone QWER letters:`);
  console.log(found.join('\n'));
} else {
  console.log('No standalone QWER letters found!');
}
