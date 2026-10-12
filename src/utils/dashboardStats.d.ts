export const MS_PER_DAY: number;
export function dayKey(date: Date | number | string, offsetMinutes?: number): string;
export function buildDailySeries(
  dates: Array<Date | number | string>,
  options?: { days?: number; now?: number; offsetMinutes?: number },
): { date: string; count: number }[];
export function formatBytes(bytes: number): string;
export function percentOf(part: number, total: number): number;
export function toDistribution(
  rows: Array<Record<string, any>>,
  field: string,
  labels?: Record<string, string>,
  options?: { keepEmpty?: boolean },
): { key: string; label: string; count: number; percent: number }[];
export function countWithin(timestamps: Array<Date | number | string>, windowMs: number, now?: number): number;
