import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf8] p-8 md:p-16 text-stone-700">
      <div className="max-w-3xl mx-auto space-y-12">
        <header>
          <Link href="/" className="text-[#b28c6e] text-xs font-bold tracking-widest hover:opacity-70">← ホームへ戻る</Link>
          <h1 className="text-4xl font-black text-stone-800 mt-6 tracking-tighter">このサイトについて</h1>
        </header>

        <section className="space-y-4">
          <p className="leading-relaxed">
            当サイトは、ストグラに登場する「暦家」の活動を、タイムライン形式で見返しやすく整理した非公式のファンサイトです。
          </p>
        </section>

        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-stone-100 space-y-6">
          <h2 className="text-xl font-bold border-b border-stone-100 pb-2">注意事項</h2>
          <ul className="space-y-3 text-sm list-disc pl-5 marker:text-[#b28c6e]">
            <li>各配信者様、およびストグラ運営様とは一切関係ございません。</li>
            <li>管理人の判断により、予告なく非公開にする場合がございます。</li>
            <li>リアルタイム更新ではございません。</li>
            <li>情報の正確性には努めておりますが、手動更新のため間違いが含まれる可能性があります。</li>
            <li>表示時間は目安であり、実際の配信時間とは数分のズレが生じる場合があります。</li>
            <li>ネタバレが含まれますので、閲覧の際はご注意ください。</li>
            <li><strong>このサイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような鳩行為・メタ情報の持ち込み等に使用しないでください。</strong></li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">制作者情報</h2>
          <div className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-stone-100">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-[#b28c6e]">X</div>
            <div>
              <p className="font-bold">アド🍉</p>
              <a href="https://x.com/admiral_splus" target="_blank" className="text-[#b28c6e] text-sm hover:underline">@admiral_splus</a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}