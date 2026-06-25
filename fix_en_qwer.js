const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
let dataStr = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(dataStr);

const enKeys = ['earlyGameEn', 'midGameEn', 'lateGameEn', 'teamfightEn', 'ngTitleEn', 'ngTextEn'];
const enArrayKeys = ['strengthsEn', 'weaknessesEn'];

function replaceSkills(text) {
  if (!text) return text;
  let t = text;
  
  // Explicitly handle Q1, Q2, Q3 etc. first
  t = t.replace(/\bQ1\b/g, '1st cast of Skill 1');
  t = t.replace(/\bQ2\b/g, '2nd cast of Skill 1');
  t = t.replace(/\bQ3\b/g, '3rd cast of Skill 1');
  t = t.replace(/\bW1\b/g, '1st cast of Skill 2');
  t = t.replace(/\bW2\b/g, '2nd cast of Skill 2');
  t = t.replace(/\bE1\b/g, '1st cast of Skill 3');
  t = t.replace(/\bE2\b/g, '2nd cast of Skill 3');
  t = t.replace(/\bR1\b/g, '1st cast of Ultimate');
  t = t.replace(/\bR2\b/g, '2nd cast of Ultimate');

  // Possessives
  t = t.replace(/\bQ's\b/g, "Skill 1's");
  t = t.replace(/\bW's\b/g, "Skill 2's");
  t = t.replace(/\bE's\b/g, "Skill 3's");
  t = t.replace(/\bR's\b/g, "Ultimate's");

  // Standalone Q, W, E, R
  t = t.replace(/\bQ\b/g, 'Skill 1');
  t = t.replace(/\bW\b/g, 'Skill 2');
  t = t.replace(/\bE\b/g, 'Skill 3');
  t = t.replace(/\bR\b/g, 'Ultimate');
  
  // Also replace 'Stopwatch' with 'Stasis'
  t = t.replace(/\bStopwatch\b/gi, 'Stasis');

  return t;
}

for (const [champ, guide] of Object.entries(data)) {
  for (const key of enKeys) {
    if (guide[key] && typeof guide[key] === 'string') {
      guide[key] = replaceSkills(guide[key]);
    }
  }
  for (const key of enArrayKeys) {
    if (Array.isArray(guide[key])) {
      guide[key] = guide[key].map(text => replaceSkills(text));
    }
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Fixed ALL standalone QWER and Stopwatch references in English fields!');
