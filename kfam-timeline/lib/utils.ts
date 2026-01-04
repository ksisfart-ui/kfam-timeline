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

// カテゴリーごとの色定義（背景色、アクセント/ボーダー、文字色）
const CATEGORY_PALETTES: Record<string, { bg: string; border: string; text: string }[]> = {
  "警察": [
    { bg: "#e1e7f0", border: "#4a6a96", text: "#1a2a40" }, // 紺碧系
    { bg: "#d0d9e8", border: "#385170", text: "#101d2d" },
    { bg: "#ecf0f5", border: "#7a94b5", text: "#1a2a40" },
  ],
  "医療": [
    { bg: "#f5e6eb", border: "#b56c80", text: "#4a1d28" }, // 苺色系
    { bg: "#faeff2", border: "#d6a4b1", text: "#4a1d28" },
  ],
  "メカニック": [
    { bg: "#f5ece1", border: "#b58e6c", text: "#4a321d" }, // 琥珀系
    { bg: "#faf5ef", border: "#d6bc9f", text: "#4a321d" },
  ],
  "飲食店": [
    { bg: "#e6f0e9", border: "#6c967a", text: "#1d3323" }, // 若草系
    { bg: "#f0f7f2", border: "#a4c2ae", text: "#1d3323" },
  ],
  "自宅": [
    { bg: "#eee", border: "#999", text: "#333" }, // 鼠色系
    { bg: "#f5f5f5", border: "#bbb", text: "#333" },
  ],
  "住民の家": [
    { bg: "#e9e1f0", border: "#836c96", text: "#2e1d4a" }, // 菖蒲系
    { bg: "#f2eff7", border: "#b5a4d6", text: "#2e1d4a" },
  ],
  "免許センター": [
    { bg: "#e9e1f0", border: "#836c96", text: "#2e1d4a" }, // 菖蒲系
    { bg: "#f2eff7", border: "#b5a4d6", text: "#2e1d4a" },
  ],
  "E5ミッション": [
    { bg: "#e9e1f0", border: "#836c96", text: "#2e1d4a" }, // 菖蒲系
    { bg: "#f2eff7", border: "#b5a4d6", text: "#2e1d4a" },
  ],
  "不動産": [
    { bg: "#e9e1f0", border: "#836c96", text: "#2e1d4a" }, // 菖蒲系
    { bg: "#f2eff7", border: "#b5a4d6", text: "#2e1d4a" },
  ],
  "金融": [
    { bg: "#e9e1f0", border: "#836c96", text: "#2e1d4a" }, // 菖蒲系
    { bg: "#f2eff7", border: "#b5a4d6", text: "#2e1d4a" },
  ],
  "その他": [
    { bg: "#f0f0f0", border: "#ccc", text: "#666" },
  ]
};

export function getLocationColor(item: any): { bg: string; border: string; text: string } {
  const category = item.カテゴリー || "その他";
  const placeName = item.場所 || "";
  
  // カテゴリーが存在しない場合は「その他」を使用
  const palettes = CATEGORY_PALETTES[category] || CATEGORY_PALETTES["その他"];

  // 場所名のハッシュ値でパレット内のインデックスを選択（同じ場所は常に同じ色になる）
  let hash = 0;
  for (let i = 0; i < placeName.length; i++) {
    hash = placeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % palettes.length;
  return palettes[index];
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
