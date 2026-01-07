"use client";
import { ArchiveData } from "@/types";
import { getPosition } from "@/lib/timeUtils";
import { MEMBER_COLORS } from "@/lib/constants";

export default function TimelineRow({ member, items }: { member: string, items: ArchiveData[] }) {
  const memberColor = MEMBER_COLORS[member] || "#666666";

  return (
    <div className="flex border-b border-card-border items-stretch hover:bg-accent-soft transition-colors duration-300">
      {/* メンバー名ラベル */}
      <div className="w-28 sm:w-32 flex-shrink-0 px-4 py-6 flex items-center justify-start border-r border-card-border sticky left-0 z-10 bg-card">
        <span
          className="text-sm font-bold pl-2 border-l-4 text-main"
          style={{ borderColor: memberColor }}
        >
          {member}
        </span>
      </div>

      {/* タイムラインエリア */}
      <div className="flex-grow relative min-h-[80px] bg-background/10">
        {items.map((item, i) => {
          const start = getPosition(item.開始時間, item.シーズン);
          const end = getPosition(item.終了時間, item.シーズン);

          return (
            <a
              key={i}
              href={item.URL}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-1/2 -translate-y-1/2 h-10 rounded-sm text-[11px] text-white flex items-center px-2 shadow-sm transition-all hover:brightness-110 hover:z-20 border border-black/10"
              style={{
                left: `${start}%`,
                width: `${end - start}%`,
                backgroundColor: memberColor,
              }}
              title={`${item.場所} (${item.開始時間}～${item.終了時間})`}
            >
              <span className="truncate font-medium">{item.場所}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}