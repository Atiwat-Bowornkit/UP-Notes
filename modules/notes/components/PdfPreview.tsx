"use client";

import { useState } from "react";

interface PdfPreviewProps {
  url: string;
}

export default function PdfPreview({ url }: PdfPreviewProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      {loading && (
        <div className="skeleton flex h-64 w-full items-center justify-center rounded-none text-sm text-gray-400">
          กำลังโหลดพรีวิวเอกสาร...
        </div>
      )}
      <iframe
        src={`${url}#page=1&view=FitH`}
        title="PDF Preview"
        className="h-[65vh] w-full min-w-full border-none md:h-[75vh]"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
