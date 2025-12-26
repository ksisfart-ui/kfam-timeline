"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, Users, MapPin, X, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"member" | "location">("member");
  const [selectedCat, setSelectedCat] = useState("すべて");
  const [selectedItem, setSelectedItem] = useState<ArchiveData | null>(null);
  // 折りたたみ状態の管理
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const categories = ["すべて", ...Array.from(new Set(data.map(d => d.カテゴリ))).filter(Boolean)];
  const season = data[0]?.シーズン || "Season2";
  const timeLabels = getTimeLabels(season);

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
        const lastInLane = lanes[i][lanes[i].length - 1];
        if (item.開始時間 >= lastInLane.終了時間) {
          lanes[i].push(item);
          placed = true;
          break;
        }
      }
      if (!placed) lanes.push([item]);
    });
    return lanes;
  };

  const groupKeys = Array.from(new Set(data.map(d => viewMode === "member" ? d.暦家 : d.場所)));

  return (
    <div className="space-y-4 pb-20">
      {/* 操作パネル */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-col gap-4 sticky top-4 z-40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="名前・場所・ひらがなで検索"
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-100 rounded-xl text-sm outline-none"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button onClick={() => setViewMode("member")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}>
                姉妹軸
              </button>
              <button onClick={() => setViewMode("location")} className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}>
                場所軸
              </button>
            </div>
            {/* ズームボタン追加 */}
            <div className="flex items-center gap-1 bg-stone-50 p-1 rounded-xl border">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-1.5 hover:bg-white rounded-lg transition-all"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-[10px] font-bold w-10 text-center text-stone-500">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-1.5 hover:bg-white rounded-lg transition-all"><ZoomIn className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCat(cat)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${selectedCat === cat ? "bg-stone-800 text-white border-stone-800" : "bg-white text-stone-500 border-stone-200"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }}>
            <div className="flex border-b border-stone-100 bg-stone-50/80 sticky top-0 z-30">
              <div className="w-32 flex-shrink-0 border-r border-stone-200 p-4 text-[10px] font-bold text-stone-400 sticky left-0 bg-stone-50 z-20">
                {viewMode === "member" ? "名前" : "場所"}
              </div>
              <div className="flex-grow flex">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[10px] text-stone-400 p-4 border-l border-stone-100/30 text-center font-mono">{label}</div>
                ))}
              </div>
            </div>

            {groupKeys.map((key, rowIndex) => {
              const items = data.filter(d => {
                const isTarget = (viewMode === "member" ? d.暦家 : d.場所) === key;
                const isCat = selectedCat === "すべて" || d.カテゴリ === selectedCat;
                const readings = LOCATION_READING_MAP[d.場所] || [];
                const isMatch = d.暦家.includes(query) || d.場所.includes(query) || readings.some(r => r.includes(query));
                return isTarget && isCat && isMatch;
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
                    <div className="text-sm font-bold text-stone-700 flex items-center gap-2">
                      {viewMode === "location" && (isExpanded ? <ChevronDown className="w-3 h-3 text-stone-300" /> : <ChevronRight className="w-3 h-3 text-stone-300" />)}
                      <div className="w-1 h-4 rounded-full" style={{ backgroundColor: viewMode === "member" ? (MEMBER_COLORS[key] || '#ccc') : '#b28c6e' }} />
                      <span className="truncate">{key}</span>
                    </div>
                  </div>
                  <div
                    className="flex-grow relative overflow-hidden transition-all duration-300"
                    style={{ height: isExpanded ? `${lanes.length * 52 + 16}px` : '68px' }}
                  >
                    {lanes.map((lane, laneIdx) => (
                      <React.Fragment key={laneIdx}>
                        {lane.map((item, i) => {
                          const start = getPosition(item.開始時間, item.シーズン);
                          const end = getPosition(item.終了時間, item.シーズン);
                          // 短い滞在時間の視認性確保 (最低幅1%)
                          const barWidth = Math.max(end - start, 1);

                          return (
                            <div
                              key={`${laneIdx}-${i}`}
                              className={`absolute h-10 rounded-lg text-[11px] flex items-center px-3 shadow-sm border border-black/5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:z-30 group ${!isExpanded && laneIdx > 0 ? 'opacity-0' : 'opacity-100'}`}
                              style={{
                                left: `${start}%`, width: `${barWidth}%`, top: isExpanded ? `${laneIdx * 52 + 12}px` : '12px',
                                backgroundColor: viewMode === "member" ? getLocationColor(item) : (MEMBER_COLORS[item.暦家] || '#666'),
                                color: viewMode === "location" ? 'white' : 'inherit'
                              }}
                              onClick={() => setSelectedItem(item)}
                            >
                              <span className="font-bold truncate">{viewMode === "member" ? item.場所 : item.暦家}</span>
                              <div className={`hidden lg:block absolute ${rowIndex < 2 ? 'top-full mt-2' : 'bottom-full mb-2'} left-1/2 -translate-x-1/2 w-48 bg-stone-900 text-white p-3 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-50`}>
                                <p className="font-bold text-xs border-b border-white/10 pb-1 mb-1">{item.暦家}</p>
                                <p className="text-[10px] text-stone-300">場所: {item.場所}</p>
                                <p className="text-[10px] text-stone-300">時間: {item.開始時間} 〜 {item.終了時間}</p>
                              </div>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* 詳細カードは省略（前のコードのままで動作します） */}
      {/* ... (selectedItem && の詳細カードコード) ... */}
    </div>
  );
}
