'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MyNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/my-notes');
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Failed to load notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    // ป๊อปอัปยืนยันก่อนลบ
    if (!window.confirm('ยืนยันการลบโน้ตนี้? (ไฟล์ใน Storage และข้อมูลในระบบจะถูกลบถาวร)')) return;

    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });

      // ตรวจสอบสิทธิ์ 403
      if (res.status === 403) {
        alert('403 Forbidden: คุณไม่มีสิทธิ์จัดการโน้ตรายการนี้');
        return;
      }
      if (!res.ok) throw new Error('เกิดข้อผิดพลาดในการลบ');

      // ลบแถวออกจากหน้าจอทันที
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/notes/${editingNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNote),
      });

      if (res.status === 403) {
        alert('403 Forbidden: คุณไม่มีสิทธิ์จัดการโน้ตรายการนี้');
        return;
      }
      if (!res.ok) throw new Error('อัปเดตไม่สำเร็จ');

      // ข้อมูลอัปเดตทันทีบนหน้าจอ
      setNotes(prev => prev.map(n => n.id === editingNote.id ? editingNote : n));
      setEditingNote(null);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">กำลังโหลดรายการโน้ต...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">โน้ตของฉัน</h1>
        <Link href="/notes/upload" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          + อัปโหลดโน้ตใหม่
        </Link>
      </div>

      {/* Empty State: หากยังไม่มีโน้ต */}
      {notes.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border border-dashed rounded-xl">
          <p className="text-gray-500 mb-4 text-lg">ยังไม่มีโน้ต</p>
          <Link href="/notes/upload" className="inline-block bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
            ไปอัปโหลด
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {notes.map(note => (
            <div key={note.id} className="border rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded font-mono font-medium">
                    {note.courseCode}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${
                    note.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {note.status === 'PUBLISHED' ? 'แสดงอยู่' : 'Pending Review'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{note.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{note.description}</p>
                <div className="flex gap-4 mt-4 text-sm text-gray-500">
                  <span>❤️ {note.likesCount || 0} ไลก์</span>
                  <span>📥 {note.downloadsCount || 0} ดาวน์โหลด</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t">
                <button 
                  onClick={() => setEditingNote(note)} 
                  className="py-1.5 text-sm font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                >
                  แก้ไข
                </button>
                <button 
                  onClick={() => handleDelete(note.id)} 
                  className="py-1.5 text-sm font-medium bg-red-50 text-red-600 rounded hover:bg-red-100 transition"
                >
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* โมดัลสำหรับแก้ไขข้อมูล */}
      {editingNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">แก้ไขข้อมูลโน้ต</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อเรื่อง</label>
                <input 
                  type="text" 
                  value={editingNote.title} 
                  onChange={e => setEditingNote({...editingNote, title: e.target.value})} 
                  className="w-full border p-2 rounded-md" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่</label>
                <select 
                  value={editingNote.category} 
                  onChange={e => setEditingNote({...editingNote, category: e.target.value})} 
                  className="w-full border p-2 rounded-md"
                >
                  <option value="GE">GE</option>
                  <option value="MAJOR_REQUIRED">วิชาเอกบังคับ</option>
                  <option value="ELECTIVE">วิชาเลือก</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">คำอธิบาย</label>
                <textarea 
                  value={editingNote.description ?? ""} 
                  onChange={e => setEditingNote({...editingNote, description: e.target.value})} 
                  className="w-full border p-2 rounded-md" 
                  rows={3} 
                  required 
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setEditingNote(null)} 
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}