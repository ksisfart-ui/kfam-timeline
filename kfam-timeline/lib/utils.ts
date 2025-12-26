// 場所名から一意のパステルカラーを生成
export const CATEGORY_COLORS: Record<string, string> = {
  "警察": "#8ebaff",
  "医療": "#ff9ea0",
  "メカニック": "#a3e635",
  "飲食店": "#ffe45e",
  "自宅": "#e2e8f0",
  "住民の家": "#f87171",
};

export function getLocationColor(item: any): string {
  if (CATEGORY_COLORS[item.カテゴリ]) return CATEGORY_COLORS[item.カテゴリ];

  let hash = 0;
  for (let i = 0; i < item.場所.length; i++) {
    hash = item.場所.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 60%, 80%)`;
}

// メンバーカラー定義
export const MEMBER_COLORS: Record<string, string> = {
  "暦家": "#b28c6e", "にこ": "#e7609e", "いん": "#113c70", "ゆうみ": "#2ca9e1",
  "しんあ": "#2e8b57", "あずみ": "#7ebea5", "ひるの": "#000b00", "みう": "#afafb0",
  "あやの": "#b7282e", "ゆん": "#b44c97", "いのん": "#f08300",
};

// 場所の読みがな辞書（必要に応じて追加してください）
export const LOCATION_READING_MAP: Record<string, string[]> = {
  "アパート": ["あぱーと", "いえ"],
  "自宅": ["じたく", "いえ"],
  "東署": ["ひがししょ", "けいさつ"],
  "本署": ["ほんしょ", "けいさつ"],
  "ボイラ宅": ["ぼいらたく"],
  "海上レストラン": ["海上レストラン", "うらしま", "urashima"],
  "FOWK": ["ふぉーく"],
  "教習所": ["きょうしゅうじょ", "めんきょ"],
  "病院": ["びょういん"],
};
