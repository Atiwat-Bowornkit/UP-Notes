import * as facultyData from "@/src/utils/facultyData";

/**
 * <option>s for a program select. With a faculty chosen only its programs are listed; without
 * one, every program is listed grouped by faculty so a program can be picked first.
 */
export default function ProgramOptions({ faculty }: { faculty: string }) {
  if (faculty) {
    return (
      <>
        {facultyData.getPrograms(faculty).map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </>
    );
  }

  return (
    <>
      {facultyData.FACULTIES.filter((f) => facultyData.getPrograms(f.value).length > 0).map((f) => (
        <optgroup key={f.value} label={f.label}>
          {facultyData.getPrograms(f.value).map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </optgroup>
      ))}
    </>
  );
}
