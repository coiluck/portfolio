const DAY_MS = 24 * 60 * 60 * 1000;

export function formatPeriod({ start, end, duration }: { start: Date; end: Date; duration?: number }): string {
  const days = duration ?? (end.getTime() - start.getTime()) / DAY_MS + 1;

  const startYear = start.getUTCFullYear();
  const endYear = end.getUTCFullYear();
  const startMonth = start.getUTCMonth() + 1;
  const endMonth = end.getUTCMonth() + 1;

  let months = `${startYear}年${startMonth}月`;
  if (startYear !== endYear) {
    months += `〜${endYear}年${endMonth}月`;
  } else if (startMonth !== endMonth) {
    months += `〜${endMonth}月`;
  }
  return `${months}（${days}日間）`;
}
