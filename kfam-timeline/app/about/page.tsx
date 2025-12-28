import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] p-4 md:p-12 text-stone-700 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden">
        
        <div className="p-8 md:p-14">
          {/* ヘッダー：タイトルとリンクを横並びに */}
          <header className="flex justify-between items-end mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
              このサイトについて
            </h1>
            <Link href="/" className="text-stone-400 text-sm font-medium hover:text-stone-600 transition-colors mb-1">
              ホームへ戻る
            </Link>
          </header>

          {/* 境界線 */}
          <hr className="border-stone-400 mb-10" />
          
          {/* サイト説明 */}
          <div className="space-y-4 text-base md:text-lg leading-relaxed text-stone-600 mb-12">
            <p>
              本サイトは、ストグラに登場する「暦家」のメンバーの活動を、タイムライン形式で見返すための<strong className="text-stone-800 font-bold">非公式のファンサイト</strong>です。
            </p>
          </div>

          {/* 注意事項：1枚目の画像のデザインを再現 */}
          <section className="bg-[#fffbeb] rounded-3xl p-8 md:p-10 border border-amber-100/50 mb-16">
            <h2 className="text-[#b45309] font-bold mb-6 flex items-center gap-2 text-lg">
              ⚠️ 注意事項
            </h2>
            <ul className="space-y-4 text-[15px] leading-relaxed text-[#92400e]">
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span><strong className="font-bold underline decoration-amber-200 underline-offset-4">各配信者様および運営様とは一切関係ありません。</strong> また、管理人の判断により予告なくサイトを非公開とする場合がございます。</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>情報の正確性には努めておりますが、有志による手動更新のため、間違いや抜け漏れが起こりうることをご了承ください。</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span>表示時間は目安であり、実際の滞在時間とはズレが生じる場合があります。</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">•</span>
                <span><strong className="font-bold underline decoration-amber-200 underline-offset-4">ネタバレへの配慮：</strong> 本サイトには物語のネタバレが含まれます。未視聴の配信がある場合は十分にご注意ください。</span>
              </li>
              <li className="flex gap-2 text-red-800">
                <span className="shrink-0">•</span>
                <span><strong className="font-bold underline decoration-red-200 underline-offset-4">メタ情報の取り扱い：</strong> 本サイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような行為に絶対に使用しないでください。</span>
              </li>
            </ul>
          </section>

          {/* 情報の修正依頼（制作者情報：維持） */}
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

      </div>
    </main>
  );
}