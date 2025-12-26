export const SEASON_CONFIG = {
  "Season1": { start: "17:00", end: "05:00", duration: 12 }, // 12時間
  "Season2": { start: "19:00", end: "03:00", duration: 8 },  // 8時間
};

// 時間（HH:mm）を「その日の開始時刻からの経過分」に変換する
export function getMinutesFromStart(time: string, season: "Season1" | "Season2") {
  const [h, m] = time.split(":").map(Number);
  const startHour = parseInt(SEASON_CONFIG[season].start);

  let relativeHour = h < startHour ? h + 24 - startHour : h - startHour;
  return relativeHour * 60 + m;
}

// タイムライン上の位置（%）を計算する
export function getPosition(time: string, season: "Season1" | "Season2") {
  const minutes = getMinutesFromStart(time, season);
  const totalMinutes = SEASON_CONFIG[season].duration * 60;
  return Math.min(Math.max((minutes / totalMinutes) * 100, 0), 100);
}
