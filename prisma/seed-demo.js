/**
 * Demo data for Demo Day (Lec29 §2.5: "demo data that looks good", not `test123`).
 *
 *   npm run db:seed-demo -- --yes            create demo authors + notes (+ real preview-able PDFs)
 *   npm run db:seed-demo -- --yes --clean    remove everything this script created
 *
 * - Idempotent: running it twice does not duplicate anything (notes are keyed by their storage path).
 * - Writes to whatever .env.local points at, so it prints the target and refuses to run without --yes.
 *   A non-local target additionally needs --remote, so it can never hit production by accident.
 * - Demo authors are database rows only (no Supabase Auth account): nobody can log in as them.
 *   They use @demo.up-notes.invalid addresses, which the app can never register.
 */
const { randomUUID } = require('node:crypto');
const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const BUCKET = 'notes';
const DEMO_DOMAIN = '@demo.up-notes.invalid';
const DEMO_FILE_PREFIX = 'demo-';

const AUTHORS = [
    { key: 'kankluay', name: 'พี่ก้านกล้วย' },
    { key: 'mali', name: 'น้องมะลิ' },
    { key: 'tonkla', name: 'พี่ต้นกล้า' },
    { key: 'mok', name: 'หมอก ไอที' },
];

// Real subjects with the course codes used in this project; descriptions are short and realistic.
const NOTES = [
    {
        key: 'se-midterm', author: 'kankluay', courseCode: '225311', category: 'MAJOR_REQUIRED',
        faculty: 'ict', program: 'software-engineering', downloads: 42, likedBy: ['mali', 'tonkla', 'mok'],
        title: 'สรุป Software Engineering กลางภาค',
        description: 'รวมบทที่ 1–6: Agile/Scrum, Requirements, UML และตัวอย่างข้อสอบ พร้อมสรุปสูตรเปรียบเทียบ Waterfall กับ Agile',
        pdf: ['Software Engineering - Midterm Summary', 'Ch1 Intro to SE and process models', 'Ch2 Agile, Scrum, sprint events', 'Ch3 Requirements: personas, user stories, MoSCoW', 'Ch4-6 UML, architecture, design patterns'],
    },
    {
        key: 'db-sheet', author: 'tonkla', courseCode: '225231', category: 'MAJOR_REQUIRED',
        faculty: 'ict', program: 'computer-science', downloads: 31, likedBy: ['kankluay', 'mali'],
        title: 'Database Design Cheat Sheet',
        description: 'ER diagram, Normalization 1NF–3NF และ SQL JOIN ที่ใช้บ่อย พร้อมโจทย์ฝึกท้ายบท',
        pdf: ['Database Design Cheat Sheet', 'ER diagram: entities, relationships, cardinality', 'Normalization 1NF 2NF 3NF with examples', 'SQL: SELECT, JOIN, GROUP BY, subquery'],
    },
    {
        key: 'ds-trees', author: 'mok', courseCode: '225212', category: 'ELECTIVE',
        faculty: 'ict', program: 'data-science', downloads: 25, likedBy: ['kankluay'],
        title: 'Data Structures: Trees & Graphs',
        description: 'BST, AVL, BFS, DFS พร้อมตัวอย่างโค้ดและ Big-O ของแต่ละการทำงาน',
        pdf: ['Data Structures: Trees and Graphs', 'BST insert, search, delete', 'AVL rotations', 'BFS vs DFS and complexity'],
    },
    {
        key: 'calculus', author: 'mali', courseCode: '201101', category: 'GE',
        faculty: 'science', program: null, downloads: 17, likedBy: ['tonkla', 'mok'],
        title: 'Calculus 1 – สูตรสำคัญก่อนสอบ',
        description: 'สรุปสูตรอนุพันธ์ ลิมิต และอินทิกรัล พร้อมเทคนิคจำแบบรวบรัด',
        pdf: ['Calculus 1 - Key Formulas', 'Limits and continuity', 'Derivative rules: product, quotient, chain', 'Integration techniques'],
    },
    {
        key: 'accounting', author: 'kankluay', courseCode: '302101', category: 'MAJOR_REQUIRED',
        faculty: 'business-communication', program: 'accounting', downloads: 12, likedBy: ['mali'],
        title: 'หลักการบัญชีเบื้องต้น: งบการเงิน',
        description: 'สมการบัญชี งบดุล งบกำไรขาดทุน และตัวอย่างการบันทึกรายการประจำวัน',
        pdf: ['Principles of Accounting - Financial Statements', 'Accounting equation', 'Balance sheet and income statement', 'Journal entries'],
    },
    {
        key: 'english', author: 'tonkla', courseCode: '001101', category: 'GE',
        faculty: 'liberal-arts', program: null, downloads: 9, likedBy: [],
        title: 'ภาษาอังกฤษเพื่อการสื่อสาร: คำศัพท์ที่ออกสอบบ่อย',
        description: 'คำศัพท์และสำนวนที่ออกสอบบ่อย พร้อมตัวอย่างประโยค',
        pdf: ['English for Communication - Frequent Exam Vocabulary', 'Everyday expressions', 'Academic vocabulary', 'Sample sentences'],
    },
];

// ---- tiny dependency-free PDF writer (Helvetica, Latin text only) ----
function pdfEscape(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function makePdf(lines) {
    const content = [
        'BT', '/F1 22 Tf', '72 740 Td', `(${pdfEscape(lines[0])}) Tj`,
        '/F1 13 Tf', '0 -34 Td',
        ...lines.slice(1).flatMap((line) => [`(${pdfEscape(line)}) Tj`, '0 -22 Td']),
        '/F1 9 Tf', '0 -40 Td', '(Demo document generated for UP-Notes) Tj', 'ET',
    ].join('\n');

    const objects = [
        '<< /Type /Catalog /Pages 2 0 R >>',
        '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
        '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
        `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
        '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    ];

    let out = '%PDF-1.4\n';
    const offsets = [];
    objects.forEach((body, i) => {
        offsets.push(Buffer.byteLength(out));
        out += `${i + 1} 0 obj\n${body}\nendobj\n`;
    });
    const xref = Buffer.byteLength(out);
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    offsets.forEach((o) => { out += `${String(o).padStart(10, '0')} 00000 n \n`; });
    out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
    return Buffer.from(out, 'latin1');
}

function isLocal(value) {
    return /(^|\/\/|@)(localhost|127\.0\.0\.1|\[::1\]|host\.docker\.internal)([:/]|$)/.test(String(value));
}

function describeTarget() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '(unset)';
    const dbUrl = process.env.DATABASE_URL || '(unset)';
    let dbHost = '(unset)';
    try { dbHost = new URL(dbUrl).host; } catch { /* keep default */ }
    return { supabaseUrl, dbHost, local: isLocal(supabaseUrl) && isLocal(dbUrl) };
}

async function cleanDemo(prisma, storage) {
    const demoUsers = await prisma.user.findMany({ where: { email: { endsWith: DEMO_DOMAIN } }, select: { id: true } });
    const ids = demoUsers.map((u) => u.id);
    const notes = await prisma.note.findMany({ where: { authorId: { in: ids } }, select: { filePath: true } });
    const paths = notes.map((n) => n.filePath).filter((p) => p.includes(`/${DEMO_FILE_PREFIX}`));
    if (paths.length) {
        const { error } = await storage.remove(paths);
        if (error) throw error;
    }
    // Notes, likes and reports cascade from the user rows
    const removed = await prisma.user.deleteMany({ where: { id: { in: ids } } });
    console.log(`Removed ${removed.count} demo authors, ${notes.length} notes and ${paths.length} files.`);
}

async function seedDemo(prisma, storage) {
    const users = {};
    for (const a of AUTHORS) {
        const email = `${a.key}${DEMO_DOMAIN}`;
        users[a.key] = await prisma.user.upsert({
            where: { email },
            create: { id: randomUUID(), email, name: a.name },
            update: { name: a.name },
        });
    }

    let created = 0;
    for (const n of NOTES) {
        const author = users[n.author];
        const path = `${author.id}/${DEMO_FILE_PREFIX}${n.key}.pdf`;
        if (await prisma.note.findFirst({ where: { filePath: path }, select: { id: true } })) continue;

        const bytes = makePdf(n.pdf);
        const { error } = await storage.upload(path, bytes, { contentType: 'application/pdf', upsert: true });
        if (error) throw new Error(`upload ${path}: ${error.message}`);

        const note = await prisma.note.create({
            data: {
                title: n.title, courseCode: n.courseCode, category: n.category, description: n.description,
                faculty: n.faculty, program: n.program, filePath: path,
                fileName: `${n.key}.pdf`, fileSizeBytes: bytes.length, status: 'PUBLISHED',
                downloadCount: n.downloads, authorId: author.id,
            },
        });
        for (const liker of n.likedBy) {
            await prisma.like.create({ data: { userId: users[liker].id, noteId: note.id } });
        }
        created += 1;
    }
    console.log(`Demo data ready: ${AUTHORS.length} authors, ${created} new notes (${NOTES.length - created} already existed).`);
}

async function main() {
    const args = new Set(process.argv.slice(2));
    const target = describeTarget();
    console.log(`Target Supabase: ${target.supabaseUrl}\nTarget database: ${target.dbHost}`);

    if (!args.has('--yes')) {
        console.error('\nRefusing to run without --yes. Check the target above, then re-run with --yes.');
        process.exit(1);
    }
    if (!target.local && !args.has('--remote')) {
        console.error('\nThe target is NOT local. If you really want to write demo data there, add --remote.');
        process.exit(1);
    }
    for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DATABASE_URL']) {
        if (!process.env[name]) { console.error(`Missing ${name}`); process.exit(1); }
    }

    const prisma = new PrismaClient();
    const storage = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } },
    ).storage.from(BUCKET);

    try {
        if (args.has('--clean')) await cleanDemo(prisma, storage);
        else await seedDemo(prisma, storage);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});
