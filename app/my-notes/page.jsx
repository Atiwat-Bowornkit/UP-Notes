'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CategoryBadge from '@/components/CategoryBadge';
import FacultyProgramFields from '@/components/FacultyProgramFields';
import * as facultyData from '@/src/utils/facultyData';
import { DownloadIcon, FileIcon, HeartIcon, UploadIcon } from '@/components/Icons';

const STATUS_BADGES = {
  PUBLISHED: { label: 'เผยแพร่แล้ว', className: 'badge-success' },
  PENDING_REVIEW: { label: 'รอผู้ดูแลอนุมัติ', className: 'badge-warning' },
  HIDDEN: { label: 'ถูกซ่อน (มีรายงาน)', className: 'badge-danger' },
};

export default function MyNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [busyDelete, setBusyDelete] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success' | 'error', text }

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/my-notes');
      if (!res.ok) throw new Error('load failed');
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Failed to load notes', err);
      setLoadError('โหลดรายการโน้ตไม่สำเร็จ กรุณารีเฟรชหน้านี้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const noteId = deletingNote.id;
    setBusyDelete(true);

    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });

      // ตรวจสอบสิทธิ์ 403
      if (res.status === 403) {
        setMessage({ type: 'error', text: '403 Forbidden: คุณไม่มีสิทธิ์จัดการโน้ตรายการนี้' });
        return;
      }
      if (!res.ok) throw new Error('เกิดข้อผิดพลาดในการลบ');

      // ลบแถวออกจากหน้าจอทันที
      setNotes(prev => prev.filter(n => n.id !== noteId));
      setMessage({ type: 'success', text: 'ลบโน้ตเรียบร้อยแล้ว' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setBusyDelete(false);
      setDeletingNote(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNote),
      });

      if (res.status === 403) {
        setMessage({ type: 'error', text: '403 Forbidden: คุณไม่มีสิทธิ์จัดการโน้ตรายการนี้' });
        return;
      }
      if (!res.ok) throw new Error('อัปเดตไม่สำเร็จ');

      // ข้อมูลอัปเดตทันทีบนหน้าจอ
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, ...editingNote } : n));
      setEditingNote(null);
      setMessage({ type: 'success', text: 'บันทึกการแก้ไขเรียบร้อยแล้ว' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="กำลังโหลดรายการโน้ต">
        <div className="skeleton h-10 w-56" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map(i => <div key={i} className="skeleton h-52" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="page-header mb-0 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="page-eyebrow">คลังของฉัน</p>
          <h1 className="page-title">โน้ตของฉัน</h1>
          <p className="page-subtitle">จัดการโน้ตที่คุณอัปโหลด ดูสถานะการอนุมัติ แก้ไข หรือลบ</p>
        </div>
        <Link href="/notes/upload" className="btn-primary">
          <UploadIcon size={16} /> อัปโหลดโน้ตใหม่
        </Link>
      </header>

      {message && (
        <div
          role={message.type === 'error' ? 'alert' : 'status'}
          className={`flex items-start justify-between gap-3 ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}
        >
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-xs underline underline-offset-2 opacity-80 hover:opacity-100"
          >
            ปิด
          </button>
        </div>
      )}

      {loadError && <p role="alert" className="alert-error">{loadError}</p>}

      {/* Empty State: หากยังไม่มีโน้ต */}
      {!loadError && notes.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 border-dashed py-16 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/5 text-gray-400">
            <FileIcon size={28} />
          </span>
          <p className="text-lg font-medium text-white">ยังไม่มีโน้ต</p>
          <p className="max-w-sm text-sm text-gray-400">
            เริ่มแบ่งปันสรุปบทเรียนของคุณให้เพื่อนๆ ได้เลย
          </p>
          <Link href="/notes/upload" className="btn-primary mt-2">ไปอัปโหลด</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => {
            const status = STATUS_BADGES[note.status] ?? { label: note.status, className: 'badge-neutral' };
            return (
              <article key={note.id} className="card flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge-accent font-mono">{note.courseCode}</span>
                    <CategoryBadge category={note.category} />
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-white">{note.title}</h3>
                  {note.faculty && (
                    <p className="mt-2 line-clamp-1 text-xs text-gray-500">
                      {facultyData.getFacultyLabel(note.faculty)}
                      {note.program && ` · ${facultyData.getProgramLabel(note.faculty, note.program)}`}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-400">
                    {note.description || 'ไม่มีคำอธิบาย'}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className={status.className}>{status.label}</span>
                    <span className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><HeartIcon size={15} /> {note.likesCount || 0}</span>
                      <span className="flex items-center gap-1.5"><DownloadIcon size={15} /> {note.downloadsCount || 0}</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                  <Link href={`/notes/${note.id}`} className="btn-ghost btn-sm">ดู</Link>
                  <button onClick={() => setEditingNote(note)} className="btn-ghost btn-sm">แก้ไข</button>
                  <button
                    onClick={() => setDeletingNote(note)}
                    className="btn-sm btn border border-danger/30 bg-danger/10 text-red-300 hover:bg-danger/20"
                  >
                    ลบ
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* โมดัลสำหรับแก้ไขข้อมูล */}
      {editingNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-title"
          onKeyDown={(e) => e.key === 'Escape' && setEditingNote(null)}
        >
          <div className="card max-h-[90vh] w-full max-w-xl animate-pop-in overflow-y-auto p-6 shadow-2xl">
            <h2 id="edit-title" className="text-xl font-semibold text-white">แก้ไขข้อมูลโน้ต</h2>
            <form onSubmit={handleUpdate} className="mt-5 space-y-4">
              <div>
                <label htmlFor="edit-note-title" className="label">ชื่อเรื่อง</label>
                <input
                  id="edit-note-title"
                  type="text"
                  value={editingNote.title}
                  onChange={e => setEditingNote({ ...editingNote, title: e.target.value })}
                  className="input"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label htmlFor="edit-note-category" className="label">หมวดหมู่</label>
                <select
                  id="edit-note-category"
                  value={editingNote.category}
                  onChange={e => setEditingNote({ ...editingNote, category: e.target.value })}
                  className="input"
                >
                  <option value="GE">GE</option>
                  <option value="MAJOR_REQUIRED">วิชาเอกบังคับ</option>
                  <option value="ELECTIVE">วิชาเลือก</option>
                </select>
              </div>
              <FacultyProgramFields
                idPrefix="edit"
                faculty={editingNote.faculty ?? ''}
                program={editingNote.program ?? ''}
                onChange={({ faculty, program }) => setEditingNote({ ...editingNote, faculty, program })}
              />
              <div>
                <label htmlFor="edit-note-description" className="label">คำอธิบาย</label>
                <textarea
                  id="edit-note-description"
                  value={editingNote.description ?? ''}
                  onChange={e => setEditingNote({ ...editingNote, description: e.target.value })}
                  className="input resize-y"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingNote(null)} className="btn-ghost" disabled={saving}>
                  ยกเลิก
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ยืนยันก่อนลบ */}
      {deletingNote && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          onKeyDown={(e) => e.key === 'Escape' && !busyDelete && setDeletingNote(null)}
        >
          <div className="card w-full max-w-sm animate-pop-in p-6 text-center shadow-2xl">
            <h2 id="delete-title" className="text-lg font-semibold text-white">ยืนยันการลบโน้ต?</h2>
            <p className="mt-2 text-sm text-gray-300">
              “{deletingNote.title}” และไฟล์ที่อัปโหลดจะถูกลบถาวร ไม่สามารถกู้คืนได้
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button onClick={() => setDeletingNote(null)} className="btn-ghost" disabled={busyDelete} autoFocus>
                ยกเลิก
              </button>
              <button onClick={handleDelete} className="btn-danger" disabled={busyDelete}>
                {busyDelete ? 'กำลังลบ...' : 'ลบโน้ต'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
