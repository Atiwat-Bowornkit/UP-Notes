import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteStatus, Role } from "@prisma/client";
import ReportNoteForm from "@/modules/admin/components/ReportNoteForm";
import authHelper from "@/src/utils/authHelper";
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

  return (
    <div className="mx-auto max-w-4xl space-y-7 px-4 py-6 sm:px-6">
      <Link href="/notes" className="inline-flex items-center text-sm text-gray-400 hover:text-white transition">
        ← กลับไปค้นหาโน้ต
      </Link>

      {/* 1. Header Information */}
      <header className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-accent">{note.courseCode}</p>
          {note.status !== NoteStatus.PUBLISHED && (
            <span className="rounded bg-yellow-500/20 px-2.5 py-0.5 text-xs font-medium text-yellow-400 border border-yellow-500/30">
              {note.status === NoteStatus.HIDDEN
                ? "ถูกซ่อนเนื่องจากมีการรายงาน (HIDDEN)"
                : "รอการตรวจสอบ (PENDING_REVIEW)"}
            </span>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-semibold leading-tight text-white sm:text-3xl">{note.title}</h1>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
          <span>โดย {authHelper.displayName(note.author)}</span>
          <time dateTime={note.createdAt.toISOString()}>
            {note.createdAt.toLocaleDateString("th-TH", { dateStyle: "long" })}
          </time>
        </div>
        {note.description && (
          <p className="mt-5 whitespace-pre-wrap leading-relaxed text-gray-300">{note.description}</p>
        )}
      </header>

      {/* 1. File Preview Section */}
      <section aria-labelledby="preview-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 id="preview-heading" className="text-lg font-semibold text-white">พรีวิวเอกสาร</h2>
          <span className="truncate text-sm text-gray-400 max-w-[200px] sm:max-w-xs">{note.fileName}</span>
        </div>
        {fileUrl ? (
          isImage ? (
            <div className="flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/20 p-2">
              <img
                src={fileUrl}
                alt={`พรีวิว ${note.title}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded"
              />
            </div>
          ) : extension === "pdf" ? (
            <PdfPreview url={fileUrl} />
          ) : (
            <p role="alert" className="rounded-lg border border-white/10 p-6 text-center text-sm text-gray-400">
              ไม่สามารถแสดงพรีวิวไฟล์นี้ได้
            </p>
          )
        ) : (
          <p role="alert" className="rounded-lg border border-white/10 p-6 text-center text-sm text-gray-400">
            ไม่สามารถโหลดพรีวิวไฟล์ได้ในขณะนี้
          </p>
        )}
      </section>

      {/* 2. Like Button & 3. Download Button */}
      <section className="border-y border-white/10 py-5">
        <NoteEngagement
          noteId={note.id}
          initialLikes={note._count.likes}
          initialDownloads={note.downloadCount}
          initialLiked={liked}
        />
      </section>

      {/* 4. Report Problem Form */}
      <ReportNoteForm noteId={note.id} />
    </div>
  );
}