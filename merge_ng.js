const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'public', 'data');
const originalGuidesPath = path.join(dataDir, 'champion_guides.json');

const originalGuides = JSON.parse(fs.readFileSync(originalGuidesPath, 'utf8'));

const chunks = ['A_C', 'D_G', 'H_L', 'M_P', 'Q_T', 'U_Z'];
let mergedCount = 0;

for (const chunk of chunks) {
  const chunkPath = path.join(dataDir, `ng_NEW_${chunk}.json`);
  if (fs.existsSync(chunkPath)) {
    const newData = JSON.parse(fs.readFileSync(chunkPath, 'utf8'));
    for (const champ in newData) {
      if (originalGuides[champ]) {
        Object.assign(originalGuides[champ], newData[champ]);
        mergedCount++;
      }
    }
    // Cleanup
    fs.unlinkSync(chunkPath);
  } else {
    console.warn(`Missing chunk: ${chunkPath}`);
  }
}

fs.writeFileSync(originalGuidesPath, JSON.stringify(originalGuides, null, 2), 'utf8');
console.log(`Successfully merged NG Actions for ${mergedCount} champions into champion_guides.json`);
