export default async function ArchivePage() {
  const allData = await fetchArchiveData(process.env.NEXT_PUBLIC_SHEET_URL || "");
  const dateList = Array.from(new Set(allData.map(d => d.日付))).sort().reverse();

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-black text-stone-800 mb-8 tracking-tight">Archives</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dateList.map(date => (
          <Link key={date} href={`/archive/${date.replaceAll("/", "-")}`} className="group p-6 bg-white rounded-2xl border border-stone-100 hover:border-[#b28c6e] shadow-sm transition-all">
            <div className="text-stone-400 text-xs font-bold mb-1">Activity Log</div>
            <div className="text-xl font-bold text-stone-700 group-hover:text-[#b28c6e] transition-colors">{date}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
