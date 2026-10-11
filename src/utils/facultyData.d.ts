export interface Faculty {
  value: string;
  label: string;
}
export interface Program {
  value: string;
  label: string;
}

export const FACULTIES: Faculty[];
export const PROGRAMS: Record<string, Program[]>;
export function getFaculty(value: string): Faculty | null;
export function getFacultyLabel(value: string): string;
export function getPrograms(facultyValue: string): Program[];
export function getProgramLabel(facultyValue: string, programValue: string): string;
export function isValidFaculty(value: string): boolean;
export function isValidProgram(facultyValue: string, programValue: string): boolean;
