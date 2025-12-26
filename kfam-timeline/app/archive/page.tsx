import { fetchArchiveData } from "@/lib/dataFetcher";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const allData = await fetchArchiveData(CSV_URL);
  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();

  return (
    <main className="min-h-screen bg-[#fcfaf8] p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <Link href="/" className="text-[#b28c6e] text-xs font-bold hover:underline">← BACK TO HOME</Link>
          <h1 className="text-4xl font-black text-stone-800 mt-4 tracking-tighter">PAST ARCHIVES</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dateList.map(date => (
            <Link key={date} href={`/archive/${date.replaceAll("/", "-")}`} className="group bg-white p-6 rounded-2xl border border-stone-200 hover:border-[#b28c6e] transition-all hover:shadow-xl shadow-stone-200/50">
              <p className="text-stone-300 text-[10px] font-black mb-1 italic">LOG_FILE</p>
              <h2 className="text-xl font-bold text-stone-700 group-hover:text-[#b28c6e] transition-colors">{date}</h2>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
