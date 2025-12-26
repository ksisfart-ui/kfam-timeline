export default function Loading() {
  const messages = [
    "姉妹の活動記録を読み込んでいます...",
    "姉妹の足跡を復元中...",
    "保管庫より該当資料の持ち出し中...",
    "衛星の記録を同期中...",
    "観測ログにアクセスしています..."
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8]">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-[#b28c6e] rounded-full animate-spin mb-4" />
      <p className="text-stone-400 font-bold text-xs tracking-widest">{msg}</p>
    </div>
  );
}
