import { useLocale } from "next-intl";

export default function LegalPage() {
  const locale = useLocale();

  if (locale === 'en') {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-6">Legal Disclaimer</h1>
        <div className="space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Intellectual Property</h2>
            <p>
              This website is a non-official fan site and is not endorsed by Riot Games in any way. 
              Riot Games, League of Legends, League of Legends: Wild Rift, and all associated properties 
              are trademarks or registered trademarks of Riot Games, Inc.
            </p>
            <p className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
              [Site Name] isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">Accuracy of Information</h2>
            <p>While we strive to keep the data on this site as accurate and up-to-date as possible, we do not guarantee its absolute correctness. Game data and mechanics are subject to change by the developers.</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-sm my-8 border border-slate-100">
      <h1 className="text-3xl font-black text-slate-800 mb-6">免責事項（Legal Jibber Jabber）</h1>
      <div className="space-y-6 text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">著作権・知的財産権について</h2>
          <p>
            当サイトは個人が運営する非公式のファンサイトであり、Riot Games社とは一切関係ありません。
            当サイト内で使用されているゲーム内の画像、アイコン、テキスト、データ等の著作権・知的財産権は、すべて Riot Games, Inc. およびその他の権利者に帰属します。
          </p>
          <p className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm italic">
            当サイトはRiot Gamesの保証を得たものではなく、Riot GamesやRiot Gamesのプロパティの制作または管理に公式に関与している人物の意見や見解を反映するものではありません。Riot Games、および関連するすべてのプロパティは、Riot Games, Inc.の商標または登録商標です。
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-3">情報の正確性について</h2>
          <p>
            当サイトに掲載されている攻略情報、パッチノート、スキルデータ等は可能な限り正確であるよう努めておりますが、
            ゲームのアップデート等により情報が古くなる場合や、独自の解析による誤差が含まれる場合があります。
            当サイトの情報を利用したことによって生じるいかなる損害についても、当サイト運営者は一切の責任を負いません。
          </p>
        </section>
      </div>
    </div>
  );
}
