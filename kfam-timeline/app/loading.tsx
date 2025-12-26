export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8]">
      <div className="w-12 h-12 border-4 border-[#b28c6e]/20 border-t-[#b28c6e] rounded-full animate-spin mb-4" />
      <p className="text-stone-400 font-bold text-sm animate-pulse tracking-widest uppercase">
        Loading Timeline...
      </p>
    </div>
  );
}
