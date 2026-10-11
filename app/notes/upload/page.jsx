'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateUploadFile, validateCourseCode } from '@/src/utils/uploadHelper';
import { createClient } from '@/lib/supabase/client';
import { CheckIcon, CloseIcon, FileIcon, UploadIcon } from '@/components/Icons';
import FacultyProgramFields from '@/components/FacultyProgramFields';
import * as facultyData from '@/src/utils/facultyData';

const CATEGORIES = [
  { value: 'GE', label: 'GE' },
  { value: 'MAJOR_REQUIRED', label: 'วิชาเอกบังคับ' },
  { value: 'ELECTIVE', label: 'วิชาเลือก' },
];

// Never assume an error response is JSON (a proxy may answer with plain text, e.g. "Request Entity Too Large")
async function readJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      error: res.status === 413
        ? 'ไฟล์ใหญ่เกินกว่าที่เซิร์ฟเวอร์รับได้'
        : `เซิร์ฟเวอร์ตอบกลับผิดรูปแบบ (${res.status})`,
    };
  }
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await readJson(res);
  if (!res.ok) throw new Error(data.error || 'อัปโหลดไม่สำเร็จ');
  return data;
}

const CATEGORY_HINTS = {
  GE: 'วิชาศึกษาทั่วไป',
  MAJOR_REQUIRED: 'วิชาบังคับของสาขา',
  ELECTIVE: 'วิชาเลือกเสรี/เลือกสาขา',
};

const STAGES = ['เตรียมการ', 'อัปโหลดไฟล์', 'บันทึกโน้ต'];

function SectionTitle({ n, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/20 text-sm font-semibold text-accent-soft">{n}</span>
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        {text && <p className="mt-0.5 text-sm text-gray-400">{text}</p>}
      </div>
    </div>
  );
}

function formatSize(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function UploadNotePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    courseCode: '',
    category: CATEGORIES[0].value,
    faculty: '',
    program: '',
    description: ''
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stage, setStage] = useState(0); // 0 idle, 1 preparing, 2 uploading file, 3 saving note
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const selectFile = (selectedFile) => {
    setSubmitError('');
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
      setFieldErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleFileChange = (e) => selectFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    selectFile(e.dataTransfer.files?.[0]);
  };

  const clearFile = () => {
    setFile(null);
    setFileError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    const errors = {};

    if (!formData.title.trim()) errors.title = 'กรุณากรอกชื่อเรื่อง';
    if (!formData.courseCode.trim()) {
      errors.courseCode = 'กรุณากรอกรหัสวิชา';
    } else if (!validateCourseCode(formData.courseCode)) {
      errors.courseCode = 'รหัสวิชาต้องเป็นตัวเลข 6 หลัก (เช่น 225311)';
    }
    if (!formData.faculty) {
      errors.faculty = 'กรุณาเลือกคณะ';
    } else if (facultyData.getPrograms(formData.faculty).length > 0 && !formData.program) {
      errors.program = 'กรุณาเลือกสาขา';
    }
    if (!formData.description.trim()) errors.description = 'กรุณากรอกคำอธิบาย';
    if (!file) errors.file = fileError || 'กรุณาเลือกไฟล์';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setStage(1);

    try {
      const metadata = { ...formData };

      // 1) server checks who/what and returns a one-time signed upload URL
      const { path, token } = await postJson('/api/notes/upload/init', {
        ...metadata,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      });

      setStage(2);
      // 2) the file goes straight to Storage (it never passes through the serverless function,
      //    so the platform's request-size limit does not apply)
      const { error: uploadError } = await createClient()
        .storage.from('notes')
        .uploadToSignedUrl(path, token, file, { contentType: file.type || undefined });
      if (uploadError) throw new Error('อัปโหลดไฟล์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');

      setStage(3);
      // 3) server verifies the stored file and creates the note
      const result = await postJson('/api/notes/upload/complete', {
        ...metadata,
        path,
        fileName: file.name,
      });

      router.push(`/notes/${result.note.id}`);
    } catch (err) {
      setSubmitError(err.message);
      setIsSubmitting(false);
      setStage(0);
    }
  };

  const canSubmit = !isSubmitting && !fileError && !!file;

  return (
    <div className="mx-auto max-w-2xl">
      <header className="page-header">
        <p className="page-eyebrow">แบ่งปันความรู้</p>
        <h1 className="page-title">อัปโหลดโน้ต</h1>
        <p className="page-subtitle">
          โน้ตของคุณจะถูกส่งให้ผู้ดูแลตรวจสอบก่อน เมื่ออนุมัติแล้วจึงแสดงในหน้าค้นหา
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* 1. Note info */}
        <section className="card space-y-5 p-6 sm:p-8">
          <SectionTitle n="1" title="ข้อมูลโน้ต" />

          <div>
            <label htmlFor="title" className="label">ชื่อเรื่อง <span className="text-danger">*</span></label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input ${fieldErrors.title ? 'input-error' : ''}`}
              placeholder="เช่น สรุป Software Engineering กลางภาค"
              aria-invalid={!!fieldErrors.title}
            />
            {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="courseCode" className="label">รหัสวิชา (6 หลัก) <span className="text-danger">*</span></label>
            <input
              id="courseCode"
              type="text"
              name="courseCode"
              inputMode="numeric"
              maxLength={6}
              value={formData.courseCode}
              onChange={handleInputChange}
              className={`input font-mono sm:max-w-48 ${fieldErrors.courseCode ? 'input-error' : ''}`}
              placeholder="225311"
              aria-invalid={!!fieldErrors.courseCode}
            />
            {fieldErrors.courseCode && <p className="field-error">{fieldErrors.courseCode}</p>}
          </div>

          <fieldset>
            <legend className="label">หมวดหมู่ <span className="text-danger">*</span></legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {CATEGORIES.map(cat => {
                const selected = formData.category === cat.value;
                return (
                  <label
                    key={cat.value}
                    className={`cursor-pointer rounded-xl border p-3 transition focus-within:ring-2 focus-within:ring-accent/60 ${
                      selected
                        ? 'border-accent bg-accent/10'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={selected}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="flex items-center justify-between gap-2 text-sm font-medium text-white">
                      {cat.label}
                      {selected && <CheckIcon size={16} className="text-accent-soft" />}
                    </span>
                    <span className="mt-1 block text-xs text-gray-400">{CATEGORY_HINTS[cat.value]}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label htmlFor="description" className="label">คำอธิบาย <span className="text-danger">*</span></label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className={`input resize-y ${fieldErrors.description ? 'input-error' : ''}`}
              placeholder="อธิบายเนื้อหาคร่าวๆ เช่น บทที่ครอบคลุม จุดที่ควรรู้"
              aria-invalid={!!fieldErrors.description}
            />
            {fieldErrors.description && <p className="field-error">{fieldErrors.description}</p>}
          </div>
        </section>

        {/* 2. Faculty / program */}
        <section className="card space-y-5 p-6 sm:p-8">
          <SectionTitle
            n="2"
            title="คณะและสาขา"
            text="เลือกคณะหรือสาขาก่อนก็ได้ ระบบจะเติมอีกช่องให้อัตโนมัติ เพื่อให้เพื่อนๆ ค้นหาโน้ตเจอง่ายขึ้น"
          />
          <FacultyProgramFields
            required
            idPrefix="upload"
            faculty={formData.faculty}
            program={formData.program}
            facultyError={fieldErrors.faculty}
            programError={fieldErrors.program}
            onChange={({ faculty, program }) => {
              setFormData(prev => ({ ...prev, faculty, program }));
              setFieldErrors(prev => ({ ...prev, faculty: '', program: '' }));
            }}
          />
        </section>

        {/* 3. File */}
        <section className="card space-y-5 p-6 sm:p-8">
          <SectionTitle n="3" title="ไฟล์โน้ต" text="รองรับ PDF, PNG, JPG ขนาดไม่เกิน 10 MB" />

          <div>
            {file ? (
              <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-success/20 text-emerald-300">
                  <FileIcon />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{file.name}</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-300">
                    <CheckIcon size={13} /> พร้อมอัปโหลด · {formatSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  disabled={isSubmitting}
                  className="btn-ghost btn-sm px-2"
                  aria-label="ลบไฟล์ที่เลือก"
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="file"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
                  isDragging
                    ? 'border-accent bg-accent/10'
                    : fieldErrors.file || fileError
                      ? 'border-danger/60 bg-danger/5'
                      : 'border-white/15 bg-white/[0.02] hover:border-accent/50 hover:bg-white/[0.04]'
                }`}
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-accent/15 text-accent-soft">
                  <UploadIcon size={22} />
                </span>
                <span className="text-sm font-medium text-white">
                  คลิกเพื่อเลือกไฟล์ หรือลากมาวางที่นี่
                </span>
                <span className="text-xs text-gray-400">PDF, PNG, JPG ขนาดไม่เกิน 10 MB</span>
              </label>
            )}

            <input
              id="file"
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="sr-only"
            />
            {fileError && <p className="field-error">{fileError}</p>}
            {fieldErrors.file && !fileError && <p className="field-error">{fieldErrors.file}</p>}
          </div>
        </section>

        {submitError && (
          <p role="alert" className="alert-error">เกิดข้อผิดพลาด: {submitError}</p>
        )}

        {isSubmitting && (
          <ol className="card flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm" aria-live="polite" aria-label="ความคืบหน้าการอัปโหลด">
            {STAGES.map((label, i) => {
              const n = i + 1;
              const done = stage > n;
              const active = stage === n;
              return (
                <li key={label} className={`flex items-center gap-2 ${done ? 'text-emerald-300' : active ? 'text-white' : 'text-gray-500'}`}>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border text-xs ${
                      done ? 'border-success bg-success/20' : active ? 'animate-pulse border-accent bg-accent/20' : 'border-white/15'
                    }`}
                  >
                    {done ? <CheckIcon size={13} /> : n}
                  </span>
                  {label}
                </li>
              );
            })}
          </ol>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => router.back()} className="btn-ghost" disabled={isSubmitting}>
            ยกเลิก
          </button>
          <button type="submit" disabled={!canSubmit} className="btn-primary sm:min-w-44">
            {isSubmitting ? 'กำลังอัปโหลด...' : 'ส่งโน้ตเพื่อตรวจสอบ'}
          </button>
        </div>
      </form>
    </div>
  );
}
