import { getPosition } from "@/lib/timeUtils";

export default function TimelineBar({ item }: { item: any }) {
  const startPos = getPosition(item.開始時間, item.シーズン);
  const endPos = getPosition(item.終了時間, item.シーズン);
  const width = endPos - startPos;

  return (
    <div className="relative h-12 w-full border-b border-gray-700 bg-gray-900/50">
      <a
        href={item.URL}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute h-8 top-2 bg-blue-500 hover:bg-blue-400 rounded-md text-xs text-white flex items-center px-2 transition-all overflow-hidden whitespace-nowrap"
        style={{ left: `${startPos}%`, width: `${width}%` }}
        title={`${item.暦家}: ${item.場所} (${item.開始時間}〜${item.終了時間})`}
      >
        {item.場所}
      </a>
    </div>
  );
}
