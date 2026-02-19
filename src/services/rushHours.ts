// services/rushHourWorker.ts

export const isRushHourUTC = (): boolean => {
  const now = new Date();

  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();

  const totalMinutes = utcHours * 60 + utcMinutes;

  const start = 12 * 60 + 30; // 12:30 UTC
  const end = 16 * 60 + 30;   // 16:30 UTC

  return totalMinutes >= start && totalMinutes <= end;
};