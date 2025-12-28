import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fcfaf8] p-6 md:p-12 text-stone-600 font-sans tracking-tight">
      <div className="max-w-2xl mx-auto">
        
        {/* ヘッダー部分 */}
        <header className="mb-16">
          <Link href="/" className="text-stone-400 text-[10px] font-black tracking-[0.2em] hover:text-[#b28c6e] transition-colors flex items-center gap-1 mb-8 uppercase">
            ← Back to Home
          </Link>
          <div className="space-y-3">
            <p className="text-[#b28c6e] text-[10px] font-black tracking-[0.4em] uppercase pl-1">
              About this project
            </p>
            <h1 className="text-5xl md:text-txl font-black text-stone-800 tracking-tighter leading-none">
              このサイトについて
            </h1>
          </div>
        </header>

        <div className="space-y-10"> {/* 全体の間隔を少し凝縮 */}
          
          {/* サイト概要：ボックスと文字サイズを小さくし、装飾を排除 */}
          <section className="bg-white rounded-[1.5rem] p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] border border-stone-100/60">
            <p className="text-[14px] md:text-[15px] leading-relaxed tracking-normal text-stone-700 font-medium">
              当サイトは、ストグラに登場する「暦家」の活動を、タイムライン形式で見返すための<strong className="text-stone-900 font-black">非公式ファンサイト</strong>です。
            </p>
          </section>

          {/* 注意事項セクション：ラベル位置の入れ替え */}
          <section className="px-1">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-stone-800 font-black text-lg flex items-center gap-2">
                <span className="text-base">⚠️</span> 注意事項
              </h2>
              <div className="h-[1px] flex-grow bg-stone-200/60"></div>
              <span className="text-[10px] font-black tracking-[0.2em] text-[#b28c6e] uppercase">Precautions</span>
            </div>
            
            <div className="space-y-8">
              {[
                { label: "公式との関係", text: "各配信者様、および運営様とは一切関係ありません。また、管理人の判断により予告なくサイトを非公開にする場合がございます。", important: true },
                { label: "更新について", text: "有志による手動更新のため、リアルタイムではありません。情報の正確性には努めておりますが、間違いや抜け漏れが含まれる可能性があります。" },
                { label: "時間表記", text: "表示時間は目安です。実際の配信や滞在時間とは数分のズレが生じる場合があります。" },
                { label: "ネタバレ", text: "物語のネタバレが含まれます。未視聴の配信がある場合は十分にご注意ください。", important: true },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-1 md:gap-6 items-start">
                  <span className="text-[10px] font-black text-[#b28c6e] tracking-widest uppercase pt-1">
                    {item.label}
                  </span>
                  <p className={`text-[13px] leading-relaxed tracking-normal ${item.important ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                    {item.text}
                  </p>
                </div>
              ))}

              {/* メタ情報：重要な警告 */}
              <div className="mt-10 p-7 bg-white rounded-[1.5rem] border border-red-50/50 shadow-sm">
                <div className="flex gap-4 items-start">
                  <span className="text-red-400 font-black text-lg leading-none">!</span>
                  <div>
                    <span className="block text-[9px] font-black text-red-400 tracking-widest uppercase mb-1.5">Important Warning</span>
                    <p className="text-[13px] leading-relaxed text-stone-800">
                      <strong className="font-bold text-stone-900">メタ情報の取り扱い：</strong>
                      本サイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような行為（鳩・指示コメント等）に絶対に使用しないでください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 制作者情報：Screenshot 5のUIを維持 */}
          <section className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-7 bg-white rounded-[1.5rem] border border-stone-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#fcfaf8] rounded-full flex items-center justify-center text-[#b28c6e] text-sm font-black border border-stone-100">
                  X
                </div>
                <div>
                  <p className="text-[9px] text-stone-400 font-black mb-0.5 tracking-widest uppercase">Contact</p>
                  <p className="font-black text-stone-800 text-base">制作者SNS</p>
                </div>
              </div>
              <a 
                href="https://x.com/admiral_splus" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3 bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white rounded-full font-black text-[13px] text-center transition-all shadow-sm flex items-center justify-center gap-2"
              >
                アド🍉 @admiral_splus
              </a>
            </div>
          </section>
        </div>

        {/* フッター */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-stone-300 font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
      </div>
    </main>
  );
}