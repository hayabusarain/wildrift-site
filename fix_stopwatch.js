const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public/data/champion_guides.json');
let dataStr = fs.readFileSync(dataPath, 'utf8');

// Replace Stopwatch with Stasis
dataStr = dataStr.replace(/ストップウォッチ/g, 'ステイシス');

const data = JSON.parse(dataStr);

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Replaced Stopwatch with Stasis.');
