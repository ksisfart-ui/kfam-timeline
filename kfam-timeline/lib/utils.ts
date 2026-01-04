import { getPosition } from "./timeUtils";
import { ArchiveData } from "@/types";

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
  "海上レストラン": ["かいじょうれすとらん", "うらしま", "urashima", "Urashima"],
  "FOWK": ["ふぉーく", "fowk"],
  "教習所": ["きょうしゅうじょ", "めんきょ"],
  "病院": ["びょういん"],
};

export function getLocationColor(item: any): { bg: string; border: string; text: string } {
  const text = item.場所 || "";
  if (!text) return { bg: "#f8f9fa", border: "#dee2e6", text: "#495057" };

  // 和モダンパレット（背景用の淡い色 ＋ アクセント用の濃い色）
  const palette = [
    { name: "灰桜", bg: "#f4e0e0", border: "#d9a0a0" },
    { name: "瓶覗", bg: "#e0f0f4", border: "#9ec5cf" },
    { name: "白緑", bg: "#e0f4e4", border: "#a0cfab" },
    { name: "藤鼠", bg: "#e9e0f4", border: "#b2a0cf" },
    { name: "練色", bg: "#f4f0e0", border: "#cfc5a0" },
    { name: "水浅葱", bg: "#e0f4ef", border: "#a0cfc2" },
    { name: "薄柿", bg: "#f4e7e0", border: "#cfada0" },
    { name: "青磁色", bg: "#e7f4f0", border: "#a0cfc5" },
    { name: "淡萌黄", bg: "#f0f4e0", border: "#bccf12" }, // 少し明度調整
    { name: "薄群青", bg: "#e0e7f4", border: "#a0b2cf" },
    { name: "灰紅梅", bg: "#f4e0e9", border: "#cfa0b7" },
    { name: "千草色", bg: "#e0f4f4", border: "#a0cfcf" },
  ];

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % palette.length;
  const color = palette[index];

  return {
    bg: color.bg,
    border: color.border,
    text: "#2d3436" // 文字色は共通の濃いグレーで視認性確保
  };
}

  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}

// 4. アーカイブの年月グループ化
export function groupDatesByMonth(dates: string[]) {
  return dates.reduce((acc, date) => {
    const [year, month] = date.split("/");
    const key = `${year}年 ${month}月`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(date);
    return acc;
  }, {} as Record<string, string[]>);
}

// 密集しているアイテムをグループ化するロジック（簡易版）
export function clusterItems(items: ArchiveData[]) {
  const clusters: (ArchiveData | ArchiveData[])[] = [];
  let currentCluster: ArchiveData[] = [];

  const sorted = [...items].sort((a, b) => a.開始時間.localeCompare(b.開始時間));

  sorted.forEach((item, idx) => {
    const next = sorted[idx + 1];
    // 滞在時間が10分未満、かつ次の移動まで5分以内なら「密集」とみなす
    const isDense = next && (getPosition(next.開始時間, item.シーズン) - getPosition(item.終了時間, item.シーズン) < 2);

    if (isDense || currentCluster.length > 0) {
      currentCluster.push(item);
      // 次が密集していない、あるいは最後のアイテムならクラスター確定
      if (!isDense) {
        clusters.push([...currentCluster]);
        currentCluster = [];
      }
    } else {
      clusters.push(item);
    }
  });
  return clusters;
}
