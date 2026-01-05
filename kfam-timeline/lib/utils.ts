import { getPosition } from "./timeUtils";
import { ArchiveData } from "@/types";
import { CATEGORY_PALETTES } from "./colors";

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

const paletteAssignmentMap: Record<string, number> = {};

export function getLocationColor(item: any): { bg: string; border: string; text: string } {
  // スプレッドシートの「カテゴリー」列の値を使用
  const category = item.カテゴリ || "その他";
  const placeName = item.場所 || "";
  const palettes = CATEGORY_PALETTES[category] || CATEGORY_PALETTES["その他"];

  const assignmentKey = `${category}-${placeName}`;

  // 1. すでにこの場所にインデックスが割り当てられていればそれを返す
  if (paletteAssignmentMap[assignmentKey] !== undefined) {
    return palettes[paletteAssignmentMap[assignmentKey]];
  }

  let hash = 0;
  for (let i = 0; i < placeName.length; i++) {
    hash = placeName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % palettes.length;

  // 3. 同じカテゴリ内で他の場所がすでにそのインデックスを使っていないかチェック
  // すべて使われている場合は、ハッシュに基づいた元のインデックスを受け入れる（衝突回避の限界）
  const usedIndices = Object.keys(paletteAssignmentMap)
    .filter(key => key.startsWith(`${category}-`))
    .map(key => paletteAssignmentMap[key]);

  if (usedIndices.includes(index)) {
    // 空いているインデックスを探す
    for (let i = 0; i < palettes.length; i++) {
      const nextIndex = (index + i) % palettes.length;
      if (!usedIndices.includes(nextIndex)) {
        index = nextIndex;
        break;
      }
    }
  }

  // 4. 割り当てを記録して返す
  paletteAssignmentMap[assignmentKey] = index;

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
