// app/your-directory/loading.tsx
import { LOADING_MESSAGES } from "@/lib/constants";

export default function Loading() {
  // サーバー側でレンダリングされる際、ランダムに1つ選択
  const randomMessage = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* ローディングアニメーション（任意） */}
        <div className="animate-spin h-8 w-8 border-4 border-accent border-t-transparent rounded-full mx-auto" />
        
        <p className="text-sub font-bold text-sm tracking-widest animate-pulse">
          {randomMessage}
        </p>
      </div>
    </div>
  );
}
