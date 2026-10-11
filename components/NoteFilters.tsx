"use client";

import Link from "next/link";
import { useState } from "react";
import * as facultyData from "@/src/utils/facultyData";
import { SearchIcon } from "@/components/Icons";
import ProgramOptions from "@/components/ProgramOptions";

type Props = {
  query: string;
  category: string;
  sort: string;
  faculty: string;
  program: string;
};

/**
 * Search form for /notes. Plain GET form. Faculty and program can be chosen in either order:
 * picking a program fills in its faculty, picking a faculty narrows the program list.
 */
export default function NoteFilters({ query, category, sort, faculty: initialFaculty, program: initialProgram }: Props) {
  const [selection, setSelection] = useState(() => facultyData.normalizeFilter(initialFaculty, initialProgram));
  const { faculty, program } = selection;

  const programs = facultyData.getPrograms(faculty);
  const hasFilters =
    Boolean(query) || (category !== "all" && category !== "ทั้งหมด") || sort !== "latest" || Boolean(faculty);

  return (
    <form action="/notes" method="get" className="card space-y-3 p-4" role="search">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_180px]">
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
          <select id="note-category" name="category" defaultValue={category} className="input">
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
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="sr-only" htmlFor="note-faculty">คณะ</label>
          <select
            id="note-faculty"
            name="faculty"
            value={faculty}
            onChange={(e) => setSelection(facultyData.applyFacultyChange(selection, e.target.value))}
            className="input"
          >
            <option value="">ทุกคณะ</option>
            {facultyData.FACULTIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="sr-only" htmlFor="note-program">สาขาวิชา</label>
          <select
            id="note-program"
            name="program"
            value={program}
            onChange={(e) => setSelection(facultyData.applyProgramChange(selection, e.target.value))}
            disabled={Boolean(faculty) && programs.length === 0}
            className="input"
          >
            <option value="">
              {faculty && programs.length === 0 ? "คณะนี้ยังไม่มีรายการสาขา" : "ทุกสาขา"}
            </option>
            <ProgramOptions faculty={faculty} />
          </select>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1 md:flex-none" type="submit">ค้นหา</button>
          {hasFilters && (
            <Link href="/notes" className="btn-ghost flex-1 md:flex-none">ล้าง</Link>
          )}
        </div>
      </div>
    </form>
  );
}
