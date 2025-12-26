import { fetchArchiveData } from "@/lib/dataFetcher";
import { groupDatesByMonth } from "@/lib/utils";
import Link from "next/link";

export default async function ArchivePage() {
  const allData = await fetchArchiveData(process.env.NEXT_PUBLIC_SHEET_URL || "");
  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();
  const groupedDates = groupDatesByMonth(dateList);

  return (
    <main className="min-h-screen bg-[#fcfaf8] p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <Link href="/" className="text-[#b28c6e] text-xs font-bold tracking-widest hover:opacity-70">← ホームへ戻る</Link>
          <h1 className="text-5xl font-black text-stone-800 mt-6 tracking-tighter">活動の軌跡</h1>
        </div>

        {Object.entries(groupedDates).map(([month, dates]) => (
          <div key={month} className="mb-12">
            <h2 className="text-lg font-bold text-[#b28c6e] mb-6 border-b border-stone-200 pb-2">{month}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dates.map(date => (
                <Link key={date} href={`/archive/${date.replaceAll("/", "-")}`} className="group p-6 bg-white rounded-3xl border border-stone-100 hover:border-[#b28c6e] transition-all hover:shadow-xl flex justify-between items-center">
                  <span className="text-xl font-bold text-stone-700 group-hover:text-[#b28c6e] transition-colors">{date}</span>
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-[#b28c6e]/10 group-hover:text-[#b28c6e] text-stone-300 transition-all">→</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
