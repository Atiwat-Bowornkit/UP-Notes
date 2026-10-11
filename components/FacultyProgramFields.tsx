"use client";

import * as facultyData from "@/src/utils/facultyData";

type Props = {
  faculty: string;
  program: string;
  onChange: (next: { faculty: string; program: string }) => void;
  /** Mark both fields as required (upload). The program is only required when the faculty has a list. */
  required?: boolean;
  facultyError?: string;
  programError?: string;
  idPrefix?: string;
};

/** Faculty select + dependent program select (the program is locked until a faculty is chosen). */
export default function FacultyProgramFields({
  faculty,
  program,
  onChange,
  required = false,
  facultyError,
  programError,
  idPrefix = "fp",
}: Props) {
  const programs = facultyData.getPrograms(faculty);
  const hasPrograms = programs.length > 0;

  let programHint = "";
  if (!faculty) programHint = "เลือกคณะก่อน จึงจะเลือกสาขาได้";
  else if (!hasPrograms) programHint = "คณะนี้ยังไม่มีรายการสาขา ไม่ต้องเลือก";

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div>
        <label htmlFor={`${idPrefix}-faculty`} className="label">
          คณะ {required && <span className="text-danger">*</span>}
        </label>
        <select
          id={`${idPrefix}-faculty`}
          name="faculty"
          value={faculty}
          onChange={(e) => onChange({ faculty: e.target.value, program: "" })}
          className={`input ${facultyError ? "input-error" : ""}`}
          aria-invalid={!!facultyError}
        >
          <option value="">-- เลือกคณะ --</option>
          {facultyData.FACULTIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        {facultyError && <p className="field-error">{facultyError}</p>}
      </div>

      <div>
        <label htmlFor={`${idPrefix}-program`} className="label">
          สาขาวิชา {required && hasPrograms && <span className="text-danger">*</span>}
        </label>
        <select
          id={`${idPrefix}-program`}
          name="program"
          value={program}
          onChange={(e) => onChange({ faculty, program: e.target.value })}
          disabled={!faculty || !hasPrograms}
          className={`input ${programError ? "input-error" : ""}`}
          aria-invalid={!!programError}
        >
          <option value="">{faculty && hasPrograms ? "-- เลือกสาขา --" : "-- สาขาวิชา --"}</option>
          {programs.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {programError ? <p className="field-error">{programError}</p> : programHint && <p className="hint">{programHint}</p>}
      </div>
    </div>
  );
}
