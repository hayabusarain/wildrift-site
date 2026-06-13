const fs = require('fs');
const path = require('path');

const skarnerData = JSON.parse(fs.readFileSync('C:/Users/81901/Desktop/ワイリフサイト/src/data/parsed_skills/champ_139.json', 'utf8')).skills;

const locales = ['ja', 'en', 'ko', 'vi', 'zh-TW'];
const skillsDir = 'C:/Users/81901/Desktop/ワイリフサイト/public/data/skills';

const enTranslations = {
  'P': { name: 'Threads of Vibration', desc: "Skarner's attacks, Shattered Earth, Upheaval, and Impale apply Quaking to enemies for 4 seconds (max 3 stacks).<br>At 3 stacks, Quaking deals 5%-10% max HP magic damage over its duration.<br>Deals 100-450 max damage to monsters." },
  'Q': { name: 'Shattered Earth', desc: "First Cast: Skarner rips a boulder from the earth, empowering his next 3 attacks. He gains 25% Attack Speed and deals 15 (+100% bonus AD)(+4% bonus HP) physical damage to nearby enemies.<br>The 3rd attack deals bonus physical damage equal to 9% max HP and slows by 40% for 1s.<br>Recast (Upheaval): Skarner throws the boulder. It explodes on the first enemy hit, dealing 15 (+100% bonus AD)(+4% bonus HP) + 9% max HP physical damage and slowing by 40% for 1s." },
  'W': { name: 'Seismic Bastion', desc: "Skarner gains a shield equal to 8% max HP for 2.5 seconds and causes an earthquake, dealing 50 (+80% AP) magic damage and slowing nearby enemies by 20% for 1s." },
  'E': { name: "Ixtal's Impact", desc: "First Cast: Skarner charges forward, ignoring terrain. If he collides with an enemy champion or large monster, he grabs them and carries them for the rest of the charge.<br>If he drags them into a wall, they take 102 (60 + 120% bonus AD + 6% max HP) physical damage and are stunned for 1.5s.<br>Recast: End the charge early.<br>Colliding with a wall reduces the cooldown by 35%." },
  'R': { name: 'Impale', desc: "Skarner lashes his tails forward, dealing 150 (+100% AP) magic damage to the first 3 enemy champions hit and suppressing them for 1.5s.<br>Suppressed targets are dragged with Skarner.<br>If he hits at least one champion:<br>- Gains 40% Move Speed for 1.5s.<br>- If Shattered Earth is active, he immediately casts Upheaval." }
};

for (const locale of locales) {
  const filePath = path.join(skillsDir, locale + '.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let localizedSkills = JSON.parse(JSON.stringify(skarnerData));
    
    if (locale === 'en') {
      for (const skill of localizedSkills) {
        if (enTranslations[skill.id]) {
          skill.name = enTranslations[skill.id].name;
          skill.description = enTranslations[skill.id].desc;
        }
      }
    } else if (locale !== 'ja') {
      // For other locales, just fallback to English
      for (const skill of localizedSkills) {
        if (enTranslations[skill.id]) {
          skill.name = enTranslations[skill.id].name;
          skill.description = enTranslations[skill.id].desc;
        }
      }
    }
    
    data['Skarner'] = localizedSkills;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Updated ' + locale + '.json');
  }
}
