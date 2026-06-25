const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
const dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const enKeys = ['earlyGameEn', 'midGameEn', 'lateGameEn', 'teamfightEn', 'ngTitleEn', 'ngTextEn'];
const enArrayKeys = ['strengthsEn', 'weaknessesEn'];

let found = [];
const regex = /(^|[^a-zA-Z])[QWER]([^a-zA-Z]|$)/;

for (const [champ, guide] of Object.entries(data)) {
  for (const key of enKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      if (regex.test(guide[key])) {
        found.push(`${champ} [${key}]: ${guide[key]}`);
      }
    }
  }
}

if (found.length > 0) {
  console.log(`Found ${found.length} English fields with Q/W/E/R:`);
  console.log(found.slice(0, 5).join('\n'));
} else {
  console.log('No standalone QWER found in English fields.');
}
