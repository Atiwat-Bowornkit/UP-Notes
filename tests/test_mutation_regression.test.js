/**
 * Lab 9 — Step 5B: Mutation Testing (Stryker)
 * Target function: filterNotesBySearch (src/utils/notesHelper.js)
 *
 * These tests were added specifically to kill mutants that survived the
 * first `npx stryker run` (see stryker.conf.json / reports/mutation).
 * Each test below is annotated with the mutant(s) it kills.
 */

const test = require('node:test');
const assert = require('node:assert');
const { filterNotesBySearch, validateUploadFile, ALLOWED_EXTENSIONS } = require('../src/utils/notesHelper');

const notes = [
    { id: 1, code: 'CS101', title: 'Intro to Testing', author: 'Alice', category: 'CS' },
    { id: 2, code: 'CS102', title: 'Advanced Testing', author: 'Bob', category: 'CS' },
    { id: 3, code: 'MA201', title: 'Calculus Notes', author: 'Carol', category: 'MATH' },
    { id: 4, category: 'CS' } // no title/code/author on purpose
];

// Kills: MethodExpression (query.trim() removal) at line 44
test('filterNotesBySearch - kills trim() mutant: surrounding whitespace in query is ignored', () => {
    // Arrange & Act
    const result = filterNotesBySearch(notes, '  cs101  ', 'all');

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 1);
});

// Kills: ConditionalExpression "matchesCategory = (true)" and the
// note.category === category Conditional/EqualityOperator mutants at line 47
test('filterNotesBySearch - kills matchesCategory mutants: category filter matches via note.category only', () => {
    // Arrange & Act
    const result = filterNotesBySearch(notes, '', 'MATH');

    // Assert: only the MATH note should match — an always-true or
    // negated category mutant would include CS notes too (or exclude MATH).
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 3);
});

// Kills: note.code === category EqualityOperator/ConditionalExpression mutants at line 47
test('filterNotesBySearch - kills note.code === category mutants: category filter matches via note.code', () => {
    // Arrange & Act — 'CS102' matches note 2's code but not its category ('CS')
    const result = filterNotesBySearch(notes, '', 'CS102');

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 2);
});

// Kills: ConditionalExpression/LogicalOperator mutants on the "!cleanQuery" term at line 48
test('filterNotesBySearch - kills !cleanQuery mutants: empty query returns notes with no searchable fields too', () => {
    // Arrange & Act
    const result = filterNotesBySearch(notes, '', 'all');

    // Assert: all 4 notes (including the field-less note 4) must be returned
    assert.strictEqual(result.length, 4);
});

// Kills: title-branch ConditionalExpression (false) and MethodExpression
// (toLowerCase -> toUpperCase) mutants at lines 48-49
test('filterNotesBySearch - kills title-match mutants: case-insensitive match via title only', () => {
    // Arrange & Act — 'testing' only appears in the title field, not code/author
    const result = filterNotesBySearch(notes, 'testing', 'all');

    // Assert
    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result.map(n => n.id).sort(), [1, 2]);
});

// Kills: code-branch MethodExpression (toLowerCase -> toUpperCase) mutant at line 50
test('filterNotesBySearch - kills code-match mutant: case-insensitive match via code only', () => {
    // Arrange & Act — lowercase query must still match the uppercase code
    const result = filterNotesBySearch(notes, 'cs102', 'all');

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 2);
});

// Kills: author-branch ConditionalExpression (false) and MethodExpression
// (toLowerCase -> toUpperCase) mutants at line 51
test('filterNotesBySearch - kills author-match mutants: case-insensitive match via author only', () => {
    // Arrange & Act
    const result = filterNotesBySearch(notes, 'carol', 'all');

    // Assert
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].id, 3);
});

// Kills: ArrayDeclaration and ConditionalExpression mutants on the
// "!Array.isArray(notes)" guard at line 42
test('filterNotesBySearch - kills Array.isArray guard mutants: non-array notes returns empty array', () => {
    // Arrange & Act
    const result = filterNotesBySearch('not-an-array', 'anything', 'all');

    // Assert
    assert.deepStrictEqual(result, []);
});

// Kills: StringLiteral default-parameter mutants for query/category at line 41
test('filterNotesBySearch - kills default parameter mutants: called with only notes arg', () => {
    // Arrange & Act — no query/category passed, must fall back to '' and 'all'
    const result = filterNotesBySearch(notes);

    // Assert: every note matches an empty query under the 'all' category
    assert.strictEqual(result.length, notes.length);
});

// Kills: StringLiteral mutant on ALLOWED_EXTENSIONS.join(', ') -> join('') at line 23
test('validateUploadFile - kills join(", ") mutant: error message lists extensions comma-separated', () => {
    // Arrange
    const file = { name: 'script.exe', size: 1024 };

    // Act
    const result = validateUploadFile(file);

    // Assert
    assert.ok(result.error.includes(ALLOWED_EXTENSIONS.join(', ')));
});
