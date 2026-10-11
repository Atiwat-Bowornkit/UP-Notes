const test = require('node:test');
const assert = require('node:assert');
const { findOrphanFiles, removeOrphanFiles } = require('../src/utils/orphanFiles');

const NOW = Date.parse('2026-10-11T12:00:00Z');
const hoursAgo = (h) => new Date(NOW - h * 3600 * 1000).toISOString();

/** Fake bucket: files are { path, createdAt }; list() behaves like Supabase (folders have id null). */
function fakeStorage(files, { failList = false, failRemove = false } = {}) {
  const removed = [];
  return {
    removed,
    async list(folder, { limit, offset }) {
      if (failList) return { data: null, error: new Error('list failed') };
      let entries;
      if (folder === '') {
        const folders = [...new Set(files.filter((f) => f.path.includes('/')).map((f) => f.path.split('/')[0]))];
        const rootFiles = files.filter((f) => !f.path.includes('/'));
        entries = [
          ...folders.map((name) => ({ name, id: null })),
          ...rootFiles.map((f) => ({ name: f.path, id: 'x', created_at: f.createdAt })),
        ];
      } else {
        entries = files
          .filter((f) => f.path.startsWith(`${folder}/`))
          .map((f) => ({ name: f.path.slice(folder.length + 1), id: 'x', created_at: f.createdAt }));
      }
      return { data: entries.slice(offset, offset + limit), error: null };
    },
    async remove(paths) {
      if (failRemove) return { data: null, error: new Error('remove failed') };
      removed.push(...paths);
      return { data: paths, error: null };
    },
  };
}

function fakePrisma(referenced) {
  return {
    note: {
      async findMany({ where }) {
        return where.filePath.in.filter((p) => referenced.includes(p)).map((filePath) => ({ filePath }));
      },
    },
  };
}

test('orphanFiles - keeps referenced files and removes old unreferenced ones', async () => {
  const storage = fakeStorage([
    { path: 'u1/a.pdf', createdAt: hoursAgo(48) }, // referenced
    { path: 'u1/b.pdf', createdAt: hoursAgo(48) }, // orphan
    { path: 'u2/c.png', createdAt: hoursAgo(5) },  // orphan
  ]);
  const result = await removeOrphanFiles({ storage, prisma: fakePrisma(['u1/a.pdf']), now: NOW });
  assert.deepStrictEqual(storage.removed.sort(), ['u1/b.pdf', 'u2/c.png']);
  assert.strictEqual(result.scanned, 3);
  assert.strictEqual(result.removed, 2);
});

test('orphanFiles - never touches files younger than the minimum age (uploads in progress)', async () => {
  const storage = fakeStorage([
    { path: 'u1/new.pdf', createdAt: hoursAgo(0.2) },
    { path: 'u1/edge.pdf', createdAt: hoursAgo(0.99) },
    { path: 'u1/old.pdf', createdAt: hoursAgo(1) }, // exactly 1h counts as old
  ]);
  const { orphans } = await findOrphanFiles({ storage, prisma: fakePrisma([]), now: NOW });
  assert.deepStrictEqual(orphans, ['u1/old.pdf']);
});

test('orphanFiles - a file with an unreadable date is kept', async () => {
  const storage = fakeStorage([
    { path: 'u1/weird.pdf', createdAt: undefined },
    { path: 'u1/bad.pdf', createdAt: 'not-a-date' },
  ]);
  const { orphans } = await findOrphanFiles({ storage, prisma: fakePrisma([]), now: NOW });
  assert.deepStrictEqual(orphans, []);
});

test('orphanFiles - dry run reports but does not delete', async () => {
  const storage = fakeStorage([{ path: 'u1/b.pdf', createdAt: hoursAgo(48) }]);
  const result = await removeOrphanFiles({ storage, prisma: fakePrisma([]), now: NOW, dryRun: true });
  assert.strictEqual(result.orphans, 1);
  assert.strictEqual(result.removed, 0);
  assert.deepStrictEqual(storage.removed, []);
});

test('orphanFiles - a listing error aborts without deleting anything', async () => {
  const storage = fakeStorage([{ path: 'u1/b.pdf', createdAt: hoursAgo(48) }], { failList: true });
  await assert.rejects(() => removeOrphanFiles({ storage, prisma: fakePrisma([]), now: NOW }), /list failed/);
  assert.deepStrictEqual(storage.removed, []);
});

test('orphanFiles - a removal error is reported, not swallowed', async () => {
  const storage = fakeStorage([{ path: 'u1/b.pdf', createdAt: hoursAgo(48) }], { failRemove: true });
  await assert.rejects(() => removeOrphanFiles({ storage, prisma: fakePrisma([]), now: NOW }), /remove failed/);
});

test('orphanFiles - handles more files than one page and one lookup chunk', async () => {
  const files = Array.from({ length: 650 }, (_, i) => ({ path: `u1/f${i}.pdf`, createdAt: hoursAgo(48) }));
  const referenced = files.slice(0, 600).map((f) => f.path);
  const storage = fakeStorage(files);
  const result = await removeOrphanFiles({ storage, prisma: fakePrisma(referenced), now: NOW });
  assert.strictEqual(result.scanned, 650);
  assert.strictEqual(result.removed, 50);
  assert.ok(storage.removed.every((p) => !referenced.includes(p)));
});

test('orphanFiles - an empty bucket is fine', async () => {
  const result = await removeOrphanFiles({ storage: fakeStorage([]), prisma: fakePrisma([]), now: NOW });
  assert.deepStrictEqual(result, { scanned: 0, orphans: 0, removed: 0, dryRun: false });
});
