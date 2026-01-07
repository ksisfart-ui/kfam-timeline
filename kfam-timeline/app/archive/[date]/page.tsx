import { fetchArchiveData } from "@/lib/dataFetcher";
import TimelineView from "@/components/TimelineView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center transition-colors duration-300">
        <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center text-2xl mb-6 border border-card-border">📡</div>
        <h1 className="text-2xl font-black text-stone-800 mb-2">{isPending ? status : "観測データ受信中"}</h1>
        <p className="text-sub text-sm max-w-xs">
          現在、{displayDate} の観測データを解析しています。表示まで今しばらくお待ちください。
        </p>
        <Link href="/archive" className="mt-8 text-accent font-bold text-xs underline">一覧へ戻る</Link>
      </div>
    );
  }

  // データが見つからない場合の処理
  if (!filteredData.length) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 transition-colors duration-300">
        <h1 className="text-xl font-bold text-main mb-4">データが見つかりませんでした</h1>
        <p className="text-sub mb-8">{displayDate} の記録はまだ登録されていないようです。</p>
        <Link href="/archive" className="text-accent font-bold hover:underline italic">
          ← BACK TO ARCHIVES
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20 transition-colors duration-300">
      {/* ヘッダーセクション */}
      <header className="px-8 py-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-grow">
          <Link
            href="/archive"
            className="text-muted text-[10px] font-bold tracking-[0.2em] hover:text-accent transition-colors flex items-center gap-1 mb-6 uppercase"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Archives
          </Link>
          <div className="space-y-2">
            <p className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase pl-1">
              Observation Logfile
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-main tracking-tight leading-none">
              {displayDate} <span className="text-muted font-normal ml-2 text-2xl">の記録</span>
            </h1>
          </div>
        </div>

        {/* モード切替ボタンを追加 */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>

      {/* タイムラインコンポーネント（再利用） */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <TimelineView data={filteredData} />
      </div>

      {/* フッター的な案内 */}
      <div className="mt-12 text-center">
        <Link href="/archive" className="inline-flex items-center gap-2 px-8 py-3 bg-btn-primary-bg text-btn-primary-text rounded-full text-xs font-bold hover:opacity-90 transition-all shadow-xl shadow-card-border">
          他の記録も探す
        </Link>
      </div>

      {/* フッター */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-muted font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
    </main>
  );
}
