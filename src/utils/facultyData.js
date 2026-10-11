/**
 * Faculties of the University of Phayao and their programs (สาขาวิชา).
 *
 * `value` is the stable key stored in Note.faculty / Note.program; `label` is shown in the UI.
 * Only faculties with a confirmed program list have entries in PROGRAMS — add more there as the
 * lists become available (the UI and validation pick them up automatically).
 */

const FACULTIES = [
  { value: 'agriculture', label: 'คณะเกษตรศาสตร์และทรัพยากรธรรมชาติ' },
  { value: 'ict', label: 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร (ICT)' },
  { value: 'law', label: 'คณะนิติศาสตร์' },
  { value: 'nursing', label: 'คณะพยาบาลศาสตร์' },
  { value: 'medicine', label: 'คณะแพทยศาสตร์' },
  { value: 'pharmacy', label: 'คณะเภสัชศาสตร์' },
  { value: 'business-communication', label: 'คณะบริหารธุรกิจและนิเทศศาสตร์' },
  { value: 'science', label: 'คณะวิทยาศาสตร์' },
  { value: 'medical-science', label: 'คณะวิทยาศาสตร์การแพทย์' },
  { value: 'engineering', label: 'คณะวิศวกรรมศาสตร์' },
  { value: 'liberal-arts', label: 'คณะศิลปศาสตร์' },
  { value: 'architecture-arts', label: 'คณะสถาปัตยกรรมศาสตร์และศิลปกรรมศาสตร์' },
  { value: 'allied-health', label: 'คณะสหเวชศาสตร์' },
  { value: 'energy-environment', label: 'คณะพลังงานและสิ่งแวดล้อม' },
  { value: 'dentistry', label: 'คณะทันตแพทยศาสตร์' },
  { value: 'political-science', label: 'คณะรัฐศาสตร์และสังคมศาสตร์' },
  { value: 'public-health', label: 'คณะสาธารณสุขศาสตร์' },
  { value: 'education', label: 'วิทยาลัยการศึกษา' },
  { value: 'management', label: 'วิทยาลัยการจัดการ' },
];

const PROGRAMS = {
  ict: [
    { value: 'computer-engineering', label: 'วิศวกรรมคอมพิวเตอร์' },
    { value: 'software-engineering', label: 'วิศวกรรมซอฟต์แวร์' },
    { value: 'computer-science', label: 'วิทยาการคอมพิวเตอร์' },
    { value: 'information-technology', label: 'เทคโนโลยีสารสนเทศ' },
    { value: 'digital-business', label: 'ธุรกิจดิจิทัล' },
    { value: 'geoinformatics', label: 'ภูมิสารสนเทศศาสตร์' },
    { value: 'computer-graphics-multimedia', label: 'เทคโนโลยีคอมพิวเตอร์กราฟิกและมัลติมีเดีย' },
    { value: 'data-science', label: 'วิทยาการข้อมูลและการประยุกต์' },
  ],
  'business-communication': [
    { value: 'business-management', label: 'การจัดการธุรกิจ' },
    { value: 'accounting', label: 'การบัญชี' },
    { value: 'communication-management', label: 'การจัดการการสื่อสาร' },
    { value: 'tourism-hotel', label: 'การท่องเที่ยวและการโรงแรม' },
    { value: 'economics', label: 'เศรษฐศาสตร์' },
    { value: 'finance-investment', label: 'การเงินและการลงทุน' },
    { value: 'new-media', label: 'การสื่อสารสื่อใหม่' },
    { value: 'digital-marketing', label: 'การตลาดดิจิทัล' },
  ],
  agriculture: [
    { value: 'agriculture', label: 'เกษตรศาสตร์' },
    { value: 'fishery-innovation', label: 'เทคโนโลยีนวัตกรรมการประมง' },
    { value: 'food-safety', label: 'ความปลอดภัยทางอาหาร' },
    { value: 'food-science', label: 'วิทยาศาสตร์และเทคโนโลยีการอาหาร' },
    { value: 'animal-science', label: 'สัตวศาสตร์และเทคโนโลยีการเกษตร' },
  ],
};

function getFaculty(value) {
  return FACULTIES.find((f) => f.value === value) || null;
}

function getFacultyLabel(value) {
  return getFaculty(value)?.label ?? '';
}

/** Programs of a faculty; [] when the faculty is unknown or has no list yet. */
function getPrograms(facultyValue) {
  return Object.prototype.hasOwnProperty.call(PROGRAMS, facultyValue) ? PROGRAMS[facultyValue] : [];
}

function getProgramLabel(facultyValue, programValue) {
  return getPrograms(facultyValue).find((p) => p.value === programValue)?.label ?? '';
}

function isValidFaculty(value) {
  return getFaculty(value) !== null;
}

/** A program is valid only for the faculty it belongs to. */
function isValidProgram(facultyValue, programValue) {
  return getPrograms(facultyValue).some((p) => p.value === programValue);
}

/** Every program of every faculty, each tagged with its faculty (program keys are unique overall). */
function getAllPrograms() {
  return FACULTIES.flatMap((f) =>
    getPrograms(f.value).map((p) => ({ ...p, faculty: f.value, facultyLabel: f.label })),
  );
}

/** Faculty key a program belongs to, or '' when the program is unknown. */
function getFacultyOfProgram(programValue) {
  return getAllPrograms().find((p) => p.value === programValue)?.faculty ?? '';
}

/**
 * Faculty and program can be picked in either order:
 * - choosing a faculty drops a program that belongs to another faculty
 * - choosing a program fills in its faculty
 * - clearing the faculty also clears the program
 */
function applyFacultyChange(current, faculty) {
  const keep = faculty && current.program && getFacultyOfProgram(current.program) === faculty;
  return { faculty: faculty || '', program: keep ? current.program : '' };
}

function applyProgramChange(current, program) {
  if (!program) return { faculty: current.faculty, program: '' };
  return { faculty: getFacultyOfProgram(program) || current.faculty, program };
}

/**
 * Sanitise filter values coming from a URL: unknown values are dropped, a program fills in its
 * faculty, and a program that contradicts the chosen faculty is ignored (the faculty wins).
 */
function normalizeFilter(faculty, program) {
  let nextFaculty = isValidFaculty(faculty) ? faculty : '';
  let nextProgram = '';
  const owner = getFacultyOfProgram(program);
  if (owner && (!nextFaculty || nextFaculty === owner)) {
    nextProgram = program;
    nextFaculty = owner;
  }
  return { faculty: nextFaculty, program: nextProgram };
}

module.exports = {
  getAllPrograms,
  getFacultyOfProgram,
  applyFacultyChange,
  applyProgramChange,
  normalizeFilter,
  FACULTIES,
  PROGRAMS,
  getFaculty,
  getFacultyLabel,
  getPrograms,
  getProgramLabel,
  isValidFaculty,
  isValidProgram,
};
