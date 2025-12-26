// 場所名から一意のパステルカラーを生成
export function getLocationColor(location: string): string {
  const fixedColors: Record<string, string> = {
    "病院": "#fecaca", // red-100
    "警察": "#bfdbfe", // blue-100
    "飲食店": "#fef08a", // yellow-100
    "自宅": "#e9d5ff", // purple-100
  };

  if (fixedColors[location]) return fixedColors[location];

  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = location.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 70%, 85%)`;
}

// メンバーカラー定義
export const MEMBER_COLORS: Record<string, string> = {
  "暦家": "#b28c6e", "にこ": "#e7609e", "いん": "#113c70", "ゆうみ": "#2ca9e1",
  "しんあ": "#2e8b57", "あずみ": "#7ebea5", "ひるの": "#000b00", "みう": "#afafb0",
  "あやの": "#b7282e", "ゆん": "#b44c97", "いのん": "#f08300",
};
