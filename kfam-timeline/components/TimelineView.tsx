"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, User } from "lucide-react";

export default function TimelineView({ data, date }: { data: ArchiveData[], date: string }) {
  const [zoom, setZoom] = useState(1); // 1 to 3
  const [filter, setFilter] = useState("");

  const season = data[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(season);
  const members = Array.from(new Set(data.map(d => d.暦家)));

  return (
    <div className="space-y-4">
      {/* コントロールパネル */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-100 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="メンバーや場所で検索..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#b28c6e]/20 outline-none"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-lg">
          <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-white rounded shadow-sm transition-all"><ZoomOut className="w-4 h-4 text-stone-600" /></button>
          <span className="text-xs font-bold text-stone-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-white rounded shadow-sm transition-all"><ZoomIn className="w-4 h-4 text-stone-600" /></button>
        </div>
      </div>

      {/* タイムライン本体 */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }}>
            {/* 時間目盛り */}
            <div className="flex border-b border-stone-50 bg-stone-50/50">
              <div className="w-32 flex-shrink-0 border-r border-stone-100 p-4 text-[10px] uppercase font-bold text-stone-400 sticky left-0 bg-stone-50 z-20">Time</div>
              <div className="flex-grow flex relative">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[10px] text-stone-400 p-4 border-l border-stone-100/50 text-center">{label}</div>
                ))}
              </div>
            </div>

            {/* メンバー行 */}
            {members.map(member => {
              const items = data.filter(d =>
                d.暦家 === member &&
                (member.includes(filter) || d.場所.includes(filter))
              );
              if (items.length === 0 && filter) return null;

              return (
                <div key={member} className="flex border-b border-stone-50 items-stretch hover:bg-stone-50/30">
                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-100 sticky left-0 z-10 bg-white">
                    <span className="text-sm font-bold text-stone-700 flex items-center gap-2">
                      <div className="w-1.5 h-4 rounded-full bg-[#b28c6e]" /> {member}
                    </span>
                  </div>
                  <div className="flex-grow relative h-20 bg-grid-slate-100/50">
                    {items.map((item, i) => {
                      const start = getPosition(item.開始時間, item.シーズン);
                      const end = getPosition(item.終了時間, item.シーズン);
                      return (
                        <a
                          key={i}
                          href={item.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-1/2 -translate-y-1/2 h-12 rounded-lg text-[11px] text-stone-800 flex flex-col justify-center px-3 shadow-sm border border-black/5 hover:scale-[1.01] transition-all overflow-hidden z-0 hover:z-30"
                          style={{
                            left: `${start}%`,
                            width: `${end - start}%`,
                            backgroundColor: getLocationColor(item.場所)
                          }}
                        >
                          <span className="font-bold truncate">{item.場所}</span>
                          <span className="text-[9px] opacity-60 font-mono">{item.開始時間}-{item.終了時間}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
