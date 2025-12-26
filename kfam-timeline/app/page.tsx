import { fetchArchiveData } from "@/lib/dataFetcher";
import { getTimeLabels } from "@/lib/timeUtils";
import TimelineRow from "@/components/TimelineBar";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const allData = await fetchArchiveData(process.env.NEXT_PUBLIC_SHEET_URL || "");
  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();
  const latestDate = dateList[0];
  const latestData = allData.filter(d => d.日付 === latestDate);

return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-stone-400 text-xs font-bold uppercase tracking-widest">Latest Activity</h2>
          <h1 className="text-3xl font-black text-stone-800">{latestDate}</h1>
        </div>
        <Link href="/archive" className="px-6 py-2 bg-[#b28c6e] text-white rounded-full text-sm font-bold shadow-lg shadow-[#b28c6e]/20 hover:scale-105 transition-all">
          過去のアーカイブを見る
        </Link>
      </div>
      <TimelineView data={latestData} date={latestDate} />
    </div>
  );
}

  // Vercelの環境変数。未設定なら空文字
  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vQllXTe8yJ2cUzt0Md11z_qHzbjgRjFRbnyVp7zf7SNRm-LKIoAR_JAkT0h8ZfwN-t2VbaTHMNAb58J/pub?output=csv";
  const allData = await fetchArchiveData(CSV_URL);

  // 1. データが取得できなかった場合の表示
  if (!allData || allData.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-[#b28c6e] font-bold mb-4">データが取得できません</h1>
        <p className="text-sm text-gray-400 mb-8 text-center">
          Vercelの環境変数 `NEXT_PUBLIC_SHEET_URL` に<br />
          スプレッドシートのCSV公開URLが設定されているか確認してください。
        </p>
        <code className="bg-black p-4 rounded text-xs text-green-400 overflow-auto max-w-full">
          URL: {CSV_URL || "未設定"}
        </code>
      </div>
    );
  }

  // 2. 日付リストの生成
  const dateList = Array.from(new Set(allData.map(d => d.日付))).filter(Boolean).sort().reverse();
  const selectedDate = searchParams.date || dateList[0];

  // 3. データの絞り込み
  let filteredData = allData.filter(d => d.日付 === selectedDate);
  if (searchParams.member) {
    filteredData = filteredData.filter(d => d.暦家 === searchParams.member);
  }

  const members = Array.from(new Set(allData.map(d => d.暦家))).filter(Boolean);
  const currentSeason = filteredData[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(currentSeason);

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] font-sans">
      <header className="border-b border-[#b28c6e]/30 bg-[#1a1a1a] p-4 lg:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Link href="/">
            <h1 className="text-xl font-black tracking-tighter text-[#b28c6e] cursor-pointer">
              KOYOMI-KE <span className="text-white/50 font-light">TIMELINE</span>
            </h1>
          </Link>

          <nav className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {dateList.map(date => (
              <Link
                key={date}
                href={`?date=${date}`}
                className={`px-4 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap ${
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

      <div className="p-4 lg:p-8 max-w-[1600px] mx-auto">
        <div className="bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden shadow-2xl">
          <div className="flex border-b border-white/10 bg-black/20 overflow-x-auto">
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

          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
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
    </main>
  );
}
