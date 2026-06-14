const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'public', 'data');
const files = [
  'combos_A_E.json',
  'combos_F_L.json',
  'combos_M_R.json',
  'combos_S_Z.json'
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

fs.writeFileSync(path.join(dataDir, 'combos.json'), JSON.stringify(mergedData, null, 2));
console.log('Successfully created combos.json with', Object.keys(mergedData).length, 'champions.');
