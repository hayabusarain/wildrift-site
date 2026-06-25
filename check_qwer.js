const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const jaKeys = ['earlyGame', 'midGame', 'lateGame', 'teamfight', 'ngTitle', 'ngText'];
const jaArrayKeys = ['strengths', 'weaknesses'];

let matchCount = 0;
const examples = [];

// Matches Q, W, E, R when used as a word (e.g. "Qの", "Wを", " E ", "R（", "Qスキル")
// But we have to be careful with English words if they somehow leaked into Japanese.
const pattern = /(?:^|[^a-zA-Z])([QWER])(?:スキル|の|を|に|で|が|は|と|や|（|\(|\s|$)/g;

for (const [champ, guide] of Object.entries(data)) {
  for (const key of jaKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      const matches = [...guide[key].matchAll(pattern)];
      if (matches.length > 0) {
        matchCount += matches.length;
        if (examples.length < 10) examples.push(guide[key]);
      }
    }
  }
  for (const key of jaArrayKeys) {
    if (Array.isArray(guide[key])) {
      for (const text of guide[key]) {
        const matches = [...text.matchAll(pattern)];
        if (matches.length > 0) {
          matchCount += matches.length;
          if (examples.length < 10) examples.push(text);
        }
      }
    }
  }
}

console.log(`Found ${matchCount} matches of Q/W/E/R in Japanese text.`);
console.log('Examples:', examples);
