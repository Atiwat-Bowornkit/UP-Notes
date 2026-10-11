import Link from "next/link";
import CategoryBadge from "@/components/CategoryBadge";
import { ArrowRightIcon, DownloadIcon, HeartIcon, UserIcon } from "@/components/Icons";
import * as facultyData from "@/src/utils/facultyData";

// browseService returns plain objects with a few alias fields, so the shape is deliberately loose
type NoteCardData = {
  id: string;
  title: string;
  courseCode?: string;
  code?: string;
  category?: string;
  faculty?: string | null;
  program?: string | null;
  author?: string | { name?: string | null } | null;
  likes?: number;
  downloads?: number;
  downloadCount?: number;
  _count?: { likes?: number };
};

/** One note in a grid: whole card is a link to the note page. */
export default function NoteCard({ note }: { note: NoteCardData }) {
  const likesCount = note._count?.likes ?? note.likes ?? 0;
  const downloadsCount = note.downloadCount ?? note.downloads ?? 0;
  const authorName = typeof note.author === "string" ? note.author : note.author?.name ?? "ไม่ระบุชื่อ";
  const courseCode = note.courseCode ?? note.code ?? "";

  return (
    <Link href={`/notes/${note.id}`} className="card card-hover group flex min-h-52 flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="badge-accent font-mono">{courseCode}</span>
        <CategoryBadge category={note.category} />
      </div>
      <h2 className="mt-4 line-clamp-2 text-lg font-semibold leading-snug text-white group-hover:text-accent-soft">
        {note.title}
      </h2>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-400">
        <UserIcon size={14} /> {authorName}
      </p>
      {note.faculty && (
        <p className="mt-2 line-clamp-2 text-xs text-gray-500">
          {facultyData.getFacultyLabel(note.faculty)}
          {note.program && ` · ${facultyData.getProgramLabel(note.faculty, note.program)}`}
        </p>
      )}
      <div className="mt-auto flex items-center justify-between pt-5 text-sm text-gray-400">
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><HeartIcon size={15} /> {likesCount}</span>
          <span className="flex items-center gap-1.5"><DownloadIcon size={15} /> {downloadsCount}</span>
        </span>
        <span className="flex items-center gap-1 font-medium text-white transition group-hover:gap-2 group-hover:text-accent-soft">
          ดูรายละเอียด <ArrowRightIcon size={15} />
        </span>
      </div>
    </Link>
  );
}
