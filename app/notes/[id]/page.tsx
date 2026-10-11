import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteStatus, Role } from "@prisma/client";
import ReportNoteForm from "@/modules/admin/components/ReportNoteForm";
import authHelper from "@/src/utils/authHelper";
import CategoryBadge from "@/components/CategoryBadge";
import * as facultyData from "@/src/utils/facultyData";
import { ArrowLeftIcon, FileIcon, UserIcon } from "@/components/Icons";
import NoteEngagement from "@/modules/notes/components/NoteEngagement";
import PdfPreview from "@/modules/notes/components/PdfPreview";
import { NOTES_BUCKET } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const [user, note] = await Promise.all([
    getCurrentUser(),
    prisma.note.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        _count: { select: { likes: true } },
      },
    }),
  ]);

  if (!note) {
    notFound();
  }

  // 5. Access Control Check:
  // If status is not PUBLISHED (e.g. PENDING_REVIEW), only the note author or an ADMIN can view it.
  const isOwner = user ? user.id === note.authorId : false;
  const isAdmin = user ? user.role === Role.ADMIN : false;
  if (note.status !== NoteStatus.PUBLISHED && !isOwner && !isAdmin) {
    notFound();
  }

  // 1. Short-lived signed URL for file preview (expires in 60s)
  // Storage being unreachable or unconfigured must not take the whole page down.
  let fileUrl: string | null = null;
  try {
    const signedFile = await createAdminClient()
      .storage.from(NOTES_BUCKET)
      .createSignedUrl(note.filePath, 60);
    fileUrl = signedFile.error ? null : signedFile.data?.signedUrl ?? null;
  } catch (error) {
    console.error("[note detail] could not create signed URL:", error);
  }

  const liked = user
    ? Boolean(
        await prisma.like.findUnique({
          where: { userId_noteId: { userId: user.id, noteId: note.id } },
          select: { noteId: true },
        })
      )
    : false;

  const extension = note.fileName.split(".").pop()?.toLowerCase();
  const isImage = extension === "png" || extension === "jpg" || extension === "jpeg";

  const statusBadge =
    note.status === NoteStatus.HIDDEN ? (
      <span className="badge-danger">ถูกซ่อนเนื่องจากมีการรายงาน</span>
    ) : note.status !== NoteStatus.PUBLISHED ? (
      <span className="badge-warning">รอผู้ดูแลอนุมัติ</span>
    ) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/notes" className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white">
        <ArrowLeftIcon size={16} /> กลับไปค้นหาโน้ต
      </Link>

      {/* Header information */}
      <header className="card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-accent font-mono">{note.courseCode}</span>
          <CategoryBadge category={note.category} />
          {statusBadge}
        </div>
        <h1 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">{note.title}</h1>
        {note.faculty && (
          <p className="text-sm text-gray-300">
            {facultyData.getFacultyLabel(note.faculty)}
            {note.program && <span className="text-gray-400"> · สาขา{facultyData.getProgramLabel(note.faculty, note.program)}</span>}
          </p>
        )}
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
          <span className="flex items-center gap-1.5">
            <UserIcon size={15} /> {authHelper.displayName(note.author)}
          </span>
          <time dateTime={note.createdAt.toISOString()}>
            {note.createdAt.toLocaleDateString("th-TH", { dateStyle: "long" })}
          </time>
        </div>
        {note.description && (
          <p className="whitespace-pre-wrap border-t border-white/10 pt-4 leading-relaxed text-gray-300">
            {note.description}
          </p>
        )}
      </header>

      {/* Like / download */}
      <section aria-label="การดำเนินการ" className="card py-4">
        <NoteEngagement
          noteId={note.id}
          initialLikes={note._count.likes}
          initialDownloads={note.downloadCount}
          initialLiked={liked}
        />
      </section>

      {/* File preview */}
      <section aria-labelledby="preview-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="preview-heading" className="text-lg font-semibold text-white">พรีวิวเอกสาร</h2>
          <span className="flex max-w-[200px] items-center gap-1.5 truncate text-sm text-gray-400 sm:max-w-xs">
            <FileIcon size={15} /> <span className="truncate">{note.fileName}</span>
          </span>
        </div>
        {fileUrl ? (
          isImage ? (
            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
              <img
                src={fileUrl}
                alt={`พรีวิว ${note.title}`}
                className="max-h-[75vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          ) : extension === "pdf" ? (
            <PdfPreview url={fileUrl} />
          ) : (
            <p role="alert" className="alert-warning text-center">ไม่สามารถแสดงพรีวิวไฟล์นี้ได้</p>
          )
        ) : (
          <p role="alert" className="alert-warning text-center">ไม่สามารถโหลดพรีวิวไฟล์ได้ในขณะนี้</p>
        )}
      </section>

      {/* Report a problem */}
      <ReportNoteForm noteId={note.id} />
    </div>
  );
}
