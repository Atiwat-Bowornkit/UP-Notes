/**
 * Finds and removes files in the notes bucket that no Note row points at (e.g. the user closed the
 * page after the browser uploaded the file but before the note was created).
 *
 * Pure functions over an injected `storage` (supabase bucket API) and `prisma`, so they can be
 * tested with fakes. Files younger than `minAgeMs` are never touched: they may belong to an upload
 * that is still in progress.
 */

const PAGE_SIZE = 100;
const DEFAULT_MIN_AGE_MS = 60 * 60 * 1000; // 1 hour
const LOOKUP_CHUNK = 500;

async function listPage(storage, folder, offset) {
  const { data, error } = await storage.list(folder, { limit: PAGE_SIZE, offset });
  if (error) throw error;
  return data ?? [];
}

/** Every file in the bucket as { path, createdAt }. Layout is <userId>/<file>, one folder level. */
async function listAllFiles(storage) {
  const files = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const entries = await listPage(storage, '', offset);
    for (const entry of entries) {
      if (entry.id === null) {
        // folder: walk it
        for (let inner = 0; ; inner += PAGE_SIZE) {
          const children = await listPage(storage, entry.name, inner);
          for (const child of children) {
            if (child.id !== null) {
              files.push({ path: `${entry.name}/${child.name}`, createdAt: child.created_at });
            }
          }
          if (children.length < PAGE_SIZE) break;
        }
      } else {
        files.push({ path: entry.name, createdAt: entry.created_at });
      }
    }
    if (entries.length < PAGE_SIZE) break;
  }

  return files;
}

async function referencedPaths(prisma, paths) {
  const referenced = new Set();
  for (let i = 0; i < paths.length; i += LOOKUP_CHUNK) {
    const rows = await prisma.note.findMany({
      where: { filePath: { in: paths.slice(i, i + LOOKUP_CHUNK) } },
      select: { filePath: true },
    });
    rows.forEach((row) => referenced.add(row.filePath));
  }
  return referenced;
}

/**
 * @returns {Promise<{scanned: number, orphans: string[]}>}
 */
async function findOrphanFiles({ storage, prisma, now = Date.now(), minAgeMs = DEFAULT_MIN_AGE_MS }) {
  const files = await listAllFiles(storage);
  const referenced = await referencedPaths(prisma, files.map((f) => f.path));

  const orphans = files
    .filter((f) => !referenced.has(f.path))
    .filter((f) => {
      const created = Date.parse(f.createdAt);
      // an unreadable date means we cannot prove the file is old: keep it
      return Number.isFinite(created) && now - created >= minAgeMs;
    })
    .map((f) => f.path);

  return { scanned: files.length, orphans };
}

/** Removes the orphans in batches. Any listing/lookup error aborts before anything is deleted. */
async function removeOrphanFiles({ storage, prisma, now, minAgeMs, dryRun = false }) {
  const { scanned, orphans } = await findOrphanFiles({ storage, prisma, now, minAgeMs });

  let removed = 0;
  if (!dryRun) {
    for (let i = 0; i < orphans.length; i += PAGE_SIZE) {
      const batch = orphans.slice(i, i + PAGE_SIZE);
      const { error } = await storage.remove(batch);
      if (error) throw error;
      removed += batch.length;
    }
  }

  return { scanned, orphans: orphans.length, removed, dryRun };
}

module.exports = { listAllFiles, findOrphanFiles, removeOrphanFiles, DEFAULT_MIN_AGE_MS };
