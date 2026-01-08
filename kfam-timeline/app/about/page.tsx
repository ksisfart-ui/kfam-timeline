import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-12 text-sub font-sans tracking-tight">
      <div className="max-w-2xl mx-auto">
        
        {/* ヘッダー部分：flexコンテナにしてToggleを配置 */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-grow">
            <Link 
              href="/" 
              className="text-muted text-[10px] font-bold tracking-[0.2em] hover:text-accent transition-colors flex items-center gap-1 mb-8 uppercase"
            >
              <ChevronLeft className="w-3 h-3" /> Back to Home
            </Link>
            <div className="space-y-2">
              <p className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase pl-1">
                About this project
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-main tracking-tight leading-none">
                このサイトについて
              </h1>
            </div>
          </div>

          {/* モード切替ボタンを配置 */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <div className="space-y-10"> {/* 全体の間隔を少し凝縮 */}
          
          {/* サイト概要：ボックスと文字サイズを小さくし、装飾を排除 */}
          <section className="bg-card rounded-[1.5rem] p-6 md:p-8 shadow-sm border border-card-border">
            <p className="text-[14px] md:text-[15px] leading-relaxed tracking-normal text-main font-medium">
              本サイトは、ストグラに登場する「暦家」の活動を、タイムライン形式で見返すための<strong className="text-main font-black">非公式ファンサイト</strong>です。
            </p>
          </section>

          {/* 注意事項セクション：ラベル位置の入れ替え */}
          <section className="px-1">
            <div className="flex items-center gap-3 mb-8">
              <h2 className="text-main font-black text-lg flex items-center gap-2">
                <span className="text-base">⚠️</span> 注意事項
              </h2>
              <div className="h-[1px] flex-grow bg-card-border"></div>
              <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">Precautions</span>
            </div>
            
            <div className="space-y-8">
              {[
                { label: "公式との関係", text: "各配信者様、および運営様とは一切関係ありません。", important: true },
                { label: "更新について", text: "個人が手動で更新しているため、リアルタイムではありません。情報の正確性には努めておりますが、間違いや抜け漏れが含まれる可能性があります。" },
                { label: "時間表記", text: "表示時間は目安です。実際の配信や滞在時間とは数分のズレが生じる場合があります。" },
                { label: "ネタバレ", text: "物語のネタバレが含まれます。未視聴の配信がある場合は十分にご注意ください。", important: true },
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[130px_1fr] gap-1 md:gap-6 items-start">
                  <span className="text-[10px] font-black text-accent tracking-widest uppercase pt-1">
                    {item.label}
                  </span>
                  <p className={`text-[13px] leading-relaxed tracking-normal ${item.important ? 'text-main font-bold' : 'text-sub'}`}>
                    {item.text}
                  </p>
                </div>
              ))}

              {/* メタ情報：重要な警告 */}
              <div className="mt-10 p-7 bg-card rounded-[1.5rem] border border-status-urgent-text/20 shadow-sm">
                <div className="flex gap-4 items-start">
                  <span className="text-status-urgent-text font-black text-lg leading-none">!</span>
                  <div>
                    <span className="block text-[9px] font-black text-status-urgent-text tracking-widest uppercase mb-1.5">Important Warning</span>
                    <p className="text-[13px] leading-relaxed text-main">
                      <strong className="font-bold text-main">情報の取り扱い：</strong>
                      本サイトの情報を、特定の人物への攻撃や、RP（ロールプレイ）の進行を妨げるような行為（鳩・指示コメント等）に絶対に使用しないでください。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-1">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-main font-black text-lg flex items-center gap-2">
                <span className="text-base">🔗</span> 関連リンク
              </h2>
              <div className="h-[1px] flex-grow bg-card-border"></div>
              <span className="text-[10px] font-black tracking-[0.2em] text-accent uppercase">Related Links</span>
            </div>
            
            <a 
              href="https://kfam-portal.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between p-6 bg-card rounded-[1.5rem] border border-card-border shadow-sm hover:border-accent transition-all group"
            >
              <div>
                <p className="text-[9px] font-black text-accent tracking-widest uppercase mb-1">Portal Site</p>
                <p className="text-main font-bold text-sm md:text-base">暦家観測記録</p>
              </div>
              <div className="text-muted group-hover:text-accent transition-colors">
                <span className="text-xl">↗</span>
              </div>
            </a>
          </section>

          {/* 制作者情報：Screenshot 5のUIを維持 */}
          <section className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-7 bg-card rounded-[1.5rem] border border-card-border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-accent text-sm font-black border border-card-border">
                  X
                </div>
                <div>
                  <p className="text-[9px] text-muted font-black mb-0.5 tracking-widest uppercase">Contact</p>
                  <p className="font-black text-main text-base">制作者SNS</p>
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
          <p className="text-[10px] text-muted font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
      </div>
    </main>
  );
}