"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ChevronDown, ChevronRight, MapPin, X, ExternalLink, Layers, Clock } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"member" | "location">("member");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<ArchiveData[] | null>(null);

  const timeLabels = getTimeLabels(data[0]?.シーズン || "Season2");
  const groupKeys = Array.from(new Set(data.map(d => viewMode === "member" ? d.暦家 : d.場所)));

  const handleItemClick = (targetItem: ArchiveData, scopeItems: ArchiveData[]) => {
    const getVisualBounds = (item: ArchiveData) => {
      const s = getPosition(item.開始時間, item.シーズン);
      const e = getPosition(item.終了時間, item.シーズン);
      const visualWidth = Math.max(e - s, 1.2);
      return { start: s, end: s + visualWidth };
    };

    let cluster: ArchiveData[] = [targetItem];
    let added = true;

    while (added) {
      added = false;
      const currentBounds = cluster.map(getVisualBounds);
      scopeItems.forEach(item => {
        if (!cluster.find(c => c === item)) {
          const itemBounds = getVisualBounds(item);
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
        <div key={i} className="flex-grow border-l border-card-border/40 first:border-l-0" />
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
    <div className="space-y-4 pb-24 transition-colors duration-300">
      {/* 操作パネル */}
      <div className="bg-card p-4 rounded-2xl shadow-sm border border-card-border flex flex-col gap-4 sticky top-4 z-40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              placeholder="名前・場所・店名で検索"
              className="w-full pl-10 pr-4 py-3 bg-background border border-card-border rounded-xl text-sm text-main placeholder-muted focus:ring-2 focus:ring-accent/30 outline-none transition-all"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-background p-1 rounded-xl border border-card-border">
              <button onClick={() => setViewMode("member")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "member" ? "bg-card text-main shadow-sm" : "text-muted hover:text-sub"}`}>姉妹軸</button>
              <button onClick={() => setViewMode("location")} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "location" ? "bg-card text-main shadow-sm" : "text-muted hover:text-sub"}`}>場所軸</button>
            </div>
            <div className="flex items-center bg-background p-1 rounded-xl border border-card-border">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-card rounded-lg transition-all"><ZoomOut className="w-4 h-4 text-sub" /></button>
              <span className="text-[10px] font-bold w-10 text-center text-sub">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-card rounded-lg transition-all"><ZoomIn className="w-4 h-4 text-sub" /></button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-xl border border-card-border overflow-hidden">
        <div className="overflow-x-auto overflow-y-visible">
          <div style={{ width: `${zoom * 100}%`, minWidth: `${zoom * 1000}px` }} className="relative transition-all duration-300">
            <div className="absolute inset-0 flex pointer-events-none z-0">
              {timeLabels.map((_, i) => (
                <div key={i} className="flex-grow border-l border-card-border/30 first:border-l-0" />
              ))}
            </div>
            <div className="flex border-b border-card-border bg-background/50 sticky top-0 z-30">
              <div className="w-32 flex-shrink-0 border-r border-card-border p-4 text-[10px] font-bold text-muted sticky left-0 bg-background z-40 uppercase tracking-widest">名前/場所</div>
              <div className="flex-grow flex">
                {timeLabels.map((label, i) => (
                  <div key={i} className="flex-grow text-[10px] text-muted p-4 border-l border-card-border/20 text-center font-mono">{label}</div>
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

              if (viewMode === "location") {
                const membersAtLocation = Array.from(new Set(items.map(d => d.暦家)));
                return (
                  <div key={key} className="mb-3 px-4 relative z-10">
                    <div className="bg-card rounded-2xl border border-card-border shadow-sm overflow-hidden">
                      <button onClick={() => toggleRow(key)} className="w-full flex items-center justify-between p-5 hover:bg-background transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 rounded-full shadow-sm bg-accent" />
                          <span className="text-base font-bold text-main">{key}</span>
                          <span className="text-xs text-muted font-normal">{membersAtLocation.length}名が滞在</span>
                        </div>
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-muted" /> : <ChevronRight className="w-5 h-5 text-muted" />}
                      </button>
                      {isExpanded && (
                        <div className="border-t border-card-border bg-background/20 relative">
                          {membersAtLocation.map((mName) => {
                            const memberItems = items.filter(d => d.暦家 === mName);
                            const memberLanes = getLanes(memberItems);
                            return (
                              <div key={mName} className="flex border-b border-card-border last:border-b-0 items-stretch relative">
                                <TimeGrid />
                                <div className="w-32 flex-shrink-0 px-4 py-3 flex items-center border-r border-card-border bg-card sticky left-0 z-30">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[mName] || '#ccc' }} />
                                    <span className="text-[11px] font-bold text-sub truncate">{mName}</span>
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
                                          className="absolute h-9 rounded-md shadow-sm border border-black/10 cursor-pointer flex items-center px-2 text-[10px] font-bold text-white transition-all hover:scale-[1.02] z-20"
                                          style={{ left: `${start}%`, width: `${Math.max(end - start, 1.2)}%`, top: `${lIdx * 44 + 6}px`, backgroundColor: MEMBER_COLORS[item.暦家] || '#666' }}
                                          onClick={() => handleItemClick(item, memberItems)}
                                        >
                                          <span className="truncate w-full">{mName}</span>
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

              return (
                <div key={key} className="flex border-b border-card-border items-stretch hover:bg-background/20 transition-colors relative">
                  <TimeGrid />
                  <div className="w-32 flex-shrink-0 px-4 py-6 flex items-center border-r border-card-border sticky left-0 z-30 bg-card">
                    <div className="text-sm font-bold text-main flex items-center gap-2">
                      <div className="w-1.5 h-3 rounded-full" style={{ backgroundColor: MEMBER_COLORS[key] || '#ccc' }} />
                      <span className="truncate">{key}</span>
                    </div>
                  </div>
                  <div className="flex-grow relative h-16">
                    {items.map((item, i) => {
                      const start = getPosition(item.開始時間, item.シーズン);
                      const end = getPosition(item.終了時間, item.シーズン);
                      const visualWidth = Math.max(end - start, 1.2);
                      const colors = getLocationColor(item);
                      return (
                        <div
                          key={i}
                          className="absolute h-10 rounded-lg text-[10px] flex items-center px-2 shadow-sm border cursor-pointer transition-all hover:scale-[1.02] z-20"
                          style={{
                            left: `${start}%`,
                            width: `${visualWidth}%`,
                            top: `12px`,
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                            borderWidth: '1px',
                            borderLeftWidth: '3px',
                            color: colors.text,
                          }}
                          onClick={() => handleItemClick(item, items)}
                        >
                          <div className="absolute inset-y-0 -left-1 -right-1 z-30" />
                          <span className="truncate font-bold relative z-10 w-full">{item.場所}</span>
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

      {/* 詳細カード */}
      {selectedItems && selectedItems.length > 0 && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedItems(null)}>
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col border border-card-border" onClick={e => e.stopPropagation()}>
            <div className="p-6 pb-2 flex justify-between items-center border-b border-card-border">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-muted" />
                <span className="text-xs font-bold text-sub uppercase tracking-widest">{selectedItems.length}件の履歴</span>
              </div>
              <button onClick={() => setSelectedItems(null)} className="p-2 bg-background rounded-full hover:opacity-80 transition-all"><X className="w-5 h-5 text-muted" /></button>
            </div>
            <div className="overflow-y-auto p-6 pt-2 space-y-10 pb-10">
              {selectedItems.map((item, idx) => (
                <div key={idx} className="relative">
                  {idx !== 0 && <div className="absolute -top-5 left-0 right-0 border-t border-card-border" />}
                  {idx === 0 && (
                    <div className="mt-1 mb-3 text-center sm:text-left">
                      <h2 className="text-3xl font-bold text-main tracking-tight">{item.暦家}</h2>
                    </div>
                  )}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-card-border">
                      <div className="w-10 h-10 bg-card rounded-xl shadow-sm flex items-center justify-center text-accent flex-shrink-0 border border-card-border"><MapPin className="w-5 h-5" /></div>
                      <div>
                        <p className="text-[10px] text-muted font-bold uppercase">場所</p>
                        <p className="font-bold text-main">{item.場所}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-background p-4 rounded-2xl border border-card-border">
                      <Clock className="w-10 h-10 bg-card rounded-xl shadow-sm flex items-center justify-center text-muted text-lg flex-shrink-0 border border-card-border" />
                      <div>
                        <p className="text-[10px] text-muted font-bold uppercase">時間</p>
                        <p className="font-bold font-mono text-lg text-main">{item.開始時間} 〜 {item.終了時間}</p>
                      </div>
                    </div>
                  </div>
                  {item.URL ? (
                    <a href={item.URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 bg-btn-primary-bg text-btn-primary-text rounded-2xl font-bold text-sm shadow-xl shadow-card-border/20 transition-transform active:scale-95">
                      観測する <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-4 bg-background text-muted rounded-2xl font-bold text-sm border border-card-border cursor-not-allowed">
                      衛星データ未受信
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}