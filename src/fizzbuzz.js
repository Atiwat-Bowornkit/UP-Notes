/**
 * Lab 9 — Step 2: TDD Kata (FizzBuzz)
 * Implemented via Red -> Green -> Refactor. See commit history.
 */

function is_multiple(n, factor) {
    return n % factor === 0;
}

function fizzbuzz(n) {
    if (is_multiple(n, 15)) return 'FizzBuzz';
    if (is_multiple(n, 3)) return 'Fizz';
    if (is_multiple(n, 5)) return 'Buzz';
    return String(n);
}

module.exports = { fizzbuzz, is_multiple };
