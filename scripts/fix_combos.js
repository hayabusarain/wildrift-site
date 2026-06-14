const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'data', 'combos.json');
let data = fs.readFileSync(filePath, 'utf8');

data = data.replace(/スキル１/g, '1');
data = data.replace(/スキル２/g, '2');
data = data.replace(/スキル３/g, '3');
data = data.replace(/スキル1/g, '1');
data = data.replace(/スキル2/g, '2');
data = data.replace(/スキル3/g, '3');

fs.writeFileSync(filePath, data);
console.log('Replaced "スキル" with just numbers in combos.json');
