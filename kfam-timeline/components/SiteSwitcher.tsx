// components/SiteSwitcher.tsx
"use client";

import { Home, MessageCircleMore, SquareLibrary, CalendarDays } from "lucide-react";

const sites = [
  { name: '観測記録', url: 'https://kfam-portal.vercel.app/', icon: Home },
  { name: 'DM履歴', url: 'https://kfam-chat.vercel.app/', icon: MessageCircleMore },
  { name: '住民アーカイブ', url: 'https://kfam-archive-search.vercel.app/', icon: SquareLibrary },
  { name: 'タイムライン', url: 'https://kfam-timeline.vercel.app/', icon: CalendarDays },
];

export default function SiteSwitcher() {
  return (
    // z-index を高めに設定し、ページ最下部に固定
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-card/80 dark:bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-card-border shadow-2xl">
        {sites.map((site) => {
          const Icon = site.icon;
          return (
            <a
              key={site.url}
              href={site.url}
              className="group flex flex-col items-center justify-center w-14 h-12 rounded-xl hover:bg-accent/10 transition-all duration-300"
              title={site.name}
            >
              <Icon className="w-5 h-5 text-sub group-hover:text-accent transition-colors" />
              <span className="text-[8px] font-bold text-muted group-hover:text-accent mt-0.5 uppercase tracking-tighter">
                {site.name}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}