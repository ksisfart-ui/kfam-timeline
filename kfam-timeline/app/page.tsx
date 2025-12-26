import { fetchArchiveData } from "@/lib/dataFetcher";
import TimelineView from "@/components/TimelineView";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const allData = await fetchArchiveData(CSV_URL);
  if (!allData.length) return <div className="p-20 text-center">データを読み込んでいます...</div>;

  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();
  const latestDate = dateList[0];
  const latestData = allData.filter(d => d.日付 === latestDate);

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-24">
      <header className="px-8 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <p className="text-[#b28c6e] text-xs font-bold tracking-[0.3em] pl-1">KOYOMI-KE ARCHIVES</p>
          <h1 className="text-5xl font-black text-stone-800 tracking-tighter leading-none">
            活動記録 <span className="text-stone-300 font-light ml-2">{latestDate}</span>
          </h1>
        </div>
        <Link href="/archive" className="px-10 py-4 bg-white border border-stone-200 text-stone-600 rounded-2xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
          アーカイブ一覧
        </Link>
      </header>
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <TimelineView data={latestData} />
      </div>
    </main>
  );
}
