const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'combos.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const keys = Object.keys(data);
const chunkSize = Math.ceil(keys.length / 4);

for (let i = 0; i < 4; i++) {
  const chunkKeys = keys.slice(i * chunkSize, (i + 1) * chunkSize);
  const chunkData = {};
  chunkKeys.forEach(k => chunkData[k] = data[k]);
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'public', 'data', `combos_part${i + 1}.json`),
    JSON.stringify(chunkData, null, 2)
  );
  console.log(`Created combos_part${i + 1}.json with ${chunkKeys.length} champions.`);
}
