import Link from "next/link";
import { getPublishedNotes } from "@/modules/notes/browseService";
import NoteCard from "@/components/NoteCard";
import NoteFilters from "@/components/NoteFilters";
import * as facultyData from "@/src/utils/facultyData";
import { InboxIcon, UploadIcon } from "@/components/Icons";

const PAGE_SIZE = 12;

type SearchParams = {
  q?: string;
  category?: string;
  faculty?: string;
  program?: string;
  sort?: string;
  page?: string;
};

export const metadata = { title: "ค้นหาโน้ต" };

export default async function NotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = (searchParams.q ?? "").trim();
  const selectedCategory = searchParams.category ?? "all";
  const sort = searchParams.sort === "popular" ? "popular" : "latest";
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);
  // Either filter works alone; a program implies its faculty and invalid values are dropped
  const { faculty: selectedFaculty, program: selectedProgram } = facultyData.normalizeFilter(
    searchParams.faculty,
    searchParams.program,
  );

  // Fetch published notes via browseService (enforces status = 'PUBLISHED' and NFR-01 optimization)
  const result = await getPublishedNotes({
    searchQuery: query,
    category: selectedCategory,
    faculty: selectedFaculty,
    program: selectedProgram,
    sortBy: sort,
    page,
    pageSize: PAGE_SIZE,
  });

  const notes = result.data ?? [];
  const { totalCount, totalPages, currentPage } = result.pagination;

  const pageHref = (targetPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (selectedCategory !== "all" && selectedCategory !== "ทั้งหมด") {
      params.set("category", selectedCategory);
    }
    if (selectedFaculty) params.set("faculty", selectedFaculty);
    if (selectedProgram) params.set("program", selectedProgram);
    if (sort !== "latest") {
      params.set("sort", sort);
    }

    params.set("page", String(targetPage));
    return `/notes?${params.toString()}`;
  };

  const hasFilters =
    Boolean(query) ||
    (selectedCategory !== "all" && selectedCategory !== "ทั้งหมด") ||
    sort !== "latest" ||
    Boolean(selectedFaculty);

  return (
    <div className="space-y-6">
      <header className="page-header mb-0 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow">UP-Notes Library</p>
          <h1 className="page-title">ค้นหาโน้ตย่อ</h1>
          <p className="page-subtitle">ค้นหาเอกสารประกอบการเรียนจากรหัสวิชาหรือชื่อวิชา</p>
        </div>
        <Link href="/notes/upload" className="btn-primary">
          <UploadIcon size={16} /> แบ่งปันโน้ตของคุณ
        </Link>
      </header>

      <NoteFilters
        query={query}
        category={selectedCategory}
        sort={sort}
        faculty={selectedFaculty}
        program={selectedProgram}
      />

      {selectedFaculty && (
        <ul className="flex flex-wrap items-center gap-2 text-sm" aria-label="ตัวกรองที่ใช้อยู่">
          <li className="badge-accent">{facultyData.getFacultyLabel(selectedFaculty)}</li>
          {selectedProgram && (
            <li className="badge-accent">{facultyData.getProgramLabel(selectedFaculty, selectedProgram)}</li>
          )}
        </ul>
      )}

      <p className="text-sm text-gray-400" aria-live="polite">
        พบ <span className="font-semibold text-white">{totalCount.toLocaleString("th-TH")}</span> รายการ
        {query && <> สำหรับ “{query}”</>}
      </p>

      {notes.length === 0 ? (
        <section className="card flex flex-col items-center gap-3 py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/5 text-gray-400">
            <InboxIcon size={28} />
          </span>
          <h2 className="text-xl font-medium text-white">ไม่พบโน้ตย่อ</h2>
          <p className="max-w-sm text-sm text-gray-400">
            ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่ หรือเป็นคนแรกที่แบ่งปันโน้ตวิชานี้
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {hasFilters && <Link href="/notes" className="btn-ghost">ล้างตัวกรอง</Link>}
            <Link href="/notes/upload" className="btn-primary">อัปโหลดโน้ตย่อ</Link>
          </div>
        </section>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav aria-label="แบ่งหน้า" className="flex items-center justify-center gap-4 py-3 text-sm">
              {currentPage > 1 ? (
                <Link className="btn-ghost" href={pageHref(currentPage - 1)}>ก่อนหน้า</Link>
              ) : (
                <span className="btn-ghost pointer-events-none opacity-40">ก่อนหน้า</span>
              )}
              <span className="text-gray-400">
                หน้า {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link className="btn-ghost" href={pageHref(currentPage + 1)}>ถัดไป</Link>
              ) : (
                <span className="btn-ghost pointer-events-none opacity-40">ถัดไป</span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
