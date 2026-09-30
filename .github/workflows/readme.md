# GitHub Actions Workflows

- `ci.yml` — รันทุก Pull Request เข้า `main` และทุก push เข้า `main` (Lab 12B Safety Net Sprint)
  - `lint` — ESLint 9 ตรวจ `src/` และ `tests/` ตาม `eslint.config.js`
  - `test` — `npm ci` → `npm run test:coverage` (Node.js native test runner + coverage)
