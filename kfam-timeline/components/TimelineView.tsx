"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getStylishRandomColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ChevronDown, ChevronRight, MapPin, Users, X } from "lucide-react";

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
    <div className="space-y-6">
      {/* 操作パネル：英字を廃止し、日本語で分かりやすく */}
      <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-stone-200 sticky top-4 z-40 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="名前・場所・ひらがなで検索"
              className="w-full pl-12 pr-4 py-3 bg-stone-100/50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#b28c6e]/20"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex bg-stone-100 p-1.5 rounded-2xl">
            <button onClick={() => setViewMode("member")} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}>姉妹軸</button>
            <button onClick={() => setViewMode("location")} className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400"}`}>場所軸</button>
          </div>
          <div className="flex items-center gap-1 bg-stone-100 p-1.5 rounded-2xl">
            <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-white rounded-lg"><ZoomOut className="w-4 h-4" /></button>
            <span className="text-[10px] font-bold w-12 text-center text-stone-500">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-white rounded-lg"><ZoomIn className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* タイムライン */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-stone-200/40 border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }}>
            <div className="flex border-b border-stone-100 bg-stone-50/50 sticky top-0 z-30">
              <div className="w-40 flex-shrink-0 border-r border-stone-200 p-4 text-[10px] font-bold text-stone-400 sticky left-0 bg-stone-50 z-20">
                {viewMode === "member" ? "名前" : "場所"}
              </div>
              <div className="flex-grow flex relative">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[10px] text-stone-400 p-4 border-l border-stone-100/30 text-center font-mono">{label}</div>
                ))}
              </div>
            </div>

            {groupKeys.map((key) => {
              const items = data.filter(d => {
                const isTarget = (viewMode === "member" ? d.暦家 : d.場所) === key;
                const reading = LOCATION_READING_MAP[d.場所] || [];
                return isTarget && (d.暦家.includes(query) || d.場所.includes(query) || reading.some(r => r.includes(query)));
              });
              if (items.length === 0) return null;

              const lanes = getLanes(items);
              const isExpanded = expandedRows.has(key) || viewMode === "member";

              return (
                <div key={key} className="flex border-b border-stone-100 items-stretch transition-colors">
                  <div
                    className={`w-40 flex-shrink-0 px-5 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white shadow-sm ${viewMode === "location" ? "cursor-pointer hover:bg-stone-50" : ""}`}
                    onClick={() => viewMode === "location" && toggleRow(key)}
                  >
                    <div className="flex items-center gap-3">
                      {viewMode === "location" && (isExpanded ? <ChevronDown className="w-4 h-4 text-stone-300" /> : <ChevronRight className="w-4 h-4 text-stone-300" />)}
                      <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: viewMode === "member" ? (MEMBER_COLORS[key] || '#ccc') : '#b28c6e' }} />
                      <span className="text-sm font-bold text-stone-700">{key}</span>
                    </div>
                  </div>

                  <div className={`flex-grow relative bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] transition-all duration-300 overflow-hidden`}
                       style={{ height: isExpanded ? `${lanes.length * 48 + 24}px` : '48px' }}>
                    {lanes.map((lane, lIdx) =>
                      lane.map((item, i) => {
                        const start = getPosition(item.開始時間, item.シーズン);
                        const end = getPosition(item.終了時間, item.シーズン);
                        // 短い時間の視認性を確保（最低幅を4px以上に）
                        const width = Math.max(end - start, 0.5);

                        return (
                          <div
                            key={`${lIdx}-${i}`}
                            className={`absolute h-9 rounded-lg shadow-sm border border-white/50 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg hover:z-30 flex items-center px-2 text-[10px] font-bold ${!isExpanded && lIdx > 0 ? 'opacity-0' : 'opacity-100'}`}
                            style={{
                              left: `${start}%`, width: `${width}%`,
                              top: isExpanded ? `${lIdx * 48 + 12}px` : '12px',
                              backgroundColor: viewMode === "member" ? getStylishRandomColor(item.場所) : (MEMBER_COLORS[item.暦家] || '#666'),
                              color: viewMode === "location" ? 'white' : 'inherit'
                            }}
                            onClick={() => setSelectedItem(item)}
                          >
                            <span className="truncate">{viewMode === "member" ? item.場所 : item.暦家}</span>
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

      {/* 詳細カード */}
      {selectedItem && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
            <div className="p-10">
              <div className="flex justify-between mb-8">
                <h2 className="text-3xl font-bold text-stone-800 tracking-tighter">{selectedItem.暦家}</h2>
                <button onClick={() => setSelectedItem(null)} className="p-2 bg-stone-100 rounded-full text-stone-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-5 p-4 bg-stone-50 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#b28c6e]"><MapPin /></div>
                  <div><p className="text-[10px] font-bold text-stone-400">滞在場所</p><p className="font-bold text-stone-700">{selectedItem.場所}</p></div>
                </div>
                <div className="flex items-center gap-5 p-4 bg-stone-50 rounded-2xl">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-stone-500">🕒</div>
                  <div><p className="text-[10px] font-bold text-stone-400">活動時間</p><p className="font-bold text-stone-700 font-mono text-lg">{selectedItem.開始時間} 〜 {selectedItem.終了時間}</p></div>
                </div>
              </div>
              <a href={selectedItem.URL} target="_blank" className="block w-full py-5 bg-[#b28c6e] text-white text-center rounded-2xl font-bold shadow-xl shadow-[#b28c6e]/20 transition-all active:scale-95">
                配信アーカイブを確認
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
