/**
 * Lab 9 — Step 3: Property-Based Test
 * Target function: calculatePopularityScore (src/utils/notesHelper.js)
 * Tool: fast-check (Node.js equivalent of Hypothesis)
 */

const test = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const { calculatePopularityScore } = require('../src/utils/notesHelper');

// Property 1: the score is never negative for non-negative inputs.
test('property: calculatePopularityScore is always non-negative for non-negative inputs', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const score = calculatePopularityScore(likes, downloads);
            return score >= 0;
        })
    );
});

// Property 2: monotonic — adding one more like never decreases the score.
test('property: calculatePopularityScore is monotonic in likes', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const before = calculatePopularityScore(likes, downloads);
            const after = calculatePopularityScore(likes + 1, downloads);
            return after > before;
        })
    );
});

// Property 3: monotonic — adding one more download never decreases the score.
test('property: calculatePopularityScore is monotonic in downloads', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const before = calculatePopularityScore(likes, downloads);
            const after = calculatePopularityScore(likes, downloads + 1);
            return after > before;
        })
    );
});

// Property 4: a like is always worth exactly twice a download (the business rule
// this function exists to encode), independent of the actual magnitude chosen.
test('property: one like is worth exactly two downloads', () => {
    fc.assert(
        fc.property(fc.nat(), fc.nat(), (likes, downloads) => {
            const scoreWithExtraLike = calculatePopularityScore(likes + 1, downloads);
            const scoreWithTwoExtraDownloads = calculatePopularityScore(likes, downloads + 2);
            return scoreWithExtraLike === scoreWithTwoExtraDownloads;
        })
    );
});
