"use client";

import { useEffect } from "react";
import { AlertIcon } from "@/components/Icons";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="card mx-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center" role="alert">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-danger/15 text-red-300">
        <AlertIcon size={28} />
      </span>
      <h1 className="text-xl font-semibold text-white">เกิดข้อผิดพลาดบางอย่าง</h1>
      <p className="max-w-sm text-sm text-gray-400">
        ระบบโหลดหน้านี้ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หากยังไม่หายให้แจ้งผู้ดูแลระบบ
      </p>
      <button onClick={reset} className="btn-primary mt-3">ลองใหม่</button>
    </section>
  );
}
