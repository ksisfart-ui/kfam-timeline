import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf8] p-6 md:p-12 text-stone-600 font-sans tracking-tight">
      <div className="max-w-3xl mx-auto">
        
        {/* ヘッダー部分：サイト全体のトーンに合わせた構成 */}
        <header className="mb-12">
          <Link href="/" className="text-stone-400 text-[10px] font-bold tracking-[0.2em] hover:text-[#b28c6e] transition-colors flex items-center gap-1 mb-4">
            ⇐ホームへ戻る
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-[#b28c6e] text-[10px] font-bold tracking-[0.3em] uppercase">
              About this site
            </h1>
          </div>
        </header>

        <div className="space-y-8">
          
          {/* サイト概要カード */}
          <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-stone-100/60">
            <p className="text-[15px] leading-relaxed tracking-normal">
              当サイトは、ストグラに登場する「暦家」の活動を、タイムライン形式で見返すための<strong className="text-stone-900 font-bold">非公式ファンサイト</strong>です。
            </p>
          </section>

          {/* 注意事項セクション：色味を抑えて馴染ませる */}
          <section className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-stone-100/60">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] font-bold tracking-widest text-[#b28c6e] uppercase">Precautions</span>
              <div className="h-[1px] flex-grow bg-stone-100"></div>
            </div>
            
            <h2 className="text-stone-800 font-bold mb-6 flex items-center gap-2 text-base">
              ⚠️ 注意事項
            </h2>
            
            <ul className="space-y-5 text-[13px] leading-relaxed text-stone-500 tracking-normal">
              <li className="flex gap-3">
                <span className="text-[#b28c6e] font-bold">01</span>
                <span><strong className="text-stone-900 font-bold underline decoration-stone-100 underline-offset-4">各配信者様、および運営様とは一切関係ありません。</strong>また、管理人の判断により予告なくサイトを非公開にする場合がございます。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#b28c6e] font-bold">02</span>
                <span>リアルタイム更新ではありません。有志による手動更新のため、情報の正確性には努めておりますが、間違いや抜け漏れが含まれる可能性があります。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#b28c6e] font-bold">03</span>
                <span>表示時間は目安であり、実際の滞在時間とは数分のズレが生じる場合があります。</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#b28c6e] font-bold">04</span>
                <span className="text-stone-700 font-medium">ネタバレへの配慮：本サイトには物語のネタバレが含まれます。未視聴の配信がある場合は十分にご注意ください。</span>
              </li>
              <li className="flex gap-3 border-t border-stone-50 pt-4 mt-2">
                <span className="text-red-400 font-bold">!</span>
                <span className="text-stone-800">
                  <strong className="font-bold underline decoration-red-100 underline-offset-4">メタ情報の取り扱い：</strong>
                  本サイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような行為（鳩・指示コメント等）に絶対に使用しないでください。
                </span>
              </li>
            </ul>
          </section>

          {/* 情報の修正依頼（制作者情報：UI維持・微調整） */}
          <section className="pt-4">
            
            {/* 制作者情報UI：元の構造を維持しつつトーンを調整 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-white rounded-[1.5rem] border border-stone-100/80 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fcfaf8] rounded-full flex items-center justify-center text-[#b28c6e] text-sm font-black border border-stone-100">
                  X
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold mb-0.5 tracking-widest uppercase">Contact</p>
                  <p className="font-bold text-stone-800 text-[15px]">制作者SNS</p>
                </div>
              </div>
              <a 
                href="https://x.com/admiral_splus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-bold text-[13px] text-center transition-all shadow-sm flex items-center justify-center gap-2"
              >
                アド🍉 @admiral_splus
              </a>
            </div>
          </section>
        </div>

        {/* フッター余白 */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-stone-300 font-bold tracking-[0.4em]">KOYOMI-KE TIMELINE</p>
        </footer>
      </div>
    </main>
  );
}