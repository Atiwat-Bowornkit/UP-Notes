import "server-only";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import * as facultyData from "@/src/utils/facultyData";
import {
  MS_PER_DAY,
  buildDailySeries,
  countWithin,
  toDistribution,
} from "@/src/utils/dashboardStats";

const CATEGORY_LABELS: Record<string, string> = {
  GE: "GE",
  MAJOR_REQUIRED: "วิชาเอกบังคับ",
  ELECTIVE: "วิชาเลือก",
};
const STATUS_LABELS: Record<string, string> = {
  PUBLISHED: "เผยแพร่แล้ว",
  PENDING_REVIEW: "รออนุมัติ",
  HIDDEN: "ถูกซ่อน (มีรายงาน)",
};
const REASON_LABELS: Record<string, string> = {
  COPYRIGHT: "ละเมิดลิขสิทธิ์",
  EXAM_LEAK: "เป็นข้อสอบที่ไม่อนุญาต",
  INACCURATE: "เนื้อหาผิดพลาดร้ายแรง",
  OTHER: "อื่นๆ",
};

const CHART_DAYS = 14;
const WINDOW_DAYS = 30;
const AUTH_PAGE_SIZE = 1000;
const AUTH_MAX_PAGES = 5; // up to 5,000 accounts; beyond that the figure is reported as partial

export type SignInActivity = {
  available: boolean;
  total: number;
  last24h: number;
  last7d: number;
  partial: boolean;
};

/** Sign-in activity from Supabase Auth. There is no presence tracking, so "online now" is not available. */
async function getSignInActivity(now: number): Promise<SignInActivity> {
  try {
    const admin = createAdminClient();
    const stamps: string[] = [];
    let total = 0;
    let partial = false;

    for (let page = 1; page <= AUTH_MAX_PAGES; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: AUTH_PAGE_SIZE });
      if (error) throw error;
      const users = data?.users ?? [];
      total += users.length;
      for (const u of users) if (u.last_sign_in_at) stamps.push(u.last_sign_in_at);
      if (users.length < AUTH_PAGE_SIZE) break;
      if (page === AUTH_MAX_PAGES) partial = true;
    }

    return {
      available: true,
      total,
      last24h: countWithin(stamps, MS_PER_DAY, now),
      last7d: countWithin(stamps, 7 * MS_PER_DAY, now),
      partial,
    };
  } catch (error) {
    console.error("[dashboard] sign-in activity unavailable:", error);
    return { available: false, total: 0, last24h: 0, last7d: 0, partial: false };
  }
}

export async function getDashboardData(now = Date.now()) {
  const since = new Date(now - WINDOW_DAYS * MS_PER_DAY);

  const [
    byStatus,
    byCategory,
    byFaculty,
    noteTotals,
    likesTotal,
    usersTotal,
    byRole,
    recentUsers,
    recentNoteDates,
    reportsByState,
    openReportsByReason,
    topDownloaded,
    topLiked,
    recentNotes,
    signIns,
  ] = await Promise.all([
    prisma.note.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.note.groupBy({ by: ["category"], _count: { _all: true } }),
    prisma.note.groupBy({ by: ["faculty"], _count: { _all: true } }),
    prisma.note.aggregate({ _sum: { downloadCount: true, fileSizeBytes: true } }),
    prisma.like.count(),
    prisma.user.count(),
    prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
    prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.note.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.report.groupBy({ by: ["resolved"], _count: { _all: true } }),
    prisma.report.groupBy({ by: ["reason"], where: { resolved: false }, _count: { _all: true } }),
    prisma.note.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ downloadCount: "desc" }, { createdAt: "desc" }],
      take: 5,
      select: { id: true, title: true, courseCode: true, downloadCount: true, _count: { select: { likes: true } } },
    }),
    prisma.note.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ likes: { _count: "desc" } }, { createdAt: "desc" }],
      take: 5,
      select: { id: true, title: true, courseCode: true, downloadCount: true, _count: { select: { likes: true } } },
    }),
    prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true, title: true, courseCode: true, status: true, createdAt: true,
        author: { select: { name: true, email: true } },
      },
    }),
    getSignInActivity(now),
  ]);

  const statusDist = toDistribution(byStatus, "status", STATUS_LABELS);
  const noteCount = (key: string) => statusDist.find((s) => s.key === key)?.count ?? 0;
  const notesTotal = statusDist.reduce((sum, s) => sum + s.count, 0);

  const facultyLabels = Object.fromEntries(facultyData.FACULTIES.map((f) => [f.value, f.label]));
  const facultyDist = toDistribution(byFaculty, "faculty", facultyLabels, { keepEmpty: false })
    .map((row) => (row.key === "" ? { ...row, label: "ยังไม่ระบุคณะ" } : row));

  const resolvedCount = (resolved: boolean) =>
    reportsByState.find((r) => r.resolved === resolved)?._count._all ?? 0;

  const roleCount = (role: string) => byRole.find((r) => r.role === role)?._count._all ?? 0;
  const userDates = recentUsers.map((u) => u.createdAt);
  const noteDates = recentNoteDates.map((n) => n.createdAt);

  return {
    generatedAt: new Date(now),
    chartDays: CHART_DAYS,
    notes: {
      total: notesTotal,
      published: noteCount("PUBLISHED"),
      pending: noteCount("PENDING_REVIEW"),
      hidden: noteCount("HIDDEN"),
      new7d: countWithin(noteDates, 7 * MS_PER_DAY, now),
      byStatus: statusDist,
      byCategory: toDistribution(byCategory, "category", CATEGORY_LABELS),
      byFaculty: facultyDist.slice(0, 8),
      perDay: buildDailySeries(noteDates, { days: CHART_DAYS, now }),
    },
    users: {
      total: usersTotal,
      admins: roleCount("ADMIN"),
      new7d: countWithin(userDates, 7 * MS_PER_DAY, now),
      new30d: userDates.length,
      perDay: buildDailySeries(userDates, { days: CHART_DAYS, now }),
      signIns,
    },
    engagement: {
      likes: likesTotal,
      downloads: noteTotals._sum.downloadCount ?? 0,
      storageBytes: noteTotals._sum.fileSizeBytes ?? 0,
    },
    reports: {
      open: resolvedCount(false),
      resolved: resolvedCount(true),
      openByReason: toDistribution(openReportsByReason, "reason", REASON_LABELS, { keepEmpty: false }),
    },
    topDownloaded,
    topLiked,
    recentNotes,
    statusLabels: STATUS_LABELS,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
