const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/81901/Desktop/ワイリフサイト/src/data/champion_stats.json', 'utf8'));
const champs = [...new Set(data.map(d => d.champion_name_en))];
const filtered = champs.filter(c => /^[HIJKL]/i.test(c)).sort();
console.log(filtered.join(', '));
