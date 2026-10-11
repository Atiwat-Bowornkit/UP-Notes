export default function LoadingNotes() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="กำลังโหลดโน้ต">
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-9 w-64" />
      </div>
      <div className="skeleton h-28" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-52" />
        ))}
      </div>
    </div>
  );
}
