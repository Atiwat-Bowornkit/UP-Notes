import type { ReactNode } from "react";

/** Big number with a label and an optional hint line. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const toneClass = {
    default: "bg-accent/15 text-accent-soft",
    warning: "bg-warning/15 text-amber-300",
    danger: "bg-danger/15 text-red-300",
    success: "bg-success/15 text-emerald-300",
  }[tone];

  return (
    <div className="card flex items-start gap-4 p-5">
      {icon && <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClass}`}>{icon}</span>}
      <div className="min-w-0">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-white">{value}</p>
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    </div>
  );
}

const shortDate = (iso: string) => {
  const [, month, day] = iso.split("-");
  return `${Number(day)}/${Number(month)}`;
};

/** Vertical bars, one per day. Pure SVG-free CSS so it stays crisp and accessible. */
export function DailyBars({ series, title, tone = "accent" }: { series: { date: string; count: number }[]; title: string; tone?: "accent" | "emerald" }) {
  const max = Math.max(1, ...series.map((d) => d.count));
  const total = series.reduce((sum, d) => sum + d.count, 0);
  const bar = tone === "emerald" ? "bg-emerald-400/80" : "bg-accent";

  return (
    <figure className="card p-5" aria-label={title}>
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="font-semibold text-white">{title}</span>
        <span className="text-xs text-gray-400">รวม {total.toLocaleString("th-TH")} ใน {series.length} วัน</span>
      </figcaption>
      <div className="mt-5 flex h-36 items-end gap-1.5" role="img" aria-label={`${title}: ${series.map((d) => `${shortDate(d.date)} = ${d.count}`).join(", ")}`}>
        {series.map((d) => (
          <div key={d.date} className="group flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            <span className="text-[10px] text-gray-400 opacity-0 transition group-hover:opacity-100">{d.count}</span>
            <div
              title={`${shortDate(d.date)}: ${d.count}`}
              className={`w-full rounded-t ${d.count === 0 ? "bg-white/10" : bar}`}
              style={{ height: d.count === 0 ? "3px" : `${Math.max(6, (d.count / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 text-[10px] text-gray-500">
        {series.map((d, i) => (
          <span key={d.date} className="min-w-0 flex-1 text-center">
            {i % 2 === (series.length - 1) % 2 ? shortDate(d.date) : ""}
          </span>
        ))}
      </div>
    </figure>
  );
}

/** Horizontal share bars: label, bar, count (+ percent). */
export function ShareBars({
  title,
  rows,
  empty = "ยังไม่มีข้อมูล",
}: {
  title: string;
  rows: { key: string; label: string; count: number; percent: number }[];
  empty?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className="card p-5" aria-label={title}>
      <h3 className="font-semibold text-white">{title}</h3>
      {rows.length === 0 || rows.every((r) => r.count === 0) ? (
        <p className="mt-4 text-sm text-gray-400">{empty}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {rows.map((r) => (
            <li key={r.key || "none"}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-gray-200">{r.label}</span>
                <span className="shrink-0 text-gray-400">
                  <span className="font-medium text-white">{r.count.toLocaleString("th-TH")}</span> · {r.percent}%
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(r.count / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
