const fs = require('fs');
const path = require('path');

const part1Path = path.join(__dirname, 'public/data/guide_part1.json');
const part2Path = path.join(__dirname, 'public/data/guide_part2.json');
const outPath = path.join(__dirname, 'public/data/massive_guide.json');

const part1 = JSON.parse(fs.readFileSync(part1Path, 'utf8'));
const part2 = JSON.parse(fs.readFileSync(part2Path, 'utf8'));

const massive = {
  glossary: part1.glossary,
  lanes: part1.lanes,
  macroMicro: part2.macroMicro,
  objectives: part2.objectives,
  mental: part2.mental
};

fs.writeFileSync(outPath, JSON.stringify(massive, null, 2), 'utf8');

// Also delete part1 and part2
fs.unlinkSync(part1Path);
fs.unlinkSync(part2Path);

console.log('Merged successfully into massive_guide.json');
