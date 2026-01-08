import { fetchArchiveData, fetchNewsData } from "@/lib/dataFetcher";
import TimelineView from "@/components/TimelineView";
import Link from "next/link";
import { Megaphone, Info, ExternalLink, ChevronRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const NEWS_URL = process.env.NEXT_PUBLIC_NEWS_URL || "";
  const [allData, newsList] = await Promise.all([
    fetchArchiveData(CSV_URL),
    fetchNewsData(NEWS_URL)
  ]);
  if (!allData.length) return <div className="p-20 text-center bg-background text-main">データを読み込んでいます...</div>;

  const latestDate = Array.from(new Set(allData.map(d => d.日付))).sort().reverse()[0];
  const latestData = allData.filter(d => d.日付 === latestDate);

  const updatingDates = Array.from(new Set(allData.filter(d => d.ステータス === "更新中").map(d => d.日付)));

  // 最新日のステータスが「準備中」か判定
  const isLatestPreparing = latestData.some(d => d.ステータス === "準備中");

  return (
    <main className="min-h-screen bg-background text-main pb-24 transition-colors duration-300">
      <header className="px-8 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <p className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase pl-1">
            Koyomi-ke Timeline
          </p>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-main tracking-tight leading-none">
              最新の記録 <span className="text-muted font-light ml-2">{latestDate}</span>
            </h1>
            {isLatestPreparing && (
              <span className="px-3 py-1 bg-status-pending-bg text-status-pending-text border border-status-pending-border text-[10px] font-bold rounded-full">
                準備中
              </span>
            )}
          </div>
        </div>

        <div className="flex items-stretch gap-3 w-full md:w-auto">
          <ThemeToggle />
          <div className="flex items-stretch gap-3 flex-1 md:flex-none">
            <Link href="/about" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sub hover:text-accent transition-colors border border-card-border bg-card/50 rounded-xl">
              <Info className="w-4 h-4 shrink-0" />
              <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase whitespace-nowrap">このサイトについて</span>
            </Link>
            <Link href="/archive" className="flex-1 flex items-center justify-center px-4 py-3 bg-btn-primary-bg text-btn-primary-text rounded-xl text-[10px] sm:text-[11px] font-black tracking-widest uppercase shadow-lg shadow-card-border hover:opacity-90 transition-all whitespace-nowrap">
              過去の記録を見る
            </Link>
          </div>
        </div>
      </header>

      {/* ステータス & お知らせエリア */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="bg-card p-8 rounded-[40px] border border-card-border shadow-sm space-y-10">
          
          {/* SYSTEM STATUS */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${updatingDates.length > 0 ? 'bg-accent' : 'bg-muted'}`} />
              <p className="text-[10px] font-bold text-sub tracking-widest uppercase">System Status</p>
            </div>
            <p className="text-sm font-bold ml-4">
              {updatingDates.length > 0 ? `${updatingDates.join(", ")} 更新中` : "全データ観測完了"}
            </p>
          </section>

          {/* RECENT NEWS（間隔を空け、謎の空divを削除） */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-3 h-3 text-accent" />
              <p className="text-[10px] font-bold text-sub tracking-widest uppercase">Recent News</p>
            </div>
            <div className="space-y-3 ml-4">
              {newsList.slice(0, 3).map((news, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <span className="text-muted font-mono shrink-0">{news.日付.replace("2025/", "")}</span>
                  {news.重要度 === "重要" && <span className="bg-status-urgent-bg text-status-urgent-text text-[9px] px-1.5 rounded font-bold shrink-0">重要</span>}
                  <p className="text-sub truncate">
                    {news.リンクURL ? (
                      <a href={news.リンクURL} target="_blank" className="hover:text-accent underline decoration-card-border underline-offset-2">{news.内容}</a>
                    ) : (
                      news.内容
                    )}
                  </p>
                </div>
              ))}
              {newsList.length === 0 && <p className="text-xs text-muted">現在、新しいお知らせはありません。</p>}
            </div>
          </section>
        </div>

        <TimelineView data={latestData} />
      </div>

      {/* セクション下部のリンクエリア：PC版で横並び、スマホ版で縦並び */}
      <div className="mt-12 max-w-md md:max-w-2xl mx-auto px-4">
        <div className="flex flex-col md:flex-row border-t border-card-border/60">
          
          {/* About へのリンク */}
          <Link 
            href="/about" 
            className="group flex-1 flex items-center justify-between py-5 md:py-6 md:px-6 border-b border-card-border/60 md:border-r hover:bg-card/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <Info className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
              <span className="text-[11px] font-bold tracking-widest text-sub group-hover:text-main transition-colors uppercase">
                About & Link
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* ポータルへのリンク */}
          <a 
            href="https://kfam-portal.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex-1 flex items-center justify-between py-5 md:py-6 md:px-6 border-b border-card-border/60 hover:bg-card/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <ExternalLink className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
              <span className="text-[11px] font-bold tracking-widest text-sub group-hover:text-main transition-colors uppercase">
                暦家観測記録
              </span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-1 transition-transform" />
          </a>

        </div>
      </div>
      

      {/* フッター */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-muted font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
    </main>
  );
}
