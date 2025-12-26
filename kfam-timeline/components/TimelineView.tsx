"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ChevronDown, ChevronRight, MapPin, X, ExternalLink } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"member" | "location">("member");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<ArchiveData | null>(null);

  const timeLabels = getTimeLabels(data[0]?.シーズン || "Season2");
  const groupKeys = Array.from(new Set(data.map(d => viewMode === "member" ? d.暦家 : d.場所)));

  const toggleRow = (key: string) => {
    const next = new Set(expandedRows);
    if (next.has(key)) next.delete(key); else next.add(key);
    setExpandedRows(next);
  };

  const getLanes = (items: ArchiveData[]) => {
    const sorted = [...items].sort((a, b) => a.開始時間.localeCompare(b.開始時間));
    const lanes: ArchiveData[][] = [];
    sorted.forEach(item => {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        if (item.開始時間 >= lanes[i][lanes[i].length - 1].終了時間) {
          lanes[i].push(item);
          placed = true;
          break;
        }
      }
      if (!placed) lanes.push([item]);
    });
    return lanes;
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 操作パネル */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-stone-200 sticky top-4 z-40 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="名前・場所・ひらがな検索"
              className="w-full pl-12 pr-4 py-3 bg-stone-100 rounded-xl text-sm outline-none"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button onClick={() => setViewMode("member")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}>姉妹軸</button>
              <button onClick={() => setViewMode("location")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}>場所軸</button>
            </div>
            <div className="flex items-center bg-stone-100 p-1 rounded-xl">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-white rounded-lg"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-[10px] font-bold w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-white rounded-lg"><ZoomIn className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* タイムライン本体 */}
      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }} className="relative transition-all duration-300">
            {/* 時間軸 */}
            <div className="flex border-b border-stone-100 bg-stone-50/50 sticky top-0 z-30">
              <div className="w-32 flex-shrink-0 border-r border-stone-200 p-4 text-[10px] font-bold text-stone-400 sticky left-0 bg-stone-50 z-20">名前/場所</div>
              <div className="flex-grow flex">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[10px] text-stone-400 p-4 border-l border-stone-100/30 text-center font-mono">{label}</div>
                ))}
              </div>
            </div>

            {groupKeys.map((key, rowIndex) => {
              const items = data.filter(d => {
                const isTarget = (viewMode === "member" ? d.暦家 : d.場所) === key;
                const reading = LOCATION_READING_MAP[d.場所] || [];
                return isTarget && (d.暦家.includes(query) || d.場所.includes(query) || reading.some(r => r.includes(query)));
              });
              if (items.length === 0) return null;

              const lanes = getLanes(items);
              const isExpanded = viewMode === "member" || expandedRows.has(key);

              return (
                <div key={key} className="flex border-b border-stone-100 items-stretch hover:bg-stone-50/20">
                  <div
                    className={`w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white ${viewMode === "location" ? "cursor-pointer hover:bg-stone-50" : ""}`}
                    onClick={() => viewMode === "location" && toggleRow(key)}
                  >
                    <div className="flex items-center gap-2">
                      {viewMode === "location" && (isExpanded ? <ChevronDown className="w-3 h-3 text-stone-300" /> : <ChevronRight className="w-3 h-3 text-stone-300" />)}
                      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: viewMode === "member" ? (MEMBER_COLORS[key] || '#ccc') : '#b28c6e' }} />
                      <span className="text-sm font-bold text-stone-700 truncate">{key}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] transition-all duration-300"
                       style={{ height: isExpanded ? `${lanes.length * 52 + 16}px` : '68px' }}>
                    {lanes.map((lane, lIdx) =>
                      lane.map((item, i) => {
                        const start = getPosition(item.開始時間, item.シーズン);
                        const end = getPosition(item.終了時間, item.シーズン);
                        const isShort = end - start < 3; // 滞在が短い場合

                        return (
                          <div
                            key={`${lIdx}-${i}`}
                            className={`absolute h-10 rounded-lg shadow-sm border border-black/5 cursor-pointer flex items-center px-2 text-[10px] font-bold transition-all hover:scale-[1.02] hover:shadow-lg hover:z-30 group ${!isExpanded && lIdx > 0 ? 'opacity-0' : 'opacity-100'}`}
                            style={{
                              left: `${start}%`, width: `${Math.max(end - start, 1)}%`,
                              top: isExpanded ? `${lIdx * 52 + 12}px` : '12px',
                              backgroundColor: viewMode === "member" ? getLocationColor(item) : (MEMBER_COLORS[item.暦家] || '#666'),
                              // 視認性のための文字色：場所軸（濃色背景）なら白、姉妹軸（淡色背景）なら黒
                              color: viewMode === "location" ? '#fff' : '#1c1917'
                            }}
                            onClick={() => setSelectedItem(item)}
                          >
                            <span className="truncate">{viewMode === "member" ? item.場所 : item.暦家}</span>

                            {/* ホバー詳細：見切れ防止 */}
                            <div className={`hidden lg:block absolute ${rowIndex < 3 ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 w-48 bg-stone-900 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50 shadow-2xl`}>
                              <p className="font-bold text-xs border-b border-white/10 pb-1 mb-1">{item.暦家}</p>
                              <p className="text-[10px] text-stone-300">場所: {item.場所}</p>
                              <p className="text-[10px] text-stone-300">時間: {item.開始時間} 〜 {item.終了時間}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 詳細カード：スマホ対応 */}
      {selectedItem && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-stone-800 tracking-tight">{selectedItem.暦家}</h2>
                <button onClick={() => setSelectedItem(null)} className="p-2 bg-stone-50 rounded-full"><X className="w-5 h-5 text-stone-400" /></button>
              </div>
              <div className="space-y-6 mb-8 text-stone-700">
                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#b28c6e]"><MapPin /></div>
                  <div><p className="text-xs text-stone-400 font-bold">場所</p><p className="font-bold">{selectedItem.場所}</p></div>
                </div>
                <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-stone-400 text-xl">🕒</div>
                  <div><p className="text-xs text-stone-400 font-bold">時間</p><p className="font-bold font-mono text-lg">{selectedItem.開始時間} 〜 {selectedItem.終了時間}</p></div>
                </div>
              </div>
              <a href={selectedItem.URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-5 bg-[#b28c6e] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#b28c6e]/30">
                視聴ページへ移動 <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
