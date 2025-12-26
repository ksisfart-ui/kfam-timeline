import { fetchArchiveData } from "@/lib/dataFetcher"; // これが必要です
import TimelineView from "@/components/TimelineView";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const allData = await fetchArchiveData(CSV_URL);
  if (!allData.length) return <div>読み込み中...</div>;

  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();
  const latestDate = dateList[0];
  const latestData = allData.filter(d => d.日付 === latestDate);

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-24">
      <header className="p-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#b28c6e] text-white text-[10px] font-bold rounded-full">最新</span>
            <span className="text-stone-400 text-[10px] font-bold tracking-[0.2em] uppercase">Koyomi-ke Archives</span>
          </div>
          <h1 className="text-4xl font-black text-stone-800 tracking-tighter">本日の活動記録 <span className="text-stone-300 font-light">| {latestDate}</span></h1>
        </div>
        <Link href="/archive" className="px-8 py-3 bg-white border border-stone-200 text-stone-600 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
          過去のアーカイブを見る
        </Link>
      </header>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <TimelineView data={latestData} />
      </div>
    </main>
  );
}
