'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateUploadFile, validateCourseCode } from '@/src/utils/uploadHelper';

const CATEGORIES = ['GE', 'วิชาเอกบังคับ', 'วิชาเลือก'];

export default function UploadNotePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    category: CATEGORIES[0],
    description: ''
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setFileError('');
      return;
    }

    const validation = validateUploadFile(selectedFile);
    if (!validation.valid) {
      setFileError(validation.error);
      setFile(null);
    } else {
      setFileError('');
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) errors.title = 'กรุณากรอกชื่อเรื่อง';
    if (!formData.courseCode.trim()) {
      errors.courseCode = 'กรุณากรอกรหัสวิชา';
    } else if (!validateCourseCode(formData.courseCode)) {
      errors.courseCode = 'รหัสวิชาต้องเป็นตัวเลข 6 หลัก (เช่น 225311)';
    }
    if (!formData.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
    if (!file) errors.file = fileError || 'กรุณาเลือกไฟล์';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      data.append('file', file);

      const res = await fetch('/api/notes/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'อัปโหลดไม่สำเร็จ');

      router.push(`/notes/${result.note.id}`); 
    } catch (err) {
      alert(`เกิดข้อผิดพลาด: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 rounded-xl shadow-2xl" style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
      <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'white' }}>อัปโหลดโน้ต</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#cbd5e1' }}>ชื่อเรื่อง *</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleInputChange} 
            className="w-full p-3 rounded-lg outline-none"
            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #cbd5e1' }}
            placeholder="กรอกชื่อโน้ต"
          />
          {fieldErrors.title && <p className="text-red-400 text-sm mt-1">{fieldErrors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#cbd5e1' }}>รหัสวิชา (6 หลัก) *</label>
          <input 
            type="text" 
            name="courseCode" 
            maxLength={6} 
            value={formData.courseCode} 
            onChange={handleInputChange} 
            className="w-full p-3 rounded-lg outline-none"
            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #cbd5e1' }}
            placeholder="เช่น 225311"
          />
          {fieldErrors.courseCode && <p className="text-red-400 text-sm mt-1">{fieldErrors.courseCode}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#cbd5e1' }}>หมวดหมู่ *</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleInputChange} 
            className="w-full p-3 rounded-lg outline-none"
            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #cbd5e1' }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#cbd5e1' }}>คำอธิบาย *</label>
          <textarea 
            name="description" 
            rows={4} 
            value={formData.description} 
            onChange={handleInputChange} 
            className="w-full p-3 rounded-lg outline-none"
            style={{ backgroundColor: 'white', color: 'black', border: '1px solid #cbd5e1' }}
            placeholder="อธิบายเนื้อหาคร่าวๆ"
          />
          {fieldErrors.description && <p className="text-red-400 text-sm mt-1">{fieldErrors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#cbd5e1' }}>ไฟล์ (PDF, PNG, JPG ไม่เกิน 10MB) *</label>
          <input 
            type="file" 
            accept=".pdf,.png,.jpg,.jpeg" 
            onChange={handleFileChange} 
            className="w-full p-2 rounded-lg"
            style={{ color: '#cbd5e1' }}
          />
          {file && (
            <p className="text-sm mt-2" style={{ color: '#4ade80' }}>
              ไฟล์ที่เลือก: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </p>
          )}
          {fileError && <p className="text-red-400 text-sm mt-1">{fileError}</p>}
          {fieldErrors.file && <p className="text-red-400 text-sm mt-1">{fieldErrors.file}</p>}
        </div>

        <div className="flex gap-4 mt-6">
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="w-1/3 py-3 px-4 font-bold rounded-lg transition-all shadow-md"
            style={{ 
              backgroundColor: '#f87171', 
              color: 'white', 
              cursor: 'pointer',
              border: '1px solid #ef4444'
            }}
          >
            ยกเลิก
          </button>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !!fileError || !file} 
            className="w-2/3 py-3 px-4 font-bold rounded-lg transition-all shadow-md"
            style={{ 
              backgroundColor: (isSubmitting || !!fileError || !file) ? '#334155' : '#2563eb', 
              color: (isSubmitting || !!fileError || !file) ? '#94a3b8' : 'white',
              cursor: (isSubmitting || !!fileError || !file) ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'กำลังอัปโหลด...' : 'เผยแพร่โน้ต'}
          </button>
        </div>
      </form>
    </div>
  );
}