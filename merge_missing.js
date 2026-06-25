const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');
const originalGuidesPath = path.join(dataDir, 'champion_guides.json');
const missingGuidesPath = path.join(dataDir, 'guides_NEW_missing.json');

const originalGuides = JSON.parse(fs.readFileSync(originalGuidesPath, 'utf8'));
const missingGuides = JSON.parse(fs.readFileSync(missingGuidesPath, 'utf8'));

let mergedCount = 0;
for (const [champ, strategies] of Object.entries(missingGuides)) {
  if (!originalGuides[champ]) {
    originalGuides[champ] = {};
  }
  Object.assign(originalGuides[champ], strategies);
  mergedCount++;
}

fs.writeFileSync(originalGuidesPath, JSON.stringify(originalGuides, null, 2), 'utf8');
console.log(`Successfully merged ${mergedCount} missing champions into champion_guides.json`);

if (fs.existsSync(missingGuidesPath)) {
  fs.unlinkSync(missingGuidesPath);
  console.log('Cleaned up missing guides file.');
}
