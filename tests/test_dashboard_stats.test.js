const test = require('node:test');
const assert = require('node:assert');
const { dayKey, buildDailySeries, formatBytes, percentOf, toDistribution, countWithin, MS_PER_DAY } = require('../src/utils/dashboardStats');

// 2026-10-12 12:00 in Thailand (05:00 UTC)
const NOW = Date.parse('2026-10-12T05:00:00Z');

test('dashboardStats - dayKey uses the Thailand calendar day by default', () => {
  assert.strictEqual(dayKey('2026-10-12T16:59:00Z'), '2026-10-12'); // 23:59 in Thailand
  assert.strictEqual(dayKey('2026-10-12T17:00:00Z'), '2026-10-13'); // midnight in Thailand
  assert.strictEqual(dayKey('2026-10-12T17:00:00Z', 0), '2026-10-12'); // UTC
});

test('dashboardStats - buildDailySeries is zero-filled, oldest first and ends today', () => {
  const series = buildDailySeries([], { days: 7, now: NOW });
  assert.strictEqual(series.length, 7);
  assert.strictEqual(series[6].date, '2026-10-12');
  assert.strictEqual(series[0].date, '2026-10-06');
  assert.ok(series.every((d) => d.count === 0));
});

test('dashboardStats - buildDailySeries counts events per day and ignores out-of-window/invalid dates', () => {
  const series = buildDailySeries(
    [
      '2026-10-12T01:00:00Z', '2026-10-12T04:00:00Z', // today x2
      '2026-10-11T10:00:00Z',                          // yesterday
      '2026-09-01T00:00:00Z',                          // outside window
      'not-a-date', null, undefined,                   // invalid
    ],
    { days: 7, now: NOW },
  );
  const byDate = Object.fromEntries(series.map((d) => [d.date, d.count]));
  assert.strictEqual(byDate['2026-10-12'], 2);
  assert.strictEqual(byDate['2026-10-11'], 1);
  assert.strictEqual(series.reduce((a, d) => a + d.count, 0), 3);
});

test('dashboardStats - buildDailySeries tolerates non-array input', () => {
  assert.strictEqual(buildDailySeries(undefined, { days: 3, now: NOW }).length, 3);
  assert.strictEqual(buildDailySeries('x', { days: 3, now: NOW }).length, 3);
});

test('dashboardStats - formatBytes', () => {
  assert.strictEqual(formatBytes(0), '0 B');
  assert.strictEqual(formatBytes(-5), '0 B');
  assert.strictEqual(formatBytes(NaN), '0 B');
  assert.strictEqual(formatBytes(512), '512 B');
  assert.strictEqual(formatBytes(1024), '1.0 KB');
  assert.strictEqual(formatBytes(1536), '1.5 KB');
  assert.strictEqual(formatBytes(10 * 1024 * 1024), '10.0 MB');
  assert.strictEqual(formatBytes(150 * 1024 * 1024), '150 MB');
  assert.strictEqual(formatBytes(3 * 1024 ** 3), '3.0 GB');
});

test('dashboardStats - percentOf is safe against zero and bad input', () => {
  assert.strictEqual(percentOf(1, 4), 25);
  assert.strictEqual(percentOf(1, 3), 33);
  assert.strictEqual(percentOf(5, 0), 0);
  assert.strictEqual(percentOf(-3, 10), 0);
  assert.strictEqual(percentOf('x', 10), 0);
});

test('dashboardStats - toDistribution merges rows, keeps empty labels and sorts by count', () => {
  const rows = [
    { category: 'GE', _count: { _all: 2 } },
    { category: 'ELECTIVE', _count: { _all: 6 } },
  ];
  const labels = { GE: 'GE', MAJOR_REQUIRED: 'วิชาเอกบังคับ', ELECTIVE: 'วิชาเลือก' };
  const dist = toDistribution(rows, 'category', labels);
  assert.deepStrictEqual(dist.map((d) => d.key), ['ELECTIVE', 'GE', 'MAJOR_REQUIRED']);
  assert.deepStrictEqual(dist.map((d) => d.count), [6, 2, 0]);
  assert.deepStrictEqual(dist.map((d) => d.percent), [75, 25, 0]);
  assert.strictEqual(dist[0].label, 'วิชาเลือก');
});

test('dashboardStats - toDistribution handles null keys, no rows and keepEmpty:false', () => {
  const dist = toDistribution([{ faculty: null, _count: { _all: 3 } }, { faculty: 'ict', _count: { _all: 1 } }], 'faculty', { ict: 'ICT' }, { keepEmpty: false });
  assert.deepStrictEqual(dist.map((d) => [d.label, d.count]), [['ไม่ระบุ', 3], ['ICT', 1]]);
  assert.deepStrictEqual(toDistribution([], 'x', { a: 'A' }).map((d) => d.count), [0]);
  assert.deepStrictEqual(toDistribution(undefined, 'x', {}), []);
  assert.deepStrictEqual(toDistribution([], 'x', { a: 'A' }, { keepEmpty: false }), []);
});

test('dashboardStats - countWithin counts only timestamps inside the window', () => {
  const stamps = [NOW - 1000, NOW - 2 * 3600 * 1000, NOW - 2 * MS_PER_DAY, NOW + 5000, 'bad', null];
  assert.strictEqual(countWithin(stamps, MS_PER_DAY, NOW), 2);
  assert.strictEqual(countWithin(stamps, 7 * MS_PER_DAY, NOW), 3);
  assert.strictEqual(countWithin(undefined, MS_PER_DAY, NOW), 0);
});
