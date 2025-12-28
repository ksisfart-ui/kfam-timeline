import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] p-4 md:p-12 text-stone-700 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-[2rem] shadow-sm border border-stone-100 overflow-hidden">
        
        {/* ヘッダーセクション */}
        <div className="p-8 md:p-12 border-b border-stone-50">
          <div className="flex justify-between items-baseline mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
              このサイトについて
            </h1>
            <Link href="/" className="text-stone-400 text-sm font-medium hover:text-[#b28c6e] transition-colors">
              ホームへ戻る
            </Link>
          </div>
          
          <div className="space-y-4 text-sm md:text-base leading-relaxed text-stone-600">
            <p>
              本サイトは、ストグラに登場する<strong className="text-stone-800">「暦家」</strong>のメンバーの活動を、タイムライン形式で見返しやすく整理した<strong className="text-stone-800">非公式のファンサイト</strong>です。
            </p>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          
          {/* 注意事項セクション */}
          <section className="bg-amber-50/50 rounded-2xl p-6 md:p-8 border border-amber-100/50">
            <h2 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
              <span className="text-lg">⚠️</span> 注意事項
            </h2>
            <ul className="space-y-4 text-sm leading-relaxed text-amber-900/80">
              <li>
                <span className="font-bold">各配信者様、および運営様とは一切関係ありません。</span>また、管理人の判断により予告なくサイトを非公開にする場合がございます。
              </li>
              <li>
                <span className="font-bold">更新頻度：</span>リアルタイム更新ではありません。有志による手動更新のため、情報の正確性には努めておりますが、間違いや抜け漏れが含まれる可能性があります。
              </li>
              <li>
                表示時間は目安であり、実際の滞在時間とはズレが生じる場合があります。
              </li>
              <li>
                <span className="font-bold">ネタバレへの配慮：</span>本サイトには物語のネタバレが含まれる可能性があります。未視聴の配信がある場合は十分にご注意ください。
              </li>
              <li>
                <span className="font-bold text-red-700 underline decoration-red-200 underline-offset-4">メタ情報の取り扱い：</span>
                本サイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような行為に絶対に使用しないでください。
              </li>
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

        {/* フッター余白 */}
        <div className="h-8 bg-stone-50/30"></div>
      </div>
    </main>
  );
}