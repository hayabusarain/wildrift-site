"use client";

import React, { useState } from 'react';
import { Link } from "@/i18n/routing";

// 16タイプ認知特性 × ロール マッピング定義 (ゲームスタイル重視)
// 10種類の詳細プレイスタイル・サブクラス マッピング定義
const ROLES = {
  // 基本クラス
  ASSASSIN: { id: 'assassin', name: 'アサシン', description: '一瞬の隙を突いて敵のキャリーを暗殺する、スタイリッシュな影の支配者。', color: 'text-purple-500', bg: 'bg-purple-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Zed_0.jpg', champions: [{ id: 'Zed', name: 'ゼド' }, { id: 'Khazix', name: 'カジックス' }, { id: 'Evelynn', name: 'イブリン' }] },
  BRUISER: { id: 'bruiser', name: 'ブルーザー', description: '最前線で敵の攻撃を受け止めながら、自らも絶大なダメージを叩き出す闘士。', color: 'text-orange-500', bg: 'bg-orange-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Darius_0.jpg', champions: [{ id: 'Darius', name: 'ダリウス' }, { id: 'Garen', name: 'ガレン' }, { id: 'Sett', name: 'セト' }] },
  MAGE: { id: 'mage', name: 'アーティラリー/メイジ', description: '安全な距離から戦況をコントロールし、圧倒的な範囲魔法で敵陣を焼き尽くす。', color: 'text-blue-500', bg: 'bg-blue-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg', champions: [{ id: 'Lux', name: 'ラックス' }, { id: 'Orianna', name: 'オリアナ' }, { id: 'Ziggs', name: 'ジグス' }] },
  ADC: { id: 'adc', name: 'マークスマン', description: 'チームの勝敗を握る絶対的火力。繊細な位置取りから継続ダメージを叩き出す。', color: 'text-yellow-500', bg: 'bg-yellow-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg', champions: [{ id: 'Jinx', name: 'ジンクス' }, { id: 'Kaisa', name: 'カイ＝サ' }, { id: 'Lucian', name: 'ルシアン' }] },
  ENCHANTER: { id: 'enchanter', name: 'エンチャンター', description: '盤面全体を俯瞰し、味方の危機を救い、勝利の道を切り拓くチームの頭脳。', color: 'text-emerald-500', bg: 'bg-emerald-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lulu_0.jpg', champions: [{ id: 'Lulu', name: 'ルル' }, { id: 'Nami', name: 'ナミ' }, { id: 'Karma', name: 'カルマ' }] },
  // 派生・特殊クラス
  SKIRMISHER: { id: 'skirmisher', name: 'スカーミッシャー', description: '極限の機動力とミクロで敵陣を切り裂き、1vs多数の状況でもアウトプレイで魅せる遊撃者。', color: 'text-rose-500', bg: 'bg-rose-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Yasuo_0.jpg', champions: [{ id: 'Yasuo', name: 'ヤスオ' }, { id: 'Akali', name: 'アカリ' }, { id: 'Katarina', name: 'カタリナ' }] },
  BATTLEMAGE: { id: 'battlemage', name: 'バトルメイジ', description: '最前線に立ち、自身の回復やシールドを駆使して「死なずにジワジワと敵全体を削り殺す」戦闘魔術師。', color: 'text-red-600', bg: 'bg-red-950', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Swain_0.jpg', champions: [{ id: 'Swain', name: 'スウェイン' }, { id: 'Vladimir', name: 'ブラッドミア' }, { id: 'Ryze', name: 'ライズ' }] },
  SPECIALIST: { id: 'specialist', name: 'スペシャリスト', description: '正面からの殴り合いを避け、独自のトラップやタレットで敵をイライラさせる盤面支配者。', color: 'text-lime-500', bg: 'bg-lime-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Teemo_0.jpg', champions: [{ id: 'Teemo', name: 'ティーモ' }, { id: 'Heimerdinger', name: 'ハイマーディンガー' }, { id: 'Singed', name: 'シンジド' }] },
  SPLITPUSHER: { id: 'splitpusher', name: 'スプリットプッシャー', description: '集団戦には参加せず、ひたすらサイドレーンを押し込んでタワーとネクサスを単独で割り切る孤高の戦士。', color: 'text-amber-600', bg: 'bg-amber-950', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jax_0.jpg', champions: [{ id: 'Jax', name: 'ジャックス' }, { id: 'Tryndamere', name: 'トリンダメア' }, { id: 'Camille', name: 'カミール' }] },
  CATCHER: { id: 'catcher', name: 'キャッチャー', description: '視界外からのフックや長距離CCで敵のキャリーを捕まえ、理不尽にキルを作り出す死の狩人。', color: 'text-cyan-500', bg: 'bg-cyan-900', img: 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Blitzcrank_0.jpg', champions: [{ id: 'Blitzcrank', name: 'ブリッツクランク' }, { id: 'Pyke', name: 'パイク' }, { id: 'Nautilus', name: 'ノーチラス' }] },
};

// 初心者向け（プレイスタイルベースの質問）
const QUESTIONS_BEGINNER = [
  {
    question: "チームでのあなたの性格（立ち位置）は？",
    answers: [
      { text: "俺が全員倒してキャリーする", scores: { assassin: 2, bruiser: 1, mage: 0, adc: 2, enchanter: 0, skirmisher: 3, battlemage: 1, specialist: 0, splitpusher: 2, catcher: 0 } },
      { text: "味方を守り、チーム全体を勝たせたい", scores: { assassin: 0, bruiser: 1, mage: 1, adc: 0, enchanter: 3, skirmisher: 0, battlemage: 1, specialist: 0, splitpusher: 0, catcher: 2 } },
      { text: "ひたすら嫌がらせをして敵を怒らせたい", scores: { assassin: 1, bruiser: 0, mage: 1, adc: 0, enchanter: 0, skirmisher: 0, battlemage: 0, specialist: 3, splitpusher: 1, catcher: 1 } },
    ]
  },
  {
    question: "戦闘の理想的な距離感は？",
    answers: [
      { text: "遠くから安全に、一方的に攻撃したい", scores: { assassin: 0, bruiser: 0, mage: 3, adc: 3, enchanter: 2, skirmisher: 0, battlemage: 0, specialist: 2, splitpusher: 0, catcher: 0 } },
      { text: "近距離でバチバチに殴り合いたい", scores: { assassin: 2, bruiser: 3, mage: 0, adc: 0, enchanter: 0, skirmisher: 3, battlemage: 2, specialist: 0, splitpusher: 3, catcher: 1 } },
    ]
  },
  {
    question: "操作の好みは？",
    answers: [
      { text: "複雑でスタイリッシュなコンボを決めるのが好き", scores: { assassin: 3, bruiser: 0, mage: 1, adc: 1, enchanter: 0, skirmisher: 4, battlemage: 1, specialist: 0, splitpusher: 1, catcher: 1 } },
      { text: "シンプルで安定した操作で確実に勝ちたい", scores: { assassin: 0, bruiser: 2, mage: 2, adc: 2, enchanter: 2, skirmisher: 0, battlemage: 2, specialist: 2, splitpusher: 2, catcher: 1 } },
    ]
  },
  {
    question: "もし自分が大負けしている時の動き方は？",
    answers: [
      { text: "味方の後ろに隠れてチャンスを待つ", scores: { assassin: 0, bruiser: 0, mage: 2, adc: 2, enchanter: 3, skirmisher: 0, battlemage: 0, specialist: 1, splitpusher: 0, catcher: 2 } },
      { text: "味方を見捨てて別の場所で逆転を狙う", scores: { assassin: 2, bruiser: 0, mage: 0, adc: 0, enchanter: 0, skirmisher: 1, battlemage: 0, specialist: 2, splitpusher: 4, catcher: 0 } },
      { text: "一発逆転のコンボを狙って突っ込む", scores: { assassin: 2, bruiser: 2, mage: 0, adc: 0, enchanter: 0, skirmisher: 3, battlemage: 2, specialist: 0, splitpusher: 0, catcher: 1 } },
    ]
  },
];

// 中・上級者向け（ガチのマクロ・ミクロ診断）
const QUESTIONS_ADVANCED = [
  {
    question: "ドラゴン前で味方が捕まった！敵は全員見えている。あなたの判断は？",
    answers: [
      { text: "味方は見捨てて、即座に逆サイドのタワーを折りに行く", scores: { assassin: 0, bruiser: 0, mage: 0, adc: 0, enchanter: 0, skirmisher: 0, battlemage: 0, specialist: 1, splitpusher: 4, catcher: 0 } },
      { text: "乱戦に乗じて、敵の後衛（キャリー）を暗殺しに行く", scores: { assassin: 3, bruiser: 1, mage: 0, adc: 0, enchanter: 0, skirmisher: 3, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 1 } },
      { text: "安全な位置まで下がりつつ、範囲スキルで牽制してダメージを出す", scores: { assassin: 0, bruiser: 0, mage: 3, adc: 2, enchanter: 1, skirmisher: 0, battlemage: 0, specialist: 1, splitpusher: 0, catcher: 0 } },
      { text: "自分が身代わりになるか、全てのシールド/回復を注ぎ込んで味方を救う", scores: { assassin: 0, bruiser: 1, mage: 0, adc: 0, enchanter: 3, skirmisher: 0, battlemage: 1, specialist: 0, splitpusher: 0, catcher: 1 } },
    ]
  },
  {
    question: "相手チームが全体的に固まって動いている（グループしている）。どう崩す？",
    answers: [
      { text: "視界外からフックや長距離CCを当てて、理不尽に1人を切り取る", scores: { assassin: 1, bruiser: 0, mage: 0, adc: 0, enchanter: 0, skirmisher: 0, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 4 } },
      { text: "相手が突っ込んでくるのを待ち、タレットやキノコの陣地で地獄を見せる", scores: { assassin: 0, bruiser: 0, mage: 1, adc: 0, enchanter: 0, skirmisher: 0, battlemage: 1, specialist: 4, splitpusher: 0, catcher: 0 } },
      { text: "自分が突っ込んで敵の攻撃をすべて吸収し、気合で生き残って場を荒らす", scores: { assassin: 0, bruiser: 3, mage: 0, adc: 0, enchanter: 0, skirmisher: 1, battlemage: 3, specialist: 0, splitpusher: 1, catcher: 1 } },
      { text: "味方に当たらせておいて、自分はフリーで一生殴り続ける", scores: { assassin: 0, bruiser: 0, mage: 2, adc: 4, enchanter: 0, skirmisher: 0, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 0 } },
    ]
  },
  {
    question: "敵チームに育ちきったマスター・イーがいる。どうやって対処する？",
    answers: [
      { text: "相手が突っ込んでくる瞬間に確定CC（スタンなど）を合わせて止める", scores: { assassin: 0, bruiser: 1, mage: 2, adc: 0, enchanter: 3, skirmisher: 0, battlemage: 1, specialist: 0, splitpusher: 0, catcher: 3 } },
      { text: "超絶ミクロで相手のQを避け、1vs1のフィジカル勝負で叩き潰す", scores: { assassin: 2, bruiser: 1, mage: 0, adc: 0, enchanter: 0, skirmisher: 4, battlemage: 0, specialist: 0, splitpusher: 1, catcher: 0 } },
      { text: "イーがこちらに来る前に、逆に敵陣を単独で割り進めて揺さぶる", scores: { assassin: 0, bruiser: 0, mage: 0, adc: 0, enchanter: 0, skirmisher: 0, battlemage: 0, specialist: 2, splitpusher: 4, catcher: 0 } },
      { text: "とにかく味方の後ろに隠れ、近寄られる前に圧倒的火力で溶かす", scores: { assassin: 0, bruiser: 0, mage: 2, adc: 3, enchanter: 1, skirmisher: 0, battlemage: 1, specialist: 1, splitpusher: 0, catcher: 0 } },
    ]
  },
  {
    question: "自分のプレイスキル（ミクロ・マクロ）の中で、一番自信があるのは？",
    answers: [
      { text: "1vs1のレーン戦での圧倒的なフィジカルとトレード技術", scores: { assassin: 1, bruiser: 3, mage: 0, adc: 0, enchanter: 0, skirmisher: 2, battlemage: 1, specialist: 0, splitpusher: 3, catcher: 0 } },
      { text: "集団戦での完璧な位置取り（ポジショニング）と生存能力", scores: { assassin: 0, bruiser: 0, mage: 2, adc: 3, enchanter: 2, skirmisher: 0, battlemage: 2, specialist: 0, splitpusher: 0, catcher: 0 } },
      { text: "敵の動きを予測して、視界の死角からの一撃必殺を当てる勘", scores: { assassin: 3, bruiser: 0, mage: 1, adc: 0, enchanter: 0, skirmisher: 1, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 4 } },
      { text: "敵のスキルをギリギリで避ける反射神経とコンボ精度", scores: { assassin: 3, bruiser: 0, mage: 0, adc: 1, enchanter: 0, skirmisher: 4, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 0 } },
    ]
  },
];

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [scores, setScores] = useState({ 
    assassin: 0, bruiser: 0, mage: 0, adc: 0, enchanter: 0, 
    skirmisher: 0, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 0 
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<'beginner' | 'advanced' | null>(null);

  const activeQuestions = selectedCourse === 'beginner' ? QUESTIONS_BEGINNER : QUESTIONS_ADVANCED;

  const handleStart = (course: 'beginner' | 'advanced') => {
    setSelectedCourse(course);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (answerScores: any) => {
    setIsAnimating(true);
    
    // スコアの加算
    setScores(prev => ({
      assassin: prev.assassin + answerScores.assassin,
      bruiser: prev.bruiser + answerScores.bruiser,
      mage: prev.mage + answerScores.mage,
      adc: prev.adc + answerScores.adc,
      enchanter: prev.enchanter + answerScores.enchanter,
      skirmisher: prev.skirmisher + answerScores.skirmisher,
      battlemage: prev.battlemage + answerScores.battlemage,
      specialist: prev.specialist + answerScores.specialist,
      splitpusher: prev.splitpusher + answerScores.splitpusher,
      catcher: prev.catcher + answerScores.catcher,
    }));

    // アニメーション用のディレイ
    setTimeout(() => {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsAnimating(false);
    }, 400);
  };

  // 結果の算出
  const getResult = () => {
    const highestRole = Object.keys(scores).reduce((a, b) => scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b);
    return ROLES[highestRole.toUpperCase() as keyof typeof ROLES];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      {/* イントロ画面 */}
      {currentQuestionIndex === -1 && (
        <div className="max-w-2xl w-full text-center animate-fade-in-up">
          <div className="inline-block p-4 rounded-full bg-indigo-500/10 mb-6">
            <span className="text-5xl">✨</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            適正チャンピオン診断
          </h1>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed max-w-xl mx-auto">
            簡単な質問に答えるだけで、あなたのプレイスタイルに最適なチャンピオンとロールを診断します。<br/>
            初心者向けの性格診断から、上級者向けのガチ思考診断までご用意しています。
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={() => handleStart('beginner')}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl border-2 border-slate-700 hover:border-slate-500 transition-all flex flex-col items-center gap-2"
            >
              <span className="text-xl">初心者向け</span>
              <span className="text-xs text-slate-400 font-normal">プレイスタイル・好みの診断</span>
            </button>
            <button 
              onClick={() => handleStart('advanced')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] transition-all flex flex-col items-center gap-2 active:scale-95"
            >
              <span className="text-xl">中・上級者向け</span>
              <span className="text-xs text-indigo-200 font-normal">マクロ・ミクロのガチ思考診断</span>
            </button>
          </div>
        </div>
      )}

      {/* 質問画面 */}
      {currentQuestionIndex >= 0 && currentQuestionIndex < activeQuestions.length && (
        <div className={`max-w-2xl w-full transition-all duration-400 ${isAnimating ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
          <div className="mb-8 flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase tracking-widest text-sm">Question {currentQuestionIndex + 1} / {activeQuestions.length}</span>
            <div className="flex gap-1">
              {activeQuestions.map((_, idx) => (
                <div key={idx} className={`h-1.5 rounded-full w-8 transition-colors ${idx <= currentQuestionIndex ? 'bg-indigo-500' : 'bg-slate-800'}`} />
              ))}
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-8">
            {activeQuestions[currentQuestionIndex].question}
          </h2>

          <div className="space-y-4">
            {activeQuestions[currentQuestionIndex].answers.map((ans, idx) => (
              <button 
                key={idx}
                onClick={() => handleAnswer(ans.scores)}
                className="w-full text-left p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-indigo-500 flex items-center justify-center font-bold transition-colors">
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-lg md:text-xl font-medium text-slate-300 group-hover:text-white transition-colors">
                    {ans.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 結果画面 */}
      {currentQuestionIndex === activeQuestions.length && (
        <div className="max-w-3xl w-full animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-slate-400 font-bold tracking-widest uppercase mb-2">
              {selectedCourse === 'advanced' ? 'ガチ診断結果' : 'プレイスタイル診断結果'}
            </h2>
            <p className="text-2xl">あなたの適正ロールは…</p>
          </div>

          <div className={`relative overflow-hidden rounded-3xl ${getResult().bg} border-2 border-slate-800 mb-12`}>
            {/* 背景画像 (スプラッシュアート) */}
            <div className="absolute inset-0 opacity-40 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 bg-cover bg-center" style={{ backgroundImage: `url(${getResult().img})` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
            
            <div className="relative p-8 md:p-12 text-center">
              <h3 className={`text-6xl md:text-8xl font-black mb-6 ${getResult().color} drop-shadow-2xl`}>
                {getResult().name}
              </h3>
              <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed max-w-2xl mx-auto">
                {getResult().description}
              </p>
            </div>
          </div>

          {/* おすすめチャンピオンリンクエリア */}
          <div className="w-full">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-300">あなたにおすすめのチャンピオン</h3>
              <p className="text-sm text-slate-500 mt-2">アイコンをタップして詳細ページへ</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {getResult().champions.map((champ, idx) => (
                <Link 
                  key={idx} 
                  href={`/champions/${champ.id}`}
                  className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-500 transition-all group"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-600 group-hover:border-indigo-400 group-hover:scale-110 transition-all shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.8.1/img/champion/${champ.id}.png`} 
                      alt={champ.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-bold text-slate-200 text-sm md:text-base group-hover:text-white">{champ.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => {
                setCurrentQuestionIndex(-1);
                setSelectedCourse(null);
                setScores({ assassin: 0, bruiser: 0, mage: 0, adc: 0, enchanter: 0, skirmisher: 0, battlemage: 0, specialist: 0, splitpusher: 0, catcher: 0 });
              }}
              className="text-slate-400 hover:text-white font-bold transition-colors underline decoration-slate-600 underline-offset-4"
            >
              もう一度診断する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
