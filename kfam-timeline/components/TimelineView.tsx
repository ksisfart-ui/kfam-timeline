"use client";
import React, { useState } from 'react';
import { ArchiveData } from "@/types";
import { getPosition, getTimeLabels } from "@/lib/timeUtils";
import { getLocationColor, MEMBER_COLORS, LOCATION_READING_MAP } from "@/lib/utils";
import { Search, ZoomIn, ZoomOut, ChevronDown, ChevronUp, MapPin, Youtube, ExternalLink } from "lucide-react";

export default function TimelineView({ data }: { data: ArchiveData[] }) {
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"member" | "location">("member");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

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
      {/* 操作パネル：配色を修正して背景との同化を防ぐ */}
      <div className="bg-white p-5 rounded-[2rem] shadow-md border border-stone-200 sticky top-4 z-40 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 検索バー：枠線を強調 */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              placeholder="名前・場所・ひらがな検索"
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#b28c6e]/20"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* 軸切り替え */}
            <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button onClick={() => setViewMode("member")} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${viewMode === "member" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"}`}>姉妹軸</button>
              <button onClick={() => setViewMode("location")} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${viewMode === "location" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500"}`}>場所軸</button>
            </div>

            {/* ズーム機能：PCのみ表示、またはスマホでも動作するように修正 */}
            <div className="hidden sm:flex items-center bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-stone-800">
              <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-[10px] font-black w-12 text-center text-stone-600">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 hover:bg-white rounded-lg transition-all"><ZoomIn className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* アコーディオンリスト */}
      <div className="space-y-3">
        {groupKeys.map((key) => {
          const items = data.filter(d => {
            const isTarget = (viewMode === "member" ? d.暦家 : d.場所) === key;
            const readings = LOCATION_READING_MAP[d.場所] || [];
            return isTarget && (d.暦家.includes(query) || d.場所.includes(query) || readings.some(r => r.includes(query)));
          });
          if (items.length === 0) return null;

          const isExpanded = expandedRows.has(key);
          const lanes = getLanes(items);
          const color = viewMode === "member" ? (MEMBER_COLORS[key] || '#ccc') : '#b28c6e';

          return (
            <div key={key} className="bg-white rounded-[1.5rem] border border-stone-200 shadow-sm overflow-hidden transition-all duration-300">
              {/* アコーディオンヘッダー：画像イメージ通り */}
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-stone-50 transition-colors"
                onClick={() => toggleRow(key)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-base font-black text-stone-800 tracking-tighter">{key}</span>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-stone-300" /> : <ChevronDown className="w-5 h-5 text-stone-300" />}
              </div>

              {/* 展開コンテンツ */}
              {isExpanded && (
                <div className="border-t border-stone-100 p-6 bg-white animate-in slide-in-from-top duration-300">
                  {/* 詳細情報表示エリア：画像の内容を模倣 */}
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-2">
                       <span className="text-[11px] font-bold text-stone-400">{items[0].日付}</span>
                       <span className="px-2 py-0.5 bg-stone-100 text-stone-500 text-[10px] font-bold rounded uppercase">Season {items[0].シーズン === "Season1" ? "1" : "2"}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-stone-800 tracking-tighter">
                        {viewMode === "member" ? "タイムライン詳細" : `${key} 滞在履歴`}
                      </h3>
                      <p className="text-xs text-stone-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {viewMode === "member" ? "複数箇所の滞在を記録" : "暦家メンバーの活動"}
                      </p>
                    </div>
                  </div>

                  {/* タイムライン：横スクロール対応を強化 */}
                  <div className="relative bg-stone-50 rounded-2xl border border-stone-100 overflow-x-auto custom-scrollbar">
                    <div style={{ width: `${zoom * 100}%`, minWidth: '800px' }} className="pb-4 transition-all duration-300">
                      {/* 時間目盛り */}
                      <div className="flex border-b border-stone-200/50 bg-stone-100/30">
                        {timeLabels.map((label, i) => (
                          <div key={i} className="flex-grow text-[9px] font-bold text-stone-300 py-3 border-l border-stone-200/20 text-center font-mono tracking-tighter">{label}</div>
                        ))}
                      </div>

                      {/* バー表示エリア */}
                      <div className="relative pt-6 px-2" style={{ height: `${lanes.length * 40 + 20}px` }}>
                        {lanes.map((lane, lIdx) =>
                          lane.map((item, i) => {
                            const start = getPosition(item.開始時間, item.シーズン);
                            const end = getPosition(item.終了時間, item.シーズン);
                            const barBg = viewMode === "member" ? getLocationColor(item) : (MEMBER_COLORS[item.暦家] || '#666');

                            return (
                              <a
                                key={`${lIdx}-${i}`}
                                href={item.URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute h-8 rounded-lg shadow-sm border border-white/40 flex items-center px-3 text-[10px] font-bold transition-all hover:scale-[1.02] hover:shadow-md z-10 group overflow-hidden"
                                style={{
                                  left: `${start}%`, width: `${Math.max(end - start, 1.5)}%`,
                                  top: `${lIdx * 40 + 6}px`,
                                  backgroundColor: barBg,
                                  color: viewMode === "location" ? '#fff' : '#1c1917'
                                }}
                              >
                                <span className="truncate">{viewMode === "member" ? item.場所 : item.暦家}</span>

                                {/* YouTubeボタン風のアイコン（ホバー時） */}
                                <div className="absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Youtube className="w-3.5 h-3.5" />
                                </div>
                              </a>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* YouTubeボタン：画像イメージ */}
                  <div className="mt-6 flex justify-end">
                    <a
                      href={items[0].URL}
                      target="_blank"
                      className="bg-[#1c1926] text-white px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-black transition-colors"
                    >
                      <Youtube className="w-4 h-4" /> YouTubeで見る
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
