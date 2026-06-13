const fs = require('fs');
const path = require('path');

const locales = ['ja', 'en', 'ko', 'vi', 'zh-TW'];
const skillsDir = 'C:/Users/81901/Desktop/ワイリフサイト/public/data/skills';

for (const locale of locales) {
  const filePath = path.join(skillsDir, locale + '.json');
  if (fs.existsSync(filePath)) {
    let rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (data['Skarner']) {
      for (const skill of data['Skarner']) {
        if (skill.description) {
          skill.description = skill.description.replace(/<br>/g, '\n');
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log('Fixed <br> in ' + locale + '.json');
    }
  }
}
