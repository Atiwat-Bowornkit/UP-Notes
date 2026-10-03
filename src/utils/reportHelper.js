/**
 * UP-Notes report/moderation rules (pure functions, no DB access).
 * US-09: report a note. US-10: admin moderation.
 */

const REPORT_REASONS = ['COPYRIGHT', 'EXAM_LEAK', 'INACCURATE', 'OTHER'];

const REPORT_REASON_LABELS = {
    COPYRIGHT: 'ละเมิดลิขสิทธิ์',
    EXAM_LEAK: 'เป็นข้อสอบที่ไม่อนุญาต',
    INACCURATE: 'เนื้อหาผิดพลาดร้ายแรง',
    OTHER: 'อื่นๆ',
};

// A note is hidden once it has MORE than this many unresolved reports (US-09 AC2)
const REPORT_HIDE_THRESHOLD = 3;
const MAX_REPORT_DETAIL_LENGTH = 500;

/**
 * Validate the report form input
 * @param {{reason?: unknown, detail?: unknown} | null | undefined} input
 * @returns {{isValid: true, reason: string, detail: string | null} | {isValid: false, error: string}}
 */
function validateReport(input) {
    const reason = input ? input.reason : undefined;
    if (!REPORT_REASONS.includes(reason)) {
        return { isValid: false, error: 'กรุณาเลือกสาเหตุการรายงานปัญหา' };
    }

    const detail = typeof input.detail === 'string' ? input.detail.trim() : '';
    if (detail.length > MAX_REPORT_DETAIL_LENGTH) {
        return {
            isValid: false,
            error: `รายละเอียดต้องไม่เกิน ${MAX_REPORT_DETAIL_LENGTH} ตัวอักษร`,
        };
    }

    return { isValid: true, reason, detail: detail === '' ? null : detail };
}

/**
 * Decide whether a note must be hidden (Pending Review)
 * @param {number} openReportCount - unresolved reports on the note
 * @returns {boolean}
 */
function shouldHideNote(openReportCount) {
    return Number.isInteger(openReportCount) && openReportCount > REPORT_HIDE_THRESHOLD;
}

/**
 * @param {{role?: string} | null | undefined} user
 * @returns {boolean}
 */
function isAdmin(user) {
    return Boolean(user) && user.role === 'ADMIN';
}

/**
 * Count reports per reason for the admin dashboard
 * @param {Array<{reason: string}>} reports
 * @returns {Record<string, number>}
 */
function summarizeReasons(reports) {
    const summary = Object.fromEntries(REPORT_REASONS.map((reason) => [reason, 0]));
    if (!Array.isArray(reports)) return summary;

    for (const report of reports) {
        if (report && Object.hasOwn(summary, report.reason)) {
            summary[report.reason] += 1;
        }
    }
    return summary;
}

module.exports = {
    REPORT_REASONS,
    REPORT_REASON_LABELS,
    REPORT_HIDE_THRESHOLD,
    MAX_REPORT_DETAIL_LENGTH,
    validateReport,
    shouldHideNote,
    isAdmin,
    summarizeReasons,
};
