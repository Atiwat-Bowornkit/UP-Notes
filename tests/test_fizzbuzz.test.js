/**
 * Lab 9 — Step 2: TDD Kata (FizzBuzz)
 * Built test-first via Red -> Green -> Refactor.
 * Full Test Suite for maximum coverage and edge-case handling.
 */

const test = require('node:test');
const assert = require('node:assert');
const { fizzbuzz } = require('../src/fizzbuzz');

// ==========================================
// 1. Normal Numbers (Returns string of number)
// ==========================================
test('fizzbuzz(1) returns "1"', () => assert.strictEqual(fizzbuzz(1), '1'));
test('fizzbuzz(2) returns "2"', () => assert.strictEqual(fizzbuzz(2), '2'));
test('fizzbuzz(4) returns "4"', () => assert.strictEqual(fizzbuzz(4), '4'));
test('fizzbuzz(7) returns "7"', () => assert.strictEqual(fizzbuzz(7), '7'));
test('fizzbuzz(8) returns "8"', () => assert.strictEqual(fizzbuzz(8), '8'));
test('fizzbuzz(11) returns "11"', () => assert.strictEqual(fizzbuzz(11), '11'));
test('fizzbuzz(14) returns "14"', () => assert.strictEqual(fizzbuzz(14), '14'));
test('fizzbuzz(98) returns "98"', () => assert.strictEqual(fizzbuzz(98), '98'));

// ==========================================
// 2. Multiples of 3 (Returns "Fizz")
// ==========================================
test('fizzbuzz(3) returns "Fizz"', () => assert.strictEqual(fizzbuzz(3), 'Fizz'));
test('fizzbuzz(6) returns "Fizz"', () => assert.strictEqual(fizzbuzz(6), 'Fizz'));
test('fizzbuzz(9) returns "Fizz"', () => assert.strictEqual(fizzbuzz(9), 'Fizz'));
test('fizzbuzz(12) returns "Fizz"', () => assert.strictEqual(fizzbuzz(12), 'Fizz'));
test('fizzbuzz(99) returns "Fizz"', () => assert.strictEqual(fizzbuzz(99), 'Fizz'));

// ==========================================
// 3. Multiples of 5 (Returns "Buzz")
// ==========================================
test('fizzbuzz(5) returns "Buzz"', () => assert.strictEqual(fizzbuzz(5), 'Buzz'));
test('fizzbuzz(10) returns "Buzz"', () => assert.strictEqual(fizzbuzz(10), 'Buzz'));
test('fizzbuzz(20) returns "Buzz"', () => assert.strictEqual(fizzbuzz(20), 'Buzz'));
test('fizzbuzz(25) returns "Buzz"', () => assert.strictEqual(fizzbuzz(25), 'Buzz'));
test('fizzbuzz(100) returns "Buzz"', () => assert.strictEqual(fizzbuzz(100), 'Buzz'));

// ==========================================
// 4. Multiples of 15 (Returns "FizzBuzz")
// ==========================================
test('fizzbuzz(15) returns "FizzBuzz"', () => assert.strictEqual(fizzbuzz(15), 'FizzBuzz'));
test('fizzbuzz(30) returns "FizzBuzz"', () => assert.strictEqual(fizzbuzz(30), 'FizzBuzz'));
test('fizzbuzz(45) returns "FizzBuzz"', () => assert.strictEqual(fizzbuzz(45), 'FizzBuzz'));
test('fizzbuzz(60) returns "FizzBuzz"', () => assert.strictEqual(fizzbuzz(60), 'FizzBuzz'));
test('fizzbuzz(150) returns "FizzBuzz"', () => assert.strictEqual(fizzbuzz(150), 'FizzBuzz'));

// ==========================================
// 5. Very Large Safe Integers
// ==========================================
test('fizzbuzz(9000000000000000) returns "FizzBuzz"', () => assert.strictEqual(fizzbuzz(9000000000000000), 'FizzBuzz'));
test('fizzbuzz(9000000000000003) returns "Fizz"', () => assert.strictEqual(fizzbuzz(9000000000000003), 'Fizz')); // หาร 3 ลงตัว

// ==========================================
// 6. Edge Cases & Invalid Inputs (Throws Error)
// ==========================================
const expectedError = /Input must be a positive integer/;

test('fizzbuzz(0) throws error (less than 1)', () => assert.throws(() => fizzbuzz(0), expectedError));
test('fizzbuzz(-1) throws error (negative number)', () => assert.throws(() => fizzbuzz(-1), expectedError));
test('fizzbuzz(-15) throws error (negative multiple)', () => assert.throws(() => fizzbuzz(-15), expectedError));
test('fizzbuzz(3.14) throws error (float)', () => assert.throws(() => fizzbuzz(3.14), expectedError));

// 7. Type Validations (Strict typing checks)
test('fizzbuzz("15") throws error (string)', () => assert.throws(() => fizzbuzz("15"), expectedError));
test('fizzbuzz(null) throws error', () => assert.throws(() => fizzbuzz(null), expectedError));
test('fizzbuzz(undefined) throws error', () => assert.throws(() => fizzbuzz(undefined), expectedError));
test('fizzbuzz(true) throws error (boolean)', () => assert.throws(() => fizzbuzz(true), expectedError));
test('fizzbuzz([]) throws error (array)', () => assert.throws(() => fizzbuzz([]), expectedError));
test('fizzbuzz({}) throws error (object)', () => assert.throws(() => fizzbuzz({}), expectedError));
test('fizzbuzz(NaN) throws error', () => assert.throws(() => fizzbuzz(NaN), expectedError));
test('fizzbuzz(Infinity) throws error', () => assert.throws(() => fizzbuzz(Infinity), expectedError));