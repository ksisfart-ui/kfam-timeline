import { fetchArchiveData } from "@/lib/dataFetcher";
import { getTimeLabels } from "@/lib/timeUtils";
import TimelineRow from "@/components/TimelineBar";

export default async function Page({ searchParams }: { searchParams: any }) {
  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQllXTe8yJ2cUzt0Md11z_qHzbjgRjFRbnyVp7zf7SNRm-LKIoAR_JAkT0h8ZfwN-t2VbaTHMNAb58J/pub?output=csv";
  const data = await fetchArchiveData(CSV_URL);

  // フィルター処理用のパラメータ（簡易実装）
  const selectedDate = searchParams.date || data[0]?.日付;
  const filteredData = data.filter(d => d.日付 === selectedDate);

  // メンバーごとにグループ化
  const members = Array.from(new Set(data.map(d => d.暦家)));
  const season = filteredData[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(season);

  return (
    <main className="min-h-screen bg-black text-gray-100 p-4 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-4">暦家タイムラインアーカイブ</h1>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {/* 日付選択ボタン */}
          {Array.from(new Set(data.map(d => d.日付))).map(date => (
            <a
              key={date}
              href={`?date=${date}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedDate === date ? 'bg-blue-600' : 'bg-gray-800'}`}
            >
              {date}
            </a>
          ))}
        </div>
      </header>

      <div className="overflow-x-auto border border-gray-800 rounded-lg">
        <div className="min-w-[1000px] relative">
          {/* 時間目盛り */}
          <div className="flex border-b border-gray-800 bg-gray-950">
            <div className="w-32 flex-shrink-0 border-r border-gray-800 p-2 text-center text-xs text-gray-500 italic">Member / Time</div>
            <div className="flex-grow flex relative">
              {timeLabels.map((label, i) => (
                <div key={i} className="flex-grow text-[10px] text-gray-500 p-2 border-l border-gray-800/50">
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* メンバーごとの行 */}
          {members.map(member => (
            <TimelineRow
              key={member}
              member={member}
              items={filteredData.filter(d => d.暦家 === member)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
