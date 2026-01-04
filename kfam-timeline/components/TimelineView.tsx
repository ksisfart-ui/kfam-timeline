"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ChevronDown, ChevronRight, MapPin, X, ExternalLink, Layers } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"member" | "location">("member");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // 修正：単体(ArchiveData | null)から配列(ArchiveData[] | null)に変更
  const [selectedItems, setSelectedItems] = useState<ArchiveData[] | null>(null);

  const timeLabels = getTimeLabels(data[0]?.シーズン || "Season2");
  const groupKeys = Array.from(new Set(data.map(d => viewMode === "member" ? d.暦家 : d.場所)));

  // 1. 視覚的な重なりを判定してグループ化する関数
  const handleItemClick = (targetItem: ArchiveData, scopeItems: ArchiveData[]) => {
    // ヘルパー：アイテムの視覚的な開始・終了位置（％）を取得
    const getVisualBounds = (item: ArchiveData) => {
      const s = getPosition(item.開始時間, item.シーズン);
      const e = getPosition(item.終了時間, item.シーズン);
      const visualWidth = Math.max(e - s, 1.2); // 最小幅1.2を考慮
      return { start: s, end: s + visualWidth };
    };

    let cluster: ArchiveData[] = [targetItem];
    let added = true;

    // 2. 視覚的に接触しているバーをすべて抽出（連鎖判定）
    while (added) {
      added = false;
      const currentBounds = cluster.map(getVisualBounds);

      scopeItems.forEach(item => {
        if (!cluster.find(c => c === item)) {
          const itemBounds = getVisualBounds(item);
          // 既存のクラスター内のいずれかのバーと「見た目」が重なっているか
          const isOverlappingVisually = currentBounds.some(cb => 
            itemBounds.start <= cb.end && itemBounds.end >= cb.start
          );

          if (isOverlappingVisually) {
            cluster.push(item);
            added = true;
          }
        }
      });
    }

    // 時間順に並び替えて詳細カードに表示
    setSelectedItems(cluster.sort((a, b) => a.開始時間.localeCompare(b.開始時間)));
  };

  const toggleRow = (key: string) => {
    const next = new Set(expandedRows);
    if (next.has(key)) next.delete(key); else next.add(key);
    setExpandedRows(next);
  };

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
      {/* 操作パネル（既存通り） */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200 flex flex-col gap-4 sticky top-4 z-40">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
            <div className="flex bg-stone-100 p-1 rounded-xl">
              <button onClick={() => setViewMode("member")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>姉妹軸</button>
              <button onClick={() => setViewMode("location")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-400 hover:text-stone-600"}`}>場所軸</button>
            </div>
            <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomOut className="w-4 h-4 text-stone-600" /></button>
              <span className="text-[10px] font-bold w-10 text-center text-stone-600">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomIn className="w-4 h-4 text-stone-600" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <div style={{ width: `${zoom * 100}%`, minWidth: '1000px' }} className="relative transition-all duration-300">
            <div className="absolute inset-0 flex pointer-events-none z-0">
              {timeLabels.map((_, i) => (
                <div key={i} className="flex-grow border-l border-stone-200/40 first:border-l-0" />
              ))}
            </div>
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

              // --- 場所軸のレンダリング ---
              if (viewMode === "location") {
                const membersAtLocation = Array.from(new Set(items.map(d => d.暦家)));
                return (
                  <div key={key} className="mb-3 px-4 relative z-10">
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                      <button onClick={() => toggleRow(key)} className="w-full flex items-center justify-between p-5 hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: '#b28c6e' }} />
                          <span className="text-base font-bold text-stone-700">{key}</span>
                          <span className="text-xs text-stone-400 font-normal">{membersAtLocation.length}名が滞在</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-stone-300" /> : <ChevronRight className="w-5 h-5 text-stone-300" />}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-stone-50 bg-stone-50/20 relative">
                          {membersAtLocation.map((mName) => {
                            const memberItems = items.filter(d => d.暦家 === mName);
                            const memberLanes = getLanes(memberItems);
                            return (
                              <div key={mName} className="flex border-b border-stone-50 last:border-b-0 items-stretch relative">
                                <TimeGrid />
                                <div className="w-32 flex-shrink-0 px-4 py-3 flex items-center border-r border-stone-100 bg-white/50 sticky left-0 z-10">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[mName] || '#ccc' }} />
                                    <span className="text-[11px] font-bold text-stone-600 truncate">{mName}</span>
                                  </div>
                                </div>
                                <div className="flex-grow relative" style={{ height: `${Math.max(memberLanes.length * 44 + 12, 56)}px` }}>
                                  {memberLanes.map((lane, lIdx) => 
                                    lane.map((item, i) => {
                                      const start = getPosition(item.開始時間, item.シーズン);
                                      const end = getPosition(item.終了時間, item.シーズン);
                                      return (
                                        <div
                                          key={`${lIdx}-${i}`}
                                          className="absolute h-9 rounded-md shadow-sm border border-black/5 cursor-pointer flex items-center px-2 text-[9px] font-bold text-white transition-all hover:scale-[1.02] z-20"
                                          style={{ left: `${start}%`, width: `${Math.max(end - start, 1.2)}%`, top: `${lIdx * 44 + 6}px`, backgroundColor: MEMBER_COLORS[item.暦家] || '#666' }}
                                          // 修正：同じメンバーの重複アイテムを抽出
                                          onClick={() => handleItemClick(item, memberItems)}
                                        >
                                          {Math.max(end - start, 1.2) > 3 && <span className="truncate">{mName}</span>}
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

              // --- 姉妹軸のレンダリング ---
              return (
                <div key={key} className="flex border-b border-stone-100 items-stretch hover:bg-stone-50/20 transition-colors relative">
                  <TimeGrid />
                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-stone-200 sticky left-0 z-10 bg-white">
                    <div className="text-sm font-bold text-stone-700 flex items-center gap-2">
                      <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[key] || '#ccc' }} />
                      <span className="truncate">{key}</span>
                    </div>
                  </div>
                  
                  {/* 高さ固定（64px）、lanesを使わず直接itemsを表示 */}
                  <div className="flex-grow relative h-16">
                    {items.map((item, i) => {
                      const start = getPosition(item.開始時間, item.シーズン);
                      const end = getPosition(item.終了時間, item.シーズン);
                      const visualWidth = Math.max(end - start, 1.2);
                      const colors = getLocationColor(item);

                      return (
                        <div
                          key={i}
                          className="absolute h-10 rounded-lg text-[10px] flex items-center px-2 shadow-sm border border-black/5 cursor-pointer transition-all hover:scale-[1.02] z-20"
                          style={{
                            left: `${start}%`,
                            width: `${visualWidth}%`,
                            top: `12px`, // 常に1段目に配置
                            backgroundColor: colors.bg,
                            borderLeft: `5px solid ${colors.border}`, // 追加：左端のアクセント
                            color: colors.text,
                            opacity: 1, // 重なりが見えるよう少し透過
                          }}
                          onClick={() => handleItemClick(item, items)}
                        >
                          {/* クリック領域拡張用の透明な擬似要素（左右に4pxずつ判定を広げる） */}
                          <div className="absolute inset-y-0 -left-1 -right-1 z-30" />

                          {visualWidth > 4 && <span className="truncate font-bold relative z-10">{item.場所}</span>}
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

      {/* 詳細カード：複数対応版 */}
      {selectedItems && selectedItems.length > 0 && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedItems(null)}>
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            
            {/* モーダルヘッダー */}
            <div className="p-6 pb-2 flex justify-between items-center border-b border-stone-50">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-bold text-stone-500 uppercase tracking-widest">{selectedItems.length}件の履歴</span>
              </div>
              <button onClick={() => setSelectedItems(null)} className="p-2 bg-stone-50 rounded-full"><X className="w-5 h-5 text-stone-400" /></button>
            </div>

            {/* リストエリア（スクロール可能） */}
            <div className="overflow-y-auto p-6 pt-2 space-y-10 pb-10">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* 区切り線（2番目以降） */}
                  {idx !== 0 && <div className="absolute -top-5 left-0 right-0 border-t border-stone-100" />}
                  
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-stone-800 tracking-tight">{item.暦家}</h2>
                  </div>
                  
                  <div className="space-y-4 mb-6 text-stone-700">
                    <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#b28c6e] flex-shrink-0"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase">場所</p>
                        <p className="font-bold">{item.場所}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-stone-400 text-lg flex-shrink-0">🕒</div>
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase">時間</p>
                        <p className="font-bold font-mono text-lg">{item.開始時間} 〜 {item.終了時間}</p>
                      </div>
                    </div>
                  </div>
                  
                  <a href={item.URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-[#b28c6e] text-white rounded-2xl font-bold text-sm shadow-xl shadow-[#b28c6e]/30 transition-transform active:scale-95">
                    視聴ページへ移動 <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}