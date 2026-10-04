export type ReportReasonCode = "COPYRIGHT" | "EXAM_LEAK" | "INACCURATE" | "OTHER";

export type ReportValidation =
  | { isValid: true; reason: ReportReasonCode; detail: string | null }
  | { isValid: false; error: string };

export const REPORT_REASONS: readonly ReportReasonCode[];
export const REPORT_REASON_LABELS: Record<ReportReasonCode, string>;
export const REPORT_HIDE_THRESHOLD: number;
export const MAX_REPORT_DETAIL_LENGTH: number;

export function validateReport(
  input: { reason?: unknown; detail?: unknown } | null | undefined,
): ReportValidation;
export function shouldHideNote(openReportCount: number): boolean;
export function isAdmin(user: { role?: string } | null | undefined): boolean;
export function summarizeReasons(
  reports: ReadonlyArray<{ reason: string }>,
): Record<ReportReasonCode, number>;
