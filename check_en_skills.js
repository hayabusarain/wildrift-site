const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
const dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const enKeys = ['earlyGameEn', 'midGameEn', 'lateGameEn', 'teamfightEn', 'ngTitleEn', 'ngTextEn'];
const enArrayKeys = ['strengthsEn', 'weaknessesEn'];

let issues = [];

for (const [champ, guide] of Object.entries(data)) {
  for (const key of enKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      if (guide[key].match(/[１２３４1234]スキル/)) {
        issues.push(`${champ} [${key}]: ${guide[key]}`);
      }
    }
  }
  for (const key of enArrayKeys) {
    if (Array.isArray(guide[key])) {
      for (const text of guide[key]) {
        if (text.match(/[１２３４1234]スキル/)) {
          issues.push(`${champ} [${key}]: ${text}`);
        }
      }
    }
  }
}

if (issues.length > 0) {
  console.log(`Found ${issues.length} Japanese skill terms in English fields:`);
  console.log(issues.slice(0, 10).join('\n'));
} else {
  console.log('No Japanese skill terms found in English fields.');
}
