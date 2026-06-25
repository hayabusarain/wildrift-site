const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
let dataStr = fs.readFileSync(dataPath, 'utf8');

// The replacements we want to make for PC LoL levels to WR levels:
// Level 6 -> 5
// Level 11 -> 9
// Level 16 -> 13
// Level 18 -> 15

// First, we can just replace the specific phrases in Japanese and English:
// Because we don't want to accidentally replace random numbers (like "16" in "16% damage").
const replacements = [
  { regex: /レベル\s*6/ig, replace: 'レベル5' },
  { regex: /レベル\s*11/ig, replace: 'レベル9' },
  { regex: /レベル\s*16/ig, replace: 'レベル13' },
  { regex: /レベル\s*18/ig, replace: 'レベル15' },
  
  { regex: /Lv\.?\s*6/ig, replace: 'Lv5' },
  { regex: /Lv\.?\s*11/ig, replace: 'Lv9' },
  { regex: /Lv\.?\s*16/ig, replace: 'Lv13' },
  { regex: /Lv\.?\s*18/ig, replace: 'Lv15' },

  { regex: /Level\s*6/ig, replace: 'Level 5' },
  { regex: /Level\s*11/ig, replace: 'Level 9' },
  { regex: /Level\s*16/ig, replace: 'Level 13' },
  { regex: /Level\s*18/ig, replace: 'Level 15' },
];

let modifiedStr = dataStr;
let matchCount = 0;

for (const rep of replacements) {
  const matches = modifiedStr.match(rep.regex);
  if (matches) {
    matchCount += matches.length;
    modifiedStr = modifiedStr.replace(rep.regex, rep.replace);
  }
}

fs.writeFileSync(dataPath, modifiedStr, 'utf8');

console.log(`Replaced ${matchCount} occurrences of PC LoL levels.`);
