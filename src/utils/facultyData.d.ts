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

export interface ProgramWithFaculty extends Program {
  faculty: string;
  facultyLabel: string;
}
export interface FacultyProgramSelection {
  faculty: string;
  program: string;
}
export function getAllPrograms(): ProgramWithFaculty[];
export function getFacultyOfProgram(programValue: string): string;
export function applyFacultyChange(current: FacultyProgramSelection, faculty: string): FacultyProgramSelection;
export function applyProgramChange(current: FacultyProgramSelection, program: string): FacultyProgramSelection;
export function normalizeFilter(faculty: string | undefined, program: string | undefined): FacultyProgramSelection;
