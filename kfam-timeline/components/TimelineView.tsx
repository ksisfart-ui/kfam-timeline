"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, Users, MapPin, X } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"member" | "location">("member");
  const [selectedItem, setSelectedItem] = useState<ArchiveData | null>(null);

  const season = data[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(season);

  // 表示用のグループ化（姉妹軸 or 場所軸）
  const groupKeys = Array.from(new Set(data.map(d => viewMode === "member" ? d.暦家 : d.場所)));

  return (
    <div className="space-y-4">
      {/* 操作パネル */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-wrap items-center justify-between gap-4 sticky top-4 z-40">
        <div className="flex items-center gap-4 flex-grow max-w-2xl">
          {/* 検索バー */}
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="名前・場所・ひらがなで検索..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-[#b28c6e]/30 outline-none"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {/* 軸切り替えスイッチ */}
          <div className="flex bg-stone-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("member")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}
            >
              <Users className="w-3 h-3" /> 姉妹軸
            </button>
            <button
              onClick={() => setViewMode("location")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}
            >
              <MapPin className="w-3 h-3" /> 場所軸
            </button>
          </div>
        </div>

        {/* ズーム */}
        <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-xl border border-stone-100">
          <button onClick={() => setZoom(prev => Math.max(1, prev - 0.5))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomOut className="w-4 h-4 text-stone-600" /></button>
          <span className="text-[10px] font-black text-stone-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(prev => Math.min(3, prev + 0.5))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomIn className="w-4 h-4 text-stone-600" /></button>
        </div>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }}>
            {/* 時間軸ラベル */}
            <div className="flex border-b border-stone-100 bg-stone-50/80 backdrop-blur-sm">
              <div className="w-32 flex-shrink-0 border-r border-stone-200 p-4 text-[10px] font-black text-stone-400 uppercase sticky left-0 bg-stone-50 z-20">
                {viewMode === "member" ? "Sisters" : "Location"}
              </div>
              <div className="flex-grow flex relative">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[10px] text-stone-400 p-4 border-l border-stone-100/50 text-center font-mono">{label}</div>
                ))}
              </div>
            </div>

            {/* 各行のレンダリング */}
            {groupKeys.map(key => {
              const items = data.filter(d => {
                const target = viewMode === "member" ? d.暦家 : d.場所;
                if (target !== key) return false;

                // ひらがな検索対応
                const reading = LOCATION_READING_MAP[d.場所] || "";
                return d.暦家.includes(query) || d.場所.includes(query) || reading.includes(query);
              });

              if (items.length === 0 && query) return null;

              return (
                <div key={key} className="flex border-b border-stone-100 items-stretch hover:bg-stone-50/50 group/row">
                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white group-hover/row:bg-stone-50 transition-colors">
                    <span className="text-sm font-bold text-stone-700 flex items-center gap-2">
                      <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: viewMode === "member" ? (MEMBER_COLORS[key] || '#ccc') : getLocationColor(key) }} />
                      <span className="truncate">{key}</span>
                    </span>
                  </div>
                  <div className="flex-grow relative h-20">
                    {items.map((item, i) => {
                      const start = getPosition(item.開始時間, item.シーズン);
                      const end = getPosition(item.終了時間, item.シーズン);
                      const barColor = viewMode === "member" ? getLocationColor(item.場所) : (MEMBER_COLORS[item.暦家] || '#ccc');

                      return (
                        <div
                          key={i}
                          className="absolute top-1/2 -translate-y-1/2 h-12 rounded-lg text-[11px] text-stone-800 flex flex-col justify-center px-3 shadow-sm border border-black/5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:z-30 group/item"
                          style={{ left: `${start}%`, width: `${end - start}%`, backgroundColor: barColor }}
                          onClick={() => setSelectedItem(item)}
                        >
                          <span className="font-bold truncate">{viewMode === "member" ? item.場所 : item.暦家}</span>
                          <span className="text-[9px] opacity-60 font-mono">{item.開始時間}-{item.終了時間}</span>

                          {/* PC用ホバー詳細表示 */}
                          <div className="hidden lg:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-stone-900 text-white p-3 rounded-xl opacity-0 group-hover/item:opacity-100 pointer-events-none transition-all z-50 shadow-2xl">
                            <p className="font-bold text-xs border-b border-white/10 pb-1 mb-1">{item.暦家}</p>
                            <p className="text-[10px] text-stone-300">📍 {item.場所}</p>
                            <p className="text-[10px] text-stone-300">⏰ {item.開始時間} 〜 {item.終了時間}</p>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-stone-900" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* スマホ用詳細モーダル（タップ時に表示） */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="h-24 relative" style={{ backgroundColor: MEMBER_COLORS[selectedItem.暦家] || '#ccc' }}>
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 pt-10 relative">
              <div className="absolute -top-10 left-6 bg-white p-2 rounded-2xl shadow-lg font-black text-[#b28c6e] text-xl">
                {selectedItem.暦家}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#b28c6e]"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Location</p>
                    <p className="font-bold text-stone-800">{selectedItem.場所}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#b28c6e]">⏱</div>
                  <div>
                    <p className="text-[10px] font-bold text-stone-400 uppercase">Time</p>
                    <p className="font-bold text-stone-800 font-mono">{selectedItem.開始時間} - {selectedItem.終了時間}</p>
                  </div>
                </div>
                <a
                  href={selectedItem.URL}
                  target="_blank"
                  className="block w-full py-4 bg-[#b28c6e] text-white text-center rounded-2xl font-bold shadow-lg shadow-[#b28c6e]/20 active:scale-95 transition-all"
                >
                  配信アーカイブを開く
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
