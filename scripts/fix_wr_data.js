const fs = require('fs');
const path = require('path');

const guidesPath = path.join(__dirname, '../public/data/champion_guides.json');
const combosPath = path.join(__dirname, '../public/data/combos.json');

let guides = JSON.parse(fs.readFileSync(guidesPath, 'utf8'));
let combos = JSON.parse(fs.readFileSync(combosPath, 'utf8'));

// 1. Manual Fixes for WR specific champions
const wrFixes = {
  LeeSin: {
    guide: "序盤から積極的にアクションを起こし、試合の主導権を握るアグレッシブなジャングラー。ワイルドリフトでは2スキルが自由な方向にダッシュできるため、極めて高い機動力を誇ります。敵陣の裏に回り込み、Ultで敵のキャリーを味方の前に蹴り飛ばすプレイが強力です。",
    combos: [
      { name: "基本ガンク", nameEn: "Basic Gank", sequence: "2 -> 1(1段目) -> 1(2段目) -> 3 -> AA", description: "2スキルで敵に接近し、確実に1スキルを当ててスロウとダメージを与えます。", descriptionEn: "Gap close with 2, land 1 for damage and slow." },
      { name: "インセク", nameEn: "Insec", sequence: "1(1段目) -> 1(2段目) -> 2 -> Ult", description: "1スキルで敵に飛びつき、2スキルで敵の後ろに回り込んでからUltで味方側に蹴り飛ばします。", descriptionEn: "Dash to enemy with 1, use 2 to get behind them, and kick them back with Ult." }
    ]
  },
  Karma: {
    guide: "パッシブスキルでスタックを溜めることで、次の通常スキルを強化できるメイジ/エンチャンター。Ultの「トランセンデンス」による強力な範囲引き寄せで、集団戦の形を一気に作り出すことができます。",
    combos: [
      { name: "ハラスコンボ", nameEn: "Harass", sequence: "3 -> 1", description: "3スキルのシールドと移動速度アップで近づき、1スキルを当てます。", descriptionEn: "Use 3 to close gap, then hit 1." },
      { name: "集団戦エンゲージ", nameEn: "Teamfight Engage", sequence: "Ult -> 強化1", description: "Ultで敵を複数人引き寄せたところに、パッシブで強化した1スキルを叩き込みます。", descriptionEn: "Pull enemies with Ult, then hit them with empowered 1." }
    ]
  },
  Soraka: {
    guide: "回復に自身の体力を消費しなくなったため、マナがある限り味方を回復し続けられる最強のヒーラー。集団戦では敵のアサシンから逃げつつ、3スキルのサイレンスで敵の致命的なコンボを封じます。",
    combos: [
      { name: "基本トレード", nameEn: "Basic Trade", sequence: "1 -> AA", description: "1スキルを当てて自身の体力を回復しつつハラスします。", descriptionEn: "Hit 1 to heal and harass." },
      { name: "詠唱妨害", nameEn: "Interrupt", sequence: "3 -> 1", description: "3スキルで敵のスキルを封じ、足が止まったところに1スキルを当てます。", descriptionEn: "Silence with 3, then hit 1." }
    ]
  },
  Lux: {
    guide: "1スキルがミニオンを貫通し、3スキルが敵の範囲内で即座に爆発するようになったことで、非常に扱いやすくなったメイジ。安全な距離を保ちつつ、スネアからのフルコンボで敵を瞬殺します。",
    combos: [
      { name: "基本ハラス", nameEn: "Basic Harass", sequence: "3 -> AA", description: "3スキルを敵に当てて爆発させ、通常攻撃でパッシブの追加ダメージを与えます。", descriptionEn: "Hit 3, then AA to proc passive." },
      { name: "ワンコンボ", nameEn: "One-Shot Combo", sequence: "1 -> 3 -> Ult", description: "1スキルのスネアを当て、3スキルとUltを同時に叩き込んで一瞬でダメージを出します。", descriptionEn: "Root with 1, then follow up with 3 and Ult." }
    ]
  },
  Katarina: {
    guide: "短剣を拾うことで大ダメージを発生させるアサシン。ワイルドリフトではUlt中にゆっくりと移動できるため、敵のスキルを避けながらダメージを与え続けることが可能です。キルを獲得してスキルを連続発動しペンタキルを狙います。",
    combos: [
      { name: "基本エンゲージ", nameEn: "Basic Engage", sequence: "1 -> 3 -> 2 -> Ult", description: "1スキルで短剣を投げ、3スキルで飛び込みます。2スキルで短剣を落としつつUltを発動します。", descriptionEn: "Throw 1, jump with 3, drop 2 and Ult." }
    ]
  },
  Janna: {
    guide: "1スキルの竜巻が2チャージ可能になり、3スキルが自動で味方にシールドを付与するようになった、防衛力の高いエンチャンター。敵のエンゲージをUltで弾き飛ばし、味方のキャリーを死守します。",
    combos: [
      { name: "ディスエンゲージ", nameEn: "Disengage", sequence: "1 -> Ult", description: "竜巻で敵を打ち上げ、さらにUltでノックバックさせて味方を守ります。", descriptionEn: "Knock up with 1, then knock back with Ult." }
    ]
  },
  Sona: {
    guide: "パッシブで敵にスタンを与えられるようになり、攻撃的にも動けるようになったエンチャンター。試合が長引くほどスキルのクールダウンが短縮され、オーラを途切れなくばら撒く最強のサポーターになります。",
    combos: [
      { name: "スタンコンボ", nameEn: "Stun Combo", sequence: "パッシブ(スタン)AA -> 1 -> AA", description: "スタックが溜まった状態の通常攻撃で敵をスタンさせ、1スキルで追撃します。", descriptionEn: "Stun with passive AA, then follow with 1." },
      { name: "集団戦コンボ", nameEn: "Teamfight Combo", sequence: "3 -> Ult -> 1", description: "3スキルで味方と移動し、Ultで敵を複数スタンさせ、1スキルでダメージを与えます。", descriptionEn: "Engage with 3, Ult multiple enemies, then 1." }
    ]
  },
  Annie: {
    guide: "3スキルで自身だけでなく味方にもシールドと移動速度アップを付与でき、Ultのティバーズが敵に飛びつくためエンゲージが強力なメイジ。スタックを管理し、スタン付きのUltで集団戦を決定づけます。",
    combos: [
      { name: "スタンエンゲージ", nameEn: "Stun Engage", sequence: "パッシブ(スタン)Ult -> 2 -> 1", description: "スタン付きのUltを敵集団に叩き込み、ティバーズと共に一気にダメージを出します。", descriptionEn: "Engage with stun Ult, follow with 2 and 1." }
    ]
  },
  Ashe: {
    guide: "ワイルドリフトではUltのクリスタルアローを撃った後に軌道を操作できるため、遠距離からでも的確にエンゲージを狙えるマークスマン。通常攻撃のスロウで敵を引き撃ちし続けます。",
    combos: [
      { name: "基本トレード", nameEn: "Basic Trade", sequence: "2 -> AA -> 1 -> AA", description: "2スキルでスロウをかけ、通常攻撃を重ねてから1スキルで追撃します。", descriptionEn: "Slow with 2, AA, then empower with 1." },
      { name: "遠距離エンゲージ", nameEn: "Long Range Engage", sequence: "Ult(操作) -> 2 -> AA", description: "Ultを操作して確実に敵に当て、スタン中に2スキルと通常攻撃でダメージを出します。", descriptionEn: "Steer Ult to hit, then follow with 2 and AA." }
    ]
  },
  Sion: {
    guide: "ワイルドリフトではUltの旋回性能が高く、長い距離を曲がりながら突進できるため奇襲が強力です。レーン戦では1スキルのチャージで圧力をかけ、集団戦では巨大な盾となって敵陣を荒らします。",
    combos: [
      { name: "基本コンボ", nameEn: "Basic Combo", sequence: "3 -> 1 -> 2", description: "3スキルでスロウと防御力低下を与え、1スキルをチャージして打ち上げます。", descriptionEn: "Slow with 3, then charge 1 to knock up." }
    ]
  }
};

// Apply manual fixes
for (const [champ, fix] of Object.entries(wrFixes)) {
  if (guides[champ]) {
    guides[champ].playstyle = fix.guide;
  }
  if (combos[champ]) {
    combos[champ] = fix.combos;
  }
}

// 2. Global Regex Replacement for Q, W, E, R
// Need to replace Q -> 1スキル (in text), 1 (in combos sequence)
function replaceQWER(text, isSequence = false) {
  if (!text) return text;
  let res = text;
  
  if (isSequence) {
    // In sequence, usually we want Q -> 1, W -> 2, E -> 3, R -> Ult
    res = res.replace(/(?<![A-Za-z])Q(?![A-Za-z])/g, '1');
    res = res.replace(/(?<![A-Za-z])W(?![A-Za-z])/g, '2');
    res = res.replace(/(?<![A-Za-z])E(?![A-Za-z])/g, '3');
    res = res.replace(/(?<![A-Za-z])R(?![A-Za-z])/g, 'Ult');
  } else {
    // In description, Q -> 1スキル
    res = res.replace(/(?<![A-Za-z])Q(?![A-Za-z])/g, '1スキル');
    res = res.replace(/(?<![A-Za-z])W(?![A-Za-z])/g, '2スキル');
    res = res.replace(/(?<![A-Za-z])E(?![A-Za-z])/g, '3スキル');
    res = res.replace(/(?<![A-Za-z])R(?![A-Za-z])/g, 'Ult');
  }
  return res;
}

// Process guides
for (const champ in guides) {
  ['playstyle', 'strengths', 'weaknesses'].forEach(key => {
    if (guides[champ][key]) {
      if (typeof guides[champ][key] === 'string') {
        guides[champ][key] = replaceQWER(guides[champ][key], false);
      } else if (Array.isArray(guides[champ][key])) {
        guides[champ][key] = guides[champ][key].map(item => replaceQWER(item, false));
      }
    }
  });
}

// Process combos
for (const champ in combos) {
  combos[champ] = combos[champ].map(combo => {
    return {
      ...combo,
      sequence: replaceQWER(combo.sequence, true),
      description: replaceQWER(combo.description, false),
      descriptionEn: replaceQWER(combo.descriptionEn, false)
    };
  });
}

// Write back
fs.writeFileSync(guidesPath, JSON.stringify(guides, null, 2), 'utf8');
fs.writeFileSync(combosPath, JSON.stringify(combos, null, 2), 'utf8');

console.log('Successfully updated guides and combos!');
