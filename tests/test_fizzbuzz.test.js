/**
 * Lab 9 — Step 2: TDD Kata (FizzBuzz)
 * Built test-first via Red -> Green -> Refactor.
 */

const test = require('node:test');
const assert = require('node:assert');
const { fizzbuzz } = require('../src/fizzbuzz');

test('fizzbuzz(3) returns "Fizz"', () => {
    // Arrange
    const input = 3;

    // Act
    const result = fizzbuzz(input);

    // Assert
    assert.strictEqual(result, 'Fizz');
});

test('fizzbuzz(1) returns "1"', () => {
    // Arrange
    const input = 1;

    // Act
    const result = fizzbuzz(input);

    // Assert
    assert.strictEqual(result, '1');
});
