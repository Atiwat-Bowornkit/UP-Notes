"use client";

import { useState } from "react";

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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleLikeToggle}
          disabled={isLiking}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
            liked
              ? "border-red-500 bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "border-white/20 bg-panel text-white hover:border-white/40"
          }`}
        >
          <span className={liked ? "text-red-500" : "text-gray-400"}>
            {liked ? "♥" : "♡"}
          </span>
          <span>{liked ? "ถูกใจแล้ว" : "ถูกใจ"}</span>
          <span className="ml-1 rounded bg-white/10 px-2 py-0.5 text-xs">{likes}</span>
        </button>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-lg border border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-accent hover:bg-accent/20"
        >
          <span>↓</span>
          <span>ดาวน์โหลด</span>
          <span className="ml-1 rounded bg-white/10 px-2 py-0.5 text-xs">{downloads}</span>
        </button>
      </div>

      {downloadError && (
        <p role="alert" className="text-sm text-red-400">
          {downloadError}
        </p>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-panel p-6 shadow-2xl text-center">
            <h3 className="text-lg font-semibold text-white">กรุณาเข้าสู่ระบบ</h3>
            <p className="mt-2 text-sm text-gray-300">กรุณาเข้าสู่ระบบก่อนกดถูกใจ</p>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="btn-ghost"
              >
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
