const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const badPatterns = [
  /レベル\s*[68]|lv\.?\s*[68]|level\s*[68]/i,
  /レベル\s*1[168]|lv\.?\s*1[168]|level\s*1[168]/i,
  /テレポート/i,
  /ミシック/i,
];

const flagged = {};

for (const [champ, guide] of Object.entries(data)) {
  for (const [key, text] of Object.entries(guide)) {
    if (typeof text === 'string') {
      for (const pattern of badPatterns) {
        if (pattern.test(text)) {
          if (!flagged[champ]) flagged[champ] = [];
          flagged[champ].push({ key, text, match: text.match(pattern)[0] });
        }
      }
    }
  }
}

console.log(JSON.stringify(flagged, null, 2));
