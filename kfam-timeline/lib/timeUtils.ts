export const SEASON_CONFIG = {
  "Season1": { start: 17, duration: 12 }, // 17:00 ~ 翌05:00
  "Season2": { start: 19, duration: 8 },  // 19:00 ~ 翌03:00
};

export function getPosition(time: string, season: "Season1" | "Season2") {
  const [h, m] = time.split(":").map(Number);
  const config = SEASON_CONFIG[season];

  // 開始時間からの経過時間を計算
  let relativeHour = h < config.start ? h + 24 - config.start : h - config.start;
  const minutes = relativeHour * 60 + m;

  const totalMinutes = config.duration * 60;
  return (minutes / totalMinutes) * 100;
}

// タイムラインの目盛りを生成
export function getTimeLabels(season: "Season1" | "Season2") {
  const config = SEASON_CONFIG[season];
  return Array.from({ length: config.duration + 1 }, (_, i) => {
    const hour = (config.start + i) % 24;
    return `${hour}:00`;
  });
}
