import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf8] p-6 md:p-12 text-stone-600 font-sans tracking-tight">
      <div className="max-w-2xl mx-auto">
        
        {/* ヘッダー部分 */}
        <header className="mb-16">
          <Link href="/" className="text-stone-400 text-[10px] font-bold tracking-[0.2em] hover:text-[#b28c6e] transition-colors flex items-center gap-1 mb-6">
            ← HOMEへ戻る
          </Link>
          <div className="flex flex-col gap-2">
            <span className="text-[#b28c6e] text-[10px] font-extrabold tracking-[0.3em] uppercase">About this site</span>
            <h1 className="text-4xl md:text-5xl font-black text-stone-800 tracking-tighter leading-none">
              このサイトについて
            </h1>
          </div>
        </header>

        <div className="space-y-12">
          
          {/* サイト概要：一行を短く、読みやすく */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-stone-100/80">
            <p className="text-base md:text-lg leading-loose tracking-normal text-stone-700 font-medium">
              本サイトは、ストグラに登場する<span className="text-stone-900 font-black underline decoration-[#b28c6e]/20 underline-offset-8">「暦家」の活動</span>を、<br className="hidden md:block" />
              タイムライン形式で見返すための<strong className="text-stone-900 font-black">非公式ファンサイト</strong>です。
            </p>
          </section>

          {/* 注意事項セクション：スキャン（流し読み）しやすいレイアウト */}
          <section className="px-2">
            <div className="flex items-center gap-3 mb-10">
              <span className="text-[10px] font-black tracking-[0.2em] text-[#b28c6e] uppercase">Precautions</span>
              <div className="h-[1px] flex-grow bg-stone-200/60"></div>
              <h2 className="text-stone-800 font-black text-lg">⚠️ 注意事項</h2>
            </div>
            
            <div className="space-y-10">
              {[
                { label: "公式との関係", text: "各配信者様、および運営様とは一切関係ありません。管理人の判断により予告なくサイトを非公開にする場合がございます。", important: true },
                { label: "更新について", text: "有志による手動更新のため、リアルタイムではありません。情報の正確性には努めておりますが、間違いや抜け漏れが含まれる可能性があります。" },
                { label: "時間表記", text: "表示時間は目安です。実際の配信や滞在時間とは数分のズレが生じる場合があります。" },
                { label: "ネタバレ", text: "物語のネタバレが含まれます。未視聴の配信がある場合は十分にご注意ください。", important: true },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-2 md:gap-6 items-start group">
                  <span className="text-[11px] font-black text-[#b28c6e] tracking-widest uppercase pt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                  <p className={`text-[14px] leading-relaxed tracking-normal ${item.important ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                    {item.text}
                  </p>
                </div>
              ))}

              {/* メタ情報：最も重要な警告 */}
              <div className="mt-12 p-8 bg-white rounded-[2rem] border-2 border-red-50 shadow-sm">
                <div className="flex gap-4 items-start">
                  <span className="text-red-500 font-black text-xl leading-none">!</span>
                  <div>
                    <span className="block text-[10px] font-black text-red-400 tracking-widest uppercase mb-2">Important Warning</span>
                    <p className="text-[14px] leading-relaxed text-stone-800">
                      <strong className="font-black text-stone-900 underline decoration-red-100 underline-offset-4">メタ情報の取り扱い：</strong>
                      本サイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような行為（鳩・指示コメント等）に絶対に使用しないでください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 制作者情報 */}
          <section className="pt-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-white rounded-[2rem] border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#fcfaf8] rounded-full flex items-center justify-center text-[#b28c6e] text-lg font-black border border-stone-100">
                  X
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-black mb-1 tracking-widest uppercase">Contact</p>
                  <p className="font-black text-stone-800 text-lg">制作者SNS</p>
                </div>
              </div>
              <a 
                href="https://x.com/admiral_splus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-4 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-black text-sm text-center transition-all shadow-md shadow-blue-100 flex items-center justify-center gap-2"
              >
                アド🍉 @admiral_splus
              </a>
            </div>
          </section>
        </div>

        {/* フッター */}
        <footer className="py-24 text-center">
          <p className="text-[10px] text-stone-300 font-black tracking-[0.5em] uppercase">Koyomi-ke Timeline</p>
        </footer>
      </div>
    </main>
  );
}