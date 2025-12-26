import { fetchArchiveData } from "@/lib/dataFetcher";
import { getTimeLabels } from "@/lib/timeUtils";
import TimelineRow from "@/components/TimelineBar";
import Link from "next/link";

// キャッシュを保持せず常に最新を取得する設定
export const dynamic = 'force-dynamic';

export default async function Page(props: { searchParams: Promise<{ date?: string, member?: string }> }) {
  const searchParams = await props.searchParams;
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const allData = await fetchArchiveData(CSV_URL);

  // 日付一覧を取得（重複排除）
  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();

  // 選択された日付（指定がなければ最新の日付）
  const selectedDate = searchParams.date || dateList[0];

  // 絞り込み
  let filteredData = allData.filter(d => d.日付 === selectedDate);
  if (searchParams.member) {
    filteredData = filteredData.filter(d => d.暦家 === searchParams.member);
  }

  const members = Array.from(new Set(allData.map(d => d.暦家)));
  const currentSeason = filteredData[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(currentSeason);

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] font-sans">
      {/* ヘッダー：既存サイトの雰囲気に合わせる */}
      <header className="border-b border-[#b28c6e]/30 bg-[#1a1a1a] p-4 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl font-black tracking-tighter text-[#b28c6e]">
            KOYOMI-KE <span className="text-white/50 font-light">TIMELINE</span>
          </h1>

          <nav className="flex gap-2 overflow-x-auto no-scrollbar">
            {dateList.slice(0, 7).map(date => (
              <Link
                key={date}
                href={`?date=${date}`}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all ${
                  selectedDate === date
                    ? 'bg-[#b28c6e] text-black'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {date.replace("2025/", "")}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* タイムライン表示エリア */}
      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden shadow-2xl">

          {/* 時間軸ラベル */}
          <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto overflow-y-hidden">
            <div className="w-28 sm:w-32 flex-shrink-0 border-r border-white/10 p-4 text-[10px] uppercase tracking-widest text-white/30 font-bold sticky left-0 bg-[#1a1a1a] z-20">
              Member
            </div>
            <div className="flex-grow flex min-w-[1000px] relative">
              {timeLabels.map((label, i) => (
                <div key={i} className="flex-grow text-[10px] text-white/40 p-4 border-l border-white/5 text-center">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* タイムライン本体 */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px] bg-grid-white/[0.02]">
              {members.map(member => (
                <TimelineRow
                  key={member}
                  member={member}
                  items={filteredData.filter(d => d.暦家 === member)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="p-8 text-center text-white/20 text-xs">
        &copy; 2025 Koyomi-ke Archive Project
      </footer>
    </main>
  );
}
