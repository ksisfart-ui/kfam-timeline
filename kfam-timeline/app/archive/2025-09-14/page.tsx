import { fetchArchiveData } from "@/lib/dataFetcher";
import TimelineView from "@/components/TimelineView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

// Next.js 15+ の規約に従い params を Promise として扱います
export default async function DateDetailPage(props: {
  params: Promise<{ date: string }>
}) {
  const params = await props.params;

  // URLの "2025-12-26" を "2025/12/26" に戻す
  const displayDate = params.date.replaceAll("-", "/");

  const CSV_URL = process.env.NEXT_PUBLIC_SHEET_URL || "";
  const allData = await fetchArchiveData(CSV_URL);

  // 指定された日付のデータのみを抽出
  const filteredData = allData.filter(d => d.日付 === displayDate);

  // データが見つからない場合の処理
  if (!filteredData.length) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center p-8">
        <h1 className="text-xl font-bold text-stone-800 mb-4">データが見つかりませんでした</h1>
        <p className="text-stone-400 mb-8">{displayDate} の記録はまだ登録されていないようです。</p>
        <Link href="/archive" className="text-[#b28c6e] font-bold hover:underline italic">
          ← BACK TO ARCHIVES
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8] pb-20">
      {/* ヘッダーセクション */}
      <header className="bg-white border-b border-stone-200 p-6 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/archive"
            className="text-[#b28c6e] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 mb-2 hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Archive List
          </Link>
          <div className="flex items-baseline gap-4">
            <h1 className="text-3xl font-black text-stone-800 tracking-tighter italic">
              LOGFILE: <span className="text-[#b28c6e] not-italic">{displayDate}</span>
            </h1>
          </div>
        </div>
      </header>

      {/* タイムラインコンポーネント（再利用） */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <TimelineView data={filteredData} />
      </div>

      {/* フッター的な案内 */}
      <div className="mt-12 text-center">
        <Link href="/archive" className="inline-flex items-center gap-2 px-8 py-3 bg-stone-800 text-white rounded-full text-xs font-bold hover:bg-stone-700 transition-all shadow-xl shadow-stone-200">
          他のアーカイブも探す
        </Link>
      </div>
    </main>
  );
}
