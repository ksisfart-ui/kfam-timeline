export interface ArchiveData {
  日付: string;
  暦家: string;
  場所: string;
  開始時間: string;
  終了時間: string;
  URL: string;
  シーズン: "Season1" | "Season2";
  カテゴリ: string;
}

export interface NewsData {
  日付: string;
  内容: string;
}