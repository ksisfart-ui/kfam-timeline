import { fetchArchiveData } from "@/lib/dataFetcher";
import TimelineView from "@/components/TimelineView";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const allData = await fetchArchiveData(CSV_URL);

  if (!allData.length) return <div className="p-20 text-center">Loading Data...</div>;

  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();
  const latestDate = dateList[0];
  const latestData = allData.filter(d => d.日付 === latestDate);

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-20">
      <header className="bg-white border-b border-stone-200 p-6 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <p className="text-[#b28c6e] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Koyomi-ke Archives</p>
            <h1 className="text-2xl font-black text-stone-800 tracking-tighter italic">TIMELINE <span className="text-stone-300 not-italic font-light">| {latestDate}</span></h1>
          </div>
          <Link href="/archive" className="bg-[#b28c6e] text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-[#9a785d] transition-colors shadow-lg shadow-[#b28c6e]/20">
            過去の一覧
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <TimelineView data={latestData} />
      </div>
    </main>
  );
}
