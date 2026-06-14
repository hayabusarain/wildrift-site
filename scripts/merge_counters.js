const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const files = [
  'new_counters_A_E.json',
  'new_counters_F_L.json',
  'new_counters_M_R.json',
  'new_counters_S_Z.json'
];

let mergedData = {};

for (const file of files) {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      mergedData = { ...mergedData, ...data };
      console.log(`Merged ${file}`);
    } catch (e) {
      console.error(`Error parsing ${file}:`, e.message);
    }
  } else {
    console.log(`${file} not found yet.`);
  }
}

fs.writeFileSync(path.join(dataDir, 'counters.json'), JSON.stringify(mergedData, null, 2));
console.log('Successfully created counters.json with', Object.keys(mergedData).length, 'champions.');
