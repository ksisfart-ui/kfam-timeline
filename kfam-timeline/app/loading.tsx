import React from 'react';

export default function Loading() {
  const messages = [
    "姉妹の活動記録を読み込んでいます...",
    "姉妹の足跡を復元中...",
    "保管庫より該当資料の持ち出し中...",
    "衛星の記録を同期中...",
    "観測ログにアクセスしています..."
  ];
// サーバーサイドでも動作するよう、表示用の簡易実装
  const msg = messages[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8]">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-[#b28c6e] rounded-full animate-spin mb-6" />
      <p className="text-stone-500 font-bold text-sm tracking-widest">{msg}</p>
    </div>
  );
}
