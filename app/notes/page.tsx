import Link from "next/link";
import { getPublishedNotes } from "@/modules/notes/browseService";
import CategoryBadge from "@/components/CategoryBadge";
import { ArrowRightIcon, DownloadIcon, HeartIcon, InboxIcon, SearchIcon, UploadIcon, UserIcon } from "@/components/Icons";

const PAGE_SIZE = 12;

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

  const hasFilters = Boolean(query) || (selectedCategory !== "all" && selectedCategory !== "ทั้งหมด") || sort !== "latest";

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

      {/* Search and filters */}
      <form
        action="/notes"
        method="get"
        className="card grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_200px_180px_auto]"
        role="search"
      >
        <div className="relative">
          <label className="sr-only" htmlFor="note-search">รหัสวิชาหรือชื่อวิชา</label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            id="note-search"
            name="q"
            defaultValue={query}
            placeholder="รหัสวิชา / ชื่อวิชา เช่น 225311"
            className="input pl-11"
          />
        </div>
        <div>
          <label className="sr-only" htmlFor="note-category">หมวดหมู่</label>
          <select id="note-category" name="category" defaultValue={selectedCategory} className="input">
            <option value="all">ทุกหมวดหมู่</option>
            <option value="GE">GE</option>
            <option value="MAJOR_REQUIRED">วิชาเอกบังคับ</option>
            <option value="ELECTIVE">วิชาเลือก</option>
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="note-sort">เรียงลำดับ</label>
          <select id="note-sort" name="sort" defaultValue={sort} className="input">
            <option value="latest">ล่าสุด</option>
            <option value="popular">ยอดนิยมสูงสุด</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1 md:flex-none" type="submit">ค้นหา</button>
          {hasFilters && (
            <Link href="/notes" className="btn-ghost flex-1 md:flex-none">ล้าง</Link>
          )}
        </div>
      </form>

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
            {notes.map((note) => {
              const likesCount = note._count?.likes ?? note.likes ?? 0;
              const downloadsCount = note.downloadCount ?? note.downloads ?? 0;
              const authorName = typeof note.author === "string" ? note.author : note.author?.name ?? "ไม่ระบุชื่อ";
              const courseCode = note.courseCode ?? note.code ?? "";

              return (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="card card-hover group flex min-h-52 flex-col"
                >
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
            })}
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
