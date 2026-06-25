const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/combos.json');
const dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const seqJa = new Set();
const descEnJa = new Set();

const regexJa = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;

for (const [champ, combos] of Object.entries(data)) {
  for (const combo of combos) {
    if (combo.sequence && regexJa.test(combo.sequence)) {
      // Extract the Japanese parts
      const matches = combo.sequence.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g);
      if (matches) {
        matches.forEach(m => seqJa.add(m));
      }
    }
    
    if (combo.descriptionEn && regexJa.test(combo.descriptionEn)) {
      const matches = combo.descriptionEn.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g);
      if (matches) {
        matches.forEach(m => descEnJa.add(m));
      }
    }
  }
}

console.log('Japanese words in sequence:', Array.from(seqJa));
console.log('Japanese words in descriptionEn (sample of 30):', Array.from(descEnJa).slice(0, 30));
