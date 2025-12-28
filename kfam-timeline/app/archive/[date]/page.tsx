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

  // ステータスが「準備中」または「順番待ち」の場合
  const status = filteredData[0]?.ステータス;
  const isPending = status === "準備中" || status === "順番待ち";

  // 詳細データ（開始時間や場所）が一切ない場合
  const hasNoDetails = filteredData.every(d => !d.開始時間 || !d.場所);

  if (isPending || hasNoDetails) {
    return (
      <div className="min-h-screen bg-[#fcfaf8] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-2xl mb-6">📡</div>
        <h1 className="text-2xl font-black text-stone-800 mb-2">{isPending ? status : "観測データ受信中"}</h1>
        <p className="text-stone-400 text-sm max-w-xs">
          現在、{displayDate} の観測データを解析しています。表示まで今しばらくお待ちください。
        </p>
        <Link href="/archive" className="mt-8 text-[#b28c6e] font-bold text-xs underline">一覧へ戻る</Link>
      </div>
    );
  }

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
      <header className="px-8 py-16 max-w-7xl mx-auto">
        <Link
          href="/archive"
          className="text-stone-400 text-[10px] font-black tracking-[0.2em] hover:text-[#b28c6e] transition-colors flex items-center gap-1 mb-8 uppercase"
        >
          <ChevronLeft className="w-3 h-3" /> Back to Archives
        </Link>
        <div className="space-y-3">
          <p className="text-[#b28c6e] text-[10px] font-black tracking-[0.4em] uppercase pl-1">
            Observation Logfile
          </p>
          <h1 className="text-5xl md:text-6xl font-black text-stone-800 tracking-tighter leading-none">
            {displayDate} <span className="text-stone-200 font-light ml-2 text-3xl md:text-4xl">記録詳細</span>
          </h1>
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

      {/* フッター */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-stone-300 font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
    </main>
  );
}
