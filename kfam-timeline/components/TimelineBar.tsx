"use client";
import { ArchiveData } from "@/types";
import { getPosition } from "@/lib/timeUtils";

export default function TimelineRow({ member, items }: { member: string, items: ArchiveData[] }) {
  const season = items[0]?.シーズン || "Season2";

  return (
    <div className="flex border-b border-gray-800 items-center group">
      <div className="w-32 flex-shrink-0 px-4 py-4 font-bold border-r border-gray-800 bg-gray-900 sticky left-0 z-10">
        {member}
      </div>
      <div className="flex-grow relative h-16 bg-gray-900/30">
        {items.map((item, i) => {
          const start = getPosition(item.開始時間, item.シーズン);
          const end = getPosition(item.終了時間, item.シーズン);
          return (
            <a
              key={i}
              href={item.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 h-10 bg-blue-600 hover:bg-blue-500 rounded border border-blue-400 text-[10px] text-white flex items-center px-2 shadow-lg transition-transform hover:scale-[1.02] z-0 hover:z-20 overflow-hidden"
              style={{ left: `${start}%`, width: `${end - start}%` }}
              title={`${item.場所} (${item.開始時間}～${item.終了時間})`}
            >
              <span className="truncate">{item.場所}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
