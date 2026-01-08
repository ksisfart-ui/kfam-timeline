"use client";
import React, { useState, useEffect } from 'react';
import { fetchArchiveData } from "@/lib/dataFetcher";
import { groupDatesByMonth } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

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
    <main className="min-h-screen bg-background p-10 transition-colors duration-300">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <Link 
            href="/" 
            className="text-muted text-[10px] font-bold tracking-[0.2em] hover:text-accent transition-colors flex items-center gap-1 mb-6 uppercase"
          >
            <ChevronLeft className="w-3 h-3" /> Back to Home
          </Link>
          <div className="space-y-2">
            <p className="text-accent text-[10px] font-bold tracking-[0.4em] uppercase pl-1">
              History / Archive Collections
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-main tracking-tight leading-none">
              過去の記録一覧
            </h1>
          </div>
        </div>

        {/* モード切替ボタン */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>

        {/* 月別フィルター */}
        <div className="flex gap-2 overflow-x-auto pb-8 no-scrollbar">
          {months.map(month => (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedMonth === month ? "bg-btn-primary-bg text-btn-primary-text shadow-lg" : "bg-card text-muted border border-card-border hover:border-accent/30"}`}
            >
              {month}
            </button>
          ))}
        </div>

        {Object.entries(groupedDates)
          .filter(([month]) => selectedMonth === "すべて" || month === selectedMonth)
          .map(([month, dates]) => (
          <div key={month} className="mb-12">
            <h2 className="text-sm font-black text-accent mb-6 tracking-[0.2em]">{month}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dates.map(date => (
                <Link key={date} href={`/archive/${date.replaceAll("/", "-")}`} className="group p-8 bg-card rounded-[2rem] border border-card-border hover:border-accent transition-all hover:shadow-xl flex justify-between items-center">
                  <span className="text-2xl font-bold text-main group-hover:text-accent transition-colors tracking-tighter">{date}</span>
                  <ArrowRight className="w-6 h-6 rounded-full bg-background flex items-center justify-center group-hover:bg-accent-soft group-hover:text-accent text-mute transition-all text-xl" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      {/* フッター */}
        <footer className="py-20 text-center">
          <p className="text-[10px] text-muted font-black tracking-[0.5em] uppercase">Unofficial Timeline</p>
        </footer>
    </main>
  );
}
