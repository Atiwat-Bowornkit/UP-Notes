/**
 * Lab 9 — Step 2: TDD Kata (FizzBuzz)
 * Implemented via Red -> Green -> Refactor. See commit history.
 */

function fizzbuzz(n) {
    if (n % 3 === 0) return 'Fizz';
    return String(n);
}

module.exports = { fizzbuzz };
