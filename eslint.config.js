/**
 * ESLint flat config (ESLint 9) — Lab 12B Safety Net Sprint
 * ตรวจเฉพาะโค้ด Node.js จริงของทีม (src/ + tests/) โดยไม่พึ่ง plugin ภายนอก
 * CI รันด้วย `npx --yes eslint@9 src tests` จึงไม่ต้องเพิ่ม dependency ใน package.json
 */

const nodeGlobals = {
    require: 'readonly',
    module: 'writable',
    exports: 'writable',
    __dirname: 'readonly',
    __filename: 'readonly',
    process: 'readonly',
    console: 'readonly',
};

module.exports = [
    {
        ignores: [
            'node_modules/**',
            '.stryker-tmp/**',
            'reports/**',
            'prototypes/**',
            'services/**',
        ],
    },
    {
        files: ['src/**/*.js', 'tests/**/*.js', 'eslint.config.js'],
        ignores: ['src/utils/uploadHelper.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'commonjs',
            globals: nodeGlobals,
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-redeclare': 'error',
            'no-dupe-keys': 'error',
            'no-unreachable': 'error',
            'no-const-assign': 'error',
            'eqeqeq': 'error',
        },
    },
    {
        // ไฟล์นี้ถูก import จาก Next.js (ESM) จึงใช้ import/export
        files: ['src/utils/uploadHelper.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: nodeGlobals,
        },
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'eqeqeq': 'error',
        },
    },
];
