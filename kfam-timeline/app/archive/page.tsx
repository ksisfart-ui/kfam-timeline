"use client";
import React, { useState, useEffect } from 'react';
import { fetchArchiveData } from "@/lib/dataFetcher";
import { groupDatesByMonth } from "@/lib/utils";
import Link from "next/link";

export default function ArchivePage() {
  const [data, setData] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("すべて");

  useEffect(() => {
    fetchArchiveData(process.env.NEXT_PUBLIC_SHEET_URL || "").then(res => {
      const dates = Array.from(new Set(res.map((d: any) => d.日付))).sort().reverse();
      setData(dates as string[]);
    });
  }, []);

  const groupedDates = groupDatesByMonth(data);
  const months = ["すべて", ...Object.keys(groupedDates)];

  return (
    <main className="min-h-screen bg-[#fcfaf8] p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <Link href="/" className="text-stone-400 text-[10px] font-black tracking-[0.2em] hover:text-[#b28c6e] transition-colors flex items-center gap-1 mb-8 uppercase">
            ← Back to Home
          </Link>
          <div className="space-y-3">
            <p className="text-[#b28c6e] text-[10px] font-black tracking-[0.4em] uppercase pl-1">
              History / Archive Collections
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-stone-800 tracking-tighter leading-none">
              活動の軌跡
            </h1>
          </div>
        </div>

        {/* 月別フィルター */}
        <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar">
          {months.map(month => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedMonth === month ? "bg-stone-800 text-white shadow-lg" : "bg-white text-stone-400 border border-stone-100"}`}
            >
              {month}
            </button>
          ))}
        </div>

        {Object.entries(groupedDates)
          .filter(([month]) => selectedMonth === "すべて" || month === selectedMonth)
          .map(([month, dates]) => (
          <div key={month} className="mb-12">
            <h2 className="text-sm font-black text-[#b28c6e] mb-6 tracking-[0.2em]">{month}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dates.map(date => (
                <Link key={date} href={`/archive/${date.replaceAll("/", "-")}`} className="group p-8 bg-white rounded-[2rem] border border-stone-100 hover:border-[#b28c6e] transition-all hover:shadow-xl flex justify-between items-center">
                  <span className="text-2xl font-bold text-stone-700 group-hover:text-[#b28c6e] transition-colors tracking-tighter">{date}</span>
                  <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center group-hover:bg-[#b28c6e]/10 group-hover:text-[#b28c6e] text-stone-200 transition-all text-xl">→</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* フッター */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-stone-300 font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
    </main>
  );
}
