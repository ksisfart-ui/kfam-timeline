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
  "海上レストラン": ["海上レストラン", "うらしま", "urashima", "Urashima"],
  "FOWK": ["ふぉーく", "fowk"],
  "教習所": ["きょうしゅうじょ", "めんきょ"],
  "病院": ["びょういん"],
};

export function getLocationColor(item: any): string {
  const text = item.場所 || "";
  if (!text) return "#f0f0f0"; // デフォルト色

  // 和のパレット（くすみパステル）
  const palette = [
    "#e2e8f0", // 灰青 (Ash Blue)
    "#d1d8e0", // 鼠色
    "#e9d8d6", // 灰桜 (Dusty Rose)
    "#d8e4d8", // 白緑 (Pale Green)
    "#e5e1d5", // 鳥の子色 (Beige)
    "#d9e3f1", // 水色
    "#e8dff5", // 藤色
    "#fce1e4", // 桃花色
    "#fcf4dd", // 象牙色
  ];

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
