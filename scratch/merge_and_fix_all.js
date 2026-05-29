const fs = require('fs');
const path = require('path');
const http = require('http');

const parsedDir = path.join(process.cwd(), 'src', 'data', 'parsed_skills');
const targetPaths = [
  path.join(process.cwd(), 'public', 'data', 'skills', 'ja.json'),
  path.join(process.cwd(), 'public', 'data', 'all_skills.json')
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function main() {
  console.log('--- Starting Merge & Fix Process ---');
  
  // 1. 既存のベースデータを読み込む
  const jaData = JSON.parse(fs.readFileSync(targetPaths[0], 'utf8'));
  const allData = JSON.parse(fs.readFileSync(targetPaths[1], 'utf8'));

  // 2. parsed_skills のファイルを走査してマージ
  const files = fs.readdirSync(parsedDir).filter(f => f.startsWith('champ_') && f.endsWith('.json'));
  let updatedKeys = new Set();
  
  for (const file of files) {
    try {
      const filePath = path.join(parsedDir, file);
      const parsedContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // key-valueペアで入っている想定 (e.g. { "Ziggs": [...] })
      for (const [champKey, skills] of Object.entries(parsedContent)) {
        
        // テーブルの構造を念のため修正
        skills.forEach(s => {
          if (s.table && Array.isArray(s.table.rows)) {
            s.table.rows = s.table.rows.map(r => {
              if (Array.isArray(r)) {
                return { label: r[0] || '', values: r.slice(1) };
              }
              return r;
            });
          }
        });
        
        jaData[champKey] = skills;
        allData[champKey] = skills;
        updatedKeys.add(champKey);
      }
    } catch(e) {
      console.log(`Failed to parse/merge ${file}: ${e.message}`);
    }
  }
  
  console.log(`Merged data for ${updatedKeys.size} champions.`);

  // 3. アイコン画像の取得と修復 (対象: 更新されたすべてのチャンピオン)
  const keysToFix = Array.from(updatedKeys);
  for (const k of keysToFix) {
    try {
      const dd = await fetchJson(`http://ddragon.leagueoflegends.com/cdn/16.10.1/data/en_US/champion/${k}.json`);
      if (dd && dd.data && dd.data[k]) {
        const champData = dd.data[k];
        const passiveImage = champData.passive.image.full;
        const spellImages = champData.spells.map(s => s.image.full);
        
        [jaData, allData].forEach(dataObj => {
          if (dataObj[k]) {
            dataObj[k].forEach((s, idx) => {
              if (s.id === 'P') {
                s.icon = `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/passive/${passiveImage}`;
              } else if (idx >= 1 && idx <= 4) {
                // スキル1〜4 (idx: 1,2,3,4 は spellImages の 0,1,2,3 に対応)
                s.icon = `https://ddragon.leagueoflegends.com/cdn/16.10.1/img/spell/${spellImages[idx-1]}`;
              }
            });
          }
        });
      }
    } catch(e) {
      console.log(`Failed to fetch DataDragon for ${k}: ${e.message}`);
    }
  }

  // 4. 保存
  fs.writeFileSync(targetPaths[0], JSON.stringify(jaData, null, 2));
  fs.writeFileSync(targetPaths[1], JSON.stringify(allData, null, 2));
  console.log('--- Merge & Fix Completed Successfully! ---');
}

main();
