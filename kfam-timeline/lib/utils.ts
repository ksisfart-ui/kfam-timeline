// 場所名からハッシュ値を生成して色を決定する
export function getLocationColor(location: string): string {
  // 特定の主要な場所には固定色を割り当て（お好みで調整可能）
  const fixedColors: Record<string, string> = {
    "病院": "#fecaca", // red-200
    "警察": "#bfdbfe", // blue-200
    "アパート": "#fef08a", // yellow-200
    "自宅": "#e9d5ff", // purple-200
  };

  if (fixedColors[location]) return fixedColors[location];

  // それ以外は名前からランダムに近いが固定の色を生成
  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = location.charCodeAt(i) + ((hash << 5) - hash);
  }
  // パステルカラーに調整
  return `hsl(${hash % 360}, 70%, 85%)`;
}
