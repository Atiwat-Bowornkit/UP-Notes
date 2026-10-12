/**
 * Pure helpers for the admin dashboard (no DB access) so they can be unit-tested.
 */

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const THAILAND_OFFSET_MINUTES = 7 * 60;

/** Calendar-day key (YYYY-MM-DD) of an instant in the given UTC offset (default: Thailand, UTC+7). */
function dayKey(date, offsetMinutes = THAILAND_OFFSET_MINUTES) {
    const shifted = new Date(new Date(date).getTime() + offsetMinutes * 60 * 1000);
    return shifted.toISOString().slice(0, 10);
}

/**
 * Number of events per day for the last `days` days (today included), oldest first, zero-filled.
 * Dates outside the window and invalid dates are ignored.
 * @returns {{date: string, count: number}[]}
 */
function buildDailySeries(dates, { days = 14, now = Date.now(), offsetMinutes = THAILAND_OFFSET_MINUTES } = {}) {
    const series = [];
    for (let i = days - 1; i >= 0; i -= 1) {
        series.push({ date: dayKey(now - i * MS_PER_DAY, offsetMinutes), count: 0 });
    }
    const byDate = new Map(series.map((entry) => [entry.date, entry]));

    for (const value of Array.isArray(dates) ? dates : []) {
        const time = new Date(value).getTime();
        if (!Number.isFinite(time)) continue;
        const entry = byDate.get(dayKey(time, offsetMinutes));
        if (entry) entry.count += 1;
    }
    return series;
}

/** Human readable size: 0 B, 512 B, 1.5 KB, 12.3 MB, 1.2 GB. */
function formatBytes(bytes) {
    const n = Number(bytes);
    if (!Number.isFinite(n) || n <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const exponent = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    const value = n / 1024 ** exponent;
    return `${exponent === 0 ? value : value.toFixed(value >= 100 ? 0 : 1)} ${units[exponent]}`;
}

/** Whole-number percentage of part in total (0 when total is 0 or inputs are invalid). */
function percentOf(part, total) {
    const p = Number(part);
    const t = Number(total);
    if (!Number.isFinite(p) || !Number.isFinite(t) || t <= 0) return 0;
    return Math.round((Math.max(0, p) / t) * 100);
}

/**
 * Turn grouped rows into [{key, label, count, percent}] sorted by count (desc), keeping every
 * label in `labels` even when its count is 0 so charts have a stable shape.
 * @param {{[field: string]: unknown}[]} rows  e.g. [{category:'GE', _count:{_all:3}}]
 */
function toDistribution(rows, field, labels = {}, { keepEmpty = true } = {}) {
    const counts = new Map();
    for (const row of Array.isArray(rows) ? rows : []) {
        const key = row[field] ?? '';
        const count = Number(row._count?._all ?? row._count ?? row.count ?? 0);
        counts.set(key, (counts.get(key) ?? 0) + (Number.isFinite(count) ? count : 0));
    }
    if (keepEmpty) {
        for (const key of Object.keys(labels)) if (!counts.has(key)) counts.set(key, 0);
    }
    const total = [...counts.values()].reduce((a, b) => a + b, 0);
    return [...counts.entries()]
        .map(([key, count]) => ({ key, label: labels[key] ?? (key || 'ไม่ระบุ'), count, percent: percentOf(count, total) }))
        .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, 'th'));
}

/** How many ISO timestamps fall within the last `windowMs` before `now`. */
function countWithin(timestamps, windowMs, now = Date.now()) {
    let n = 0;
    for (const value of Array.isArray(timestamps) ? timestamps : []) {
        const time = new Date(value).getTime();
        if (Number.isFinite(time) && time <= now && now - time <= windowMs) n += 1;
    }
    return n;
}

module.exports = { dayKey, buildDailySeries, formatBytes, percentOf, toDistribution, countWithin, MS_PER_DAY };
