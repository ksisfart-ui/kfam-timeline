// 場所名から一意のパステルカラーを生成
export function getLocationColor(location: string): string {
  const fixedColors: Record<string, string> = {
    "病院": "#ff9ea0", "警察": "#8ebaff", "飲食店": "#ffe45e",
    "自宅": "#d1a3ff", "メカニック": "#a3e635"
  };

  if (fixedColors[location]) return fixedColors[location];

  let hash = 0;
  for (let i = 0; i < location.length; i++) {
    hash = location.charCodeAt(i) + ((hash << 5) - hash);
  }
  // 少し彩度を上げ、明度を調整して「ぼんやり」を解消
  return `hsl(${Math.abs(hash) % 360}, 65%, 75%)`;
}

// メンバーカラー定義
export const MEMBER_COLORS: Record<string, string> = {
  "暦家": "#b28c6e", "にこ": "#e7609e", "いん": "#113c70", "ゆうみ": "#2ca9e1",
  "しんあ": "#2e8b57", "あずみ": "#7ebea5", "ひるの": "#000b00", "みう": "#afafb0",
  "あやの": "#b7282e", "ゆん": "#b44c97", "いのん": "#f08300",
};

// 場所の読みがな辞書（必要に応じて追加してください）
export const LOCATION_READING_MAP: Record<string, string> = {
  "アパート": "あぱーと", "自宅": "じたく", "東署": "ひがししょ", "本署": "ほんしょ", "ボイラ宅": "ぼいらたく", "海上レストラン": "かいじょうれすとらん", "FOWK": "ふぉーく", "教習所": "きょうしゅうじょ", "病院": "びょういん"
};
