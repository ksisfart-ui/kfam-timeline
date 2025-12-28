import { fetchArchiveData, fetchNewsData } from "@/lib/dataFetcher";
import TimelineView from "@/components/TimelineView";
import Link from "next/link";
import { Megaphone, Info } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const NEWS_URL = process.env.NEXT_PUBLIC_NEWS_URL || "";
  const [allData, newsList] = await Promise.all([
    fetchArchiveData(CSV_URL),
    fetchNewsData(NEWS_URL)
  ]);
  if (!allData.length) return <div className="p-20 text-center">データを読み込んでいます...</div>;

  const latestDate = Array.from(new Set(allData.map(d => d.日付))).sort().reverse()[0];
  const latestData = allData.filter(d => d.日付 === latestDate);

  const updatingDates = Array.from(new Set(allData.filter(d => d.ステータス === "更新中").map(d => d.日付)));

  // 最新日のステータスが「準備中」か判定
  const isLatestPreparing = latestData.some(d => d.ステータス === "準備中");

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-24">
      <header className="px-8 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <p className="text-[#b28c6e] text-xs font-bold tracking-[0.3em] pl-1">KOYOMI-KE TIMELINE</p>
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-black text-stone-800 tracking-tighter leading-none">
              活動記録 <span className="text-stone-300 font-light ml-2">{latestDate}</span>
            </h1>
            {/* ヘッダーの日付横に準備中ステータスを表示 */}
            {isLatestPreparing && (
              <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold rounded-full animate-pulse">
                準備中
              </span>
            )}
          </div>
        </div>
        <Link href="/archive" className="px-10 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
          アーカイブ一覧
        </Link>
      </header>

      {/* ステータス & お知らせエリア */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm space-y-10">
          
          {/* SYSTEM STATUS */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full ${updatingDates.length > 0 ? 'bg-[#b28c6e] animate-pulse' : 'bg-stone-300'}`} />
              <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">System Status</p>
            </div>
            <p className="text-sm font-bold text-stone-700 ml-4">
              {updatingDates.length > 0 ? `${updatingDates.join(", ")} 更新中` : "全データ観測完了"}
            </p>
          </section>

          {/* RECENT NEWS（間隔を空け、謎の空divを削除） */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="w-3 h-3 text-[#b28c6e]" />
              <p className="text-[10px] font-bold text-stone-400 tracking-widest uppercase">Recent News</p>
            </div>
            <div className="space-y-3 ml-4">
              {newsList.slice(0, 3).map((news, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <span className="text-stone-300 font-mono shrink-0">{news.日付.replace("2025/", "")}</span>
                  {news.重要度 === "重要" && <span className="bg-red-50 text-red-500 text-[9px] px-1.5 rounded font-bold shrink-0">重要</span>}
                  <p className="text-stone-600 truncate">
                    {news.リンクURL ? (
                      <a href={news.リンクURL} target="_blank" className="hover:text-[#b28c6e] underline decoration-stone-200 underline-offset-2">{news.内容}</a>
                    ) : (
                      news.内容
                    )}
                  </p>
                </div>
              ))}
              {newsList.length === 0 && <p className="text-xs text-stone-300">現在、新しいお知らせはありません。</p>}
            </div>
          </section>
        </div>

        <TimelineView data={latestData} />
      </div>
    </main>
  );
}
