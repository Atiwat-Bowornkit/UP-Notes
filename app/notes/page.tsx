import Link from "next/link";
import { getPublishedNotes } from "@/modules/notes/browseService";
import { calculatePopularityScore, filterNotesBySearch } from "@/src/utils/browseHelper";
import { getCourseName } from "@/src/Nonthakorn";

const PAGE_SIZE = 12;

const CATEGORY_LABELS: Record<string, string> = {
  GE: "GE",
  MAJOR_REQUIRED: "วิชาเอกบังคับ",
  ELECTIVE: "วิชาเลือก",
  "วิชาเอกบังคับ": "วิชาเอกบังคับ",
  "วิชาเลือก": "วิชาเลือก",
};

type SearchParams = {
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const query = (searchParams.q ?? "").trim();
  const selectedCategory = searchParams.category ?? "all";
  const sort = searchParams.sort === "popular" ? "popular" : "latest";
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1);

  // Fetch published notes via browseService (enforces status = 'PUBLISHED' and NFR-01 optimization)
  const result = await getPublishedNotes({
    searchQuery: query,
    category: selectedCategory,
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
    if (sort !== "latest") {
      params.set("sort", sort);
    }

    params.set("page", String(targetPage));
    return `/notes?${params.toString()}`;
  };

  return (
    <div className="space-y-7">
      <header className="border-b border-white/10 pb-5">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">UP-Notes Library</p>
        <h1 className="mt-2 text-3xl font-semibold">ค้นหาโน้ตย่อ</h1>
        <p className="mt-2 text-sm text-gray-400">ค้นหาเอกสารประกอบการเรียนจากรหัสวิชาหรือชื่อวิชา</p>
      </header>

      {/* 1. Header / Filter section */}
      <form action="/notes" method="get" className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_170px_auto_auto]">
        <label className="sr-only" htmlFor="note-search">รหัสวิชาหรือชื่อวิชา</label>
        <input
          id="note-search"
          name="q"
          defaultValue={query}
          placeholder="รหัสวิชา / ชื่อวิชา เช่น 225311"
          className="min-w-0 rounded-lg border border-white/15 bg-panel px-4 py-3 text-sm outline-none focus:border-accent"
        />
        <select
          name="category"
          defaultValue={selectedCategory}
          className="rounded-lg border border-white/15 bg-panel px-3 py-3 text-sm"
        >
          <option value="all">ทั้งหมด</option>
          <option value="GE">GE</option>
          <option value="MAJOR_REQUIRED">วิชาเอกบังคับ</option>
          <option value="ELECTIVE">วิชาเลือก</option>
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="rounded-lg border border-white/15 bg-panel px-3 py-3 text-sm"
        >
          <option value="latest">ล่าสุด</option>
          <option value="popular">ยอดนิยมสูงสุด</option>
        </select>
        <button className="btn-primary" type="submit">ค้นหา</button>
        <Link href="/notes" className="btn-ghost flex items-center justify-center">ล้างตัวกรอง</Link>
      </form>

      {/* Item count and upload shortcut */}
      <div className="flex items-center justify-between text-sm text-gray-400">
        <p>พบ {totalCount.toLocaleString("th-TH")} รายการ</p>
        <Link href="/notes/upload" className="text-accent hover:text-white">
          แบ่งปันโน้ตของคุณ +
        </Link>
      </div>

      {/* 2. Grid note cards section / 3. Empty State */}
      {notes.length === 0 ? (
        <section className="border-y border-white/10 py-16 text-center">
          <h2 className="text-xl font-medium">ไม่พบโน้ตย่อในวิชานี้</h2>
          <p className="mt-2 text-sm text-gray-400">ลองเปลี่ยนคำค้นหาหรือตัวกรองหมวดหมู่</p>
          <Link href="/notes/upload" className="btn-primary mt-5 inline-block">
            อัปโหลดโน้ตย่อ
          </Link>
        </section>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => {
              const likesCount = note._count?.likes ?? note.likes ?? 0;
              const downloadsCount = note.downloadCount ?? note.downloads ?? 0;
              const authorName = typeof note.author === "string" ? note.author : note.author?.name ?? "ไม่ระบุชื่อ";
              const categoryLabel = CATEGORY_LABELS[note.category] ?? note.category ?? "ทั่วไป";
              const courseCode = note.courseCode ?? note.code ?? "";

              return (
                <article key={note.id} className="flex min-h-56 flex-col border border-white/10 bg-panel p-5 rounded-lg shadow-sm hover:border-accent/50 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-accent">{courseCode}</p>
                      <h2 className="mt-2 text-lg font-semibold leading-snug text-white">{note.title}</h2>
                    </div>
                    <span className="shrink-0 border border-white/15 px-2 py-1 text-xs text-gray-300 rounded">
                      {categoryLabel}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-400">โดย {authorName}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-gray-400">
                    <span className="flex items-center gap-3">
                      <span>♥ {likesCount}</span>
                      <span>↓ {downloadsCount}</span>
                    </span>
                    <Link
                      href={`/notes/${note.id}`}
                      className="text-sm font-medium text-white hover:text-accent flex items-center gap-1 transition"
                    >
                      ดูรายละเอียด / พรีวิว <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <nav aria-label="แบ่งหน้า" className="flex items-center justify-center gap-4 py-3 text-sm">
              {currentPage > 1 ? (
                <Link className="btn-ghost" href={pageHref(currentPage - 1)}>
                  ก่อนหน้า
                </Link>
              ) : (
                <span className="text-gray-500 cursor-not-allowed">ก่อนหน้า</span>
              )}
              <span className="text-gray-400">
                หน้า {currentPage} / {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link className="btn-ghost" href={pageHref(currentPage + 1)}>
                  ถัดไป
                </Link>
              ) : (
                <span className="text-gray-500 cursor-not-allowed">ถัดไป</span>
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}