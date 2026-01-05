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

// utils.ts

const CATEGORY_PALETTES: Record<string, { bg: string; border: string; text: string }[]> = {
  "警察": [
    { bg: "#7a7c7d", border: "#614060", text: "#ffffff" }, // 鉛
    { bg: "#7a7c7d", border: "#7fd1ae", text: "#ffffff" }, // 鉛
    { bg: "#373737", border: "#bbbcde", text: "#ffffff" }, // 墨 × 藤
    { bg: "#373737", border: "#a76b7a", text: "#ffffff" }, // 墨
    { bg: "#00001c", border: "#e1d1b3", text: "#ffffff" }, // 暗黒 × 亜麻
    { bg: "#00001c", border: "#482a2b", text: "#ffffff" }, // 暗黒
  ],
  "医療": [
    { bg: "#f6f7f8", border: "#f09199", text: "#4a1d28" }, // 月白 × 桃色
    { bg: "#f6f7f8", border: "#cbddee", text: "#394856" }, // 月白
    { bg: "#f6f7f8", border: "#23857a", text: "#394856" }, // 月白
    { bg: "#fdfcfa", border: "#b4cf8f", text: "#1d3323" }, // 卯の花 × 山葵
    { bg: "#fdfcfa", border: "#fd8e58", text: "#4a1d28" }, // 卯の花
    { bg: "#fdfcfa", border: "#e8dfcb", text: "#4a1d28" }, // 卯の花
  ],
  "メカニック": [
    { bg: "#f08300", border: "#c26a00", text: "#ffffff" }, // 蜜柑色
    { bg: "#f08300", border: "#758f00", text: "#ffffff" }, // 蜜柑色
    { bg: "#ed6d46", border: "#c44e2b", text: "#ffffff" }, // 丹
    { bg: "#ed6d46", border: "#004c74", text: "#ffffff" }, // 丹
    { bg: "#f7b977", border: "#d9934a", text: "#4a321d" }, // 杏
    { bg: "#f7b977", border: "#78ccd2", text: "#4a321d" }, // 杏 × 白群
    { bg: "#e0803a", border: "#b35e22", text: "#ffffff" }, // 金木犀
    { bg: "#e0803a", border: "#eb6159", text: "#ffffff" }, // 金木犀 × 中紅
    { bg: "#f6ad48", border: "#d48d2a", text: "#4a321d" }, // 柑子
    { bg: "#f6ad48", border: "#ffeccc", text: "#4a321d" }, // 柑子
  ],
  "飲食店": [
    { bg: "#19448e", border: "#bbbcde", text: "#ffffff" }, // 瑠璃紺
    { bg: "#19448e", border: "#ac65c0", text: "#ffffff" }, // 瑠璃紺
    { bg: "#164a84", border: "#bbbcde", text: "#ffffff" }, // 紺瑠璃
    { bg: "#164a84", border: "#7f2d42", text: "#ffffff" }, // 紺瑠璃
    { bg: "#165e83", border: "#9ec5cf", text: "#ffffff" }, // 藍色
    { bg: "#165e83", border: "#71532d", text: "#ffffff" }, // 藍色
    { bg: "#0f2350", border: "#bbbcde", text: "#ffffff" }, // 濃藍
    { bg: "#0f2350", border: "#b34d72", text: "#ffffff" }, // 濃藍
    { bg: "#213d5d", border: "#9ec5cf", text: "#ffffff" }, // 瞑
    { bg: "#213d5d", border: "#00909b", text: "#ffffff" }, // 瞑
    { bg: "#00669f", border: "#9ec5cf", text: "#ffffff" }, // 孔雀青
    { bg: "#00669f", border: "#00722a", text: "#ffffff" }, // 孔雀青
  ],
  "自宅": [
    { bg: "#b28c6e", border: "#8c6a4d", text: "#ffffff" }, // 柴染
    { bg: "#a58f86", border: "#2f4858", text: "#ffffff" }, // 胡桃染
  ],
  "住民の家": [
    { bg: "#4b0d43", border: "#be84b8", text: "#ffffff" }, // 小紫 × 若紫
    { bg: "#4b0d43", border: "#A01C8F", text: "#ffffff" }, // 小紫
  ],
  "免許センター": [
    { bg: "#ede4cd", border: "#c9b98e", text: "#4a4434" }, // 練色
  ],
  "E5ミッション": [
    { bg: "#edd3a1", border: "#cca766", text: "#4a3d24" }, // 浅黄
  ],
  "不動産": [
    { bg: "#716246", border: "#4a3f2d", text: "#ffffff" }, // 媚茶
  ],
  "金融": [
    { bg: "#e6b422", border: "#b38b1a", text: "#ffffff" }, // 金色
  ],
  "その他": [
    { bg: "#dcdddd", border: "#abb1b1", text: "#4a4a4a" }, // 白鼠
  ]
};

export function getLocationColor(item: any): { bg: string; border: string; text: string } {
  // スプレッドシートの「カテゴリー」列の値を使用
  const category = item.カテゴリ || "その他";
  const placeName = item.場所 || "";
  
  const palettes = CATEGORY_PALETTES[category] || CATEGORY_PALETTES["その他"];

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
