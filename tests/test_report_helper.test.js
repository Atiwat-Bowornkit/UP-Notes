/**
 * Unit tests for report/moderation rules (US-09, US-10)
 */

const test = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const {
    REPORT_REASONS,
    REPORT_REASON_LABELS,
    REPORT_HIDE_THRESHOLD,
    MAX_REPORT_DETAIL_LENGTH,
    validateReport,
    shouldHideNote,
    isAdmin,
    summarizeReasons,
} = require('../src/utils/reportHelper');

// ── validateReport (US-09 AC1, AC3) ──

test('validateReport - valid reason without detail passes with null detail', () => {
    assert.deepStrictEqual(validateReport({ reason: 'COPYRIGHT' }), {
        isValid: true,
        reason: 'COPYRIGHT',
        detail: null,
    });
});

test('validateReport - trims detail text', () => {
    const result = validateReport({ reason: 'OTHER', detail: '  ไฟล์เสีย  ' });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.detail, 'ไฟล์เสีย');
});

test('validateReport - whitespace-only detail becomes null', () => {
    const result = validateReport({ reason: 'OTHER', detail: '   ' });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.detail, null);
});

test('validateReport - every known reason is accepted', () => {
    for (const reason of REPORT_REASONS) {
        assert.strictEqual(validateReport({ reason }).isValid, true, reason);
    }
});

test('validateReport - missing reason is rejected with the required message (AC3)', () => {
    const result = validateReport({ detail: 'x' });
    assert.strictEqual(result.isValid, false);
    assert.strictEqual(result.error, 'กรุณาเลือกสาเหตุการรายงานปัญหา');
});

test('validateReport - empty string, unknown and non-string reasons are rejected', () => {
    for (const reason of ['', 'SPAM', 42, null, undefined, ['COPYRIGHT']]) {
        assert.strictEqual(validateReport({ reason }).isValid, false, String(reason));
    }
});

test('validateReport - null or undefined input is rejected, not thrown', () => {
    assert.strictEqual(validateReport(null).isValid, false);
    assert.strictEqual(validateReport(undefined).isValid, false);
});

test('validateReport - detail boundary: exactly max length passes, one more fails', () => {
    const atLimit = 'ก'.repeat(MAX_REPORT_DETAIL_LENGTH);
    assert.strictEqual(validateReport({ reason: 'OTHER', detail: atLimit }).isValid, true);

    const over = validateReport({ reason: 'OTHER', detail: atLimit + 'ก' });
    assert.strictEqual(over.isValid, false);
    assert.ok(over.error.includes(String(MAX_REPORT_DETAIL_LENGTH)));
});

test('validateReport - non-string detail is treated as empty', () => {
    const result = validateReport({ reason: 'OTHER', detail: 123 });
    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.detail, null);
});

// ── shouldHideNote (US-09 AC2) ──

test('shouldHideNote - threshold is 3 reports', () => {
    assert.strictEqual(REPORT_HIDE_THRESHOLD, 3);
});

test('shouldHideNote - boundary: 3 reports stays visible, 4 reports is hidden', () => {
    assert.strictEqual(shouldHideNote(3), false);
    assert.strictEqual(shouldHideNote(4), true);
});

test('shouldHideNote - zero and negative counts stay visible', () => {
    assert.strictEqual(shouldHideNote(0), false);
    assert.strictEqual(shouldHideNote(-1), false);
});

test('shouldHideNote - non-integer or non-number input never hides', () => {
    for (const value of [3.5, 10.2, NaN, Infinity, '10', null, undefined]) {
        assert.strictEqual(shouldHideNote(value), false, String(value));
    }
});

test('property: shouldHideNote is true exactly when count > threshold', () => {
    fc.assert(
        fc.property(fc.integer({ min: -5, max: 1000 }), (count) => {
            return shouldHideNote(count) === (count > REPORT_HIDE_THRESHOLD);
        })
    );
});

// ── isAdmin (US-10 AC1) ──

test('isAdmin - only the ADMIN role passes', () => {
    assert.strictEqual(isAdmin({ role: 'ADMIN' }), true);
    assert.strictEqual(isAdmin({ role: 'USER' }), false);
    assert.strictEqual(isAdmin({ role: 'admin' }), false);
    assert.strictEqual(isAdmin({}), false);
});

test('isAdmin - missing user is not an admin', () => {
    assert.strictEqual(isAdmin(null), false);
    assert.strictEqual(isAdmin(undefined), false);
});

// ── summarizeReasons ──

test('summarizeReasons - counts reports per reason, all reasons present', () => {
    const summary = summarizeReasons([
        { reason: 'COPYRIGHT' },
        { reason: 'COPYRIGHT' },
        { reason: 'EXAM_LEAK' },
    ]);
    assert.deepStrictEqual(summary, { COPYRIGHT: 2, EXAM_LEAK: 1, INACCURATE: 0, OTHER: 0 });
});

test('summarizeReasons - ignores unknown reasons and inherited property names', () => {
    const summary = summarizeReasons([
        { reason: 'SPAM' },
        { reason: 'toString' },
        { reason: '__proto__' },
        null,
    ]);
    assert.deepStrictEqual(summary, { COPYRIGHT: 0, EXAM_LEAK: 0, INACCURATE: 0, OTHER: 0 });
});

test('summarizeReasons - non-array input returns all zeros', () => {
    const zeros = { COPYRIGHT: 0, EXAM_LEAK: 0, INACCURATE: 0, OTHER: 0 };
    assert.deepStrictEqual(summarizeReasons(undefined), zeros);
    assert.deepStrictEqual(summarizeReasons('x'), zeros);
});

test('property: summarizeReasons total equals the number of valid reports', () => {
    fc.assert(
        fc.property(fc.array(fc.constantFrom(...REPORT_REASONS)), (reasons) => {
            const summary = summarizeReasons(reasons.map((reason) => ({ reason })));
            const total = Object.values(summary).reduce((a, b) => a + b, 0);
            return total === reasons.length;
        })
    );
});

// ── labels ──

test('every report reason has a Thai label', () => {
    for (const reason of REPORT_REASONS) {
        assert.ok(REPORT_REASON_LABELS[reason], reason);
    }
});
