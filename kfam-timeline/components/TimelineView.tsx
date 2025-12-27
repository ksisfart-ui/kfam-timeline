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
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-col gap-4 sticky top-4 z-40">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* 検索バー：文字色を明示的に指定 */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="名前・場所・店名で検索"
            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-[#b28c6e]/30 outline-none"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* 軸切り替え */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button onClick={() => setViewMode("member")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>
              姉妹軸
            </button>
            <button onClick={() => setViewMode("location")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>
              場所軸
            </button>
          </div>

          {/* ズーム機能：スマホ（md未満）では非表示に設定 */}
          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-white rounded-lg transition-all">
              <ZoomOut className="w-4 h-4 text-stone-600" />
            </button>
            <span className="text-[10px] font-bold w-10 text-center text-stone-600">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-white rounded-lg transition-all">
              <ZoomIn className="w-4 h-4 text-stone-600" />
            </button>
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

            {groupKeys.map((key) => {
              const items = data.filter(d => {
                const isTarget = (viewMode === "member" ? d.暦家 : d.場所) === key;
                const readings = LOCATION_READING_MAP[d.場所] || [];
                return isTarget && (d.暦家.includes(query) || d.場所.includes(query) || readings.some(r => r.includes(query)));
              });

              if (items.length === 0) return null;
              const isExpanded = viewMode === "member" || expandedRows.has(key);
              const lanes = getLanes(items);

              // --- 場所軸（アコーディオン形式） ---
              if (viewMode === "location") {
                return (
                  <div key={key} className="mb-3 px-4">
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                      {/* アコーディオンヘッダー */}
                      <button
                        onClick={() => toggleRow(key)}
                        className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#b28c6e' }} />
                          <span className="text-base font-bold text-stone-700">{key}</span>
                        </div>
                        {isExpanded ?
                          <ChevronDown className="w-5 h-5 text-stone-300" /> :
                          <ChevronRight className="w-5 h-5 text-stone-300" />
                        }
                      </button>

                      {/* 展開時のタイムラインエリア */}
                      {isExpanded && (
                        <div className="border-t border-stone-50 overflow-x-auto bg-stone-50/30">
                          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }} className="relative p-2">
                            {/* その場所にいたメンバーごとにグループ化して表示 */}
                            {Array.from(new Set(items.map(d => d.暦家))).map((member) => {
                              const memberItems = items.filter(d => d.暦家 === member);
                              const memberLanes = getLanes(memberItems); // 同一メンバーの重なり対応

                              return (
                                <div key={member} className="flex items-center mb-1 last:mb-0 group/member-row">
                                  {/* 左側：メンバー名ラベル（15%程度の幅で固定すると見やすい） */}
                                  <div className="w-24 shrink-0 px-2 py-1 sticky left-0 z-10 bg-stone-100/80 backdrop-blur rounded text-[10px] font-bold text-stone-500 border border-stone-200 shadow-sm">
                                    {member}
                                  </div>

                                  {/* 右側：そのメンバーの滞在バー */}
                                  <div className="flex-grow relative h-10 ml-2">
                                    {memberItems.map((item, i) => {
                                      const start = getPosition(item.開始時間, item.シーズン);
                                      const end = getPosition(item.終了時間, item.シーズン);
                                      return (
                                        <div
                                          key={i}
                                          className="absolute h-8 top-1 rounded-md shadow-sm border border-black/5 cursor-pointer flex items-center px-2 text-[10px] font-bold text-white transition-all hover:scale-[1.02]"
                                          style={{
                                            left: `${start}%`,
                                            width: `${Math.max(end - start, 1)}%`,
                                            backgroundColor: MEMBER_COLORS[item.暦家] || '#666'
                                          }}
                                          onClick={() => setSelectedItem(item)}
                                        >
                                          {/* バーが狭い場合は場所名（この場合は不要かも）を非表示 */}
                                          {(end - start) > 5 && <span className="truncate">滞在</span>}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // --- 姉妹軸（従来通りの横長行形式） ---
              return (
                <div key={key} className="flex border-b border-stone-100 items-stretch hover:bg-stone-50/20 transition-colors">
                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white">
                    <div className="text-sm font-bold text-stone-700 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MEMBER_COLORS[key] || '#ccc' }} />
                      <span className="truncate">{key}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative min-h-[80px]" style={{ height: `${lanes.length * 52 + 16}px` }}>
                    {lanes.map((lane, laneIdx) =>
                      lane.map((item, i) => {
                        const start = getPosition(item.開始時間, item.シーズン);
                        const end = getPosition(item.終了時間, item.シーズン);
                        const isShort = end - start < 3; // 滞在が短い場合

                        return (
                          <div
                            key={`${laneIdx}-${i}`}
                            className="absolute h-10 rounded-lg text-[10px] flex items-center px-2 shadow-sm border border-black/5 cursor-pointer bg-stone-50 transition-all hover:scale-[1.02]"
                            style={{
                              left: `${start}%`,
                              width: `${Math.max(end - start, 1)}%`,
                              top: `${laneIdx * 52 + 12}px`,
                              backgroundColor: getLocationColor(item),
                              color: '#1c1917'
                            }}
                            onClick={() => setSelectedItem(item)}
                          >
                            <span className="truncate font-bold">{item.場所}</span>
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
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-stone-800">
              {Array.isArray(selectedItem) ? "移動履歴（密集エリア）" : selectedItem.暦家}
            </h2>
            <button onClick={() => setSelectedItem(null)}><X className="text-stone-400" /></button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {(Array.isArray(selectedItem) ? selectedItem : [selectedItem]).map((item, idx) => (
              <div key={idx} className="bg-stone-50 p-4 rounded-2xl flex items-center justify-between group/list-item">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#b28c6e] text-xs">📍</div>
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold">{item.開始時間} - {item.終了時間}</p>
                    <p className="font-bold text-stone-700">{item.場所}</p>
                  </div>
                </div>
                <a href={item.URL} target="_blank" className="p-2 bg-[#b28c6e]/10 text-[#b28c6e] rounded-xl opacity-0 group-hover/list-item:opacity-100 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
