const fs = require('fs');
const path = require('path');

const locales = ['ja', 'en', 'ko', 'vi', 'zh-TW'];
const skillsDir = 'C:/Users/81901/Desktop/ワイリフサイト/public/data/skills';
const patch = '16.10.1'; // Using the latest patch version available

const icons = {
  'P': `https://ddragon.leagueoflegends.com/cdn/${patch}/img/passive/Skarner_Passive.png`,
  'Q': `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/SkarnerQ.png`,
  'W': `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/SkarnerW.png`,
  'E': `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/SkarnerE.png`,
  'R': `https://ddragon.leagueoflegends.com/cdn/${patch}/img/spell/SkarnerR.png`
};

for (const locale of locales) {
  const filePath = path.join(skillsDir, locale + '.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data['Skarner']) {
      for (const skill of data['Skarner']) {
        if (icons[skill.id]) {
          skill.icon = icons[skill.id];
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log('Updated icons for ' + locale + '.json');
    }
  }
}
