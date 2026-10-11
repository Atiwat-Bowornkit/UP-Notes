const CATEGORY_STYLES: Record<string, { label: string; className: string }> = {
  GE: { label: "GE", className: "badge border-sky-400/30 bg-sky-400/10 text-sky-300" },
  MAJOR_REQUIRED: {
    label: "วิชาเอกบังคับ",
    className: "badge border-violet-400/30 bg-violet-400/10 text-violet-300",
  },
  ELECTIVE: { label: "วิชาเลือก", className: "badge border-teal-400/30 bg-teal-400/10 text-teal-300" },
};

// browseService maps categories to Thai labels in some code paths
const ALIASES: Record<string, string> = {
  "วิชาเอกบังคับ": "MAJOR_REQUIRED",
  "วิชาเลือก": "ELECTIVE",
};

export function categoryLabel(category: string | null | undefined): string {
  const key = ALIASES[category ?? ""] ?? category ?? "";
  return CATEGORY_STYLES[key]?.label ?? (category || "ทั่วไป");
}

export default function CategoryBadge({ category }: { category: string | null | undefined }) {
  const key = ALIASES[category ?? ""] ?? category ?? "";
  const style = CATEGORY_STYLES[key];
  return <span className={style?.className ?? "badge-neutral"}>{categoryLabel(category)}</span>;
}
