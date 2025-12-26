"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ExternalLink } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");

  const season = data[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(season);
  const members = Array.from(new Set(data.map(d => d.暦家)));

  return (
    <div className="space-y-4">
      {/* 操作パネル */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-30">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="メンバーや場所を検索..."
            className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#b28c6e]/20"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-lg border border-stone-100">
          <button onClick={() => setZoom(prev => Math.max(1, prev - 0.5))} className="p-2 hover:bg-white rounded transition-all"><ZoomOut className="w-4 h-4 text-stone-600" /></button>
          <span className="text-[10px] font-black text-stone-400 w-12 text-center uppercase tracking-tighter">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(prev => Math.min(3, prev + 0.5))} className="p-2 hover:bg-white rounded transition-all"><ZoomIn className="w-4 h-4 text-stone-600" /></button>
        </div>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }}>
            {/* 時間軸 */}
            <div className="flex border-b border-stone-100 bg-stone-50/50">
              <div className="w-32 flex-shrink-0 border-r border-stone-200 p-3 text-[10px] font-black text-stone-400 uppercase sticky left-0 bg-stone-50 z-20">Member</div>
              <div className="flex-grow flex relative">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[9px] text-stone-400 p-3 border-l border-stone-100 text-center font-mono">{label}</div>
                ))}
              </div>
            </div>

            {/* 各メンバー行 */}
            {members.map(member => {
              const items = data.filter(d =>
                d.暦家 === member && (member.includes(query) || d.場所.includes(query))
              );
              if (items.length === 0 && query) return null;

              return (
                <div key={member} className="flex border-b border-stone-50 items-stretch hover:bg-stone-50/30 transition-colors">
                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-2">
                      <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[member] || '#ccc' }} />
                      {member}
                    </span>
                  </div>
                  <div className="flex-grow relative h-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-80">
                    {items.map((item, i) => {
                      const start = getPosition(item.開始時間, item.シーズン);
                      const end = getPosition(item.終了時間, item.シーズン);
                      return (
                        <a
                          key={i}
                          href={item.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-1/2 -translate-y-1/2 h-12 rounded-lg text-[10px] text-stone-800 flex flex-col justify-center px-3 shadow-sm border border-white/50 hover:scale-[1.02] hover:shadow-md transition-all group overflow-hidden"
                          style={{ left: `${start}%`, width: `${end - start}%`, backgroundColor: getLocationColor(item.場所) }}
                        >
                          <span className="font-bold truncate flex items-center gap-1">
                            {item.場所} <ExternalLink className="w-2 h-2 opacity-0 group-hover:opacity-50 transition-opacity" />
                          </span>
                          <span className="text-[8px] opacity-60 font-mono">{item.開始時間}-{item.終了時間}</span>
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
