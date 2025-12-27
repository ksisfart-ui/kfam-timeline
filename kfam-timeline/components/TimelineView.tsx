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

  // 目盛り線（グリッド）を表示する共通パーツ
  const TimeGrid = () => (
    <div className="absolute inset-0 flex pointer-events-none z-0">
      {timeLabels.map((_, i) => (
        <div key={i} className="flex-grow border-l border-stone-300 first:border-l-0" />
      ))}
    </div>
  );

  const getLanes = (items: ArchiveData[]) => {
    const sorted = [...items].sort((a, b) => a.開始時間.localeCompare(b.開始時間));
    const lanes: ArchiveData[][] = [];
    
    // 表示上の最小幅（%単位）。UI側の Math.max(..., 1.2) と合わせる
    const MIN_WIDTH = 1.2; 

    sorted.forEach(item => {
      let placed = false;
      
      // このアイテムの表示上の開始位置と終了位置を計算
      const startPos = getPosition(item.開始時間, item.シーズン);
      const actualEndPos = getPosition(item.終了時間, item.シーズン);
      // UIと同じく、最低でも MIN_WIDTH 分の幅を確保した「計算上の終了位置」
      const visualEndPos = Math.max(actualEndPos, startPos + MIN_WIDTH);

      for (let i = 0; i < lanes.length; i++) {
        const lastItem = lanes[i][lanes[i].length - 1];
        const lastStartPos = getPosition(lastItem.開始時間, lastItem.シーズン);
        const lastActualEndPos = getPosition(lastItem.終了時間, lastItem.シーズン);
        // 前のアイテムの「表示上の終了位置」
        const lastVisualEndPos = Math.max(lastActualEndPos, lastStartPos + MIN_WIDTH);

        // 前のアイテムの「表示上の終わり」よりも、今のアイテムの「開始」が後ろなら同じ段に入れる
        // 少し（0.1%ほど）余裕を持たせるとより綺麗に見えます
        if (startPos >= lastVisualEndPos + 0.1) {
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
            {/* 背景の縦目盛り線（ここを追加） */}
            <div className="absolute inset-0 flex pointer-events-none z-0">
              {timeLabels.map((_, i) => (
                <div key={i} className="flex-grow border-l border-stone-200/40 first:border-l-0" />
              ))}
            </div>
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
                const membersAtLocation = Array.from(new Set(items.map(d => d.暦家)));
  
                return (
                  <div key={key} className="mb-3 px-4 relative z-10">
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                      {/* アコーディオンヘッダー（既存イメージ維持） */}
                      <button 
                        onClick={() => toggleRow(key)}
                        className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#b28c6e' }} />
                          <span className="text-base font-bold text-stone-700">{key}</span>
                          <span className="text-xs text-stone-400 font-normal">{membersAtLocation.length}名が滞在</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-stone-300" /> : <ChevronRight className="w-5 h-5 text-stone-300" />}
                      </button>

                      {/* 展開時：メンバーごとに姉妹軸と同じデザインで並べる */}
                      {isExpanded && (
                        <div className="border-t border-stone-50 bg-stone-50/20 relative">
                          {membersAtLocation.map((mName) => {
                            const memberItems = items.filter(d => d.暦家 === mName);
                            const memberLanes = getLanes(memberItems);
                            
                            return (
                              <div key={mName} className="flex border-b border-stone-50 last:border-b-0 items-stretch relative">
                                {/* 場所軸の展開内にも縦線を追加 */}
                                <TimeGrid />

                                <div className="w-32 flex-shrink-0 px-4 py-3 flex items-center border-r border-stone-100 bg-white/50 sticky left-0 z-10">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[mName] || '#ccc' }} />
                                    <span className="text-[11px] font-bold text-stone-600 truncate">{mName}</span>
                                  </div>
                                </div>
                                
                                {/* 移動が重なった場合はmemberLanesの数だけ高さを出す */}
                                <div 
                                  className="flex-grow relative" 
                                  style={{ height: `${Math.max(memberLanes.length * 44 + 12, 56)}px` }}
                                >
                                  {memberLanes.map((lane, lIdx) => 
                                    lane.map((item, i) => {
                                      const start = getPosition(item.開始時間, item.シーズン);
                                      const end = getPosition(item.終了時間, item.シーズン);
                                      const barWidth = Math.max(end - start, 1.2);

                                      return (
                                        <div
                                          key={`${lIdx}-${i}`}
                                          className="absolute h-9 rounded-md shadow-sm border border-black/5 cursor-pointer flex items-center px-2 text-[9px] font-bold text-white transition-all hover:scale-[1.02] z-20"
                                          style={{ 
                                            left: `${start}%`, 
                                            width: `${barWidth}%`, 
                                            top: `${lIdx * 44 + 6}px`,
                                            backgroundColor: MEMBER_COLORS[item.暦家] || '#666'
                                          }}
                                          onClick={() => setSelectedItem(item)}
                                        >
                                          {barWidth > 3 && <span className="truncate">{mName}</span>}
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // 姉妹軸（viewMode === "member"）のレンダリング部分
              return (
                <div key={key} className="flex border-b border-stone-100 items-stretch hover:bg-stone-50/20 transition-colors relative">
                  {/* 背景の縦線（追加：色を濃く） */}
                  <TimeGrid />

                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white">
                    <div className="text-sm font-bold text-stone-700 flex items-center gap-2">
                      <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[key] || '#ccc' }} />
                      <span className="truncate">{key}</span>
                    </div>
                  </div>
                  
                  {/* getLanesを使用して重なりを縦に積む */}
                  <div className="flex-grow relative min-h-[80px]" style={{ height: `${Math.max(lanes.length * 48 + 16, 80)}px` }}>
                    {lanes.map((lane, lIdx) => 
                      lane.map((item, i) => {
                        const start = getPosition(item.開始時間, item.シーズン);
                        const end = getPosition(item.終了時間, item.シーズン);
                        const barWidth = Math.max(end - start, 1.2);
                        return (
                          <div
                            key={`${lIdx}-${i}`}
                            className="absolute h-10 rounded-lg text-[10px] flex items-center px-2 shadow-sm border border-black/5 cursor-pointer transition-all hover:scale-[1.02] z-20"
                            style={{
                              left: `${start}%`,
                              width: `${barWidth}%`,
                              top: `${lIdx * 48 + 12}px`,
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
