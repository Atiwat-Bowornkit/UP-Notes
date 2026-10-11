"use client";

import { useState } from "react";
import { DownloadIcon, HeartIcon } from "@/components/Icons";

interface NoteEngagementProps {
  noteId: string;
  initialLikes: number;
  initialDownloads: number;
  initialLiked: boolean;
}

export default function NoteEngagement({
  noteId,
  initialLikes,
  initialDownloads,
  initialLiked,
}: NoteEngagementProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [downloads, setDownloads] = useState(initialDownloads);
  const [liked, setLiked] = useState(initialLiked);
  const [isLiking, setIsLiking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch(`/api/notes/${noteId}/like`, {
        method: liked ? "DELETE" : "POST",
      });

      if (res.status === 401) {
        setShowLoginModal(true);
        return;
      }

      if (res.ok) {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
      }
    } catch {
      // Fallback if fetch fails
    } finally {
      setIsLiking(false);
    }
  };

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      const res = await fetch(`/api/notes/${noteId}/download`, {
        method: "POST",
      });

      if (res.status === 401) {
        setShowLoginModal(true);
        return;
      }

      if (!res.ok) {
        setDownloadError("ไม่สามารถดาวน์โหลดไฟล์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      const data = await res.json();
      if (data.downloadUrl) {
        setDownloads((prev) => prev + 1);
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = data.fileName || "note";
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        setDownloadError("ไม่สามารถดาวน์โหลดไฟล์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
      }
    } catch {
      setDownloadError("ไม่สามารถดาวน์โหลดไฟล์ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          aria-pressed={liked}
          className={`btn border ${
            liked
              ? "border-red-400/50 bg-red-500/15 text-red-300 hover:bg-red-500/25"
              : "border-white/15 bg-white/[0.03] text-gray-200 hover:border-white/30 hover:bg-white/[0.07]"
          }`}
        >
          <HeartIcon filled={liked} size={17} />
          <span>{liked ? "ถูกใจแล้ว" : "ถูกใจ"}</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{likes}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="btn-primary"
        >
          <DownloadIcon size={17} />
          <span>{isDownloading ? "กำลังเตรียมไฟล์..." : "ดาวน์โหลด"}</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{downloads}</span>
        </button>
      </div>

      {downloadError && (
        <p role="alert" className="alert-error">
          {downloadError}
        </p>
      )}

      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-title"
          onKeyDown={(e) => e.key === "Escape" && setShowLoginModal(false)}
        >
          <div className="card w-full max-w-sm animate-pop-in p-6 text-center shadow-2xl">
            <h3 id="login-modal-title" className="text-lg font-semibold text-white">กรุณาเข้าสู่ระบบ</h3>
            <p className="mt-2 text-sm text-gray-300">เข้าสู่ระบบก่อนกดถูกใจหรือดาวน์โหลดโน้ต</p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setShowLoginModal(false)} className="btn-ghost" autoFocus>
                ปิด
              </button>
              <a href="/login" className="btn-primary">
                เข้าสู่ระบบ
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
